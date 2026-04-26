import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowUpDown, Plus } from 'lucide-react';
import { AddAnimalModal } from '../../animals/components/AddAnimalModal';
import { useDashboardStore } from '../../../store/dashboardStore';

export function DashboardToolbar() {
  const [isAddAnimalModalOpen, setIsAddAnimalModalOpen] = useState(false);
  const { viewingDate, sortOrder, shiftDate, resetToToday, toggleSortOrder } = useDashboardStore();

  const formattedDate = viewingDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex justify-center items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Viewing Date:</span>
        </div>
        
        <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden text-xs">
          <button onClick={() => shiftDate(-1)} className="px-3 py-1.5 border-r border-slate-200 hover:bg-slate-50 font-medium text-slate-700">← Prev</button>
          <span className="px-4 py-1.5 font-semibold text-slate-800">{formattedDate}</span>
          <button className="px-3 py-1.5 border-l border-r border-slate-200 hover:bg-slate-50"><CalendarIcon className="w-3.5 h-3.5 text-slate-500" /></button>
          <button onClick={() => shiftDate(1)} className="px-3 py-1.5 border-r border-slate-200 hover:bg-slate-50 font-medium text-slate-700">Next →</button>
          <button onClick={() => resetToToday()} className="px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700">Today</button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <button onClick={toggleSortOrder} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          Name ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </button>

        <button 
          onClick={() => setIsAddAnimalModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 border border-blue-700 rounded-md shadow-sm text-xs font-semibold text-white hover:bg-blue-700 ml-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Owls
        </button>
      </div>

      <AddAnimalModal 
        isOpen={isAddAnimalModalOpen} 
        onClose={() => setIsAddAnimalModalOpen(false)} 
      />
    </>
  );
}
