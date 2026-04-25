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
      <div className="flex h-screen w-full bg-[#171f30] font-sans text-slate-300 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-800/50">
          <div className="flex items-center h-16 px-6 bg-[#0f172a]">
            <h1 className="text-xl font-bold tracking-tight text-white">KOA Manager</h1>
          </div>
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="px-6 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Overview</div>
            <div className="px-3">
              <div className="flex items-center gap-3 px-3 py-2 bg-emerald-500 rounded text-slate-950 font-semibold mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span className="text-sm">Dashboard</span>
              </div>
            </div>

            <div className="px-6 pb-2 pt-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Husbandry</div>
            <div className="px-3 space-y-1 mb-6">
              {['Daily Logs', 'Daily Rounds', 'Tasks', 'Feeding Schedule'].map(item => (
                <div key={item} className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white rounded hover:bg-slate-800/50 cursor-pointer">
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-2 pt-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Animals</div>
            <div className="px-3 space-y-1 mb-6">
              {['Animals', 'Clinical Notes', 'Medications', 'Quarantine'].map(item => (
                <div key={item} className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white rounded hover:bg-slate-800/50 cursor-pointer">
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-2 pt-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Logistics</div>
            <div className="px-3 space-y-1 mb-6">
              {['Movements', 'Flight Records'].map(item => (
                <div key={item} className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white rounded hover:bg-slate-800/50 cursor-pointer">
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-2 pt-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Safety</div>
            <div className="px-3 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white rounded hover:bg-slate-800/50 cursor-pointer">
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="text-sm font-medium">Maintenance</span>
              </div>
            </div>
          </nav>
          
          <div className="p-4 border-t border-slate-800/50 mt-auto">
            <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white cursor-pointer mb-2">
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="text-sm font-medium">Accessibility</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white cursor-pointer">
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-slate-50 text-slate-900 border-l border-slate-300 relative">
          {/* Header Bar */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10 shadow-sm">
            <div className="flex items-center">
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-1.5 border border-emerald-500 text-emerald-600 rounded-full text-sm font-bold tracking-wider hover:bg-emerald-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                CLOCK IN
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">Charlotte Davis-Whytock</span>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  C
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative">
             <Outlet />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
