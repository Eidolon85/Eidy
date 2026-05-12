import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Employee } from '../types';

export const Card: React.FC<{
  title?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  accent?: 'red' | 'gold' | 'slate';
}> = ({ title, subtitle, icon, children, className, accent }) => {
  const accentBar = {
    red: 'from-[#E4002B] to-[#8B0000]',
    gold: 'from-[#F5B400] to-[#E4002B]',
    slate: 'from-slate-700 to-slate-900',
  }[accent || 'slate'];
  return (
    <section
      className={`relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 ${className || ''}`}
    >
      {accent && <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentBar}`} />}
      {title && (
        <header className="px-5 pt-5 pb-3 flex items-start gap-3">
          {icon && (
            <div className="text-[#E4002B] mt-0.5">{icon}</div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </header>
      )}
      <div className="px-5 pb-5 pt-1">{children}</div>
    </section>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; tone?: 'red' | 'gold' | 'green' | 'blue' | 'slate' | 'amber' }> = ({ children, tone = 'slate' }) => {
  const tones: Record<string, string> = {
    red: 'bg-red-50 text-[#E4002B] border-red-200',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    amber: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: string; tone?: 'red' | 'gold' | 'slate' | 'green' }> = ({ label, value, sub, tone = 'slate' }) => {
  const colors = {
    red: 'text-[#E4002B]',
    gold: 'text-amber-600',
    slate: 'text-slate-900',
    green: 'text-emerald-600',
  } as const;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${colors[tone]}`}>{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
};

export const Bar: React.FC<{ value: number; max?: number; tone?: 'red' | 'gold' | 'green' | 'slate' }> = ({ value, max = 100, tone = 'red' }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const colors = {
    red: 'bg-gradient-to-r from-[#E4002B] to-[#FF4D6D]',
    gold: 'bg-gradient-to-r from-amber-400 to-amber-600',
    green: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    slate: 'bg-gradient-to-r from-slate-400 to-slate-600',
  };
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${colors[tone]} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
};

export const AiBadge: React.FC<{ children?: React.ReactNode }> = ({ children = 'AI 生成' }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r from-[#E4002B] to-[#F5B400] shadow-sm">
    <Sparkles size={10} /> {children}
  </span>
);

export const EmployeeChip: React.FC<{ e: Employee; onClick?: () => void; active?: boolean }> = ({ e, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-left ${
      active ? 'border-[#E4002B] bg-red-50 ring-2 ring-red-100' : 'border-slate-200 bg-white hover:border-slate-300'
    }`}
  >
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">{e.avatar}</div>
    <div className="min-w-0">
      <div className="text-sm font-semibold text-slate-900 truncate">{e.name}</div>
      <div className="text-[11px] text-slate-500 truncate">{e.title}</div>
    </div>
  </button>
);

export const RadarChart: React.FC<{ data: { name: string; score: number }[]; size?: number; color?: string }> = ({ data, size = 220, color = '#E4002B' }) => {
  const n = data.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, v: number) => [cx + Math.cos(angle(i)) * r * (v / 100), cy + Math.sin(angle(i)) * r * (v / 100)] as const;
  const polygon = data.map((d, i) => point(i, d.score).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <svg width={size} height={size} className="overflow-visible">
      {rings.map((rg, k) => (
        <polygon
          key={k}
          points={data.map((_, i) => [cx + Math.cos(angle(i)) * r * rg, cy + Math.sin(angle(i)) * r * rg].join(',')).join(' ')}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" />;
      })}
      <polygon points={polygon} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={2} />
      {data.map((d, i) => {
        const [x, y] = [cx + Math.cos(angle(i)) * (r + 14), cy + Math.sin(angle(i)) * (r + 14)];
        return (
          <text key={i} x={x} y={y} fontSize={10} textAnchor="middle" dominantBaseline="middle" fill="#475569">
            {d.name}
          </text>
        );
      })}
    </svg>
  );
};
