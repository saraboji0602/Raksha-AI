import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { Shield, MapPin, Sparkles, CheckCircle2, Lock, Mail, UserCheck, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginScreen: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { setCurrentUser, addToast, startDemoTour } = useApp();
  const [email, setEmail] = useState('collector.nagapattinam@tn.gov.in');
  const [role, setRole] = useState<UserRole>('DDMA_OFFICER');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
    addToast({
      type: 'success',
      title: 'Authenticated as District Collector & Chairman DDMA',
      description: 'Connected to Tamil Nadu Coastal Corridor Geospatial Command Center.'
    });
  };

  const handleDemoMode = () => {
    onLoginSuccess();
    startDemoTour();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background GIS Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand & Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-xl shadow-cyan-500/20 mb-1">
            <Shield className="w-8 h-8 stroke-[2.5]" />
            <MapPin className="w-4 h-4 absolute top-2 right-2 text-slate-950 fill-current" />
          </div>

          <h1 className="text-2xl font-black font-mono tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            RAKSHA-AI
          </h1>
          <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
            AI-Powered Settlement Resilience & Relocation Intelligence Portal
          </p>
          <span className="text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-400 px-2.5 py-0.5 rounded border border-cyan-700/60 uppercase tracking-widest">
            SYNTHETIC DEMO ENVIRONMENT
          </span>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
          <div className="text-center pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-tight">Secure Disaster Intelligence Portal</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Evidence-based planning for safer habitations</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Official Government Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition-all font-mono"
                  placeholder="name@gov.in"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="password"
                  value="••••••••••••"
                  readOnly
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Assigned Statutory Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all font-semibold"
              >
                <option value="DDMA_OFFICER">District Collector & Chairman DDMA</option>
                <option value="SDMA_DIRECTOR">State Disaster Management Director (SDMA)</option>
                <option value="FIELD_OFFICER">Field Verification Officer</option>
                <option value="PLANNING_OFFICER">Town & Relocation Planning Officer</option>
                <option value="SYSTEM_ADMIN">GIS System Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition-colors shadow-md mt-1"
            >
              Sign In to Official Command Portal
            </button>
          </form>

          {/* Instant 1-Click Demo Mode Button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleDemoMode}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Instant Hackathon Demo Mode (No Login Required)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All 6 GIS Feeds Operational</span>
          </span>
          <span>v2.6.4-prod-prototype</span>
        </div>
      </div>
    </div>
  );
};
