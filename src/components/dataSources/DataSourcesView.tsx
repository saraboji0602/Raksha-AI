import React from 'react';
import { Database, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const sources = [
    {
      name: 'Satellite SAR & Optical Coastline InSAR (Synthetic)',
      category: 'REMOTE SENSING',
      updated: '14 mins ago',
      resolution: '5-meter spatial grid',
      coverage: '100% Coastal Corridor',
      confidence: 96,
      status: 'OPTIMAL'
    },
    {
      name: 'Hydrological River Runoff DEM & Sluice Telemetry',
      category: 'HYDROLOGY',
      updated: '2 hours ago',
      resolution: '10-meter basin DEM',
      coverage: 'Delta Basin Network',
      confidence: 92,
      status: 'OPTIMAL'
    },
    {
      name: 'Census 2026 Micro-Habitation Demographics (Synthetic)',
      category: 'SOCIO-ECONOMIC',
      updated: '1 day ago',
      resolution: 'Household / Hamlet Level',
      coverage: '128 Habitations',
      confidence: 94,
      status: 'OPTIMAL'
    },
    {
      name: 'State Land Bank & Gramanatham Registry',
      category: 'LAND USE',
      updated: '3 days ago',
      resolution: 'Cadastral Survey Parcels',
      coverage: '14 Candidate Safe Sites',
      confidence: 90,
      status: 'OPTIMAL'
    },
    {
      name: 'Geological Slope Shear & InSAR Piezometer Telemetry',
      category: 'GEOLOGY',
      updated: '4 hours ago',
      resolution: '1:5000 Slope Susceptibility',
      coverage: 'Nilgiri Hill Corridor',
      confidence: 95,
      status: 'OPTIMAL'
    },
    {
      name: 'Ground Truth Mobile Field Officer Verifications',
      category: 'HUMAN-IN-THE-LOOP',
      updated: 'Active Ingestion',
      resolution: 'Point GPS + Geotagged Media',
      coverage: 'Priority Habitations',
      confidence: 94,
      status: 'VERIFIED'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              GEOSPATIAL DATA INFRASTRUCTURE
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Connected Data Feeds & Quality Assurance
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>All 6 Feeds Synchronized</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.2 rounded border border-cyan-800">
                  {src.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{src.status}</span>
                </span>
              </div>

              <h4 className="text-sm font-bold text-white tracking-tight">{src.name}</h4>

              <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">Resolution</span>
                  <span className="font-bold text-slate-300">{src.resolution}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Coverage</span>
                  <span className="font-bold text-slate-300">{src.coverage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Last Ingestion</span>
                  <span className="font-mono font-bold text-cyan-300">{src.updated}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Data Confidence</span>
                  <span className="font-mono font-bold text-emerald-400">{src.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              Source: Synthetic Government-Grade GeoTIFF & InSAR Sensor Grid
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
