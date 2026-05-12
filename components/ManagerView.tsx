import React, { useState } from 'react';
import { Card, EmployeeChip, Pill, AiBadge, RadarChart } from './Shared';
import { Briefcase, Sparkles, Loader2, FileText, MessageSquare, Shield, Download } from 'lucide-react';
import { EMPLOYEES, KEY_ROLES } from '../constants';
import { generateManagerBriefing } from '../services/geminiService';
import type { Employee, ManagerBriefing } from '../types';

export const ManagerView: React.FC = () => {
  const [selected, setSelected] = useState<Employee>(EMPLOYEES[0]); // 王晨
  const [targetRoles, setTargetRoles] = useState<string[]>([KEY_ROLES[0].title]);
  const [brief, setBrief] = useState<ManagerBriefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    setLoading(true); setErr(''); setBrief(null);
    try {
      const r = await generateManagerBriefing(selected, targetRoles);
      setBrief(r);
    } catch (e: any) {
      setErr(e?.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (t: string) =>
    setTargetRoles((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Briefcase className="text-[#E4002B]" /> 数字助理 · 主管视角</h2>
        <p className="text-sm text-slate-500 mt-1">对应 RFP「为主管提供结构化、智能化的人才发展建议书」</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="选择我的下属" subtitle="主管视角下的人才视图">
            <div className="grid grid-cols-2 gap-2">
              {EMPLOYEES.slice(0, 8).map((e) => (
                <EmployeeChip key={e.id} e={e} active={selected.id === e.id} onClick={() => { setSelected(e); setBrief(null); }} />
              ))}
            </div>
          </Card>

          <Card title="候选目标岗位" subtitle="供 AI 评估「就位度」" accent="gold">
            <div className="space-y-2">
              {KEY_ROLES.map((r) => (
                <label key={r.id} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer text-sm ${targetRoles.includes(r.title) ? 'border-[#E4002B] bg-red-50' : 'border-slate-200'}`}>
                  <input type="checkbox" checked={targetRoles.includes(r.title)} onChange={() => toggleRole(r.title)} className="mt-0.5 accent-[#E4002B]" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">{r.title}</div>
                    <div className="text-[11px] text-slate-500">{r.brand} · {r.requiredSkills.slice(0, 3).join(' / ')}</div>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={run} disabled={loading || targetRoles.length === 0} className="mt-4 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E4002B] to-[#F5B400] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              一键生成发展建议书
            </button>
            {err && <div className="mt-2 text-xs text-red-600">{err}</div>}
          </Card>

          <Card title="员工速览">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl">{selected.avatar}</div>
              <div>
                <div className="font-bold text-slate-900">{selected.name}</div>
                <div className="text-xs text-slate-500">{selected.title}</div>
                <div className="flex gap-1 mt-1">
                  <Pill tone="green">{selected.performance}</Pill>
                  <Pill tone="gold">{selected.potential}</Pill>
                  <Pill tone="red">{selected.readiness}</Pill>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-2"><RadarChart data={selected.competencies.map((c) => ({ name: c.name, score: c.score }))} size={200} /></div>
          </Card>
        </div>

        {/* Briefing */}
        <div className="lg:col-span-2 space-y-4">
          {!brief && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              <FileText className="mx-auto mb-2 text-slate-400" />
              <div className="text-sm">勾选目标岗位 → 点击「一键生成发展建议书」</div>
              <div className="text-xs mt-1 text-slate-400">用于人才盘点会、1on1 发展沟通、IDP 模板填充</div>
            </div>
          )}

          {brief && (
            <>
              {/* Doc Header */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-300 font-semibold tracking-wider">CAPGEMINI · TALENT INTELLIGENCE</div>
                  <div className="text-lg font-bold mt-1">{selected.name} · 智能化人才发展建议书</div>
                  <div className="text-xs text-white/70 mt-0.5">基于 SF 继任发展模块 + 凯捷三维评估模型 + GenAI 推理</div>
                </div>
                <div className="flex items-center gap-2">
                  <AiBadge>Gemini 实时生成</AiBadge>
                  <button onClick={() => window.print()} className="text-xs px-3 py-1.5 bg-white/10 border border-white/20 rounded-full flex items-center gap-1 hover:bg-white/20"><Download size={12} /> 导出</button>
                </div>
              </div>

              <Card title="综合判断" icon={<FileText size={18} />} accent="red">
                <p className="text-sm text-slate-700 leading-relaxed">{brief.summary}</p>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card title="优势 · 证据" accent="gold">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {brief.strengthsTable.map((s, i) => (
                        <tr key={i}>
                          <td className="py-2 pr-2 align-top w-1/3"><Pill tone="green">{s.dimension}</Pill></td>
                          <td className="py-2 text-slate-700 text-xs leading-relaxed">{s.evidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
                <Card title="发展项 · 风险 · 干预" accent="red">
                  <div className="space-y-3">
                    {brief.developmentTable.map((d, i) => (
                      <div key={i} className="border-l-4 border-[#E4002B] pl-3">
                        <div className="text-sm font-semibold text-slate-900">{d.dimension}</div>
                        <div className="text-xs text-slate-600 mt-1"><strong className="text-amber-700">业务风险：</strong>{d.risk}</div>
                        <div className="text-xs text-slate-600 mt-1"><strong className="text-emerald-700">干预建议：</strong>{d.intervention}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card title="继任就位度评估" subtitle="对应 RFP「梯队与接班人动态追踪」" accent="gold">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b">
                      <th className="py-2">候选岗位</th>
                      <th className="py-2">就位度</th>
                      <th className="py-2">判断依据</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brief.successionFit.map((s, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-2 font-semibold text-slate-900">{s.role}</td>
                        <td className="py-2 pr-2"><Pill tone={s.readiness === 'Ready Now' ? 'green' : s.readiness.includes('1-2') ? 'gold' : 'slate'}>{s.readiness}</Pill></td>
                        <td className="py-2 text-xs text-slate-600">{s.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <Card title="1on1 发展沟通脚本" subtitle="主管直接用于教练式对话" icon={<MessageSquare size={18} />}>
                <ol className="space-y-2 text-sm text-slate-700 list-decimal pl-5">
                  {brief.conversationGuide.map((c, i) => <li key={i}>{c}</li>)}
                </ol>
              </Card>

              <Card title="保留风险与建议" icon={<Shield size={18} />} accent="red">
                <p className="text-sm text-slate-700 leading-relaxed bg-red-50/40 border border-red-100 rounded-lg p-3">{brief.retentionRisk}</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
