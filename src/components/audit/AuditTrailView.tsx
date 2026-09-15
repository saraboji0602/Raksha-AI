import React, { useState } from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Cpu, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Scale, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Award
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AuditTrailView: React.FC = () => {
  const { 
    auditLogs, 
    adminReviewSteps, 
    toggleAdminReviewStep, 
    dataConflicts,
    setSelectedConflictId,
    setIsConflictModalOpen,
    currentUser,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'LEDGER' | 'STATUTORY_CHECKLIST'>('LEDGER');
  const [searchTerm, setSearchTerm] = useState('');
  const [actorFilter, setActorFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(auditLogs[0]?.id || null);

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetEntityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.officialReason && log.officialReason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesActor = actorFilter === 'ALL' || log.actor.role === actorFilter;
    const matchesAction = actionFilter === 'ALL' || log.actionType === actionFilter;

    return matchesSearch && matchesActor && matchesAction;
  });

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case 'HUMAN_DECISION_OVERRIDE':
      case 'DATA_CONFLICT_RESOLVED':
        return 'border-amber-500/50 bg-amber-950/40 text-amber-300';
      case 'FIELD_VERIFICATION_SUBMITTED':
      case 'SETTLEMENT_APPROVED':
      case 'RECOVERY_SANCTIONED':
        return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';
      case 'DATA_CONFLICT_DETECTED':
        return 'border-rose-500/50 bg-rose-950/40 text-rose-300';
      default:
        return 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex-shrink-0">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wide">
                GOVERNANCE & ACCOUNTABILITY
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 uppercase">
                IMMUTABLE AUDIT LEDGER
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Explainable Decision Audit Trail & Statutory Review
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Complete provenance chain of automated AI models, field surveyor ground truth, and human authority sign-offs under Disaster Management Act 2005.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-end md:self-auto">
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LEDGER'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Log Ledger ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('STATUTORY_CHECKLIST')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'STATUTORY_CHECKLIST'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Statutory Review Checklist</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
            Total Logged Events
          </span>
          <span className="text-2xl font-black text-white font-mono mt-1 block">
            {auditLogs.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">100% Cryptographic EXIF Integrity</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
            Human Overrides
          </span>
          <span className="text-2xl font-black text-amber-300 font-mono mt-1 block">
            {auditLogs.filter(l => l.actionType === 'HUMAN_DECISION_OVERRIDE').length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Collector Statutory Directives</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
            Field Truth Upgrades
          </span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
            {auditLogs.filter(l => l.actionType === 'FIELD_VERIFICATION_SUBMITTED').length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Confidence Calibrated to 94%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">
            Statutory Clearances
          </span>
          <span className="text-2xl font-black text-cyan-300 font-mono mt-1 block">
            {adminReviewSteps.filter(s => s.status === 'COMPLETED').length} / {adminReviewSteps.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Mandatory Review Progress</span>
        </div>
      </div>

      {activeTab === 'LEDGER' ? (
        /* Ledger View */
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail by decision, actor, settlement..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Actor:</span>
              </div>
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold outline-none cursor-pointer"
              >
                <option value="ALL">All Actors</option>
                <option value="DDMA_OFFICER">District Collector / DDMA</option>
                <option value="FIELD_OFFICER">Field Officer</option>
                <option value="SYSTEM_ADMIN">AI / System Engine</option>
                <option value="CITIZEN">Citizen Claimant</option>
              </select>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold outline-none cursor-pointer"
              >
                <option value="ALL">All Action Types</option>
                <option value="HUMAN_DECISION_OVERRIDE">Human Override</option>
                <option value="FIELD_VERIFICATION_SUBMITTED">Field Ground Truth</option>
                <option value="DATA_CONFLICT_DETECTED">Conflict Flagged</option>
                <option value="RECOVERY_SANCTIONED">Recovery Milestone</option>
                <option value="AI_RECOMMENDATION">AI Model</option>
              </select>
            </div>
          </div>

          {/* Audit Entries List */}
          <div className="space-y-3">
            {filteredLogs.map(log => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl overflow-hidden transition-all"
                >
                  {/* Summary Row */}
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-4.5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 select-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 mt-0.5 flex-shrink-0">
                        {log.actor.role === 'FIELD_OFFICER' ? (
                          <UserCheck className="w-5 h-5 text-emerald-400" />
                        ) : log.actor.role === 'DDMA_OFFICER' ? (
                          <Award className="w-5 h-5 text-amber-400" />
                        ) : (
                          <Cpu className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase ${getActionBadgeColor(log.actionType)}`}>
                            {log.actionType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {log.targetEntityType}: <strong className="text-slate-200">{log.targetEntityName}</strong>
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white">
                          {log.title}
                        </h3>

                        <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span>
                            Actor: <strong className="text-slate-200">{log.actor.name}</strong> ({log.actor.designation})
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" /> {log.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      {log.confidenceAfter && (
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-slate-400 uppercase block">Confidence</span>
                          <span className="text-xs font-mono font-black text-emerald-400">
                            {log.confidenceBefore ? `${log.confidenceBefore}% → ` : ''}{log.confidenceAfter}%
                          </span>
                        </div>
                      )}

                      <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-950/80 border-t border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-150">
                      
                      {/* State Transition Matrix */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">
                            Previous System State / Model Reading
                          </span>
                          <p className="text-xs font-mono text-slate-300">
                            {log.previousValue}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block mb-1">
                            New Logged Truth / Sanctioned State
                          </span>
                          <p className="text-xs font-mono font-bold text-white">
                            {log.newValue}
                          </p>
                        </div>
                      </div>

                      {/* Official Justification & Statutory Grounding */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="font-bold text-slate-300 block mb-1">
                            Official Reason & Rationale:
                          </span>
                          <p className="text-slate-300 leading-relaxed">
                            {log.officialReason}
                          </p>
                        </div>

                        {log.statutoryBasis && (
                          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center gap-2 text-indigo-300">
                            <Scale className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                            <span>
                              <strong>Statutory Authority Basis:</strong> {log.statutoryBasis}
                            </span>
                          </div>
                        )}

                        {log.evidenceReference && (
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Evidence Archive Reference: <strong className="text-cyan-400 font-mono">{log.evidenceReference}</strong></span>
                            <span className="text-emerald-400 font-mono">✓ Signed & Verified</span>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-bold text-white">No audit ledger entries match your filter criteria.</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search terms or actor filters.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Statutory Administrative Relocation Review Checklist */
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  STATUTORY ADMINISTRATIVE COMPLIANCE MATRIX
                </span>
                <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                  SECTION 30 DMA 2005
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Mandatory Relocation & Rehabilitation (R&R) Clearances Checklist
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Every settlement relocation decision requires verified statutory sign-offs across revenue, geotechnical, forest/CRZ, and grama sabha bodies before gazette execution.
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3 pt-2">
              {adminReviewSteps.map((step, idx) => {
                const isCompleted = step.status === 'COMPLETED';
                return (
                  <div
                    key={step.id}
                    className={`p-4.5 rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'bg-slate-950 border-emerald-500/40' 
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => toggleAdminReviewStep(step.id)}
                          className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold text-cyan-400">
                              STEP 0{idx + 1}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                              isCompleted 
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                                : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}>
                              {step.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white">
                            {step.stageName}
                          </h4>

                          <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                            {step.officerName && (
                              <p>
                                Signatory Authority: <strong className="text-slate-200">{step.officerName}</strong> ({step.officerDesignation})
                              </p>
                            )}
                            {step.timestamp && (
                              <p className="font-mono text-[11px] text-slate-500">
                                Executed: {step.timestamp}
                              </p>
                            )}
                            {step.notes && (
                              <p className="text-slate-300 mt-1 italic">
                                "{step.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="self-end sm:self-auto">
                        <button
                          onClick={() => toggleAdminReviewStep(step.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                          }`}
                        >
                          {isCompleted ? 'Revoke Sign-off' : 'Grant Statutory Sign-off'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
