import React, { useMemo, useState } from 'react';
import { Card, Pill, Bar, AiBadge } from './Shared';
import { Sparkles, Loader2, Crown, Network, Flag, ChevronRight, Trophy, AlertOctagon, TrendingUp } from 'lucide-react';
import { EMPLOYEES, KEY_ROLES, CROSS_PROJECTS, CORPORATE_TASKS } from '../constants';
import { rankCandidates, buildTargetFromRole, buildTargetFromProject, buildTargetFromTask } from '../services/geminiService';
import type { RankedCandidate, RecommendationMode } from '../types';

export const Recommendation: React.FC = () => {
  const [mode, setMode] = useState<RecommendationMode>('role');
  const [selectedId, setSelectedId] = useState<string>(KEY_ROLES[0].id);
  const [results, setResults] = useState<RankedCandidate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const modeMeta = {
    role: { label: '关键岗位匹配', icon: <Crown size={16} />, list: KEY_ROLES, descKey: 'title' as const },
    project: { label: '跨部门项目组队', icon: <Network size={16} />, list: CROSS_PROJECTS, descKey: 'name' as const },
    task: { label: '集团级任务推荐', icon: <Flag size={16} />, list: CORPORATE_TASKS, descKey: 'title' as const },
  };

  const currentList = modeMeta[mode].list as any[];

  const selectedItem = useMemo(() => currentList.find((x) => x.id === selectedId) || currentList[0], [currentList, selectedId]);

  const run = async () => {
    if (!selectedItem) return;
    setLoading(true); setErr(''); setResults(null);
    try {
      const target =
        mode === 'role' ? buildTargetFromRole(selectedItem) :
        mode === 'project' ? buildTargetFromProject(selectedItem) :
        buildTargetFromTask(selectedItem);
      const r = await rankCandidates(target, EMPLOYEES);
      setResults(r);
    } catch (e: any) {
      setErr(e?.message || '推荐失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Sparkles className="text-[#E4002B]" /> 智能推荐引擎</h2>
        <p className="text-sm text-slate-500 mt-1">对应 RFP「构建人才发展与流动的智能推荐能力，覆盖关键岗位、跨部门团队、策略项目、集团级任务」</p>
      </div>

      {/* Mode switch */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        {(Object.keys(modeMeta) as RecommendationMode[]).map((k) => (
          <button
            key={k}
            onClick={() => { setMode(k); setSelectedId((modeMeta[k].list as any[])[0].id); setResults(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              mode === k ? 'bg-white text-[#E4002B] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {modeMeta[k].icon} {modeMeta[k].label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Target picker */}
        <div className="lg:col-span-1 space-y-3">
          <Card title={`选择${modeMeta[mode].label.replace('匹配', '').replace('组队', '').replace('推荐', '')}`} accent="red">
            <div className="space-y-2">
              {currentList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedId(item.id); setResults(null); }}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedId === item.id ? 'border-[#E4002B] bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-sm flex items-center justify-between">
                    {item[modeMeta[mode].descKey]}
                    {selectedId === item.id && <ChevronRight size={14} className="text-[#E4002B]" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {mode === 'role' && `${item.brand} · 风险 ${item.vacancyRisk}`}
                    {mode === 'project' && `${item.brand} · ${item.duration}`}
                    {mode === 'task' && `${item.sponsor} · ${item.durationWeeks} 周`}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Target detail */}
          {selectedItem && (
            <Card title="目标详情" accent="gold">
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-slate-900">{selectedItem[modeMeta[mode].descKey]}</div>
                {mode === 'role' && (
                  <>
                    <div className="text-xs text-slate-600">{selectedItem.incumbent}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><div className="text-slate-500">战略价值</div><Bar value={selectedItem.strategicWeight} tone="red" /></div>
                      <div><div className="text-slate-500">稀缺性</div><Bar value={selectedItem.scarcity} tone="gold" /></div>
                      <div><div className="text-slate-500">替代难度</div><Bar value={selectedItem.replaceDifficulty} tone="slate" /></div>
                    </div>
                    <div className="text-xs text-slate-700"><strong>所需能力：</strong>{(selectedItem.requiredSkills || []).join('、')}</div>
                  </>
                )}
                {mode === 'project' && (
                  <>
                    <p className="text-xs text-slate-600">{selectedItem.description}</p>
                    <div className="text-xs"><strong>角色构成：</strong>{(selectedItem.roles || []).map((r: any) => r.role).join(' · ')}</div>
                  </>
                )}
                {mode === 'task' && (
                  <>
                    <p className="text-xs text-slate-600">{selectedItem.description}</p>
                    <div className="text-xs text-slate-700"><strong>所需能力：</strong>{(selectedItem.requiredSkills || []).join('、')}</div>
                  </>
                )}
              </div>
              <button onClick={run} disabled={loading} className="mt-4 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E4002B] to-[#F5B400] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                AI 智能匹配
              </button>
              {err && <div className="mt-2 text-xs text-red-600">{err}</div>}
            </Card>
          )}
        </div>

        {/* Ranking */}
        <div className="lg:col-span-2 space-y-3">
          {!results && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              <Sparkles className="mx-auto mb-2 text-slate-400" />
              <div className="text-sm">选择目标 → 点击「AI 智能匹配」</div>
              <div className="text-xs mt-1 text-slate-400">凯捷 AI 人岗匹配资产 · 基于技能向量相似度 + 多维评估推理</div>
            </div>
          )}
          {loading && (
            <div className="rounded-2xl border border-slate-200 p-8 text-center">
              <Loader2 className="animate-spin mx-auto text-[#E4002B]" />
              <div className="text-sm text-slate-600 mt-3">Gemini 正在对 {EMPLOYEES.length} 位候选人进行多维评估…</div>
              <div className="text-xs text-slate-400 mt-1">综合能力 / 经验 / 潜力 / 绩效 / 就位度 / 跨品牌经历</div>
            </div>
          )}
          {results && (
            <>
              <div className="flex items-center gap-2"><AiBadge /> <span className="text-xs text-slate-500">AI 已对 {results.length} 位候选人完成评估排序</span></div>
              {results.slice(0, 8).map((r, idx) => (
                <Card key={r.employee.id} className="hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl ${idx === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500' : 'bg-slate-100'}`}>
                        {r.employee.avatar}
                        {idx === 0 && <Trophy size={14} className="absolute -top-1 -right-1 text-amber-600 bg-white rounded-full p-0.5" />}
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 font-semibold">#{idx + 1}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{r.employee.name} <span className="text-slate-500 font-normal">· {r.employee.title}</span></div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-1">
                            <Pill tone="red">{r.employee.brand}</Pill>
                            <Pill tone="green">{r.employee.performance}</Pill>
                            <Pill tone="gold">{r.employee.potential}</Pill>
                            <Pill tone="slate">{r.employee.readiness}</Pill>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-3xl font-bold ${r.matchScore >= 85 ? 'text-[#E4002B]' : r.matchScore >= 70 ? 'text-amber-600' : 'text-slate-600'}`}>{r.matchScore}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">match score</div>
                        </div>
                      </div>
                      <Bar value={r.matchScore} tone={r.matchScore >= 85 ? 'red' : 'gold'} />
                      <div className="grid md:grid-cols-3 gap-3 mt-3 text-xs">
                        <div>
                          <div className="font-semibold text-emerald-700 flex items-center gap-1 mb-1"><TrendingUp size={12} /> 匹配理由</div>
                          <ul className="space-y-0.5 text-slate-700 list-disc pl-4">
                            {r.reasons.map((x, i) => <li key={i}>{x}</li>)}
                          </ul>
                        </div>
                        <div>
                          <div className="font-semibold text-amber-700 flex items-center gap-1 mb-1"><AlertOctagon size={12} /> 能力差距</div>
                          <ul className="space-y-0.5 text-slate-700 list-disc pl-4">
                            {r.gaps.map((x, i) => <li key={i}>{x}</li>)}
                          </ul>
                        </div>
                        <div>
                          <div className="font-semibold text-[#E4002B] flex items-center gap-1 mb-1"><Sparkles size={12} /> 发展动作</div>
                          <ul className="space-y-0.5 text-slate-700 list-disc pl-4">
                            {r.developmentMoves.map((x, i) => <li key={i}>{x}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
