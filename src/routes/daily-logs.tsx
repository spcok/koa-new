import { createRoute, Link } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-logs',
  component: DailyLogPage,
});

import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useState } from 'react';
import { useLiveQuery } from '@electric-sql/pglite-react';
import { db } from '../lib/db';
import { DailyLogModal } from '../features/logs/components/DailyLogModal';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-logs',
  component: DailyLogs,
});

function DailyLogs() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | undefined>();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('00000000-0000-0000-0000-000000000000');

  const liveQuery = useLiveQuery(
    `SELECT l.*, a.name as animal_name, a.category as animal_category
     FROM daily_logs l
     LEFT JOIN animals a ON l.animal_id = a.id
     WHERE DATE(l.log_date) = $1 AND l.is_deleted = false
     ORDER BY l.updated_at DESC`,
    [selectedDate],
    db
  );

  const logs = liveQuery?.rows || [];

  const filteredLogs = logs.filter(log =>
    selectedCategory === 'All' || (log as any).animal_category === selectedCategory
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daily Logs</h1>
          <p className="text-slate-500">Log and track daily animal activities.</p>
        </div>
        <button
           onClick={() => { setEditingLogId(undefined); setIsModalOpen(true); }}
           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
           Add Log
        </button>
      </header>

      <div className="flex gap-4">
         <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white p-2 rounded border border-slate-300" />
         <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-white p-2 rounded border border-slate-300">
           {['All', 'Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Invertebrates', 'Fish'].map(c => <option key={c} value={c}>{c}</option>)}
         </select>
      </div>

      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="w-full text-sm text-left">
           <thead className="bg-slate-100 uppercase text-xs">
             <tr>
               <th className="px-4 py-2">Time</th>
               <th className="px-4 py-2">Animal</th>
               <th className="px-4 py-2">Type</th>
               <th className="px-4 py-2">Value</th>
               <th className="px-4 py-2">Notes</th>
               <th className="px-4 py-2">Actions</th>
             </tr>
           </thead>
           <tbody>
             {filteredLogs.map(log => {
                 const l = log as any;
                 return (
                    <tr key={l.id} className="border-b">
                      <td className="px-4 py-2">{new Date(l.log_date).toLocaleTimeString()}</td>
                      <td className="px-4 py-2">{l.animal_name}</td>
                      <td className="px-4 py-2">{l.log_type}</td>
                      <td className="px-4 py-2">{l.weight_grams !== -1 ? `${l.weight_grams} g` : l.temperature_c !== -1 ? `${l.temperature_c} °C` : '-'}</td>
                      <td className="px-4 py-2">{l.notes}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => { setEditingLogId(l.id); setIsModalOpen(true); }} className="text-emerald-700 font-bold">Edit</button>
                      </td>
                    </tr>
                 )
             })}
           </tbody>
        </table>
      </div>

      <DailyLogModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLogId(undefined); }}
        animalId={selectedAnimalId}
        existingLogId={editingLogId}
      />
    </div>
  );
}


