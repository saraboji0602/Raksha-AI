import React from 'react';
import { useApp } from '../../store/useAppStore';
import { MetricCard } from '../common/MetricCard';
import { 
  AlertOctagon, 
  Users, 
  Compass, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Coins 
} from 'lucide-react';

export const OverviewKPIs: React.FC = () => {
  const { settlements, safeSites, setCurrentPage, setFilterRiskLevel, setFilterPriority } = useApp();

  const criticalCount = settlements.filter(s => s.overallRisk >= 85).length;
  const immediateRelocationCount = settlements.filter(s => s.priority === 'IMMEDIATE').length;
  const totalExposedPop = settlements.reduce((acc, curr) => acc + curr.exposedPopulation, 0);
  const totalInactionCr = settlements.reduce((acc, curr) => acc + curr.costOfInactionCr, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* KPI 1: Critical Habitations */}
      <MetricCard
        title="Critical Red-Zone Habitations"
        value={criticalCount}
        subtitle="in high exposure"
        trend={{ value: '+12 this quarter', isPositive: false }}
        icon={AlertOctagon}
        iconColor="text-red-400"
        badge="CRITICAL"
        onClick={() => {
          setFilterRiskLevel('CRITICAL');
          setCurrentPage('settlements');
        }}
      />

      {/* KPI 2: High-Risk Population */}
      <MetricCard
        title="High-Risk Population Exposed"
        value={totalExposedPop.toLocaleString()}
        subtitle="citizens"
        trend={{ value: '87% vulnerable', isNeutral: true }}
        icon={Users}
        iconColor="text-amber-400"
        badge="POPULATION"
        onClick={() => {
          setCurrentPage('settlements');
        }}
      />

      {/* KPI 3: Immediate Relocation Queue */}
      <MetricCard
        title="Immediate Relocation Priority"
        value={immediateRelocationCount}
        subtitle="settlements"
        trend={{ value: 'Urgent action', isPositive: false }}
        icon={Compass}
        iconColor="text-rose-400"
        badge="ACTION QUEUE"
        onClick={() => {
          setFilterPriority('IMMEDIATE');
          setCurrentPage('relocation');
        }}
      />

      {/* KPI 4: Validated Safe Havens */}
      <MetricCard
        title="Validated Safe Havens"
        value={safeSites.length}
        subtitle="18.2K capacity"
        trend={{ value: '100% audited', isPositive: true }}
        icon={ShieldCheck}
        iconColor="text-emerald-400"
        badge="SAFE SITES"
        onClick={() => {
          setCurrentPage('safe-sites');
        }}
      />

      {/* KPI 5: Cost of Inaction */}
      <MetricCard
        title="10-Year Inaction Exposure"
        value={`₹${totalInactionCr} Cr`}
        subtitle="projected loss"
        trend={{ value: 'Proactive saves 72%', isPositive: true }}
        icon={Coins}
        iconColor="text-cyan-400"
        badge="SCENARIO ROI"
        onClick={() => {
          setCurrentPage('simulator');
        }}
      />
    </div>
  );
};
