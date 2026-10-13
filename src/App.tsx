import { useAppStore } from './store/useAppStore';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Sources from './pages/Sources';
import Feed from './pages/Feed';
import Moderation from './pages/Moderation';
import Templates from './pages/Templates';
import Scheduler from './pages/Scheduler';
import Queue from './pages/Queue';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AIRewrite from './pages/AIRewrite';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

function Notification() {
  const { notification, setNotification } = useAppStore();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg', bgColors[notification.type])}>
        {icons[notification.type]}
        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
        <button onClick={() => setNotification(null)} className="ml-2 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PageContent() {
  const { currentPage } = useAppStore();

  switch (currentPage) {
    case 'dashboard': return <Dashboard />;
    case 'sources': return <Sources />;
    case 'feed': return <Feed />;
    case 'moderation': return <Moderation />;
    case 'templates': return <Templates />;
    case 'scheduler': return <Scheduler />;
    case 'queue': return <Queue />;
    case 'analytics': return <Analytics />;
    case 'ai-rewrite': return <AIRewrite />;
    case 'settings': return <Settings />;
    default: return <Dashboard />;
  }
}

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <PageContent />
        </main>
      </div>
      <Notification />
    </div>
  );
}
