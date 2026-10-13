import { useAppStore } from '../store/useAppStore';
import { Bell, Search, User, Menu } from 'lucide-react';

export default function Header() {
  const { setSidebarOpen, currentPage, searchQuery, setSearchQuery } = useAppStore();

  const pageTitle: Record<string, string> = {
    dashboard: 'Дашборд',
    sources: 'Источники',
    feed: 'Лента публикаций',
    'ai-rewrite': 'AI Рерайт',
    'ai-settings': 'Настройки AI',
    moderation: 'Модерация',
    templates: 'Шаблоны',
    scheduler: 'Планировщик',
    queue: 'Очередь публикаций',
    analytics: 'Аналитика',
    settings: 'Общие настройки',
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{pageTitle[currentPage] || 'Дашборд'}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">Админ</p>
            <p className="text-xs text-gray-500">admin@maxnews.ru</p>
          </div>
        </div>
      </div>
    </header>
  );
}
