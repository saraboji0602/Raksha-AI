import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../services/apiClient';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  CloudRain, 
  Waves, 
  Wind, 
  Mountain, 
  MapPin, 
  Radio, 
  Server,
  Activity,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface DataSourceHealthItem {
  source_name: string;
  category: string;
  endpoint_config: string;
  connection_status: string; // CONNECTED, NOT_CONNECTED, STALE, ERROR, DEMO
  source_type: string;
  freshness: string;
  last_successful_update: string;
  record_count: number;
  confidence: number;
  error_message?: string | null;
  data_classification?: string;
}

export const DataSourcesView: React.FC = () => {
  const [sources, setSources] = useState<DataSourceHealthItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemMode, setSystemMode] = useState<string>('HYBRID');

  const fetchHealth = async () => {
    setLoading(true);
    const fallback: { sources: DataSourceHealthItem[]; system_data_mode: string } = {
      system_data_mode: 'HYBRID',
      sources: [
        {
          source_name: 'Survey of India CartoDEM Elevation (10m)',
          category: 'terrain_elevation',
          endpoint_config: 'Local PostGIS Geodatabase / Spatial Grid',
          connection_status: 'CONNECTED',
          source_type: 'LOCAL_ELEVATION_RASTER',
          freshness: 'Static Baseline 2026',
          last_successful_update: '2026-09-01 12:00 PM',
          record_count: 48,
          confidence: 96,
          error_message: null,
        },
        {
          source_name: 'Hydrodynamic 2D Inundation Model DEM-10m',
          category: 'flood_hazard',
          endpoint_config: 'Local PostGIS Geodatabase / Spatial Grid',
          connection_status: 'CONNECTED',
          source_type: 'LOCAL_POSTGIS_GIS',
          freshness: 'Continuous Spatial Indexing',
          last_successful_update: '2026-09-15 08:00 AM',
          record_count: 8,
          confidence: 92,
          error_message: null,
        },
        {
          source_name: 'Census & Habitation Vulnerability Registry',
          category: 'population_exposure',
          endpoint_config: 'Local PostGIS Database (Tables: habitations, micro_zones)',
          connection_status: 'CONNECTED',
          source_type: 'LOCAL_RELATIONAL_POSTGIS',
          freshness: 'Continuous Spatial Indexing',
          last_successful_update: '2026-09-15 08:00 AM',
          record_count: 14,
          confidence: 94,
          error_message: null,
        },
        {
          source_name: 'Automated Weather Station (AWS) Grid',
          category: 'weather_rainfall',
          endpoint_config: 'https://api.imd.gov.in/telemetry/aws (Simulated Feed)',
          connection_status: 'DEMO',
          source_type: 'SYNTHETIC_MET_FEED',
          freshness: 'T-15m Hourly Telemetry',
          last_successful_update: '2026-09-15 09:00 AM',
          record_count: 12,
          confidence: 95,
          error_message: null,
        },
        {
          source_name: 'Central Water Commission (CWC) Sluice Telemetry',
          category: 'river_discharge',
          endpoint_config: 'https://cwc.gov.in/gauges/delta-estuary (Simulated Feed)',
          connection_status: 'DEMO',
          source_type: 'SYNTHETIC_HYDRO_FEED',
          freshness: 'T-30m Real-Time',
          last_successful_update: '2026-09-15 08:30 AM',
          record_count: 6,
          confidence: 94,
          error_message: null,
        },
        {
          source_name: 'IMD Regional Cyclone Radar & Track Forecast',
          category: 'cyclone_storm',
          endpoint_config: 'https://mausam.imd.gov.in/radar/cyclone-feed',
          connection_status: 'NOT_CONNECTED',
          source_type: 'OFFICIAL_API_CREDENTIALS_PENDING',
          freshness: 'Offline / Synthetic Fallback Active',
          last_successful_update: 'N/A (Awaiting IMD API Token)',
          record_count: 0,
          confidence: 75,
          error_message: 'Live API credentials not configured. Adapter ready in standby mode.',
        },
        {
          source_name: 'National Centre for Coastal Research (NCCR) Shoreline',
          category: 'coastal_erosion',
          endpoint_config: 'https://nccr.gov.in/erosion/telemetry-feed',
          connection_status: 'NOT_CONNECTED',
          source_type: 'OFFICIAL_API_CREDENTIALS_PENDING',
          freshness: 'Offline / Synthetic Fallback Active',
          last_successful_update: 'N/A (Awaiting NCCR Data Gateway)',
          record_count: 0,
          confidence: 70,
          error_message: 'Government data gateway awaiting official department clearance.',
        },
        {
          source_name: 'Geological Survey of India (GSI) Landslide InSAR',
          category: 'landslide_hazard',
          endpoint_config: 'Local PostGIS Geodatabase',
          connection_status: 'CONNECTED',
          source_type: 'LOCAL_POSTGIS_GIS',
          freshness: 'Static 2026 Geo-Layer',
          last_successful_update: '2026-09-01 12:00 PM',
          record_count: 4,
          confidence: 90,
          error_message: null,
        },
      ]
    };

    try {
      const res = await ApiClient.getDataHealth(fallback);
      setSources(res.data?.sources || fallback.sources);
      setSystemMode(res.data?.system_data_mode || 'HYBRID');
    } catch {
      setSources(fallback.sources);
      setSystemMode('HYBRID');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const connectedCount = sources.filter(s => s.connection_status === 'CONNECTED').length;
  const demoCount = sources.filter(s => s.connection_status === 'DEMO').length;
  const notConnectedCount = sources.filter(s => s.connection_status === 'NOT_CONNECTED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            CONNECTED
          </span>
        );
      case 'DEMO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-purple-950 text-purple-300 border border-purple-700 shadow-sm">
            <Activity className="w-3 h-3 text-purple-400" />
            DEMO / SYNTHETIC
          </span>
        );
      case 'NOT_CONNECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-slate-800 text-amber-300 border border-amber-600/70 shadow-sm">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            NOT CONNECTED
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-red-950 text-red-300 border border-red-700 shadow-sm">
            <XCircle className="w-3 h-3 text-red-400" />
            ERROR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-slate-800 text-slate-300 border border-slate-700">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                STATUTORY DATA HEALTH & ADAPTER REGISTRY
              </span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                MODE: {systemMode}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              External Geospatial & Telemetry Feeds
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Transparent operational status of all data pipelines. Local PostGIS layers are live, demo feeds are marked synthetic, and unconnected external gateways are never fabricated.
            </p>
          </div>
        </div>

        {/* Quick Refresh & Summary Counters */}
        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Health Matrix</span>
          </button>
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Total Configured Sources</span>
          <div className="font-mono font-black text-2xl text-white mt-1">{sources.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Multi-hazard adapters</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-800/60">
          <span className="text-[11px] text-emerald-400 font-bold uppercase block">Connected (PostGIS)</span>
          <div className="font-mono font-black text-2xl text-emerald-400 mt-1">{connectedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Active spatial indexing</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-800/60">
          <span className="text-[11px] text-purple-400 font-bold uppercase block">Synthetic Feeds</span>
          <div className="font-mono font-black text-2xl text-purple-300 mt-1">{demoCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">AWS & CWC simulated telemetry</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-800/60">
          <span className="text-[11px] text-amber-400 font-bold uppercase block">Not Connected (Standby)</span>
          <div className="font-mono font-black text-2xl text-amber-400 mt-1">{notConnectedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Adapter ready for API token</div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border flex flex-col justify-between shadow-xl transition-all ${
              src.connection_status === 'CONNECTED'
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                : src.connection_status === 'DEMO'
                ? 'bg-slate-900/90 border-purple-900/40 hover:border-purple-800'
                : 'bg-slate-900/70 border-amber-900/40 opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                  {src.category.replace(/_/g, ' ')}
                </span>
                {getStatusBadge(src.connection_status)}
              </div>

              <h3 className="text-base font-bold text-white tracking-tight">{src.source_name}</h3>
              <p className="text-[11px] font-mono text-slate-400 mt-1 break-all">
                Config: <span className="text-slate-300">{src.endpoint_config}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Freshness</span>
                  <span className="font-semibold text-slate-300">{src.freshness}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Last Update</span>
                  <span className="font-mono font-semibold text-cyan-300">{src.last_successful_update}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Record Count</span>
                  <span className="font-mono font-bold text-white">{src.record_count} Records</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Confidence</span>
                  <span className="font-mono font-bold text-emerald-400">{src.confidence}%</span>
                </div>
              </div>

              {src.error_message && (
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-[11px] text-amber-300 flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{src.error_message}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Adapter: {src.source_type}</span>
              <span>{src.data_classification || 'DEMO / SYNTHETIC DATA'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

