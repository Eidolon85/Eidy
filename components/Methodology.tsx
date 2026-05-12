import React from 'react';
import { Card, Pill } from './Shared';
import { Layers, Database, Users2, BrainCircuit, Bot, Award, Building2 } from 'lucide-react';
import { CAPGEMINI_ASSETS, CAPGEMINI_CASES } from '../constants';

export const Methodology: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Layers className="text-[#E4002B]" /> 凯捷方案与方法论</h2>
        <p className="text-sm text-slate-500 mt-1">四模块方案框架 · 核心方法论 · 凯捷资产与案例</p>
      </div>

      {/* 四模块 */}
      <Card title="解决方案总体框架（四大模块）" subtitle="对应 RFP 第 4 章「项目主要交付物」" accent="red">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { n: '01', t: '人才数据底座', icon: <Database size={18} />, items: ['多源数据采集与整合（绩效/培训/轮岗/评估）', '统一人才标签体系', '黄金数据源 + 数据质量治理'] },
            { n: '02', t: '人员 & 岗位画像', icon: <Users2 size={18} />, items: ['员工能力画像（基于 SF/PS 增强）', '关键岗位胜任力模型', '人岗匹配度算法设计'] },
            { n: '03', t: '智能推荐引擎', icon: <BrainCircuit size={18} />, items: ['场景一：关键岗位人才推荐', '场景二：跨部门项目团队匹配', '场景三：集团级任务委派推荐', '准确性验证方法论'] },
            { n: '04', t: '数字化发展助理', icon: <Bot size={18} />, items: ['员工自助：个人评估 + 发展路径', '主管辅助：发展建议书自动生成', '组织视角：人才健康度仪表盘'] },
          ].map((m) => (
            <div key={m.n} className="rounded-2xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition">
              <div className="text-[#E4002B] font-mono text-xs">MODULE {m.n}</div>
              <div className="flex items-center gap-2 mt-1 font-bold text-slate-900">{m.icon} {m.t}</div>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {m.items.map((x, i) => <li key={i} className="leading-snug">• {x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* 核心方法论 */}
      <Card title="核心方法论" subtitle="可写入 Proposal 第二章" accent="gold">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b">
              <th className="py-2">方法 / 模型</th>
              <th className="py-2">说明</th>
              <th className="py-2">凯捷资产</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 font-semibold text-slate-900">三维人才评估模型</td>
              <td className="py-3 text-slate-700 text-xs">业绩 × 能力 × 潜力，配合九宫格盘点</td>
              <td className="py-3"><Pill tone="red">SF 继任发展模块经验</Pill></td>
            </tr>
            <tr>
              <td className="py-3 font-semibold text-slate-900">关键岗位识别三维模型</td>
              <td className="py-3 text-slate-700 text-xs">战略价值 × 稀缺性 × 替代难度</td>
              <td className="py-3"><Pill tone="gold">凯捷咨询方法论</Pill></td>
            </tr>
            <tr>
              <td className="py-3 font-semibold text-slate-900">AI 人岗匹配算法</td>
              <td className="py-3 text-slate-700 text-xs">基于技能向量相似度 + GenAI 推理解释</td>
              <td className="py-3"><Pill tone="red">AI 人岗匹配资产包</Pill></td>
            </tr>
            <tr>
              <td className="py-3 font-semibold text-slate-900">数据多源一致性原则</td>
              <td className="py-3 text-slate-700 text-xs">黄金数据源认定 + 冲突解决规则</td>
              <td className="py-3"><Pill tone="gold">数据治理咨询</Pill></td>
            </tr>
            <tr>
              <td className="py-3 font-semibold text-slate-900">数字助理 · 三视角</td>
              <td className="py-3 text-slate-700 text-xs">员工 / 主管 / 组织三视角统一</td>
              <td className="py-3"><Pill tone="red">SF 人才画像组件</Pill></td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* 凯捷资产 */}
      <Card title="即拿即用 · 凯捷资产清单" subtitle="加速本项目 Time-to-Value" icon={<Award size={18} />} accent="red">
        <div className="grid md:grid-cols-3 gap-3">
          {CAPGEMINI_ASSETS.map((a, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 bg-white">
              <div className="flex items-center justify-between"><div className="font-bold text-slate-900 text-sm">{a.name}</div><Pill tone="red">{a.category}</Pill></div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 案例 */}
      <Card title="同构案例" subtitle="奇瑞高度匹配本项目 · 麦当劳直接复用餐饮经验" icon={<Building2 size={18} />} accent="gold">
        <div className="grid md:grid-cols-2 gap-3">
          {CAPGEMINI_CASES.map((c, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 flex gap-3 bg-gradient-to-br from-white to-amber-50/30">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E4002B] to-[#F5B400] flex items-center justify-center text-white font-bold flex-shrink-0">{c.client.slice(0, 2)}</div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm">{c.client}</div>
                <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{c.highlight}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Timeline */}
      <Card title="项目分阶段实施路线图" subtitle="对应 RFP「系统实施路线图与分阶段计划」（不含系统开发）" accent="red">
        <div className="grid md:grid-cols-5 gap-3">
          {[
            { p: 'Phase 1', t: '诊断与对齐', d: '4 周', desc: '现状诊断、关键岗位识别、数据源摸底' },
            { p: 'Phase 2', t: '画像与算法', d: '6 周', desc: '员工/岗位画像、匹配算法原型、业务规则' },
            { p: 'Phase 3', t: '三场景验证', d: '4 周', desc: '关键岗位/跨部门/集团任务三场景试点' },
            { p: 'Phase 4', t: '数字助理设计', d: '4 周', desc: '员工/主管/组织三视角 PRD + 原型' },
            { p: 'Phase 5', t: '路线图与交接', d: '2 周', desc: '实施路线图、报价、运营治理建议' },
          ].map((s, i) => (
            <div key={i} className="relative rounded-xl border border-slate-200 p-3 bg-white">
              <div className="text-[10px] text-[#E4002B] font-bold uppercase tracking-wider">{s.p}</div>
              <div className="font-bold text-slate-900 text-sm mt-1">{s.t}</div>
              <Pill tone="gold">{s.d}</Pill>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-slate-500">总周期：约 20 周（2026/5 → 2026/9），与 BD plan 一致；交付以上海现场为主 + 远程协同。</div>
      </Card>
    </div>
  );
};
