import React, { useState } from 'react';
import { useApp } from '../store/useAppStore';
import { 
  Hammer, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Zap, 
  Droplets, 
  Fish, 
  Truck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Filter, 
  Search, 
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  Sliders,
  ChevronRight,
  ShieldAlert,
  HeartPulse
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { DamageCategory, RecoveryStatus, RecoveryItem, SectorDamageSummary, Settlement } from '../types';

export const RecoveryCenterPage: React.FC = () => {
  const { 
    recoveryItems, 
    sectorDamageSummaries, 
    updateRecoveryStatus, 
    submitCitizenDamageClaim,
    settlements,
    currentUser,
    t 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // New Claim Form State
  const [claimTitle, setClaimTitle] = useState('');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimCategory, setClaimCategory] = useState<DamageCategory>('HOUSING');
  const [claimLossLakhs, setClaimLossLakhs] = useState('25');
  const [claimPersons, setClaimPersons] = useState('18');
  const [claimSettlementId, setClaimSettlementId] = useState(settlements[0]?.id || 'kadalpuram');
  const [claimReporterName, setClaimReporterName] = useState('Panchayat Secretary');
  const [claimReporterPhone, setClaimReporterPhone] = useState('9444109822');

  const totalDamageCr = sectorDamageSummaries.reduce((sum: number, s: SectorDamageSummary) => sum + s.estimatedTotalCostCr, 0);
  const totalAssets = sectorDamageSummaries.reduce((sum: number, s: SectorDamageSummary) => sum + s.totalAssetsDamaged, 0);
  const totalSpentCr = recoveryItems.reduce((sum: number, item: RecoveryItem) => sum + item.spentCostCr, 0);

  // Filtered recovery items
  const filteredItems = recoveryItems.filter((item: RecoveryItem) => {
    const matchesCategory = categoryFilter === 'ALL' || item.damageCategory === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch = item.infrastructureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.damageDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.settlementName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getSectorIcon = (category: DamageCategory) => {
    switch (category) {
      case 'HOUSING': return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'ROADS_BRIDGES': return <Truck className="w-5 h-5 text-amber-400" />;
      case 'WATER_POWER_UTILITIES': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'HEALTHCARE_SCHOOLS': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'SHELTERS': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'COASTAL_PROTECTION': return <Droplets className="w-5 h-5 text-cyan-400" />;
      default: return <Hammer className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTitle.trim()) return;

    submitCitizenDamageClaim({
      category: claimCategory,
      title: claimTitle,
      description: claimDesc,
      estimatedLossLakhs: Number(claimLossLakhs) || 20,
      settlementId: claimSettlementId,
      affectedPersons: Number(claimPersons) || 10,
      reporterName: claimReporterName,
      reporterPhone: claimReporterPhone
    });

    setClaimTitle('');
    setClaimDesc('');
    setIsClaimModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <Hammer className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                PHASE 3 RECONSTRUCTION COMMAND
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                BUILD BACK BETTER
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Post-Disaster Recovery & Reconstruction Center
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Deterministic recovery prioritization, cross-sector damage assessment tracking, and rapid reconstruction milestone ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Record Damage Claim / Intake</span>
          </button>
        </div>
      </div>

      {/* Safety & Intelligence Integrity Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <p className="text-slate-300">
            <strong className="text-white">Architectural Safety Invariant:</strong> Recovery milestone progress is tracked on a dedicated reconstruction ledger and does not corrupt baseline hazard risk intelligence models.
          </p>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800 uppercase font-bold flex-shrink-0">
          INVARIANT ACTIVE
        </span>
      </div>

      {/* District Damage Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
            Total Estimated District Damage
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-white font-mono">₹{totalDamageCr.toFixed(1)}</span>
            <span className="text-sm font-bold text-rose-400">Crores</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">{totalAssets} Damaged Infrastructure Assets</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            Reconstruction Expenditure Spent
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-emerald-400 font-mono">₹{totalSpentCr.toFixed(2)}</span>
            <span className="text-sm font-bold text-emerald-400">Crores</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Sanctioned SDRF Project Disbursals</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Active Rebuild Projects
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-cyan-300 font-mono">{recoveryItems.length}</span>
            <span className="text-sm font-bold text-cyan-400">Sanctioned Works</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Ranked by Deterministic Priority Score</span>
        </div>
      </div>

      {/* Sectoral Breakdown Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {sectorDamageSummaries.map((sector: SectorDamageSummary) => (
          <div
            key={sector.category}
            onClick={() => setCategoryFilter(categoryFilter === sector.category ? 'ALL' : sector.category)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              categoryFilter === sector.category
                ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                {getSectorIcon(sector.category)}
              </div>
              <span className="text-xs font-mono font-bold text-white">
                ₹{sector.estimatedTotalCostCr} Cr
              </span>
            </div>

            <h4 className="text-xs font-bold text-white uppercase tracking-wide">
              {sector.label}
            </h4>

            <div className="mt-2 space-y-1 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Damaged:</span>
                <span className="font-mono text-rose-400">{sector.totalAssetsDamaged} assets</span>
              </div>
              <div className="flex justify-between">
                <span>Progress:</span>
                <span className="font-mono text-emerald-400">{sector.averageProgressPct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deterministic Recovery Prioritization Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Deterministic Recovery Priority Matrix
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                ALGORITHMIC RANKING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Score = (Severity × 0.30) + (Population Impact × 0.25) + (Vulnerable Demographic × 0.25) + (Infrastructure Importance × 0.20)
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search works..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSESSED">Assessed</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="VERIFIED">Verified</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Project Cards List */}
        <div className="space-y-4">
          {filteredItems.map((item: RecoveryItem, idx: number) => {
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
              >
                {/* Top Row: Rank & Details */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    
                    {/* Priority Rank Badge */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex-shrink-0">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">RANK</span>
                      <span className="text-base font-black text-white font-mono">#{idx + 1}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {item.damageCategory.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Location: <strong className="text-slate-200">{item.settlementName}</strong>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          Score: {item.priorityScore} / 100
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">
                        {item.infrastructureName}
                      </h4>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {item.damageDescription}
                      </p>
                    </div>
                  </div>

                  {/* Budget & Target */}
                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Sanctioned Budget</span>
                      <span className="text-sm font-black text-emerald-400 font-mono block">
                        ₹{item.estimatedCostCr} Cr
                      </span>
                      <span className="text-[10px] text-slate-400">Spent: ₹{item.spentCostCr} Cr</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Affected Citizens</span>
                      <span className="text-sm font-bold text-white font-mono block">
                        {item.populationImpact.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-amber-400">({item.vulnerablePopulationImpact} Vulnerable)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Milestone Progress Slider & Status Controls */}
                <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Progress Bar & Slider */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Reconstruction Progress:</span>
                      <span className="font-bold text-emerald-400">{item.progressPercentage}% Complete</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={item.progressPercentage}
                      onChange={(e) => updateRecoveryStatus(item.id, item.status, Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-slate-400">Milestone:</span>
                    <select
                      value={item.status}
                      onChange={(e) => updateRecoveryStatus(item.id, e.target.value as RecoveryStatus, item.progressPercentage)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold outline-none cursor-pointer focus:border-emerald-500"
                    >
                      <option value="REPORTED">Reported</option>
                      <option value="ASSESSED">Assessed</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Citizen Damage Claim Intake Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Record Post-Disaster Damage Assessment Claim
                  </h3>
                  <p className="text-xs text-slate-300">
                    Direct intake into District Recovery Prioritization Ledger
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateClaim} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Damage Title / Infrastructure Asset
                </label>
                <input
                  type="text"
                  required
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  placeholder="e.g. Fishing Wharf Cold Storage Structural Inundation"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Sector Category
                  </label>
                  <select
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value as DamageCategory)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="HOUSING">Housing</option>
                    <option value="ROADS_BRIDGES">Roads & Bridges</option>
                    <option value="WATER_POWER_UTILITIES">Water & Power Utilities</option>
                    <option value="HEALTHCARE_SCHOOLS">Healthcare & Schools</option>
                    <option value="SHELTERS">Shelters</option>
                    <option value="COASTAL_PROTECTION">Coastal Protection</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Target Habitation
                  </label>
                  <select
                    value={claimSettlementId}
                    onChange={(e) => setClaimSettlementId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none cursor-pointer"
                  >
                    {settlements.map((s: Settlement) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Estimated Loss (₹ Lakhs)
                  </label>
                  <input
                    type="number"
                    required
                    value={claimLossLakhs}
                    onChange={(e) => setClaimLossLakhs(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Affected Individuals
                  </label>
                  <input
                    type="number"
                    required
                    value={claimPersons}
                    onChange={(e) => setClaimPersons(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Damage Description & Ground Symptoms
                </label>
                <textarea
                  rows={3}
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  placeholder="Describe foundation undermining, collapsed walls, or damaged transformers..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  Submit & Prioritize in Ledger
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
