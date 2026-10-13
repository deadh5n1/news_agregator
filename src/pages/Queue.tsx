import { useAppStore } from '../store/useAppStore';
import { Clock, CheckCircle, AlertCircle, Loader, RefreshCw, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function Queue() {
  const { schedules, preparedPublications, setNotification } = useAppStore();

  const getPrepared = (id: string) => preparedPublications.find(p => p.id === id);

  const queued = schedules.filter(s => s.status === 'QUEUED' || s.status === 'SCHEDULED');
  const publishing = schedules.filter(s => s.status === 'PUBLISHING');
  const completed = schedules.filter(s => s.status === 'PUBLISHED');
  const failed = schedules.filter(s => s.status === 'FAILED');

  const QueueSection = ({ title, items, icon: Icon, color }: {
    title: string;
    items: typeof schedules;
    icon: typeof Clock;
    color: string;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={clsx('w-5 h-5', color)} />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => {
            const prepared = getPrepared(item.preparedPublicationId);
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{prepared?.title || 'Публикация'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.scheduledAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {' • '}{prepared?.sourceName}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {item.status === 'PUBLISHING' && <Loader className="w-4 h-4 text-blue-500 animate-spin" />}
                  {item.retryCount > 0 && <span className="text-xs text-orange-500">×{item.retryCount}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">Пусто</p>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Очередь публикаций</h1>
          <p className="text-sm text-gray-500 mt-1">Статус задач на публикацию в канал MAX</p>
        </div>
        <button
          onClick={() => setNotification({ type: 'info', message: 'Очередь обновлена' })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Обновить
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{queued.length}</p>
          <p className="text-xs text-blue-600">В очереди</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{publishing.length}</p>
          <p className="text-xs text-yellow-600">Публикуются</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{completed.length}</p>
          <p className="text-xs text-green-600">Опубликовано</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{failed.length}</p>
          <p className="text-xs text-red-600">Ошибки</p>
        </div>
      </div>

      {/* Queue Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QueueSection title="В очереди / Запланировано" items={queued} icon={Clock} color="text-blue-500" />
        <QueueSection title="Публикуются сейчас" items={publishing} icon={Loader} color="text-yellow-500" />
        <QueueSection title="Успешно опубликовано" items={completed} icon={CheckCircle} color="text-green-500" />
        <QueueSection title="Ошибки" items={failed} icon={AlertCircle} color="text-red-500" />
      </div>

      {/* Queue Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Настройки очереди</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500">Макс. параллельных задач</label>
            <input type="number" defaultValue={3} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Повторных попыток</label>
            <input type="number" defaultValue={3} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Задержка между попытками (сек)</label>
            <input type="number" defaultValue={30} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
