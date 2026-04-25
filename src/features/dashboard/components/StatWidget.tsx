// src/features/dashboard/components/StatWidget.tsx
import { LucideIcon } from 'lucide-react';

interface StatWidgetProps {
  title: string;
  current: number;
  total: number;
  icon: LucideIcon;
  colorClass: string;
}

export function StatWidget({ title, current, total, icon: Icon, colorClass }: StatWidgetProps) {
  return (
    <div className={`${colorClass} rounded-lg p-5 flex justify-between items-center shadow-md`}>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white/90 mb-1">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{current}</span>
          <span className="text-lg font-medium text-white/80">/{total}</span>
        </div>
      </div>
      <div className="bg-white/20 p-3 rounded-full">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}