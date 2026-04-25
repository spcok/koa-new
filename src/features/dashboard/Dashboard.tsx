import React from 'react';
import { DutyWidget } from './components/DutyWidget';
import { StatWidget } from './components/StatWidget';
import { DashboardToolbar } from './components/DashboardToolbar';
import { AnimalTable } from './components/AnimalTable';

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* Title Area */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-xs font-semibold text-slate-500">
          Sunday, 19 April 2026 | 🌤️ 14°C Partly Cloudy
        </p>
      </div>

      {/* Top Grid: Duties */}
      <div className="grid grid-cols-2 gap-6">
        <DutyWidget
          title="Pending Duties"
          count={0}
          type="duties"
          statusText="All Duties Satisfied"
        />
        <DutyWidget
          title="Health Rota"
          count={0}
          type="health"
          statusText="Collection Stable"
        />
      </div>

      {/* Middle Grid: Stats */}
      <div className="grid grid-cols-2 gap-6">
        <StatWidget
          title="Weighed Today"
          current={7}
          total={12}
          type="weighed"
        />
        <StatWidget
          title="Fed Today"
          current={0}
          total={12}
          type="fed"
        />
      </div>

      {/* Toolbar */}
      <DashboardToolbar />

      {/* Table Area */}
      <AnimalTable />
    </div>
  );
}
