import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import { DailyLogModal } from '../../features/logs/components/DailyLogModal';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dev/db_dailylogs',
  component: DbDailyLogsHarness,
});

function DbDailyLogsHarness() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | undefined>(undefined);
  const [logs, setLogs] = useState<any[]>([]);
  const [testAnimalId, setTestAnimalId] = useState('');

  async function fetchData() {
    try {
      const animalRes = await db.query('SELECT id FROM animals LIMIT 1');
      if (animalRes.rows.length > 0) {
        setTestAnimalId(animalRes.rows[0].id);
      }
      
      const logsRes = await db.query('SELECT * FROM daily_logs ORDER BY updated_at DESC');
      setLogs(logsRes.rows);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">Daily Log CRUD Test Harness</h1>
      
      <button 
        onClick={() => { setEditingLogId(undefined); setIsModalOpen(true); }}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition"
      >
        Add Test Log
      </button>

      <DailyLogModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchData(); }} 
        animalId={testAnimalId} 
        existingLogId={editingLogId} 
      />

      <div className="overflow-x-auto rounded-md shadow-sm border border-slate-700 bg-slate-950 p-4">
        <table className="w-full text-left text-sm text-emerald-400 font-mono">
          <thead className="text-xs uppercase bg-slate-900 border-b border-slate-700 text-slate-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Log Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Updated At</th>
              <th className="px-4 py-3">Deleted</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-900">
                <td className="px-4 py-3">{log.id}</td>
                <td className="px-4 py-3">{log.log_type}</td>
                <td className="px-4 py-3">{new Date(log.log_date).toLocaleString()}</td>
                <td className="px-4 py-3">{new Date(log.updated_at).toLocaleString()}</td>
                <td className="px-4 py-3">{String(log.is_deleted)}</td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => { setEditingLogId(log.id); setIsModalOpen(true); }}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
