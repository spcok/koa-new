import React, { useEffect, useState } from 'react';
import { Scale, Drumstick } from 'lucide-react';
import clsx from 'clsx';
import { db } from '../../../lib/db';
import { useDashboardStore } from '../../../store/dashboardStore';

interface StatWidgetProps {
  title: string;
  current: number;
  total: number;
  type: 'weighed' | 'fed';
}

export function StatWidget({ title, current, total, type }: StatWidgetProps) {
  const isWeighed = type === 'weighed';
  const { viewingDate, categoryFilter } = useDashboardStore();
  
  const [currentCount, setCurrentCount] = useState(current);
  const [totalCount, setTotalCount] = useState(total);

  useEffect(() => {
    let whereClause = "animals.archived = false";
    let params: any[] = [];
    let paramIndex = 1;

    const yyyy = viewingDate.getFullYear();
    const mm = String(viewingDate.getMonth() + 1).padStart(2, '0');
    const dd = String(viewingDate.getDate()).padStart(2, '0');
    const dateParam = `${yyyy}-${mm}-${dd}`;

    if (categoryFilter === 'ARCHIVED') {
      whereClause = "animals.archived = true";
    } else if (categoryFilter !== 'ALL') {
      whereClause = `UPPER(animals.category) = UPPER($${paramIndex}) AND animals.archived = false`;
      params.push(categoryFilter);
      paramIndex++;
    }

    let unsubscribeCurrent: () => Promise<void>;
    let unsubscribeTotal: () => Promise<void>;

    // Current Count Query
    const currentQuery = isWeighed 
      ? `SELECT count(DISTINCT daily_logs.animal_id) as count FROM daily_logs JOIN animals ON animals.id = daily_logs.animal_id WHERE ${whereClause} AND daily_logs.log_date::date = $${paramIndex}::date AND daily_logs.weight_grams IS NOT NULL`
      : `SELECT count(DISTINCT feeding_schedules.animal_id) as count FROM feeding_schedules JOIN animals ON animals.id = feeding_schedules.animal_id WHERE ${whereClause} AND feeding_schedules.scheduled_date = $${paramIndex} AND feeding_schedules.is_completed = true`;

    db.live.query(currentQuery, [...params, dateParam], (results) => {
      if (results.rows && results.rows[0]) {
        setCurrentCount(Number(results.rows[0].count));
      }
    }).then(res => {
      unsubscribeCurrent = res.unsubscribe;
    }).catch(err => console.error(err));

    // Total Count Query (all animals matched by filter)
    const totalQuery = `SELECT count(*) as count FROM animals WHERE ${whereClause}`;
    db.live.query(totalQuery, params, (results) => {
      if (results.rows && results.rows[0]) {
        setTotalCount(Number(results.rows[0].count));
      }
    }).then(res => {
      unsubscribeTotal = res.unsubscribe;
    }).catch(err => console.error(err));

    return () => {
      if (unsubscribeCurrent) unsubscribeCurrent();
      if (unsubscribeTotal) unsubscribeTotal();
    };
  }, [viewingDate, categoryFilter, isWeighed]);

  return (
    <div className={clsx("rounded-lg p-4 text-white shadow-sm flex justify-between items-center h-24", isWeighed ? "bg-emerald-500" : "bg-orange-500")}>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-white/90 mb-1">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight">{currentCount}</span>
          <span className="text-sm font-semibold opacity-80">/{totalCount}</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        {isWeighed ? <Scale className="w-5 h-5 text-white" /> : <Drumstick className="w-5 h-5 text-white" />}
      </div>
    </div>
  );
}
