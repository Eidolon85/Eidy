import React from 'react';
import { Card, Pill, Stat } from './Shared';
import { Sparkles, Target, Database, BrainCircuit, Users2, Rocket, ShieldCheck, Layers } from 'lucide-react';

export const Overview: React.FC<{ onJump: (k: any) => void }> = ({ onJump }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0008] via-[#3a0010] to-[#E4002B] text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 0, transparent 40%), radial-gradient(circle at 80% 70%, #F5B400 0, transparent 35%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold border border-white/20">CAPGEMINI × YUM CHINA · RFP 2026</span>
            <span className="px-3 py-1 rounded-full bg-[#F5B400]/95 text-black text-xs font-bold">交互式方案演示</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            人才智能推荐与发展平台
            <br />
            <span className="text-[#F5B400]">Talent Intelligence Suite for Yum China</span>
          </h1>
          <p className="mt-4 text-white/85 max-w-3xl text-sm md:text-base leading-relaxed">
            以「数据底座 + 人岗画像 + 智能推荐 + 数字助理」四模块为骨架，对齐百胜「前端分层、后端聚合」战略，
            从点状评估升级为<span className="font-semibold text-[#F5B400]">动态人才生态</span>。
            本演示基于真实 RFP 业务需求构建，所有 AI 输出由 Gemini 实时生成。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => onJump('dashboard')} className="px-5 py-2.5 rounded-full bg-white text-[#E4002B] font-semibold text-sm hover:scale-105 transition shadow-lg flex items-center gap-2">
              <Rocket size={16} /> 进入组织驾驶舱
            </button>
            <button onClick={() => onJump('recommendation')} className="px-5 py-2.5 rounded-full bg-[#F5B400] text-black font-semibold text-sm hover:scale-105 transition shadow-lg flex items-center gap-2">
              <Sparkles size={16} /> 体验智能推荐
            </button>
            <button onClick={() => onJump('methodology')} className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur text-white font-semibold text-sm border border-white/20 hover:bg-white/20 transition flex items-center gap-2">
              <Layers size={16} /> 查看方法论与案例
            </button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="覆盖品牌" value="6 +" sub="肯德基 / 必胜客 / 塔可贝尔 / 小肥羊 / 黄记煌 / 烧范儿" tone="red" />
        <Stat label="智能匹配场景" value="3" sub="关键岗位 · 跨部门项目 · 集团级任务" tone="gold" />
        <Stat label="凯捷 HCM 项目" value="150 +" sub="奇瑞 / 招商局 / 立邦 / 一汽大众 / 安踏…" />
        <Stat label="数字助理视角" value="3" sub="员工 · 主管 · 组织" tone="green" />
      </div>

      {/* 项目理解 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="百胜中国的核心痛点（来自 RFP）" subtitle="对应 RFP 第 1 章「项目背景」" icon={<Target size={18} />} accent="red">
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><Pill tone="red">痛点 1</Pill><span><strong>人才数据分散</strong>于多系统多流程，缺乏统一画像。</span></li>
            <li className="flex gap-3"><Pill tone="red">痛点 2</Pill><span><strong>人员决策维度单一</strong>，依赖个人经验，缺数据驱动支撑。</span></li>
            <li className="flex gap-3"><Pill tone="red">痛点 3</Pill><span><strong>员工职业发展缺乏系统性指引</strong>，自助能力不足。</span></li>
            <li className="flex gap-3"><Pill tone="red">痛点 4</Pill><span><strong>梯队 / 接班人状态不透明</strong>，无法动态追踪与全局部署。</span></li>
          </ul>
        </Card>
        <Card title="凯捷的核心洞察 & 价值主张" subtitle="独家解读，写进 Proposal 第一章" icon={<BrainCircuit size={18} />} accent="gold">
          <p className="text-sm text-slate-700 leading-relaxed">
            百胜「前端分层、后端聚合」战略对<strong>复合型人才</strong>的需求，本质上是建立一套
            <span className="bg-amber-100 text-amber-900 px-1.5 rounded">人才供应链管理体系</span>
            ——需要从<strong>点状评估</strong>升级为<strong>动态人才生态</strong>。
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg p-3 border border-slate-200 bg-slate-50">
              <div className="font-semibold text-slate-900">从 → 到</div>
              <div className="text-slate-600 mt-1">单系统评估 → 多源融合画像</div>
            </div>
            <div className="rounded-lg p-3 border border-slate-200 bg-slate-50">
              <div className="font-semibold text-slate-900">从 → 到</div>
              <div className="text-slate-600 mt-1">主观经验决策 → AI 辅助决策</div>
            </div>
            <div className="rounded-lg p-3 border border-slate-200 bg-slate-50">
              <div className="font-semibold text-slate-900">从 → 到</div>
              <div className="text-slate-600 mt-1">静态盘点 → 动态梯队追踪</div>
            </div>
            <div className="rounded-lg p-3 border border-slate-200 bg-slate-50">
              <div className="font-semibold text-slate-900">从 → 到</div>
              <div className="text-slate-600 mt-1">岗位维度 → 岗位 + 项目 + 任务</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 业务需求映射 */}
      <Card title="RFP 业务需求 ↔ 本演示能力映射" subtitle="逐条对齐 RFP 第 3 章" icon={<ShieldCheck size={18} />} accent="red">
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b">
                <th className="py-2 px-2">RFP 业务需求</th>
                <th className="py-2 px-2">本演示对应能力</th>
                <th className="py-2 px-2">入口</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-2">智能推荐：关键岗位 / 跨部门团队 / 策略项目 / 集团级任务匹配</td>
                <td className="py-2 px-2">三场景智能推荐引擎（AI 实时排序 + 解释 + 差距 + 发展动作）</td>
                <td className="py-2 px-2"><button onClick={() => onJump('recommendation')} className="text-[#E4002B] font-semibold hover:underline">智能推荐引擎 →</button></td>
              </tr>
              <tr>
                <td className="py-2 px-2">员工自助评估 + 个性化发展路径（培训 / 轮岗 / 岗位匹配度）</td>
                <td className="py-2 px-2">数字助理 · 员工视角：90 天计划 + 推荐岗位 + 学习路径</td>
                <td className="py-2 px-2"><button onClick={() => onJump('employee')} className="text-[#E4002B] font-semibold hover:underline">员工自助 →</button></td>
              </tr>
              <tr>
                <td className="py-2 px-2">主管：结构化、智能化的人才发展建议书</td>
                <td className="py-2 px-2">数字助理 · 主管视角：一键生成「发展建议书」+ 1on1 提问</td>
                <td className="py-2 px-2"><button onClick={() => onJump('manager')} className="text-[#E4002B] font-semibold hover:underline">主管视角 →</button></td>
              </tr>
              <tr>
                <td className="py-2 px-2">组织：人才健康度（接班池 / 跨部门接班人比例 / 关键岗位风险）</td>
                <td className="py-2 px-2">组织驾驶舱：健康度仪表盘 + 关键岗位风险地图 + AI 洞察</td>
                <td className="py-2 px-2"><button onClick={() => onJump('dashboard')} className="text-[#E4002B] font-semibold hover:underline">组织驾驶舱 →</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Winning Strategy */}
      <Card title="为何选择凯捷 · Winning Strategy" subtitle="HCM 团队最丰富的实践 + 餐饮 / 集团化客户经验" icon={<Users2 size={18} />} accent="gold">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50">
            <div className="font-bold text-slate-900">中国最多 HCM 标杆案例</div>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">20+ 年中国 HCM 独立实施团队，150+ 客户，奇瑞、招商局、一汽大众、安踏、立邦等行业头部均由凯捷实施。</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50">
            <div className="font-bold text-slate-900">奇瑞汽车类似案例</div>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">HRSSC + SF 全模块 + 集团人才画像与继任池，方法论与本项目高度同构，可显著降低 Day-1 风险。</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50">
            <div className="font-bold text-slate-900">餐饮行业理解</div>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">服务过麦当劳等餐饮客户，理解多品牌矩阵、门店人才链路与「营运 + 数字化」复合人才需求。</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50">
            <div className="font-bold text-slate-900">凯捷 AI / GenAI 资产</div>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">€2B GenAI 投资，1000+ 数据 / AI 顾问，AI 创新中台 + AI 人岗匹配 + SAP SF 人才画像组件即拿即用。</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50">
            <div className="font-bold text-slate-900">数据治理 & 合规</div>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">「黄金数据源」原则 + 数据跨境合规咨询，覆盖《个人信息保护法》全要求。</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50">
            <div className="font-bold text-slate-900">全中文交付 · 上海现场</div>
            <p className="text-slate-600 text-xs mt-2 leading-relaxed">上海现场 + 远程协同；全中文文档与沟通；可灵活调配凯捷全国 200+ HCM 顾问。</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
