import { createRoute, Link } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/db';
import { DailyLogModal } from '../features/logs/components/DailyLogModal';
import { Users, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-logs',
  component: DailyLogPage,
});

function DailyLogPage() {
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeCategory, setActiveCategory] = useState('Owls');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | undefined>();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedLogType, setSelectedLogType] = useState<string | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ['dailyLogs', viewDate],
    queryFn: async () => {
      const animalsRes = await db.query("SELECT * FROM animals WHERE status = 'active' ORDER BY name ASC");
      const logsRes = await db.query("SELECT * FROM daily_logs WHERE DATE(log_date) = $1", [viewDate]);
      return { animals: animalsRes.rows, logs: logsRes.rows };
    },
  });

  const filteredAnimals = data?.animals.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase()) || [];
  const getLogs = (animalId: string, logType: string) => data?.logs.filter(l => l.animal_id === animalId && l.log_type === logType) || [];

  const handleOpenModal = (animalId: string, logType: string, logId?: string) => {
    setSelectedAnimalId(animalId);
    setSelectedLogType(logType);
    setEditingLogId(logId);
    setIsModalOpen(true);
  };

  const renderLogButton = (animal: any, logType: string) => {
    const logs = getLogs(animal.id, logType);
    if (logType === 'feed' && activeCategory.toLowerCase() === 'mammals') {
      return (
        <div className="flex flex-col gap-2">
          {logs.map((log: any) => (
            <button key={log.id} onClick={() => handleOpenModal(animal.id, 'feed', log.id)} className="text-left bg-slate-800 p-2 rounded text-xs">
              {log.quantity !== -1 ? log.quantity + 'x ' : ''}{log.food}
              <div className="text-[10px] text-slate-500">@ {log.feed_time !== '00:00:00' ? log.feed_time.substring(0,5) : new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </button>
          ))}
          <button onClick={() => handleOpenModal(animal.id, 'feed')} className="bg-emerald-900 text-emerald-100 p-2 rounded text-xs flex items-center gap-1 justify-center">
            <Plus size={12} /> Add Feed
          </button>
        </div>
      );
    }
    
    if (logs.length > 0) {
      const log = logs[0];
      let displayValue = '';
      if (logType === 'feed') displayValue = `${log.quantity !== -1 ? log.quantity + 'x ' : ''}${log.food}`;
      else if (['weight', 'temperature', 'misting', 'water'].includes(logType)) {
          // Assuming these fields map to value in a generic way or specifically
          displayValue = log[logType === 'weight' ? 'weight_grams' : logType === 'temperature' ? 'temperature_c' : logType];
      }
      return (
        <button onClick={() => handleOpenModal(animal.id, logType, log.id)} className="text-left bg-slate-800 p-1 rounded text-xs w-full">
          {displayValue}
          <div className="text-[10px] text-slate-500">@ {log.feed_time !== '00:00:00' && logType === 'feed' ? log.feed_time.substring(0,5) : new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </button>
      );
    }
    return <button onClick={() => handleOpenModal(animal.id, logType)} className="text-slate-500 text-xs flex items-center gap-1"><Plus size={12} /> Add {logType}</button>;
  };

  const headers = activeCategory.toLowerCase() === 'exotics' 
    ? ['Animal', 'Feed', 'Misting', 'Water', 'Temperature']
    : ['Animal', 'Weight', 'Feed', 'Temperature'];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-700">
        <button onClick={() => setViewDate(new Date(new Date(viewDate).getTime() - 86400000).toISOString().split('T')[0])}><ChevronLeft /></button>
        <div className='flex items-center gap-2'><Calendar /> {viewDate}</div>
        <button onClick={() => setViewDate(new Date(new Date(viewDate).getTime() + 86400000).toISOString().split('T')[0])}><ChevronRight /></button>
      </div>
      
      <div className="flex gap-2">
        {['Owls', 'Raptors', 'Mammals', 'Exotics'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded ${activeCategory === cat ? 'bg-emerald-600' : 'bg-slate-800'}`}>{cat}</button>
        ))}
      </div>

      <table className="w-full text-slate-200">
        <thead><tr>{headers.map(h => <th key={h} className="text-left p-2">{h}</th>)}</tr></thead>
        <tbody>
          {filteredAnimals.map(animal => (
            <tr key={animal.id} className="border-t border-slate-700">
              <td className="p-2">{animal.name}</td>
              {headers.slice(1).map(h => {
                const logType = h.toLowerCase().replace(' ', '_');
                return <td key={h} className="p-2">{renderLogButton(animal, logType === 'water_changed' ? 'water' : logType === 'weight_grams' ? 'weight' : logType)}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedAnimalId && (
        <DailyLogModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); refetch(); }} 
          animalId={selectedAnimalId}
          existingLogId={editingLogId}
          initialType={selectedLogType || 'general'}
        />
      )}
    </div>
  );
}
