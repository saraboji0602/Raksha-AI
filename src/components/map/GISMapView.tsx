import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/useAppStore';
import { Settlement, SafeSite, RiskLevel } from '../../types';
import { 
  Map as MapIcon, 
  Layers, 
  Maximize2, 
  Compass, 
  ShieldCheck, 
  AlertTriangle, 
  Navigation, 
  Info,
  Building2,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const GISMapView: React.FC<{
  height?: string;
  focusedSettlementId?: string;
  showRelocationVector?: boolean;
  showMicroZones?: boolean;
  interactive?: boolean;
}> = ({
  height = '540px',
  focusedSettlementId,
  showRelocationVector = true,
  showMicroZones = false,
  interactive = true
}) => {
  const {
    settlements,
    safeSites,
    selectedSettlementId,
    setSelectedSettlementId,
    selectedSafeSiteId,
    setSelectedSafeSiteId,
    setCurrentPage,
    hazardLayers,
    toggleHazardLayer,
    filterHazard,
    filterRiskLevel,
    filterDistrict,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'STANDARD_DARK' | 'SATELLITE' | 'TERRAIN'>('STANDARD_DARK');
  const [hoveredSettlement, setHoveredSettlement] = useState<Settlement | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<Settlement | null>(null);

  const currentSettlement = settlements.find(s => s.id === (focusedSettlementId || selectedSettlementId)) || settlements[0];
  const targetSafeSite = safeSites.find(st => st.id === (currentSettlement.recommendedSiteId || selectedSafeSiteId)) || safeSites[0];

  // Filter settlements based on global active filters
  const filteredSettlements = settlements.filter(s => {
    if (filterHazard !== 'ALL' && s.dominantHazard !== filterHazard) return false;
    if (filterRiskLevel !== 'ALL') {
      const riskLevel = s.overallRisk >= 85 ? 'CRITICAL' : s.overallRisk >= 75 ? 'VERY_HIGH' : s.overallRisk >= 60 ? 'HIGH' : s.overallRisk >= 40 ? 'MODERATE' : 'LOW';
      if (riskLevel !== filterRiskLevel) return false;
    }
    if (filterDistrict !== 'ALL' && s.district !== filterDistrict) return false;
    return true;
  });

  // Calculate coordinates mapping for interactive SVG GIS Projection (Tamil Nadu & South India Coastal Corridor)
  // Lat: 9.0 to 12.0 N, Lng: 76.0 to 80.5 E
  const minLat = 9.0, maxLat = 12.0;
  const minLng = 76.2, maxLng = 80.2;

  const projectToSVG = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 860 + 70;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 480 + 30;
    return { x, y };
  };

  const getRiskColor = (score: number) => {
    if (score >= 85) return '#ef4444'; // Red critical
    if (score >= 75) return '#f97316'; // Orange
    if (score >= 60) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };

  const isLayerActive = (layerId: string) => {
    const layer = hazardLayers.find(l => l.id === layerId);
    return layer ? layer.enabled : false;
  };

  const startCoord = projectToSVG(currentSettlement.latitude, currentSettlement.longitude);
  const endCoord = projectToSVG(targetSafeSite.latitude, targetSafeSite.longitude);

  return (
    <div
      className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none"
      style={{ height }}
    >
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Map Mode Tabs */}
        <div className="flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          <button
            onClick={() => setActiveTab('STANDARD_DARK')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'STANDARD_DARK'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GIS Dark Command
          </button>
          <button
            onClick={() => setActiveTab('SATELLITE')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'SATELLITE'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite View
          </button>
          <button
            onClick={() => setActiveTab('TERRAIN')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'TERRAIN'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terrain Contour
          </button>
        </div>

        {/* Legend / Status Badges */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 font-medium pointer-events-auto">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-bold">Critical Red Zone</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-bold">Safe Haven</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-cyan-400">{filteredSettlements.length} Habitations</span>
        </div>
      </div>

      {/* Main SVG GIS Canvas */}
      <div className="w-full h-full relative bg-gradient-to-br from-slate-950 via-[#0b101d] to-[#070b14] overflow-hidden">
        <svg
          viewBox="0 0 1000 550"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1" />
            </pattern>

            {/* Coastal Hazard Gradient */}
            <linearGradient id="coastal-surge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
            </linearGradient>

            {/* Fluvial Flood Gradient */}
            <radialGradient id="fluvial-flood-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            {/* Marker Glow Filter */}
            <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="550" fill="url(#gis-grid)" />

          {/* Simulated Coastline and Land Boundary of Tamil Nadu Corridor */}
          <path
            d="M 120,40 Q 240,60 380,50 T 620,90 T 780,180 T 820,280 T 790,390 T 720,490 T 580,530 T 320,520 T 140,460 Z"
            fill={activeTab === 'SATELLITE' ? '#131e24' : activeTab === 'TERRAIN' ? '#152219' : '#0e1626'}
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Bay of Bengal Sea Representation */}
          <path
            d="M 780,180 Q 820,280 790,390 T 720,490 L 1000,550 L 1000,0 L 620,0 Z"
            fill={activeTab === 'SATELLITE' ? '#07151e' : '#050a14'}
            opacity="0.85"
          />

          {/* Rivers & Estuaries (Cauvery, Vennar, Kollidam Delta Channels) */}
          <path
            d="M 280,240 Q 420,250 560,260 T 710,270 T 810,275"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeOpacity="0.7"
          />
          <path
            d="M 560,260 Q 640,310 740,330 T 790,340"
            fill="none"
            stroke="#0369a1"
            strokeWidth="2.5"
            strokeOpacity="0.6"
          />

          {/* HAZARD LAYER: Coastal Erosion & Storm Surge Inundation Envelope */}
          {isLayerActive('coastal_erosion') && (
            <path
              d="M 770,170 Q 815,275 785,385 T 715,485 L 830,485 Q 860,380 855,270 T 810,170 Z"
              fill="url(#coastal-surge-grad)"
              className="animate-pulse"
            />
          )}

          {/* HAZARD LAYER: Fluvial Flood Plain Inundation */}
          {isLayerActive('flood') && (
            <ellipse
              cx="640"
              cy="285"
              rx="90"
              ry="45"
              fill="url(#fluvial-flood-grad)"
            />
          )}

          {/* HAZARD LAYER: Landslide Susceptibility Contour (Hill region top-left) */}
          {isLayerActive('landslide') && (
            <path
              d="M 140,80 Q 200,60 230,120 T 170,190 T 120,130 Z"
              fill="#ef4444"
              fillOpacity="0.25"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          )}

          {/* Critical Infrastructure 5km Service Buffers */}
          {isLayerActive('infrastructure_buffer') && (
            <>
              <circle cx={endCoord.x} cy={endCoord.y} r="65" fill="#6366f1" fillOpacity="0.12" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={startCoord.x} cy={startCoord.y} r="55" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            </>
          )}

          {/* Relocation Vector Arc (Kadalpuram -> Safe Site B) */}
          {showRelocationVector && (
            <g className="transition-all duration-700">
              {/* Pulsing Path */}
              <path
                d={`M ${startCoord.x},${startCoord.y} Q ${(startCoord.x + endCoord.x) / 2 - 25},${(startCoord.y + endCoord.y) / 2 - 30} ${endCoord.x},${endCoord.y}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeDasharray="8 4"
                className="animate-pulse"
              />

              {/* Direction Indicator */}
              <circle
                cx={(startCoord.x + endCoord.x) / 2 - 12}
                cy={(startCoord.y + endCoord.y) / 2 - 15}
                r="4"
                fill="#38bdf8"
                filter="url(#glow-cyan)"
              />
            </g>
          )}

          {/* Safe Relocation Sites Markers */}
          {isLayerActive('safe_relocation_sites') && safeSites.map(site => {
            const coord = projectToSVG(site.latitude, site.longitude);
            const isSelected = site.id === targetSafeSite.id;

            return (
              <g
                key={site.id}
                onClick={() => {
                  setSelectedSafeSiteId(site.id);
                  addToast({
                    type: 'info',
                    title: `Safe Haven Selected: ${site.name}`,
                    description: `Safety: ${site.hazardSafetyScore}/100 • Capacity: ${site.capacity.recommendedMaxCapacity.toLocaleString()}`
                  });
                }}
                className="cursor-pointer group"
              >
                {/* Outer Ring */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isSelected ? 18 : 14}
                  fill="#065f46"
                  fillOpacity="0.5"
                  stroke="#10b981"
                  strokeWidth={isSelected ? 3 : 1.5}
                  className={isSelected ? 'gis-pulse-cyan' : ''}
                />

                {/* Shield Icon Inner */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="7"
                  fill="#10b981"
                />

                {/* Site Label */}
                <text
                  x={coord.x}
                  y={coord.y - 18}
                  textAnchor="middle"
                  fill="#6ee7b7"
                  fontSize="11"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md"
                >
                  {site.name.split(' (')[0]}
                </text>
              </g>
            );
          })}

          {/* Vulnerable Settlements Markers */}
          {filteredSettlements.map(s => {
            const coord = projectToSVG(s.latitude, s.longitude);
            const isSelected = s.id === currentSettlement.id;
            const color = getRiskColor(s.overallRisk);
            const isCritical = s.overallRisk >= 85;

            return (
              <g
                key={s.id}
                onClick={() => {
                  setSelectedSettlementId(s.id);
                  setSelectedPreview(s);
                }}
                onMouseEnter={() => setHoveredSettlement(s)}
                onMouseLeave={() => setHoveredSettlement(null)}
                className="cursor-pointer group"
              >
                {/* Animated Ping Aura for Critical Risk */}
                {isCritical && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 24 : 18}
                    fill={color}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Base Outer Marker */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isSelected ? 16 : 11}
                  fill="#0f172a"
                  stroke={color}
                  strokeWidth={isSelected ? 3.5 : 2}
                  filter={isCritical ? 'url(#glow-red)' : undefined}
                />

                {/* Center Core */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isSelected ? 7 : 5}
                  fill={color}
                />

                {/* Label */}
                <text
                  x={coord.x}
                  y={coord.y + (isSelected ? 24 : 20)}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize={isSelected ? '12' : '10'}
                  fontWeight={isSelected ? '800' : '600'}
                  className="pointer-events-none drop-shadow-lg"
                >
                  {s.name} ({s.overallRisk})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Settlement Quick Preview Floating Card on Map (Bottom-Left) */}
        {selectedPreview && (
          <div className="absolute bottom-4 left-4 z-30 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl animate-slideUp">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white tracking-tight">{selectedPreview.name}</h4>
                  <Badge variant="risk" level={selectedPreview.overallRisk >= 85 ? 'CRITICAL' : selectedPreview.overallRisk >= 75 ? 'VERY_HIGH' : 'HIGH'} size="sm" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedPreview.district}</p>
              </div>

              <button
                onClick={() => setSelectedPreview(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Exposed Pop</span>
                <div className="font-bold text-slate-100">{selectedPreview.exposedPopulation.toLocaleString()} ({selectedPreview.exposedPercentage}%)</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">AI Recommendation</span>
                <div className="font-bold text-cyan-400">{selectedPreview.aiRecommendation.replace('_', ' ')}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedSettlementId(selectedPreview.id);
                  setCurrentPage('settlement-detail');
                }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Open Digital Twin</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSettlementId(selectedPreview.id);
                  setCurrentPage('intervention');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Interventions
              </button>
            </div>
          </div>
        )}

        {/* Hover Tooltip */}
        {hoveredSettlement && !selectedPreview && (
          <div
            className="absolute top-16 right-4 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg p-3 shadow-xl pointer-events-none animate-fadeIn text-xs"
          >
            <div className="font-bold text-white text-sm">{hoveredSettlement.name}</div>
            <div className="text-[11px] text-slate-400">{hoveredSettlement.district}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-slate-400">Risk Score:</span>
              <span className="font-mono font-bold text-red-400">{hoveredSettlement.overallRisk}/100</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-slate-400">Recommendation:</span>
              <span className="font-bold text-cyan-300">{hoveredSettlement.aiRecommendation.replace('_', ' ')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
