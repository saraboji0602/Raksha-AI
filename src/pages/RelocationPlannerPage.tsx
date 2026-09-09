import React from 'react';
import { RelocationOptimizer } from '../components/allocation/RelocationOptimizer';

export const RelocationPlannerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <RelocationOptimizer />
    </div>
  );
};
