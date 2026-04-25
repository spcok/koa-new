// src/features/dashboard/Dashboard.tsx
import { ClipboardList, Heart, Scale, Drumstick, CloudSun, CheckCircle2 } from 'lucide-react';
import { DutyWidget } from './components/DutyWidget';
import { StatWidget } from './components/StatWidget';
import { DashboardToolbar } from './components/DashboardToolbar';
import { AnimalTable } from './components/AnimalTable';

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col mb-2">
        <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
          <span>Sunday, 19 April 2026</span>
          <span className="text-slate-600">|</span>
          <CloudSun className="w-4 h-4 text-amber-500" />
          <span>14°C Partly Cloudy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DutyWidget 
          title="Pending Duties" 
          icon={ClipboardList} 
          count={0} 
          emptyIcon={CheckCircle2} 
          emptyText="All Duties Satisfied"
          emptyIconColor="text-emerald-500"
        />
        <DutyWidget 
          title="Health Rota" 
          icon={Heart} 
          count={0} 
          emptyIcon={Heart} 
          emptyText="Collection Stable"
          emptyIconColor="text-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatWidget 
          title="Weighed Today" 
          current={7} 
          total={12} 
          icon={Scale} 
          colorClass="bg-emerald-600"
        />
        <StatWidget 
          title="Fed Today" 
          current={0} 
          total={12} 
          icon={Drumstick} 
          colorClass="bg-amber-600"
        />
      </div>

      <div className="mt-2">
        <DashboardToolbar />
      </div>

      <div className="mt-2">
        <AnimalTable />
      </div>
    </div>
  );
}