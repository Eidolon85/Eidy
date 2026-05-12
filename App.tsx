import React, { useState } from 'react';
import { Home, Gauge, User, Briefcase, Sparkles, Layers, Menu, X } from 'lucide-react';
import { NAV } from './constants';
import type { ViewKey } from './types';
import { Overview } from './components/Overview';
import { Dashboard } from './components/Dashboard';
import { EmployeeView } from './components/EmployeeView';
import { ManagerView } from './components/ManagerView';
import { Recommendation } from './components/Recommendation';
import { Methodology } from './components/Methodology';

const ICONS: Record<string, React.ReactNode> = {
  home: <Home size={16} />,
  gauge: <Gauge size={16} />,
  user: <User size={16} />,
  briefcase: <Briefcase size={16} />,
  sparkles: <Sparkles size={16} />,
  layers: <Layers size={16} />,
};

export default function App() {
  const [view, setView] = useState<ViewKey>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (k: ViewKey) => {
    setView(k);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E4002B] to-[#8B0000] text-white font-bold flex items-center justify-center shadow-sm text-sm">
                C<span className="text-[#F5B400]">·</span>Y
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm md:text-base">凯捷 × 百胜中国</div>
              <div className="text-[10px] md:text-[11px] text-slate-500 tracking-wider">TALENT INTELLIGENCE SUITE · RFP 2026</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="ml-auto hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => navigate(n.key as ViewKey)}
                className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${
                  view === n.key
                    ? 'bg-gradient-to-r from-[#E4002B] to-[#8B0000] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {ICONS[n.icon]}
                <span>{n.label}</span>
              </button>
            ))}
          </nav>

          <button
            className="ml-auto md:hidden p-2 rounded-lg border border-slate-200"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-2 flex flex-col">
              {NAV.map((n) => (
                <button
                  key={n.key}
                  onClick={() => navigate(n.key as ViewKey)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    view === n.key ? 'bg-red-50 text-[#E4002B]' : 'text-slate-700'
                  }`}
                >
                  {ICONS[n.icon]} {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        {view === 'overview' && <Overview onJump={(k: any) => navigate(k)} />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'employee' && <EmployeeView />}
        {view === 'manager' && <ManagerView />}
        {view === 'recommendation' && <Recommendation />}
        {view === 'methodology' && <Methodology />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between text-xs text-slate-500">
          <div>© 2026 Capgemini Consulting · 本演示用于百胜中国 RFP 应答 · 全部数据为模拟样本</div>
          <div className="hidden md:block">Powered by Gemini · React 19 · TailwindCSS</div>
        </div>
      </footer>
    </div>
  );
}
