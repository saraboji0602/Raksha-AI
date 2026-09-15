import React from 'react';
import { useApp } from '../../store/useAppStore';
import { MetricCard } from '../common/MetricCard';
import { 
  AlertOctagon, 
  Users, 
  Compass, 
  ShieldCheck, 
  TrendingUp, 
  Radio, 
  BellRing,
  ShieldAlert,
  Building2,
  Truck,
  FileCheck2,
  Coins 
} from 'lucide-react';

export const OverviewKPIs: React.FC = () => {
  const { 
    settlements, 
    safeSites, 
    incidents, 
    alerts, 
    shelters, 
    emergencyResources, 
    hazardReports, 
    setCurrentPage, 
    setFilterRiskLevel, 
    setFilterPriority 
  } = useApp();

  const criticalCount = settlements.filter(s => s.overallRisk >= 85).length;
  const immediatePriorityCount = settlements.filter(s => s.priority === 'IMMEDIATE').length;
  const totalExposedPop = settlements.reduce((acc, curr) => acc + curr.exposedPopulation, 0);
  
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const activeAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'WARNING').length;
  const unresolvedSOSCount = incidents.filter(i => i.source === 'CITIZEN_SOS' && i.status !== 'RESOLVED').length;
  
  const totalShelterCap = shelters.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalShelterOcc = shelters.reduce((acc, curr) => acc + curr.currentOccupancy, 0);
  const shelterOccPercent = totalShelterCap > 0 ? Math.round((totalShelterOcc / totalShelterCap) * 100) : 0;
  
  const availableResourcesCount = emergencyResources.filter(r => r.status === 'AVAILABLE').length;
  const unverifiedReportsCount = hazardReports.filter(h => h.status !== 'VERIFIED' && h.status !== 'RESOLVED').length;

  return (
    <div className="space-y-3.5">
      {/* Primary Row: High-Level Threat & Habitational Risk KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Critical Habitations */}
        <MetricCard
          title="Critical Habitations"
          value={criticalCount}
          subtitle="Red-zone settlements"
          trend={{ value: 'High scarp retreat', isPositive: false }}
          icon={AlertOctagon}
          iconColor="text-red-400"
          badge="CRITICAL"
          onClick={() => {
            setFilterRiskLevel('CRITICAL');
            setCurrentPage('settlements');
          }}
        />

        {/* KPI 2: People Currently at Risk */}
        <MetricCard
          title="People Currently at Risk"
          value={totalExposedPop.toLocaleString()}
          subtitle="Frontline exposed citizens"
          trend={{ value: '87% vulnerable profile', isNeutral: true }}
          icon={Users}
          iconColor="text-amber-400"
          badge="POPULATION"
          onClick={() => {
            setCurrentPage('settlements');
          }}
        />

        {/* KPI 3: Immediate-Priority Settlements */}
        <MetricCard
          title="Immediate Priority"
          value={immediatePriorityCount}
          subtitle="Habitations requiring action"
          trend={{ value: 'Urgent intervention', isPositive: false }}
          icon={Compass}
          iconColor="text-rose-400"
          badge="ACTION QUEUE"
          onClick={() => {
            setFilterPriority('IMMEDIATE');
            setCurrentPage('relocation');
          }}
        />

        {/* KPI 4: Active Incidents */}
        <MetricCard
          title="Active Incidents"
          value={activeIncidentsCount}
          subtitle="Operational triage queue"
          trend={{ value: '1 escalated to SDRF', isPositive: false }}
          icon={Radio}
          iconColor="text-red-400"
          badge="COMMAND"
          onClick={() => {
            setCurrentPage('officer-emergency');
          }}
        />

        {/* KPI 5: Active Alerts */}
        <MetricCard
          title="Active Alerts"
          value={activeAlertsCount}
          subtitle="CAP-compliant broadcasts"
          trend={{ value: 'Multilingual live', isPositive: true }}
          icon={BellRing}
          iconColor="text-amber-400"
          badge="EARLY WARNING"
          onClick={() => {
            setCurrentPage('alerts');
          }}
        />
      </div>

      {/* Secondary Row: Operational Emergency & Logistics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 6: Unresolved SOS */}
        <MetricCard
          title="Unresolved SOS"
          value={unresolvedSOSCount}
          subtitle="Citizen distress beacons"
          trend={{ value: 'Response SLA: <30m', isPositive: false }}
          icon={ShieldAlert}
          iconColor="text-red-500"
          badge="SOS QUEUE"
          onClick={() => {
            setCurrentPage('officer-emergency');
          }}
        />

        {/* KPI 7: Evacuation Progress */}
        <MetricCard
          title="Evacuation Progress"
          value="42%"
          subtitle="770 / 1,850 evacuated"
          trend={{ value: 'Via SH-49 High Bypass', isPositive: true }}
          icon={TrendingUp}
          iconColor="text-cyan-400"
          badge="EVACUATION"
          onClick={() => {
            setCurrentPage('officer-emergency');
          }}
        />

        {/* KPI 8: Shelter Occupancy */}
        <MetricCard
          title="Shelter Occupancy"
          value={`${shelterOccPercent}%`}
          subtitle={`${totalShelterOcc} / ${totalShelterCap} capacity`}
          trend={{ value: `${totalShelterCap - totalShelterOcc} berths headroom`, isPositive: true }}
          icon={Building2}
          iconColor="text-emerald-400"
          badge="SHELTERS"
          onClick={() => {
            setCurrentPage('officer-emergency');
          }}
        />

        {/* KPI 9: Available Rescue Resources */}
        <MetricCard
          title="Available Resources"
          value={`${availableResourcesCount} / ${emergencyResources.length}`}
          subtitle="Boats, ALS Ambulances, Pumps"
          trend={{ value: 'Staged at Hubs', isPositive: true }}
          icon={Truck}
          iconColor="text-blue-400"
          badge="LOGISTICS"
          onClick={() => {
            setCurrentPage('officer-emergency');
          }}
        />

        {/* KPI 10: Unverified Field Reports */}
        <MetricCard
          title="Unverified Field Reports"
          value={unverifiedReportsCount}
          subtitle="Awaiting ground arbitration"
          trend={{ value: 'Citizen + sensor feeds', isNeutral: true }}
          icon={FileCheck2}
          iconColor="text-purple-400"
          badge="FIELD TRUTH"
          onClick={() => {
            setCurrentPage('field-verification');
          }}
        />
      </div>
    </div>
  );
};

