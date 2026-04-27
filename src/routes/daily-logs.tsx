import { createRoute, Link } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-logs',
  component: DailyLogPage,
});

function DailyLogPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daily Logs</h1>
          <p className="text-slate-500">Log and track daily animal activities.</p>
        </div>
        <Link 
          to="/dev/db_dailylogs"
          className="text-xs uppercase tracking-wider text-slate-400 border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded transition-colors"
        >
          Dev: Log DB
        </Link>
      </div>
      {/* Daily Logs Content Placeholder */}
    </div>
  );
}
