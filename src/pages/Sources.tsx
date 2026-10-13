import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Search, Filter, MoreVertical, Pause, Play, Archive, Trash2, ExternalLink, TrendingUp, Users, Activity, Upload } from 'lucide-react';
import clsx from 'clsx';
import { SourceStatus, SourcePriority } from '../types';

const statusColors: Record<SourceStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  ARCHIVED: 'bg-gray-100 text-gray-700',
  ERROR: 'bg-red-100 text-red-700',
  BANNED: 'bg-red-100 text-red-700',
};

const priorityColors: Record<SourcePriority, string> = {
  HIGH: 'bg-red-50 text-red-600 border-red-200',
  MEDIUM: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  LOW: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function Sources() {
  const { sources, categories, addSource, updateSourceStatus, deleteSource, setNotification } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<SourceStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<SourcePriority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Add form
  const [newSource, setNewSource] = useState({ name: '', url: '', externalId: '', priority: 'MEDIUM' as SourcePriority, pollingIntervalMin: 30, categoryId: '', notes: '' });

  const filteredSources = sources.filter(s => {
    if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
    if (filterPriority !== 'ALL' && s.priority !== filterPriority) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAddSource = () => {
    if (!newSource.name || !newSource.url) {
      setNotification({ type: 'error', message: 'Заполните обязательные поля' });
      return;
    }
    addSource(newSource);
    setNotification({ type: 'success', message: `Канал "${newSource.name}" добавлен` });
    setShowAddModal(false);
    setNewSource({ name: '', url: '', externalId: '', priority: 'MEDIUM', pollingIntervalMin: 30, categoryId: '', notes: '' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Источники</h1>
          <p className="text-sm text-gray-500 mt-1">Управление каналами-источниками новостей</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Импорт CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Добавить канал
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as SourceStatus | 'ALL')}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Все статусы</option>
              <option value="ACTIVE">Активные</option>
              <option value="PAUSED">На паузе</option>
              <option value="ARCHIVED">Архив</option>
              <option value="ERROR">Ошибки</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as SourcePriority | 'ALL')}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Все приоритеты</option>
              <option value="HIGH">Высокий</option>
              <option value="MEDIUM">Средний</option>
              <option value="LOW">Низкий</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {filteredSources.map((source) => (
          <div key={source.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-blue-600">{source.name.charAt(0)}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-900">{source.name}</h3>
                  <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', statusColors[source.status])}>
                    {source.status}
                  </span>
                  <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium border', priorityColors[source.priority])}>
                    {source.priority === 'HIGH' ? '⚡ Высокий' : source.priority === 'MEDIUM' ? '📊 Средний' : '📉 Низкий'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{source.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>{source.followersCount.toLocaleString()} подп.</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Activity className="w-3.5 h-3.5" />
                    <span>ER: {source.engagementRate}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{source.growthRate}%</span>
                  </div>
                  <span className="text-xs text-gray-400">Опрос каждые {source.pollingIntervalMin} мин</span>
                </div>
              </div>

              {/* Actions */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setMenuOpen(menuOpen === source.id ? null : source.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
                {menuOpen === source.id && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-44">
                    <button
                      onClick={() => { updateSourceStatus(source.id, source.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'); setMenuOpen(null); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {source.status === 'ACTIVE' ? <><Pause className="w-4 h-4" /> Приостановить</> : <><Play className="w-4 h-4" /> Активировать</>}
                    </button>
                    <button
                      onClick={() => { updateSourceStatus(source.id, 'ARCHIVED'); setMenuOpen(null); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Archive className="w-4 h-4" /> В архив
                    </button>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <ExternalLink className="w-4 h-4" /> Открыть канал
                    </a>
                    <hr className="my-1" />
                    <button
                      onClick={() => { deleteSource(source.id); setMenuOpen(null); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Удалить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Добавить канал-источник</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Название канала *</label>
                <input
                  type="text"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: ТехноНовости"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">URL канала *</label>
                <input
                  type="text"
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://max.app/channel_name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">ID канала в MAX</label>
                <input
                  type="text"
                  value={newSource.externalId}
                  onChange={(e) => setNewSource({ ...newSource, externalId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="max_ch_xxx"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Приоритет</label>
                  <select
                    value={newSource.priority}
                    onChange={(e) => setNewSource({ ...newSource, priority: e.target.value as SourcePriority })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HIGH">Высокий</option>
                    <option value="MEDIUM">Средний</option>
                    <option value="LOW">Низкий</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Интервал опроса (мин)</label>
                  <input
                    type="number"
                    value={newSource.pollingIntervalMin}
                    onChange={(e) => setNewSource({ ...newSource, pollingIntervalMin: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Категория</label>
                <select
                  value={newSource.categoryId}
                  onChange={(e) => setNewSource({ ...newSource, categoryId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Не выбрана</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Заметки</label>
                <textarea
                  value={newSource.notes}
                  onChange={(e) => setNewSource({ ...newSource, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleAddSource}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Импорт из CSV</h2>
            <p className="text-sm text-gray-500 mb-4">
              Загрузите CSV-файл с колонками: name, url, external_id, priority, polling_interval
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Перетащите файл сюда или нажмите для выбора</p>
              <p className="text-xs text-gray-400 mt-1">CSV, до 1000 строк</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={() => { setShowImportModal(false); setNotification({ type: 'success', message: 'Импорт запущен' }); }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Импортировать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
