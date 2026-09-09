import { HazardType } from '../types';

export interface HazardLayerConfig {
  id: HazardType | 'evacuation_routes' | 'infrastructure_buffer' | 'safe_relocation_sites';
  name: string;
  category: 'HAZARD' | 'INFRASTRUCTURE' | 'RELOCATION';
  color: string;
  defaultOpacity: number;
  enabled: boolean;
  unit: string;
  sourceDataset: string;
  updateFrequency: string;
  description: string;
}

export const HAZARD_LAYERS_CONFIG: HazardLayerConfig[] = [
  {
    id: 'coastal_erosion',
    name: 'Coastal Ingress & High Tide Erosion Line',
    category: 'HAZARD',
    color: '#06b6d4',
    defaultOpacity: 0.7,
    enabled: true,
    unit: 'meters/year retreat',
    sourceDataset: 'Synthetic Shoreline Change InSAR & CRZ Survey',
    updateFrequency: 'Bi-weekly',
    description: 'Active coastline regression envelope with projected 10-year shoreline retreat.'
  },
  {
    id: 'cyclone',
    name: 'Cyclonic Storm Surge & Wind Swell Envelope',
    category: 'HAZARD',
    color: '#a855f7',
    defaultOpacity: 0.65,
    enabled: true,
    unit: 'meter surge inundation',
    sourceDataset: 'Synthetic Met Ocean Wave Surge Model',
    updateFrequency: 'Daily forecast grid',
    description: 'Category 3-5 storm surge reach and high-velocity cyclonic wind corridors.'
  },
  {
    id: 'flood',
    name: '1-in-50 Year Fluvial Inundation Zone',
    category: 'HAZARD',
    color: '#3b82f6',
    defaultOpacity: 0.7,
    enabled: true,
    unit: 'water depth (m)',
    sourceDataset: 'Synthetic Hydro-DEM 5m Resolution',
    updateFrequency: 'Monthly hydrological recalculation',
    description: 'Riverine overflow and estuarine tidal backwater waterlogging depths.'
  },
  {
    id: 'landslide',
    name: 'Hill Slope Instability & Debris Flow Runout',
    category: 'HAZARD',
    color: '#ef4444',
    defaultOpacity: 0.75,
    enabled: true,
    unit: 'shear susceptibility index',
    sourceDataset: 'Synthetic GSI Geological Slope Database',
    updateFrequency: 'Seasonal soil moisture sync',
    description: 'High shear tension crack zones and debris flow runout corridors.'
  },
  {
    id: 'multi_hazard',
    name: 'Composite Multi-Hazard Exposure Index',
    category: 'HAZARD',
    color: '#f97316',
    defaultOpacity: 0.8,
    enabled: true,
    unit: 'risk score (0-100)',
    sourceDataset: 'RAKSHA-AI Weighted Fusion Engine',
    updateFrequency: 'Real-time calculation',
    description: 'Spatial confluence of flood, surge, coastal erosion, and slope instability.'
  },
  {
    id: 'safe_relocation_sites',
    name: 'Validated Safe Relocation Sites & Buffers',
    category: 'RELOCATION',
    color: '#10b981',
    defaultOpacity: 0.85,
    enabled: true,
    unit: 'carrying capacity (people)',
    sourceDataset: 'State Land Bank & Carrying Capacity Registry',
    updateFrequency: 'Quarterly validation',
    description: 'Verified safe havens outside all primary hazard envelopes.'
  },
  {
    id: 'evacuation_routes',
    name: 'Emergency Evacuation Routes & Bottlenecks',
    category: 'INFRASTRUCTURE',
    color: '#eab308',
    defaultOpacity: 0.8,
    enabled: false,
    unit: 'evac transit time (mins)',
    sourceDataset: 'Public Works Highway GIS',
    updateFrequency: 'Monthly road inspection',
    description: 'Primary and secondary egress routes with flood and choke point markers.'
  },
  {
    id: 'infrastructure_buffer',
    name: 'Critical Infrastructure 2km/5km Service Radii',
    category: 'INFRASTRUCTURE',
    color: '#6366f1',
    defaultOpacity: 0.4,
    enabled: false,
    unit: 'radial service buffer',
    sourceDataset: 'District Health & Education Geospatial Database',
    updateFrequency: 'Annual audit',
    description: 'Proximity catchments for Hospitals, Higher Secondary Schools, and Shelters.'
  }
];
