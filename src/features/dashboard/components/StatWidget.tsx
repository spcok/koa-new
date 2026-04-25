import React from 'react';
import { Scale, Drumstick } from 'lucide-react';
import clsx from 'clsx';

interface StatWidgetProps {
  title: string;
  current: number;
  total: number;
  type: 'weighed' | 'fed';
}

export function StatWidget({ title, current, total, type }: StatWidgetProps) {
  const isWeighed = type === 'weighed';

  return (
    <div className={clsx("rounded-lg p-4 text-white shadow-sm flex justify-between items-center h-24", isWeighed ? "bg-emerald-500" : "bg-orange-500")}>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-white/90 mb-1">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight">{current}</span>
          <span className="text-sm font-semibold opacity-80">/{total}</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        {isWeighed ? <Scale className="w-5 h-5 text-white" /> : <Drumstick className="w-5 h-5 text-white" />}
      </div>
    </div>
  );
}
