import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { AuthGuard } from '../components/auth/AuthGuard';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return (
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-slate-950 font-sans text-slate-300 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-slate-950 font-bold italic">
                K
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100">KOA Manager <span className="text-emerald-500 text-xs font-mono">RC6</span></h1>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Phase 1: Foundation</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <div className="text-[10px] text-slate-600 uppercase font-bold px-2 py-2 mb-1">Architecture Scaffold</div>
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded text-amber-400 border border-slate-700/50">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium">Project Initialization</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <span className="text-sm font-medium">PGLite / Supabase Sync</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <span className="text-sm font-medium">TanStack Routing</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <span className="text-sm font-medium">Zod Schema Definitions</span>
            </div>
          </nav>
          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-950 rounded p-3 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-slate-500">PGLite DB</span>
                <span className="text-[10px] font-mono text-emerald-500">LOCAL_STRICT</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-emerald-500"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Header Bar */}
          <header className="h-14 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">Vite v5.2</span>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">React 18.3</span>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">TanStack Suite</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-400">System Ready</span>
              </div>
              <button className="px-3 py-1 bg-emerald-600 text-slate-950 text-xs font-bold rounded hover:bg-emerald-500">DEPLOY STACK</button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative">
             <Outlet />
          </div>

          {/* Bottom Status Bar */}
          <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 text-[10px] font-mono">
            <div className="flex gap-6">
              <span className="text-emerald-500">SYNC: ENABLED</span>
              <span className="text-slate-500">LATENCY: 12ms</span>
              <span className="text-slate-500">DB_SIZE: 1.2MB</span>
            </div>
            <div className="flex gap-4">
              <span className="text-slate-600 uppercase">TanStack Router (Active)</span>
              <span className="text-slate-400">UTF-8</span>
              <span className="text-amber-500">WARN: 0</span>
              <span className="text-rose-500">ERR: 0</span>
            </div>
          </footer>
        </main>
      </div>
    </AuthGuard>
  );
}
