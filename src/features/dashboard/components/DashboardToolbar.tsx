// src/features/dashboard/components/DashboardToolbar.tsx
import { Calendar, ChevronLeft, ChevronRight, ArrowUpDown, Plus } from 'lucide-react';

// Ensure the word 'export' is right here before the function
export function DashboardToolbar() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col md:flex-row justify-center items-center gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-300">Viewing Date:</span>
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-md overflow-hidden">
          <button className="px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700 border-r border-slate-700 flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          <div className="px-4 py-1.5 text-sm text-slate-100 font-medium flex items-center gap-2">
            19/04/2026 <Calendar className="w-3 h-3 text-slate-400" />
          </div>
          <button className="px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-700 border-l border-slate-700 flex items-center gap-1">
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <button className="px-3 py-1.5 text-sm bg-slate-900 border border-slate-700 text-slate-300 rounded-md hover:bg-slate-700">
          Today
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm bg-slate-900 border border-slate-700 text-slate-300 rounded-md hover:bg-slate-700 flex items-center gap-2">
          <ArrowUpDown className="w-3 h-3" /> Name (A-Z)
        </button>
        <button className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Owls
        </button>
      </div>
    </div>
  );
}