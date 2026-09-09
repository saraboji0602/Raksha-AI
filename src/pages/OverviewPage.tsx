import React from 'react';
import { useApp } from '../store/useAppStore';
import { OverviewKPIs } from '../components/dashboard/OverviewKPIs';
import { GISMapView } from '../components/map/GISMapView';
import { PrioritySettlementsList } from '../components/dashboard/PrioritySettlementsList';
import { RiskTrendChart } from '../components/dashboard/RiskTrendChart';
import { InterventionDistribution } from '../components/dashboard/InterventionDistribution';
import { ActionCenterCard } from '../components/dashboard/ActionCenterCard';
import { Sparkles, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { setCurrentPage, setSelectedSettlementId, addToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Welcome & Flagship Quick Action Hero Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
              DECISION COMMAND CENTER
            </span>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              TAMIL NADU COASTAL & DELTA CORRIDOR
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            National Settlement Risk & Intelligent Relocation Overview
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Monitor multi-hazard exposures, evaluate Protect vs Adapt vs Relocate interventions, and discover validated inland safe havens.
          </p>
        </div>

        {/* Flagship Fast Jump */}
        <button
          onClick={() => {
            setSelectedSettlementId('kadalpuram');
            setCurrentPage('settlement-detail');
            addToast({
              type: 'info',
              title: 'Flagship Digital Twin Loaded: Kadalpuram',
              description: 'Examine 91/100 risk decomposition and micro-zone analysis.'
            });
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-end md:self-center flex-shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Launch Kadalpuram Digital Twin</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Executive KPI Metric Cards */}
      <OverviewKPIs />

      {/* GIS Command Center Map View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Real-Time GIS Red-Zone Detection & Safe Haven Relocation Vectors
            </h3>
          </div>
          <button
            onClick={() => setCurrentPage('risk')}
            className="text-xs text-cyan-400 hover:underline font-bold"
          >
            Expand Full GIS Intelligence →
          </button>
        </div>

        <GISMapView height="520px" showRelocationVector={true} />
      </div>

      {/* Row 2: Today's Priority Action Queue & Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <PrioritySettlementsList />
        </div>
        <div className="lg:col-span-5">
          <ActionCenterCard />
        </div>
      </div>

      {/* Row 3: Trend & Strategy Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RiskTrendChart />
        <InterventionDistribution />
      </div>
    </div>
  );
};
