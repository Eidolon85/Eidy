import React, { useState } from 'react';
import { Card, EmployeeChip, Pill, RadarChart, AiBadge, Bar } from './Shared';
import { Sparkles, Loader2, User, Compass, GraduationCap, ListChecks, FileText } from 'lucide-react';
import { EMPLOYEES } from '../constants';
import { generateDevelopmentPlan } from '../services/geminiService';
import type { DevelopmentPlan, Employee } from '../types';

export const EmployeeView: React.FC = () => {
  const [selected, setSelected] = useState<Employee>(EMPLOYEES[1]); // 李哲 default
  const [aspiration, setAspiration] = useState<string>('希望未来 18 个月成长为集团数字化产品总监，能够主导一个跨品牌的会员产品。');
  const [plan, setPlan] = useState<DevelopmentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    setLoading(true);
    setErr('');
    setPlan(null);
    try {
      const r = await generateDevelopmentPlan(selected, aspiration);
      setPlan(r);
    } catch (e: any) {
      setErr(e?.message || '调用失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><User className="text-[#E4002B]" /> 数字助理 · 员工自助</h2>
        <p className="text-sm text-slate-500 mt-1">对应 RFP「为员工提供完整的自助式人才评估结果与个性化发展路径建议」</p>
      </div>

      {/* Employee picker */}
      <Card title="选择员工（体验者视角）" subtitle="所有数据为演示样本">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {EMPLOYEES.slice(0, 8).map((e) => (
            <EmployeeChip key={e.id} e={e} active={selected.id === e.id} onClick={() => { setSelected(e); setPlan(null); }} />
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card title="我的画像" subtitle="基于 SAP SuccessFactors + 多源融合" icon={<User size={18} />} accent="red" className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center text-3xl">{selected.avatar}</div>
            <div>
              <div className="font-bold text-slate-900">{selected.name}</div>
              <div className="text-xs text-slate-500">{selected.title} · {selected.band}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                <Pill tone="red">{selected.brand}</Pill>
                <Pill tone="slate">{selected.location}</Pill>
                <Pill tone="green">{selected.performance}</Pill>
                <Pill tone="gold">{selected.potential}</Pill>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">{selected.bio}</p>
          <div className="mt-4 flex justify-center">
            <RadarChart data={selected.competencies.map((c) => ({ name: c.name, score: c.score }))} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {selected.competencies.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-[11px] text-slate-600"><span>{c.name}</span><span className="font-semibold">{c.score}</span></div>
                <Bar value={c.score} tone={c.score >= 85 ? 'red' : c.score >= 70 ? 'gold' : 'slate'} />
              </div>
            ))}
          </div>
        </Card>

        {/* Aspiration + AI */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="我的发展愿景" subtitle="输入愿景，AI 即生成个性化发展路径" icon={<Compass size={18} />} accent="gold">
            <textarea
              value={aspiration}
              onChange={(e) => setAspiration(e.target.value)}
              className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E4002B] focus:outline-none resize-none text-sm"
              placeholder="例如：未来 18 个月成为某个 BU 的数字化负责人；希望尝试跨品牌轮岗…"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-slate-500">技能标签：{selected.skills.map((s) => `#${s}`).join(' ')}</div>
              <button onClick={run} disabled={loading} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E4002B] to-[#F5B400] text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                生成我的发展路径
              </button>
            </div>
            {err && <div className="mt-2 text-xs text-red-600">{err}</div>}
          </Card>

          {/* Plan output */}
          {plan && (
            <div className="space-y-4">
              <div className="flex items-center gap-2"><AiBadge /> <span className="text-xs text-slate-500">由 Gemini 实时生成 · 凯捷 HCM 顾问 Prompt 模板</span></div>

              <Card title="发展定位摘要" icon={<FileText size={18} />} accent="red">
                <p className="text-sm text-slate-700 leading-relaxed bg-red-50/40 border border-red-100 rounded-lg p-3">{plan.careerNarrative}</p>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card title="我的优势">
                  <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">{plan.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </Card>
                <Card title="提升项">
                  <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">{plan.growthAreas.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </Card>
              </div>

              <Card title="推荐目标岗位" subtitle="12-24 个月内可达" icon={<Compass size={18} />}>
                <div className="space-y-3">
                  {plan.recommendedRoles.map((r, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-3 bg-gradient-to-br from-white to-amber-50/40">
                      <div className="font-semibold text-slate-900 text-sm">🎯 {r.role}</div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.rationale}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="学习与发展路径" subtitle="培训 · 轮岗 · 项目 · 导师" icon={<GraduationCap size={18} />} accent="gold">
                <div className="grid md:grid-cols-2 gap-3">
                  {plan.learningPath.map((l, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">{l.name}</span>
                        <Pill tone={l.type === '培训' ? 'blue' : l.type === '轮岗' ? 'red' : l.type === '项目' ? 'gold' : 'green'}>{l.type}</Pill>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">建议时长：{l.duration}</div>
                      <p className="text-xs text-slate-600 mt-1">{l.why}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="我的 90 天行动计划" icon={<ListChecks size={18} />} accent="red">
                <ol className="space-y-2 text-sm text-slate-700 list-decimal pl-5">
                  {plan.ninetyDayPlan.map((p, i) => <li key={i}>{p}</li>)}
                </ol>
              </Card>
            </div>
          )}

          {!plan && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
              填写愿景后点击右上「生成我的发展路径」，AI 将基于您的画像与百胜业务上下文实时生成 IDP。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
