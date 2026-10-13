import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Key, Globe, Bell, Shield, Database, Save, Check } from 'lucide-react';
import clsx from 'clsx';

export default function Settings() {
  const { setNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState('api');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'api', label: 'API', icon: Key },
    { id: 'channel', label: 'Канал', icon: Globe },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'moderation', label: 'Модерация', icon: Shield },
    { id: 'database', label: 'База данных', icon: Database },
  ];

  const handleSave = () => {
    setSaved(true);
    setNotification({ type: 'success', message: 'Настройки сохранены' });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
          <p className="text-sm text-gray-500 mt-1">Конфигурация приложения и интеграций</p>
        </div>
        <button
          onClick={handleSave}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {saved ? <><Check className="w-4 h-4" /> Сохранено</> : <><Save className="w-4 h-4" /> Сохранить</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-48 flex lg:flex-col gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">MaxStat API</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">API Key</label>
                  <input
                    type="password"
                    defaultValue="msk_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Получите ключ на <a href="https://maxstat.ru/promo/api" className="text-blue-600 hover:underline" target="_blank">maxstat.ru/promo/api</a></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Base URL</label>
                  <input
                    type="text"
                    defaultValue="https://api.maxstat.ru/v1"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Rate Limit (запросов/мин)</label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">MAX Publishing API</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Bot Token</label>
                    <input
                      type="password"
                      defaultValue="bot_xxxxxxxxxxxxxxxx"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Channel ID для публикации</label>
                    <input
                      type="text"
                      defaultValue="my_channel_id"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channel' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Мой канал</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Название канала</label>
                  <input
                    type="text"
                    defaultValue="Мой Новостной Канал"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Описание канала</label>
                  <textarea
                    defaultValue="Лучшие новости из мира технологий, науки и бизнеса. Собираем и адаптируем для вас."
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Язык контента</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Русский</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Макс. длина поста (символов)</label>
                  <input
                    type="number"
                    defaultValue={4096}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Уведомления</h2>
              <div className="space-y-4">
                {[
                  { label: 'Новые посты собраны', desc: 'Уведомлять когда собраны новые посты', default: true },
                  { label: 'Ошибки сбора', desc: 'Уведомлять при ошибках опроса источников', default: true },
                  { label: 'Публикация успешна', desc: 'Уведомлять после успешной публикации', default: false },
                  { label: 'Публикация не удалась', desc: 'Уведомлять при ошибках публикации', default: true },
                  { label: 'Низкое качество поста', desc: 'Уведомлять при фильтрации по качеству', default: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Автомодерация</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Минимальная длина поста (символов)</label>
                  <input type="number" defaultValue={50} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Запрещённые слова (через запятую)</label>
                  <textarea
                    defaultValue="казино, ставки, заработок, крипта"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Минимальный importance score</label>
                  <input type="number" defaultValue={5} min={1} max={10} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Автоматическое одобрение</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Только с score ≥ 8</option>
                    <option>Все посты</option>
                    <option>Только ручная модерация</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">База данных</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">PostgreSQL Host</label>
                  <input type="text" defaultValue="localhost" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Port</label>
                  <input type="text" defaultValue="5432" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Database</label>
                  <input type="text" defaultValue="maxnews" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Redis (BullMQ)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Redis URL</label>
                    <input type="text" defaultValue="redis://localhost:6379" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 Для работы бэкенда убедитесь, что PostgreSQL и Redis запущены. Используйте <code className="bg-blue-100 px-1 rounded">docker-compose up -d</code> для быстрого старта.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
