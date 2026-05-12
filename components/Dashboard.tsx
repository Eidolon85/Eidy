import React, { useMemo, useState } from 'react';
import { Card, Pill, Stat, Bar, AiBadge } from './Shared';
import { Gauge, Users2, AlertTriangle, GitBranch, Sparkles, Loader2 } from 'lucide-react';
import { EMPLOYEES, KEY_ROLES } from '../constants';
import { generateInsight } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Derived metrics
  const metrics = useMemo(() => {
    const total = EMPLOYEES.length;
    const highPo = EMPLOYEES.filter((e) => e.potential === '高潜').length;
    const readyNow = EMPLOYEES.filter((e) => e.readiness === 'Ready Now').length;
    const successors = EMPLOYEES.filter((e) => !!e.successorOf).length;
    const crossBrand = EMPLOYEES.filter((e) => e.experiences.some((x) => /轮岗|跨品牌|跨/.test(x))).length;
    const highRisk = KEY_ROLES.filter((r) => r.vacancyRisk === 'High').length;
    return {
      total,
      highPoRate: Math.round((highPo / total) * 100),
      readyNow,
      successors,
      crossBrandRate: Math.round((crossBrand / total) * 100),
      highRisk,
    };
  }, []);

  // 9-Box grid
  const nineBox = useMemo(() => {
    const map: Record<string, typeof EMPLOYEES> = {};
    for (let p = 0; p < 3; p++) for (let pe = 0; pe < 3; pe++) map[`${p}-${pe}`] = [];
    EMPLOYEES.forEach((e) => {
      const pe = e.performance === 'A' ? 2 : e.performance === 'B+' ? 1 : 0;
      const p = e.potential === '高潜' ? 2 : e.potential === '稳定' ? 1 : 0;
      map[`${p}-${pe}`].push(e);
    });
    return map;
  }, []);

  // Brand mix
  const brandMix = useMemo(() => {
    const m = new Map<string, number>();
    EMPLOYEES.forEach((e) => m.set(e.brand, (m.get(e.brand) || 0) + 1));
    return Array.from(m.entries());
  }, []);

  const runInsight = async () => {
    setLoading(true);
    try {
      const prompt = `请基于以下百胜中国人才驾驶舱数据给出 1 条洞察：
- 总人才池：${metrics.total} 人
- 高潜比例：${metrics.highPoRate}%
- Ready Now 后备：${metrics.readyNow} 人
- 关键岗位高风险数量：${metrics.highRisk}
- 跨品牌经历比例：${metrics.crossBrandRate}%
关键岗位风险：${KEY_ROLES.filter((r) => r.vacancyRisk === 'High').map((r) => r.title).join('、')}
要求：80-120 字，给出 1 个具体问题 + 1 个可执行建议。`;
      const t = await generateInsight(prompt);
      setInsight(t);
    } catch (e: any) {
      setInsight('⚠️ AI 调用失败：' + (e?.message || '请检查 API Key'));
    } finally {
      setLoading(false);
    }
  };

  const nineBoxLabel = (p: number, pe: number) => {
    if (p === 2 && pe === 2) return { label: '明星', tone: 'red' as const };
    if (p === 2 && pe === 1) return { label: '高潜', tone: 'gold' as const };
    if (p === 1 && pe === 2) return { label: '中坚', tone: 'green' as const };
    if (p === 0 && pe === 0) return { label: '风险', tone: 'amber' as const };
    return { label: '观察', tone: 'slate' as const };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Gauge className="text-[#E4002B]" /> 组织驾驶舱 · 人才健康度
          </h2>
          <p className="text-sm text-slate-500 mt-1">对应 RFP「组织层面人才健康度分析」需求 · 数据为演示用模拟样本</p>
        </div>
        <button
          onClick={runInsight}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          AI 一键洞察
        </button>
      </div>

      {/* AI Insight */}
      {(insight || loading) && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2">
            <AiBadge /> 凯捷 AI 顾问洞察
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">{loading ? '正在分析人才健康度数据…' : insight}</p>
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat label="人才池" value={metrics.total} tone="slate" />
        <Stat label="高潜比例" value={`${metrics.highPoRate}%`} tone="red" />
        <Stat label="Ready Now" value={metrics.readyNow} tone="green" sub="可立即就位" />
        <Stat label="接班池规模" value={metrics.successors} tone="gold" />
        <Stat label="跨品牌经历率" value={`${metrics.crossBrandRate}%`} tone="slate" />
        <Stat label="高风险岗位" value={metrics.highRisk} tone="red" sub="需 6 个月内补位" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 关键岗位风险地图 */}
        <Card title="关键岗位风险地图" subtitle="战略价值 × 空缺风险" icon={<AlertTriangle size={18} />} accent="red">
          <div className="space-y-4">
            {KEY_ROLES.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-xl p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">{r.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.brand} · 现状：{r.incumbent}</div>
                  </div>
                  <Pill tone={r.vacancyRisk === 'High' ? 'red' : r.vacancyRisk === 'Medium' ? 'gold' : 'green'}>
                    {r.vacancyRisk === 'High' ? '高风险' : r.vacancyRisk === 'Medium' ? '中风险' : '低风险'}
                  </Pill>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">战略价值</div>
                    <Bar value={r.strategicWeight} tone="red" />
                  </div>
                  <div>
                    <div className="text-slate-500">稀缺性</div>
                    <Bar value={r.scarcity} tone="gold" />
                  </div>
                  <div>
                    <div className="text-slate-500">替代难度</div>
                    <Bar value={r.replaceDifficulty} tone="slate" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-600">后备人数：<span className="font-semibold">{r.successorCount}</span> · 所需能力：{r.requiredSkills.join('、')}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 9-Box */}
        <Card title="九宫格 · 业绩 × 潜力" subtitle="经典人才盘点视图，凯捷三维评估模型" icon={<GitBranch size={18} />} accent="gold">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[2, 1, 0].map((p) =>
              [0, 1, 2].map((pe) => {
                const list = nineBox[`${p}-${pe}`];
                const meta = nineBoxLabel(p, pe);
                return (
                  <div key={`${p}-${pe}`} className="border border-slate-200 rounded-lg p-2 min-h-[88px] bg-white">
                    <div className="flex items-center justify-between">
                      <Pill tone={meta.tone}>{meta.label}</Pill>
                      <span className="text-[10px] text-slate-400">{list.length} 人</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-0.5">
                      {list.slice(0, 5).map((e) => (
                        <span key={e.id} title={`${e.name} · ${e.title}`} className="text-base">
                          {e.avatar}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-slate-500">
            <span>← 业绩低</span><span>业绩高 →</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">行：上=高潜，中=稳定，下=观察</div>
        </Card>

        {/* Brand mix */}
        <Card title="品牌组合人才结构" subtitle="对应「前端分层、后端聚合」战略" icon={<Users2 size={18} />} accent="slate">
          <div className="space-y-3">
            {brandMix.map(([brand, count]) => (
              <div key={brand}>
                <div className="flex justify-between text-xs text-slate-700"><span className="font-medium">{brand}</span><span>{count} 人</span></div>
                <Bar value={(count / metrics.total) * 100} tone="red" />
              </div>
            ))}
          </div>
        </Card>

        {/* 接班池 */}
        <Card title="接班池快照" subtitle="对应「接班池结构 / 跨部门接班人比例」" icon={<GitBranch size={18} />} accent="red">
          <div className="space-y-3">
            {KEY_ROLES.map((r) => {
              const candidates = EMPLOYEES.filter((e) => e.successorOf?.includes(r.title.split(' ')[0].slice(0, 4)) || (r.requiredSkills.some((s) => e.skills.includes(s)) && e.potential === '高潜'));
              return (
                <div key={r.id} className="border border-slate-200 rounded-xl p-3">
                  <div className="text-sm font-semibold text-slate-900">{r.title}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidates.slice(0, 5).map((e) => (
                      <span key={e.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                        <span>{e.avatar}</span>
                        <span className="font-medium">{e.name}</span>
                        <span className="text-slate-400">· {e.readiness}</span>
                      </span>
                    ))}
                    {candidates.length === 0 && <span className="text-xs text-slate-400">尚未识别到合格候选人</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
