import { GoogleGenAI, Type } from "@google/genai";
import type {
  Employee,
  KeyRole,
  CrossProject,
  CorporateTask,
  RankedCandidate,
  DevelopmentPlan,
  ManagerBriefing,
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const TEXT_MODEL = "gemini-2.5-flash";

// ---------- Helpers ----------
function employeeBrief(e: Employee): string {
  return [
    `工号:${e.id} 姓名:${e.name}`,
    `岗位:${e.title} (${e.band}) | 品牌:${e.brand} | 部门:${e.department} | 司龄:${e.tenureYears}年`,
    `绩效:${e.performance} | 潜力:${e.potential} | 就位度:${e.readiness}`,
    `能力(0-100): ${e.competencies.map((c) => `${c.name}=${c.score}`).join(", ")}`,
    `技能: ${e.skills.join("、")}`,
    `关键经历: ${e.experiences.join("；")}`,
    `备注: ${e.bio}`,
    e.riskFlags?.length ? `风险标签: ${e.riskFlags.join("、")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function generateJSON<T>(prompt: string, schema: any): Promise<T> {
  const res = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.6,
      systemInstruction:
        "你是凯捷咨询 HCM 团队的资深人才分析顾问，服务百胜中国（YUM China），熟悉肯德基/必胜客/塔可贝尔等品牌的业务特点。" +
        "所有产出必须使用专业中文，结合餐饮行业语境，简洁有据，避免空话。",
    },
  });
  const text = res.text || "{}";
  return JSON.parse(text) as T;
}

// ============================================================
//  1) Talent Match — rank candidates for a role/project/task
// ============================================================

interface MatchTarget {
  kind: "role" | "project" | "task";
  title: string;
  description: string;
  requiredSkills: string[];
}

const RANK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    rankings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          employeeId: { type: Type.STRING },
          matchScore: { type: Type.INTEGER },
          reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
          gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          developmentMoves: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["employeeId", "matchScore", "reasons", "gaps", "developmentMoves"],
      },
    },
  },
  required: ["rankings"],
};

export async function rankCandidates(
  target: MatchTarget,
  candidates: Employee[]
): Promise<RankedCandidate[]> {
  const prompt = `
# 任务：智能人岗匹配

## 目标 (${target.kind === "role" ? "关键岗位" : target.kind === "project" ? "跨部门项目" : "集团级任务"})
- 名称：${target.title}
- 描述：${target.description}
- 所需技能/能力：${target.requiredSkills.join("、")}

## 候选人池（共 ${candidates.length} 人）
${candidates.map(employeeBrief).join("\n---\n")}

## 要求
1. 对每位候选人给出 0-100 的综合匹配分（综合考虑战略价值×稀缺性×替代难度，以及人才本身的能力/经验/潜力/绩效/就位度）。
2. 用 2-3 条精炼中文短句说明匹配理由（结合具体经历或技能）。
3. 列出 1-2 条能力差距（不要写空泛的"经验不足"）。
4. 给出 1-2 个发展动作（培训 / 轮岗 / 项目 / 导师 / 教练）。
5. 按 matchScore 从高到低排序。
6. 严格使用候选人的 employeeId。`;

  const result = await generateJSON<{ rankings: any[] }>(prompt, RANK_SCHEMA);
  const byId = new Map(candidates.map((c) => [c.id, c]));
  return result.rankings
    .filter((r) => byId.has(r.employeeId))
    .map((r) => ({
      employee: byId.get(r.employeeId)!,
      matchScore: Math.min(100, Math.max(0, r.matchScore)),
      reasons: r.reasons || [],
      gaps: r.gaps || [],
      developmentMoves: r.developmentMoves || [],
    }));
}

export function buildTargetFromRole(role: KeyRole): MatchTarget {
  return {
    kind: "role",
    title: role.title,
    description: `品牌：${role.brand}；现状：${role.incumbent}；空缺风险：${role.vacancyRisk}；战略价值=${role.strategicWeight}/稀缺性=${role.scarcity}/替代难度=${role.replaceDifficulty}`,
    requiredSkills: role.requiredSkills,
  };
}
export function buildTargetFromProject(p: CrossProject): MatchTarget {
  return {
    kind: "project",
    title: p.name,
    description: `${p.description} 周期：${p.duration}；所需角色：${p.roles.map((r) => r.role).join("/")}`,
    requiredSkills: Array.from(new Set(p.roles.flatMap((r) => r.skills))),
  };
}
export function buildTargetFromTask(t: CorporateTask): MatchTarget {
  return {
    kind: "task",
    title: t.title,
    description: `Sponsor: ${t.sponsor}；${t.description}；周期：${t.durationWeeks} 周。`,
    requiredSkills: t.requiredSkills,
  };
}

// ============================================================
//  2) Employee — Personal Development Plan
// ============================================================
const PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendedRoles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
        required: ["role", "rationale"],
      },
    },
    learningPath: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          duration: { type: Type.STRING },
          why: { type: Type.STRING },
        },
        required: ["name", "type", "duration", "why"],
      },
    },
    ninetyDayPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
    careerNarrative: { type: Type.STRING },
  },
  required: [
    "strengths",
    "growthAreas",
    "recommendedRoles",
    "learningPath",
    "ninetyDayPlan",
    "careerNarrative",
  ],
};

export async function generateDevelopmentPlan(
  e: Employee,
  aspiration: string
): Promise<DevelopmentPlan> {
  const prompt = `
# 任务：为员工生成「个性化发展路径」（数字助理-员工自助视角）

## 员工档案
${employeeBrief(e)}

## 员工的发展愿景
"${aspiration || "暂未填写"}"

## 要求
1. strengths：3-5 条优势（结合能力分数与具体经历，禁止空话）。
2. growthAreas：3-4 条提升项（具体且可干预）。
3. recommendedRoles：2-3 个 12-24 个月内可达的目标岗位（结合百胜业务），每条说明匹配理由。
4. learningPath：4-5 项发展动作，type 必须是「培训/轮岗/项目/导师」之一，duration 用中文，比如"6 周"。
5. ninetyDayPlan：5 条 90 天落地行动（动词开头，可衡量）。
6. careerNarrative：120-180 字的发展故事，可用于员工 IDP（个人发展计划）文档。`;

  return generateJSON<DevelopmentPlan>(prompt, PLAN_SCHEMA);
}

// ============================================================
//  3) Manager — Smart Development Briefing
// ============================================================
const BRIEF_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    strengthsTable: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { dimension: { type: Type.STRING }, evidence: { type: Type.STRING } },
        required: ["dimension", "evidence"],
      },
    },
    developmentTable: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dimension: { type: Type.STRING },
          risk: { type: Type.STRING },
          intervention: { type: Type.STRING },
        },
        required: ["dimension", "risk", "intervention"],
      },
    },
    successionFit: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          readiness: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
        required: ["role", "readiness", "rationale"],
      },
    },
    conversationGuide: { type: Type.ARRAY, items: { type: Type.STRING } },
    retentionRisk: { type: Type.STRING },
  },
  required: [
    "summary",
    "strengthsTable",
    "developmentTable",
    "successionFit",
    "conversationGuide",
    "retentionRisk",
  ],
};

export async function generateManagerBriefing(
  e: Employee,
  candidateRoles: string[]
): Promise<ManagerBriefing> {
  const prompt = `
# 任务：生成「智能化人才发展建议书」（主管辅助视角，用于人才盘点与发展沟通）

## 员工档案
${employeeBrief(e)}

## 候选目标岗位列表
${candidateRoles.join("、")}

## 要求
1. summary：80-120 字综合判断。
2. strengthsTable：3 条结构化优势（dimension=能力维度名，evidence=证据/经历）。
3. developmentTable：3 条结构化发展项（dimension=能力维度名，risk=对业务的潜在影响，intervention=具体干预）。
4. successionFit：基于候选目标岗位，对每个岗位给出 readiness（Ready Now / 1-2年 / 3-5年）与 rationale。
5. conversationGuide：4-5 条主管与员工 1on1 的开放式提问。
6. retentionRisk：50-80 字的保留风险与建议。`;

  return generateJSON<ManagerBriefing>(prompt, BRIEF_SCHEMA);
}

// ============================================================
//  4) Insight chip — quick narrative for dashboard
// ============================================================
export async function generateInsight(prompt: string): Promise<string> {
  const res = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      temperature: 0.5,
      systemInstruction:
        "你是凯捷咨询资深人才分析顾问。用 60-100 字中文，给出基于数据的可执行洞察，避免空话。",
    },
  });
  return res.text?.trim() || "";
}
