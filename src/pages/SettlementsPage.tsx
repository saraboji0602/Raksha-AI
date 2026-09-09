import React, { useState } from 'react';
import { useApp } from '../store/useAppStore';
import { Badge } from '../components/common/Badge';
import { ReportGenerator } from '../services/reportGenerator';
import { 
  Building2, 
  Search, 
  Download, 
  ArrowUpDown, 
  ArrowRight, 
  Filter, 
  CheckSquare, 
  Square,
  Sparkles
} from 'lucide-react';

export const SettlementsPage: React.FC = () => {
  const { 
    settlements, 
    setSelectedSettlementId, 
    setCurrentPage, 
    filterHazard, 
    setFilterHazard,
    filterRiskLevel,
    setFilterRiskLevel,
    addToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'overallRisk' | 'population' | 'priorityScore' | 'dataConfidence'>('overallRisk');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter & Search
  const filtered = settlements
    .filter(s => {
      if (search.trim() !== '' && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.district.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterHazard !== 'ALL' && s.dominantHazard !== filterHazard) return false;
      if (filterRiskLevel !== 'ALL') {
        const rLevel = s.overallRisk >= 85 ? 'CRITICAL' : s.overallRisk >= 75 ? 'VERY_HIGH' : s.overallRisk >= 60 ? 'HIGH' : 'MODERATE';
        if (rLevel !== filterRiskLevel) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(s => s.id));
    }
  };

  const handleExportCSV = () => {
    const subset = selectedIds.length > 0 ? settlements.filter(s => selectedIds.includes(s.id)) : settlements;
    const csvContent = ReportGenerator.exportSettlementsToCSV(subset);
    ReportGenerator.downloadFile(csvContent, 'RAKSHA_AI_Vulnerable_Habitations.csv');
    addToast({
      type: 'success',
      title: 'CSV Export Downloaded',
      description: `Exported ${subset.length} habitations records.`
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              HABITATION RISK REGISTRY
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Vulnerable Habitations Diagnostic Database
            </h2>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors self-end sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export {selectedIds.length > 0 ? `(${selectedIds.length}) Selected` : 'All'} CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by settlement name or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterHazard}
            onChange={(e) => setFilterHazard(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold outline-none"
          >
            <option value="ALL">All Hazard Types</option>
            <option value="coastal_erosion">Coastal Erosion</option>
            <option value="cyclone">Cyclone</option>
            <option value="flood">Flood</option>
            <option value="landslide">Landslide</option>
          </select>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing <strong>{filtered.length}</strong> of {settlements.length} Habitations
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-3.5 w-10">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3.5">Habitation Name</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5 cursor-pointer" onClick={() => { setSortField('population'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>Population</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3.5">Dominant Hazard</th>
                <th className="p-3.5 cursor-pointer" onClick={() => { setSortField('overallRisk'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3.5">Priority Queue</th>
                <th className="p-3.5">AI Recommendation</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map((s) => {
                const isSelected = selectedIds.includes(s.id);
                return (
                  <tr
                    key={s.id}
                    onClick={() => {
                      setSelectedSettlementId(s.id);
                      setCurrentPage('settlement-detail');
                    }}
                    className={`hover:bg-slate-850/80 cursor-pointer transition-colors group ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5" onClick={(e) => { e.stopPropagation(); handleToggleSelect(s.id); }}>
                      <button className="text-slate-400 hover:text-white">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                        <span>{s.name}</span>
                        {s.id === 'kadalpuram' && (
                          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                            FLAGSHIP
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {s.id}</div>
                    </td>

                    <td className="p-3.5 text-slate-400">{s.district}</td>

                    <td className="p-3.5 font-mono text-slate-200">
                      {s.population.toLocaleString()} ({s.households} HH)
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-300 capitalize">
                        {s.dominantHazard.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-red-400 text-sm">{s.overallRisk}</span>
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${s.overallRisk}%` }} />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="priority" level={s.priority} size="sm" />
                    </td>

                    <td className="p-3.5">
                      <Badge variant="intervention" level={s.aiRecommendation} size="sm" />
                    </td>

                    <td className="p-3.5 font-mono text-emerald-400 font-bold">
                      {s.dataConfidence}% {s.fieldVerified ? '✓' : ''}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSettlementId(s.id);
                          setCurrentPage('settlement-detail');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-400 transition-all inline-flex items-center justify-center"
                        title="Open Digital Twin"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
