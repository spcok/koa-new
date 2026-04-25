// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AuthGuard } from '../components/auth/AuthGuard';

// The "export" keyword MUST be present here
export const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard>
      <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h1 className="text-xl font-bold text-amber-500 tracking-tight">KOA Manager</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2 text-sm text-slate-400">
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</div>
             <div className="bg-emerald-600/10 text-emerald-500 p-2 rounded-md border border-emerald-600/20 flex items-center gap-3">
               Dashboard
             </div>
             {/* Additional nav items can go here */}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
               <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">SYSTEM_STABLE</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm font-medium border border-emerald-500/50 text-emerald-500 px-3 py-1 rounded hover:bg-emerald-500/10 transition-colors">
                CLOCK IN
              </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto bg-slate-900">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  ),
});