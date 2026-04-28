import { useQuery } from '@tanstack/react-query';
import { db } from '../../lib/db';
import { StatWidget } from './components/StatWidget';
import { AnimalTable } from './components/AnimalTable';
import { Users, Activity, AlertTriangle } from 'lucide-react';

export function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      // Fetch active animals
      const animalsRes = await db.query("SELECT * FROM animals WHERE is_deleted = false ORDER BY name ASC");
      
      // Fetch today's logs to count activity
      const today = new Date().toISOString().split('T')[0];
      const logsRes = await db.query("SELECT * FROM daily_logs WHERE DATE(log_date) = $1", [today]);
      
      return { 
        animals: animalsRes.rows, 
        todayLogsCount: logsRes.rows.length 
      };
    }
  });

  const totalAnimals = data?.animals.length || 0;
  const mammalsCount = data?.animals.filter((a: any) => a.category === 'Mammals').length || 0;
  const birdsCount = data?.animals.filter((a: any) => a.category === 'Owls' || a.category === 'Raptors').length || 0;
  const exoticsCount = data?.animals.filter((a: any) => a.category === 'Exotics').length || 0;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Overview</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Live facility status and statistics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatWidget 
          title="Total Active Animals" 
          value={totalAnimals} 
          icon={<Users size={20} />} 
          trend={`${mammalsCount} Mammals, ${birdsCount} Birds, ${exoticsCount} Exotics`}
        />
        <StatWidget 
          title="Daily Logs Today" 
          value={data?.todayLogsCount || 0} 
          icon={<Activity size={20} />} 
          trend="Facility activity"
        />
        <StatWidget 
          title="Pending Tasks" 
          value="0" 
          icon={<AlertTriangle size={20} />} 
          trend="All clear"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Animal Table takes up 2/3 of the screen */}
        <div className="lg:col-span-2 h-full">
          <AnimalTable animals={data?.animals || []} isLoading={isLoading} />
        </div>
        
        {/* Placeholder for future Duty/Task widget */}
        <div className="bg-slate-100 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 p-6 text-center h-full">
          <Activity size={32} className="mb-4 opacity-50" />
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Duty Roster</h3>
          <p className="text-xs font-medium">Task management module coming soon.</p>
        </div>
      </div>

    </div>
  );
}
