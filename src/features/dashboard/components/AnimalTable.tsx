import React from 'react';
import clsx from 'clsx';

const mockAnimals = [
  { id: 1, name: 'Azula', species: 'Snowy Owl', ring: '-', weight: '-', feed: '-', lastFed: 'Day Old Chicks - Whole - 3 14:46', location: 'Purple Aviary 3', active: true },
  { id: 2, name: 'Beastie', species: 'Boobook owl', ring: '-', weight: '11 1/8 oz', feed: '-', lastFed: 'Day Old Chicks - Yolked - 1 14:08', location: 'Blue Aviary 1', active: false },
  { id: 3, name: 'Dawn', species: 'Barn Owl', ring: '-', weight: '11 3/8 oz', feed: '-', lastFed: 'Day Old Chicks - Yolked - 2 14:08', location: 'Green Aviary 1', active: false },
];

const tabs = ['Owls', 'Raptors', 'Mammals', 'Exotics', 'Archived'];

export function AnimalTable() {
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
              {mockAnimals.map((animal) => (
                <tr key={animal.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 text-slate-500 font-medium text-xs">
                  <td className="px-6 py-4 font-bold text-slate-800">{animal.name}</td>
                  <td className="px-6 py-4">{animal.species}</td>
                  <td className="px-6 py-4">{animal.ring}</td>
                  <td className="px-6 py-4">{animal.weight}</td>
                  <td className="px-6 py-4">{animal.feed}</td>
                  <td className="px-6 py-4">{animal.lastFed}</td>
                  <td className="px-6 py-4 text-blue-600">{animal.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
