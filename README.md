# 凯捷 × 百胜中国 · 人才智能推荐与发展平台

**Capgemini Talent Intelligence Suite for Yum China** — 面向百胜中国 2026 RFP「集团人才智能推荐和发展咨询项目」的交互式方案演示。

> 用于讲标 / 售前演示。所有 AI 输出（推荐解释、发展建议书、IDP）由 Google **Gemini** 实时生成；所有员工 / 岗位 / 项目数据均为演示用模拟样本。

## ✨ 演示亮点（对齐 RFP）

| RFP 业务需求 | 本演示中的对应能力 |
|---|---|
| 智能推荐：关键岗位 / 跨部门团队 / 策略项目 / 集团级任务 | **智能推荐引擎**（三场景统一） |
| 员工自助评估 + 个性化发展路径 | **数字助理 · 员工自助** |
| 主管智能化人才发展建议书 | **数字助理 · 主管视角**（一键生成 + 1on1 脚本） |
| 组织人才健康度（接班池 / 跨部门接班人比例 / 关键岗位风险） | **组织驾驶舱**（含 AI 一键洞察） |
| 凯捷方案、方法论与同构案例 | **凯捷方案与方法论** |

## 🧭 导航

- **项目理解** — 痛点诊断、洞察、价值映射、Winning Strategy
- **组织驾驶舱** — KPI、关键岗位风险地图、九宫格、接班池、AI 洞察
- **员工自助** — 个人画像（雷达图）+ 愿景输入 + AI 生成发展路径与 90 天计划
- **主管视角** — 选下属 + 勾选目标岗位 → AI 生成结构化发展建议书
- **智能推荐引擎** — 三模式（岗位 / 项目 / 任务）→ AI 实时排序 + 解释 + 差距 + 发展动作
- **凯捷方案与方法论** — 四模块框架、核心方法论、凯捷资产、案例、分阶段路线图

## 🚀 本地运行

前置条件：Node.js 18+

```bash
npm install
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm run dev      # → http://localhost:3000
npm run build    # 生产构建
```

## 🛠️ 技术栈

React 19 · TypeScript · Vite 6 · TailwindCSS (CDN) · lucide-react · `@google/genai`（Gemini 2.5 Flash，JSON Schema 结构化输出）

## 📁 目录结构

```
.
├── App.tsx                    # 顶层导航与视图切换
├── types.ts                   # 人才域类型定义
├── constants.ts               # 员工/岗位/项目/任务样本 + 凯捷资产 & 案例
├── services/geminiService.ts  # AI 推荐 / 发展计划 / 建议书 / 洞察
└── components/
    ├── Shared.tsx             # Card / Pill / Stat / RadarChart / Bar / AiBadge
    ├── Overview.tsx
    ├── Dashboard.tsx
    ├── EmployeeView.tsx
    ├── ManagerView.tsx
    ├── Recommendation.tsx
    └── Methodology.tsx
```
