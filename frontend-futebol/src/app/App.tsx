import { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  UserCog, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Search 
} from 'lucide-react';

// Importação dos Componentes
import { DashboardOverview } from './components/DashboardOverview';
import { MatchManagement } from './components/MatchManagement';
import { TechnicalStaffManager } from './components/TechnicalStaffManager';
import { RefereeAnalytics } from './components/RefereeAnalytics';
import { AdvancedReports } from './components/AdvancedReports';
import { TeamExplorer } from './components/TeamExplorer'; // Nova tela de consulta de times
import { cn } from './components/ui/utils';

// Definição do Tipo para o Menu
type NavigationItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

// Configuração dos Itens do Menu Lateral
const navigationItems: NavigationItem[] = [
  { 
    id: 'dashboard', 
    label: 'Painel Geral', 
    icon: <LayoutDashboard className="h-5 w-5" />, 
    component: <DashboardOverview /> 
  },
  { 
    id: 'teams', 
    label: 'Clubes', 
    icon: <Search className="h-5 w-5" />, 
    component: <TeamExplorer /> 
  },
  { 
    id: 'matches', 
    label: 'Partidas', 
    icon: <CalendarPlus className="h-5 w-5" />, 
    component: <MatchManagement /> 
  },
  { 
    id: 'staff', 
    label: 'Equipe Técnica', 
    icon: <UserCog className="h-5 w-5" />, 
    component: <TechnicalStaffManager /> 
  },
  { 
    id: 'referees', 
    label: 'Árbitros', 
    icon: <Flag className="h-5 w-5" />, 
    component: <RefereeAnalytics /> 
  },
  { 
    id: 'relatorios', 
    label: 'Relatórios SQL', 
    icon: <FileText className="h-5 w-5" />, 
    component: <AdvancedReports /> 
  },
];

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Encontra o componente ativo com base no ID selecionado
  const activeItem = navigationItems.find((item) => item.id === activeView);

  return (
    <div className="dark min-h-screen bg-zinc-950 text-foreground font-sans flex">
      
      {/* --- SIDEBAR (Menu Lateral) --- */}
      <aside 
        className={cn(
          'relative flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex-shrink-0', 
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Cabeçalho do Menu */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 h-16">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <span className="text-white font-bold text-lg">⚽</span>
              </div>
              <div>
                <h2 className="font-bold text-zinc-100 leading-tight">BD Futebol</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Sistema Admin</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto font-bold text-xl w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              ⚽
            </div>
          )}
        </div>

        {/* Lista de Navegação */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                activeView === item.id 
                  ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 shadow-sm' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent',
                sidebarCollapsed && 'justify-center px-0'
              )}
            >
              <span className={cn("transition-transform duration-200", activeView === item.id && "scale-110")}>
                {item.icon}
              </span>
              
              {!sidebarCollapsed && (
                <span className="font-medium text-sm truncate">{item.label}</span>
              )}
              
              {/* Indicador lateral ativo */}
              {activeView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Botão de Colapsar */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-lg z-50"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Rodapé do Menu */}
        <div className="p-4 border-t border-zinc-800">
          {!sidebarCollapsed ? (
             <div className="text-xs text-zinc-600 text-center">
               v1.0.0 • Admin Mode
             </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-600 mx-auto animate-pulse" />
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT (Área Principal) --- */}
      <main className="flex-1 overflow-hidden flex flex-col bg-black">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-in fade-in zoom-in duration-300 pb-10">
            {activeItem?.component}
          </div>
        </div>
      </main>
      
    </div>
  );
}