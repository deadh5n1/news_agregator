import { useAppStore } from '../store/useAppStore';
import {
  LayoutDashboard, Radio, Newspaper, FileEdit, CheckSquare,
  Calendar, Clock, BarChart3, Settings, ChevronLeft, ChevronRight, Zap, Sparkles
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { id: 'sources', label: 'Источники', icon: Radio },
  { id: 'feed', label: 'Лента постов', icon: Newspaper },
  { id: 'ai-rewrite', label: 'AI Рерайт', icon: Sparkles },
  { id: 'moderation', label: 'Модерация', icon: CheckSquare },
  { id: 'templates', label: 'Шаблоны', icon: FileEdit },
  { id: 'scheduler', label: 'Планировщик', icon: Calendar },
  { id: 'queue', label: 'Очередь', icon: Clock },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, stats } = useAppStore();

  return (
    <aside className={clsx(
      'bg-gray-900 text-white flex flex-col transition-all duration-300 h-screen sticky top-0',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MaxNews
            </h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">News Aggregator</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const badge = item.id === 'moderation' ? stats.pendingModeration : null;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {badge && badge > 0 && (
                <span className={clsx(
                  'absolute right-3 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1',
                  !sidebarOpen && 'right-1 top-0'
                )}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-4 border-t border-gray-800 text-gray-500 hover:text-white transition-colors flex items-center justify-center"
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </aside>
  );
}
