export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'ACTION_REQUIRED';

export type AlertCategory = 
  | 'RISK_ESCALATION' 
  | 'NEW_HAZARD' 
  | 'FIELD_VERIFICATION_PENDING' 
  | 'CAPACITY_WARNING' 
  | 'DATA_FRESHNESS' 
  | 'RELOCATION_MILESTONE';

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  settlementId?: string;
  settlementName?: string;
  siteId?: string;
  siteName?: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  timeAgo: string;
  read: boolean;
  type: 'CRITICAL' | 'SUCCESS' | 'WARNING' | 'INFO';
  linkTo?: string;
}
