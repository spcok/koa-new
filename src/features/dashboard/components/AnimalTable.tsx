import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { db } from '../../../lib/db';
import { useDashboardStore } from '../../../store/dashboardStore';

const tabs = ['Owls', 'Raptors', 'Mammals', 'Exotics', 'Archived'];

export function AnimalTable() {
  const { sortOrder } = useDashboardStore();
  const [animals, setAnimals] = useState<any[]>([]);

  useEffect(() => {
    const query = `
      SELECT id, name, species, location, gender, hazard_rating, flying_weight_g, ring_number 
      FROM animals 
      ORDER BY name ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
    `;

    let unsubscribe: () => Promise<void>;

    db.live.query(query, [], (results) => {
      setAnimals(results.rows);
    }).then((res) => {
      unsubscribe = res.unsubscribe;
    }).catch(err => {
      console.error('Error starting live query:', err);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sortOrder]);

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Tabs */}
      <div className="flex items-center justify-between text-sm font-semibold text-slate-500 bg-white/50 rounded-full border border-slate-200 overflow-hidden shadow-sm p-1">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={clsx(
              "flex-1 py-2 text-center rounded-full transition-colors",
              idx === 0 ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "hover:bg-white/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Your Owls</h2>
        </div>
        
        {animals.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">No animals found</h3>
            <p className="text-xs text-slate-500 mt-1">Add an animal to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-800 font-bold border-b border-slate-200 bg-white">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Species</th>
                  <th className="px-6 py-4">Ring/Microchip</th>
                  <th className="px-6 py-4">Today's Weight</th>
                  <th className="px-6 py-4">Today's Feed</th>
                  <th className="px-6 py-4">Last Fed</th>
                  <th className="px-6 py-4">Location</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal) => (
                  <tr key={animal.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 text-slate-500 font-medium text-xs">
                    <td className="px-6 py-4 font-bold text-slate-800">{animal.name}</td>
                    <td className="px-6 py-4">{animal.species}</td>
                    <td className="px-6 py-4">{animal.ring_number === 'unknown' ? '-' : animal.ring_number}</td>
                    <td className="px-6 py-4">{animal.flying_weight_g === -1 ? '-' : `${animal.flying_weight_g}g`}</td>
                    <td className="px-6 py-4">-</td>
                    <td className="px-6 py-4">-</td>
                    <td className="px-6 py-4 text-blue-600">{animal.location === 'unknown' ? '-' : animal.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
