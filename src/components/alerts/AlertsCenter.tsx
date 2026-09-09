import React from 'react';
import { useApp } from '../../store/useAppStore';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Bell, 
  Clock, 
  ShieldAlert, 
  Building2, 
  Compass, 
  Database 
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const AlertsCenter: React.FC = () => {
  const { alerts, markAlertRead, setSelectedSettlementId, setSelectedSafeSiteId, setCurrentPage } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-red-950/60 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase">
              SMART DISASTER ESCALATIONS
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Active Red-Zone Alerts & Operational Triggers
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-white bg-red-900 px-3 py-1.5 rounded-xl border border-red-700">
          {alerts.filter(a => !a.read).length} Unread Escalations
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              !alert.read
                ? 'bg-slate-900 border-red-500/50 shadow-lg shadow-red-950/20'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : alert.severity === 'ACTION_REQUIRED'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    {alert.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              {alert.actionLabel && (
                <button
                  onClick={() => {
                    markAlertRead(alert.id);
                    if (alert.settlementId) setSelectedSettlementId(alert.settlementId);
                    if (alert.siteId) setSelectedSafeSiteId(alert.siteId);
                    if (alert.actionUrl) {
                      setCurrentPage(alert.actionUrl.includes('settlements') ? 'settlement-detail' : alert.actionUrl.replace('/', ''));
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span>{alert.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {!alert.read && (
                <button
                  onClick={() => markAlertRead(alert.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                  title="Mark as Read"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
