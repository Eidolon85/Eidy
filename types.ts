// ====== Talent Intelligence Domain Types ======

export type ViewKey =
  | 'overview'
  | 'dashboard'
  | 'employee'
  | 'manager'
  | 'recommendation'
  | 'methodology';

export interface Competency {
  name: string;     // 能力项
  score: number;    // 0-100
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;          // emoji or url
  title: string;           // 岗位
  band: string;            // 职级
  brand: '肯德基' | '必胜客' | '塔可贝尔' | '小肥羊' | '黄记煌' | '集团总部';
  department: string;
  location: string;
  tenureYears: number;
  performance: 'A' | 'B+' | 'B' | 'C';     // 过往绩效
  potential: '高潜' | '稳定' | '观察';
  readiness: 'Ready Now' | '1-2年' | '3-5年';
  successorOf?: string;    // 接班的关键岗位
  competencies: Competency[];   // 能力维度
  skills: string[];        // 技能标签
  experiences: string[];   // 关键经历
  certifications?: string[];
  bio: string;
  riskFlags?: string[];
}

export interface KeyRole {
  id: string;
  title: string;
  brand: string;
  incumbent: string;
  vacancyRisk: 'High' | 'Medium' | 'Low';
  successorCount: number;
  requiredSkills: string[];
  strategicWeight: number;   // 战略价值 0-100
  scarcity: number;          // 稀缺性
  replaceDifficulty: number; // 替代难度
}

export interface CrossProject {
  id: string;
  name: string;
  brand: string;
  duration: string;
  roles: { role: string; skills: string[] }[];
  description: string;
}

export interface CorporateTask {
  id: string;
  title: string;
  sponsor: string;
  description: string;
  requiredSkills: string[];
  durationWeeks: number;
}

export type RecommendationMode = 'role' | 'project' | 'task';

export interface RankedCandidate {
  employee: Employee;
  matchScore: number;       // 0-100
  reasons: string[];        // 中文短句
  gaps: string[];
  developmentMoves: string[];
}

export interface DevelopmentPlan {
  strengths: string[];
  growthAreas: string[];
  recommendedRoles: { role: string; rationale: string }[];
  learningPath: { name: string; type: '培训' | '轮岗' | '项目' | '导师' ; duration: string; why: string }[];
  ninetyDayPlan: string[];
  careerNarrative: string;
}

export interface ManagerBriefing {
  summary: string;
  strengthsTable: { dimension: string; evidence: string }[];
  developmentTable: { dimension: string; risk: string; intervention: string }[];
  successionFit: { role: string; readiness: string; rationale: string }[];
  conversationGuide: string[];
  retentionRisk: string;
}
