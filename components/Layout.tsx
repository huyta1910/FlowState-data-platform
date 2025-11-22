import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  Database, 
  Terminal, 
  Settings, 
  Activity,
  Boxes,
  Cpu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-cyan-500/10 text-cyan-400 border-r-2 border-cyan-500' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
    }`}
  >
    <Icon size={20} className={active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-900 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100">FlowState</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</div>
          <NavItem to="/" icon={LayoutDashboard} label="Overview" active={location.pathname === '/'} />
          <NavItem to="/pipelines" icon={Network} label="Pipeline Builder" active={location.pathname === '/pipelines'} />
          <NavItem to="/catalog" icon={Database} label="Data Catalog" active={location.pathname === '/catalog'} />
          <NavItem to="/query" icon={Terminal} label="SQL Lab" active={location.pathname === '/query'} />
          
          <div className="mt-8 px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
          <NavItem to="/compute" icon={Cpu} label="Compute Clusters" active={location.pathname === '/compute'} />
          <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="relative">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse absolute -right-1 -top-1"></div>
               <Activity size={18} className="text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">System Healthy</p>
              <p className="text-[10px] text-slate-500">Latency: 45ms</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium text-slate-200 capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '').replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-500 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900">
                Gemini 2.5 Flash Connected
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
                JS
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
