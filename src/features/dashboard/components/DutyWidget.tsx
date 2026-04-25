// src/features/dashboard/components/DutyWidget.tsx
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DutyWidgetProps {
  title: string;
  icon: LucideIcon;
  count: number;
  emptyIcon: LucideIcon;
  emptyText: string;
  emptyIconColor: string;
}

export function DutyWidget({ title, icon: Icon, count, emptyIcon: EmptyIcon, emptyText, emptyIconColor }: DutyWidgetProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col min-h-[160px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-slate-100 font-semibold">
          <Icon className="w-5 h-5 text-slate-400" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
            {count}
          </span>
          <span className="text-slate-500 text-xs">^</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <EmptyIcon className={`w-8 h-8 ${emptyIconColor} opacity-80`} />
        <span className="text-sm text-slate-400">{emptyText}</span>
      </div>
    </div>
  );
}