import React from 'react';
import { useApp } from '../store/useAppStore';
import { GISMapView } from '../components/map/GISMapView';
import { Layers, Sliders, Filter, Eye, EyeOff, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';

export const RiskIntelligencePage: React.FC = () => {
  const {
    hazardLayers,
    toggleHazardLayer,
    setLayerOpacity,
    filterHazard,
    setFilterHazard,
    filterRiskLevel,
    setFilterRiskLevel,
    filterDistrict,
    setFilterDistrict,
    resetFilters,
    settlements
  } = useApp();

  return (
    <div className="space-y-4">
      {/* Top Filter & Layer Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold pr-2 border-r border-slate-800">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>GIS Filters:</span>
          </div>

          {/* Hazard Type Filter */}
          <select
            value={filterHazard}
            onChange={(e) => setFilterHazard(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold outline-none"
          >
            <option value="ALL">All Hazard Types</option>
            <option value="coastal_erosion">Coastal Erosion</option>
            <option value="cyclone">Cyclonic Storm Surge</option>
            <option value="flood">Fluvial Flooding</option>
            <option value="landslide">Slope Landslide</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={filterRiskLevel}
            onChange={(e) => setFilterRiskLevel(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (85+)</option>
            <option value="VERY_HIGH">Very High (75-84)</option>
            <option value="HIGH">High (60-74)</option>
            <option value="MODERATE">Moderate (40-59)</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing <strong className="text-white">{settlements.length}</strong> monitored habitations
        </div>
      </div>

      {/* Main Grid: Map & Layer Toggles Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Map */}
        <div className="lg:col-span-8 xl:col-span-9">
          <GISMapView height="640px" showRelocationVector={true} />
        </div>

        {/* Right: GIS Hazard Layer Deck */}
        <div className="lg:col-span-4 xl:col-span-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5 text-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white uppercase tracking-wider">GIS Layer Deck</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">8 Layers</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[550px] pr-1">
            {hazardLayers.map((layer) => (
              <div
                key={layer.id}
                className={`p-3 rounded-xl border transition-all ${
                  layer.enabled
                    ? 'bg-slate-950 border-slate-700'
                    : 'bg-slate-950/40 border-slate-850 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="font-bold text-white leading-tight">{layer.name}</span>
                  </div>

                  <button
                    onClick={() => toggleHazardLayer(layer.id)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title={layer.enabled ? 'Hide layer' : 'Show layer'}
                  >
                    {layer.enabled ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 mt-1">{layer.description}</div>

                {layer.enabled && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Opacity:</span>
                      <span>{Math.round(layer.defaultOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={layer.defaultOpacity}
                      onChange={(e) => setLayerOpacity(layer.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
