// src/features/dashboard/components/AnimalTable.tsx
import { useState } from 'react';

const TABS = ['Owls', 'Raptors', 'Mammals', 'Exotics', 'Archived'];

const MOCK_DATA = [
  { id: 1, name: 'Azula', species: 'Snowy Owl', ring: '-', weight: '-', feed: '-', lastFed: 'Day Old Chicks - Whole - 3 14:46', location: 'Purple Aviary 3' },
  { id: 2, name: 'Beastie', species: 'Boobook owl', ring: '-', weight: '11 1/8 oz', feed: '-', lastFed: 'Day Old Chicks - Yolked - 1 14:08', location: 'Blue Aviary 1' },
  { id: 3, name: 'Dawn', species: 'Barn Owl', ring: '-', weight: '11 2/8 oz', feed: '-', lastFed: 'Day Old Chicks - Yolked - 2 14:08', location: 'Green Aviary 1' },
];

export function AnimalTable() {
  const [activeTab, setActiveTab] = useState('Owls');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[120px] py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">Your {activeTab}</h2>
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-700">
                <th className="p-4 text-sm font-semibold text-slate-300">Name</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Species</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Ring/Microchip</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Today's Weight</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Today's Feed</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Last Fed</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Location</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.map((animal) => (
                <tr key={animal.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 text-sm font-bold text-slate-100">{animal.name}</td>
                  <td className="p-4 text-sm text-slate-300">{animal.species}</td>
                  <td className="p-4 text-sm text-slate-400">{animal.ring}</td>
                  <td className="p-4 text-sm text-slate-300">{animal.weight}</td>
                  <td className="p-4 text-sm text-slate-400">{animal.feed}</td>
                  <td className="p-4 text-sm text-slate-400">{animal.lastFed}</td>
                  <td className="p-4 text-sm text-blue-400 hover:text-blue-300 cursor-pointer">{animal.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}