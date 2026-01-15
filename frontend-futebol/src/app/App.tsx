import { useState } from 'react';
import { 
  LayoutDashboard, CalendarPlus, UserCog, Flag, 
  ChevronLeft, ChevronRight, FileText, Search, Users, LogOut 
} from 'lucide-react';

import { Login } from './components/Login';
import { DashboardOverview } from './components/DashboardOverview';
import { MatchManagement } from './components/MatchManagement';
import { TechnicalStaffManager } from './components/TechnicalStaffManager';
import { RefereeAnalytics } from './components/RefereeAnalytics';
import { AdvancedReports } from './components/AdvancedReports';
import { TeamExplorer } from './components/TeamExplorer';
import { UserManager } from './components/UserManager';
import { cn } from './components/ui/utils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', role: '' });
  
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (user: string, role: string) => {
    setCurrentUser({ name: user, role: role });
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({ name: '', role: '' });
  };

  // 1. Itens Básicos (Visíveis para TODOS)
  // Nota: Passamos currentUser.role para MatchManagement para ele saber se esconde o formulário
  const navigationItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20} />, component: <DashboardOverview /> },
    { id: 'teams', label: 'Clubes', icon: <Search size={20} />, component: <TeamExplorer /> },
    { id: 'matches', label: 'Partidas', icon: <CalendarPlus size={20} />, component: <MatchManagement userRole={currentUser.role} /> },
    { id: 'referees', label: 'Árbitros', icon: <Flag size={20} />, component: <RefereeAnalytics /> },
    { id: 'relatorios', label: 'Relatórios SQL', icon: <FileText size={20} />, component: <AdvancedReports /> },
  ];

  // 2. Itens Exclusivos de ADMINISTRADOR (Telas de Personalização/Escrita)
  if (currentUser.role === 'admin') {
    navigationItems.push(
      // Atualização de Técnico (Escrita)
      { id: 'staff', label: 'Equipe Técnica', icon: <UserCog size={20} />, component: <TechnicalStaffManager /> },
      // Criação de Usuário (Escrita)
      { id: 'users', label: 'Gerenciar Usuários', icon: <Users size={20} />, component: <UserManager /> }
    );
  }

  const activeItem = navigationItems.find((item) => item.id === activeView);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="dark min-h-screen bg-zinc-950 text-foreground font-sans flex">
      
      <aside className={cn('relative flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300', sidebarCollapsed ? 'w-16' : 'w-64')}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 h-16">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white">⚽</div>
              <div>
                <h2 className="font-bold text-zinc-100">BD Futebol</h2>
                <p className="text-[10px] text-zinc-500 uppercase">{currentUser.role === 'admin' ? 'Administrador' : 'Analista'}</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && <div className="mx-auto font-bold text-xl">⚽</div>}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative',
                activeView === item.id ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-600/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                sidebarCollapsed && 'justify-center px-0'
              )}
            >
              {item.icon}
              {!sidebarCollapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
              {activeView === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800">
            <button onClick={handleLogout} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors", sidebarCollapsed && "justify-center")}>
                <LogOut size={20} />
                {!sidebarCollapsed && <span>Sair ({currentUser.name})</span>}
            </button>
        </div>

        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-emerald-500 z-50">
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col bg-black">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto animate-in fade-in zoom-in duration-300 pb-10">
            {activeItem?.component}
          </div>
        </div>
      </main>
    </div>
  );
}