"use client";

import React, { useState, useEffect } from 'react';

export default function AvansCalculator() {
  const [salary, setSalary] = useState(6000000);
  const [totalDays, setTotalDays] = useState(22);
  const [workedDays, setWorkedDays] = useState(10);
  const [safety, setSafety] = useState(75);
  const [requested, setRequested] = useState(2000000);

  // Derived state
  const dailyWage = totalDays > 0 ? salary / totalDays : 0;
  const accrued = dailyWage * workedDays;
  const maxSafe = accrued * (safety / 100);

  const diff = requested - maxSafe;
  const pct = maxSafe > 0 ? (requested / maxSafe) * 100 : 0;

  let colorClass = '#10B981'; // Mint
  let label = 'Xavfsiz Hudud';
  let isDanger = false;
  let isWarning = false;

  if (pct > 100) {
    colorClass = '#EF4444';
    label = 'Xavfli (Cash Crunch)';
    isDanger = true;
  } else if (pct > 85) {
    colorClass = '#F59E0B';
    label = 'Ehtiyotkor Hudud';
    isWarning = true;
  }

  const fmt = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
  };

  const handleWorkedDays = (val: number) => {
    setWorkedDays(Math.min(val, totalDays));
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:py-24 flex flex-col items-center relative overflow-hidden" 
      style={{ 
        fontFamily: "'IBM Plex Sans', sans-serif",
        backgroundImage: `
          radial-gradient(at 0% 0%, hsla(38,100%,74%,0.1) 0px, transparent 50%),
          radial-gradient(at 100% 100%, hsla(160,100%,74%,0.08) 0px, transparent 50%)
        `,
        backgroundAttachment: 'fixed',
      }}>
      
      <header className="w-full max-w-xl mx-auto flex items-center justify-between mb-10 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#F59E0B] to-yellow-300 flex items-center justify-center shadow-lg shadow-[#F59E0B]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Avans Kalkulyatori</h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">Jon Branding Moliya Tizimi</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-xl mx-auto space-y-6 z-10">
        
        {/* Inputs */}
        <section className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_40px_rgba(0,0,0,0.05)] rounded-[2rem] p-6 sm:p-8 space-y-7">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-500" htmlFor="salary">
              Xodimning sof maoshi (UZS)
            </label>
            <div className="relative group">
              <input 
                id="salary" 
                type="number" 
                value={salary || ''} 
                onChange={e => setSalary(Number(e.target.value))} 
                step="100000" min="0" 
                className="w-full bg-white/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-xl font-bold outline-none transition-all focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/15" 
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">UZS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-500" htmlFor="totalDays">Jami ish kunlari</label>
              <input 
                id="totalDays" type="number" 
                value={totalDays || ''} onChange={e => setTotalDays(Number(e.target.value))} 
                min="1" max="31" 
                className="w-full bg-white/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-lg font-bold outline-none transition-all focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/15 text-center" 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-500" htmlFor="workedDays">Ishlangan kunlar</label>
              <input 
                id="workedDays" type="number" 
                value={workedDays || ''} onChange={e => handleWorkedDays(Number(e.target.value))} 
                min="0" max={totalDays}
                className="w-full bg-white/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-lg font-bold outline-none transition-all focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/15 text-center" 
              />
            </div>
          </div>

          <div className="space-y-4 pt-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-500" htmlFor="safety">Xavfsizlik chegarasi (Limit)</label>
              <span className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-bold text-sm border border-[#F59E0B]/20">
                {safety}%
              </span>
            </div>
            <div className="relative px-1">
              <input 
                id="safety" type="range" min="50" max="100" 
                value={safety} onChange={e => setSafety(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-white/10 outline-none cursor-pointer accent-[#F59E0B]" 
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
              <span>Konservativ (50%)</span>
              <span>Erkin (100%)</span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200/60 dark:border-white/10">
            <label className="block text-sm font-semibold text-slate-500" htmlFor="requested">Xodim so'rayotgan avans (UZS)</label>
            <div className="relative group">
              <input 
                id="requested" type="number" 
                value={requested || ''} onChange={e => setRequested(Number(e.target.value))}
                step="50000" min="0" 
                className="w-full bg-white/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-xl font-bold outline-none transition-all focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/15" 
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">UZS</span>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-[#10B981]/20 rounded-[2rem] p-6 shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Haqiqatda ishlangan
            </p>
            <p className="text-2xl font-bold tracking-tight">{fmt(accrued)}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">{fmt(dailyWage)} / kuniga</p>
          </div>

          <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-[#F59E0B]/30 rounded-[2rem] p-6 shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)]">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-2xl"></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Xavfsiz Limit
            </p>
            <p className="text-2xl font-bold text-[#F59E0B] tracking-tight">{fmt(maxSafe)}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Tavsiya etilgan maksimal</p>
          </div>
        </section>

        {/* Status */}
        {requested > 0 && maxSafe > 0 && (
          <div 
            className={`transition-all duration-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border rounded-[2rem] p-6 sm:p-8
              ${isDanger ? 'border-[#EF4444]/40 shadow-[0_0_50px_-10px_rgba(239,68,68,0.25)] scale-[1.01]' : 
                isWarning ? 'border-[#F59E0B]/40 shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)]' : 
                'border-slate-200/80 dark:border-white/10 shadow-sm'}
            `}
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avans Holati</p>
                <p className="text-xl font-bold mt-1" style={{ color: colorClass }}>{label}</p>
              </div>
              <p className="text-3xl font-black font-mono tracking-tighter" style={{ color: colorClass }}>
                {Math.round(pct)}%
              </p>
            </div>
            
            <div className="w-full h-3 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out" 
                style={{ 
                  width: `${Math.min(pct, 100)}%`, 
                  backgroundColor: colorClass 
                }}
              ></div>
            </div>
            
            <div className="mt-4 font-medium text-[15px]">
              {isDanger ? (
                <span className="text-[#EF4444]">Limitdan <strong>{fmt(diff)} UZS</strong> ortiq. Bu kassa xavfsizligini buzadi (Cash Crunch).</span>
              ) : isWarning ? (
                <span className="text-[#F59E0B]">Limitga juda yaqin. Xavfsiz zaxira: <strong>{fmt(Math.abs(diff))} UZS</strong>.</span>
              ) : (
                <span className="text-[#10B981]">Xavfsiz hududda. Yana <strong>{fmt(Math.abs(diff))} UZS</strong> zaxira bor.</span>
              )}
            </div>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 24px; height: 24px; border-radius: 50%;
          background: #F59E0B; border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2); cursor: pointer; transition: transform .15s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.1); }
      `}} />
    </div>
  );
}
