import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <div className="p-6 text-white h-full grid place-items-center">
      <div className="p-8 border border-slate-800 bg-slate-900/50 rounded-lg text-center backdrop-blur shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Dashboard Core Module Pending...</h2>
        <p className="text-sm text-slate-500 font-mono">Phase 3 routing established successfully.</p>
      </div>
    </div>
  );
}
