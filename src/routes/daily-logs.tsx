import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/db';
import { DailyLogModal } from '../features/logs/components/DailyLogModal';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-logs',
  component: DailyLogPage,
});

function DailyLogPage() {
  const [viewDate, setViewDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeCategory, setActiveCategory] = useState('Owls');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedLogType, setSelectedLogType] = useState<string | null>(null);
  const [existingLogId, setExistingLogId] = useState<string | undefined>();

  const logsQuery = useQuery({
    queryKey: ['dailyLogs', viewDate],
    queryFn: async () => {
      const animalsRes = await db.query('SELECT * FROM animals ORDER BY name ASC');
      const logsRes = await db.query('SELECT * FROM daily_logs WHERE DATE(log_date) = $1', [viewDate]);
      return { animals: animalsRes.rows, logs: logsRes.rows };
    },
  });

  const categories = ['Owls', 'Raptors', 'Mammals', 'Exotics'];
  
  const handlePrevDay = () => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() - 1);
    setViewDate(d.toISOString().slice(0, 10));
  };
  const handleNextDay = () => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + 1);
    setViewDate(d.toISOString().slice(0, 10));
  };

  const filteredAnimals = logsQuery.data?.animals.filter(a => a.category === activeCategory) || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
            <button onClick={handlePrevDay} className="p-2 hover:bg-slate-100 rounded"><ChevronLeft size={20}/></button>
            <div className="flex items-center gap-2 px-3 py-2 border rounded font-mono text-sm text-slate-600">
                <Calendar size={16}/>{viewDate}
            </div>
            <button onClick={handleNextDay} className="p-2 hover:bg-slate-100 rounded"><ChevronRight size={20}/></button>
        </div>
        <div className="flex gap-2">
            {categories.map(cat => (
                <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === cat ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="text-xs uppercase bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4">Animal</th>
              {activeCategory === 'Exotics' ? (
                <>
                    <th className="px-6 py-4">Feed</th>
                    <th className="px-6 py-4">Misting</th>
                    <th className="px-6 py-4">Env</th>
                </>
              ) : (
                <>
                    <th className="px-6 py-4">WT</th>
                    <th className="px-6 py-4">Feed</th>
                    <th className="px-6 py-4">Env</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => {
               const animalLogs = logsQuery.data?.logs.filter(l => l.animal_id === animal.id) || [];
               return (
                <tr key={animal.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{animal.name}</td>
                    {activeCategory === 'Exotics' ? (
                        <>
                            <td className="px-6 py-4 cursor-pointer hover:underline" onClick={() => { setSelectedAnimalId(animal.id); setSelectedLogType('feed'); setExistingLogId(animalLogs.find(l => l.log_type === 'feed')?.id); setIsModalOpen(true); }}>Feed</td>
                            <td className="px-6 py-4 cursor-pointer hover:underline" onClick={() => { setSelectedAnimalId(animal.id); setSelectedLogType('misting'); setExistingLogId(animalLogs.find(l => l.log_type === 'misting')?.id); setIsModalOpen(true); }}>Misting</td>
                            <td className="px-6 py-4 cursor-pointer hover:underline" onClick={() => { setSelectedAnimalId(animal.id); setSelectedLogType('general'); setExistingLogId(animalLogs.find(l => l.log_type === 'general')?.id); setIsModalOpen(true); }}>Env</td>
                        </>
                    ) : (
                        <>
                             <td className="px-6 py-4 cursor-pointer hover:underline" onClick={() => { setSelectedAnimalId(animal.id); setSelectedLogType('weight'); setExistingLogId(animalLogs.find(l => l.log_type === 'weight')?.id); setIsModalOpen(true); }}>WT</td>
                             <td className="px-6 py-4 cursor-pointer hover:underline" onClick={() => { setSelectedAnimalId(animal.id); setSelectedLogType('feed'); setExistingLogId(animalLogs.find(l => l.log_type === 'feed')?.id); setIsModalOpen(true); }}>Feed</td>
                             <td className="px-6 py-4 cursor-pointer hover:underline" onClick={() => { setSelectedAnimalId(animal.id); setSelectedLogType('general'); setExistingLogId(animalLogs.find(l => l.log_type === 'general')?.id); setIsModalOpen(true); }}>Env</td>
                        </>
                    )}
                </tr>
               )
            })}
          </tbody>
        </table>
      </div>
      
      {selectedAnimalId && (
        <DailyLogModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); logsQuery.refetch(); }}
          animalId={selectedAnimalId}
          existingLogId={existingLogId}
          initialType={selectedLogType || 'general'}
        />
      )}
    </div>
  );
}

