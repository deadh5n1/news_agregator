import { useAppStore } from '../store/useAppStore';
import { Radio, Newspaper, Eye, Clock, CheckCircle, TrendingUp, Users, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyticsData } from '../data/mockData';

export default function Dashboard() {
  const { stats, sources, preparedPublications, publications } = useAppStore();

  const statCards = [
    { label: 'Источники', value: stats.totalSources, sub: `${stats.activeSources} активных`, icon: Radio, color: 'from-blue-500 to-blue-600' },
    { label: 'Постов сегодня', value: stats.publicationsToday, sub: `${stats.publicationsWeek} за неделю`, icon: Newspaper, color: 'from-green-500 to-green-600' },
    { label: 'На модерации', value: stats.pendingModeration, sub: 'ожидают проверки', icon: Clock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Охват', value: `${(stats.totalReach / 1000).toFixed(0)}K`, sub: 'за сегодня', icon: Eye, color: 'from-purple-500 to-purple-600' },
  ];

  const recentPublications = publications.slice(0, 4);
  const pendingModeration = preparedPublications.filter(p => p.status === 'DRAFT');

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Просмотры за неделю</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`, 'Просмотры']} />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Вовлечённость за неделю</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`]} />
              <Bar dataKey="likes" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Лайки" />
              <Bar dataKey="shares" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Репосты" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Publications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Последние публикации</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700">Все →</button>
          </div>
          <div className="space-y-3">
            {recentPublications.map((pub) => (
              <div key={pub.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{pub.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{pub.sourceName} • {new Date(pub.collectedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-gray-700">{(pub.viewCount / 1000).toFixed(0)}K</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{pub.importanceScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Ожидают модерации</h3>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {pendingModeration.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingModeration.map((pub) => (
              <div key={pub.id} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                <p className="text-sm font-medium text-gray-800 truncate">{pub.title}</p>
                <p className="text-xs text-gray-500 mt-1">{pub.sourceName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" /> DRAFT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Быстрая сводка</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-200 text-sm">Запланировано на сегодня</p>
            <p className="text-2xl font-bold">{stats.scheduledToday}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Опубликовано сегодня</p>
            <p className="text-2xl font-bold">{stats.publishedToday}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Средний ER источников</p>
            <p className="text-2xl font-bold">{(sources.reduce((a, s) => a + s.engagementRate, 0) / sources.length).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Всего подписчиков</p>
            <p className="text-2xl font-bold">{(sources.reduce((a, s) => a + s.followersCount, 0) / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>
    </div>
  );
}
