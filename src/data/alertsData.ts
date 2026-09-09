import { AlertItem } from '../types';

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'CRITICAL RISK ESCALATION: Kadalpuram',
    message: 'Composite multi-hazard risk escalated from 82 to 91 following satellite detection of 3.4m/yr coastal shoreline erosion.',
    severity: 'CRITICAL',
    category: 'RISK_ESCALATION',
    timestamp: '14 minutes ago',
    settlementId: 'kadalpuram',
    settlementName: 'Kadalpuram',
    read: false,
    actionUrl: '/settlements/kadalpuram',
    actionLabel: 'Open Digital Twin'
  },
  {
    id: 'alt-02',
    title: 'ACTION REQUIRED: Site B Capacity Allocation Validation',
    message: 'Site B (Pothigai Haven) has reached 53% planned capacity (2,650 / 5,000 residents allocated). Water supply feeder clearance pending approval.',
    severity: 'ACTION_REQUIRED',
    category: 'CAPACITY_WARNING',
    timestamp: '42 minutes ago',
    siteId: 'site-b',
    siteName: 'Site B (Pothigai Resilient Haven)',
    read: false,
    actionUrl: '/safe-sites',
    actionLabel: 'Review Site Carrying Capacity'
  },
  {
    id: 'alt-03',
    title: 'FIELD EVIDENCE CONFIRMATION: Malaiyur',
    message: 'Geological Field Team verified active 45mm tension crack widening. Data confidence boosted from 72% to 94%. Relocation urgency: IMMEDIATE.',
    severity: 'CRITICAL',
    category: 'FIELD_VERIFICATION_PENDING',
    timestamp: '2 hours ago',
    settlementId: 'malaiyur',
    settlementName: 'Malaiyur',
    read: false,
    actionUrl: '/field-verification',
    actionLabel: 'View Field Evidence'
  },
  {
    id: 'alt-04',
    title: 'DATA WARNING: Estuarine Hydrological Model Freshness',
    message: 'Synthetic CWC runoff gauge telemetry for Delta sector is 14 days old. Recalibration scheduled.',
    severity: 'WARNING',
    category: 'DATA_FRESHNESS',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: '/data',
    actionLabel: 'Check Data Sources'
  },
  {
    id: 'alt-05',
    title: 'RELOCATION MILESTONE: Pamban Island Sector 4',
    message: 'Community consultation stage initiated for 2,200 exposed households in Sector 4.',
    severity: 'INFO',
    category: 'RELOCATION_MILESTONE',
    timestamp: '1 day ago',
    settlementId: 'pamban-sector4',
    settlementName: 'Pamban Island Sector 4',
    read: true,
    actionUrl: '/relocation',
    actionLabel: 'Open Relocation Planner'
  }
];
