import { useAppStore } from '../store/useAppStore';
import { analyticsData, sourceMetricsData } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, Share2, Users, Award } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

export default function Analytics() {
  const { publications, sources, preparedPublications } = useAppStore();

  const topPublications = [...publications].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  const categoryData = [
    { name: 'Технологии', value: publications.filter(p => p.category === 'tech').length },
    { name: 'Бизнес', value: publications.filter(p => p.category === 'business').length },
    { name: 'Наука', value: publications.filter(p => p.category === 'science').length },
    { name: 'Спорт', value: publications.filter(p => p.category === 'sport').length },
    { name: 'Политика', value: publications.filter(p => p.category === 'politics').length },
  ].filter(d => d.value > 0);

  const totalViews = publications.reduce((a, p) => a + p.viewCount, 0);
  const totalLikes = publications.reduce((a, p) => a + p.likeCount, 0);
  const totalComments = publications.reduce((a, p) => a + p.commentCount, 0);
  const totalShares = publications.reduce((a, p) => a + p.shareCount, 0);
  const avgER = sources.reduce((a, s) => a + s.engagementRate, 0) / sources.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
        <p className="text-sm text-gray-500 mt-1">Эффективность публикаций и источников</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">Просмотры</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{(totalViews / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">Лайки</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{(totalLikes / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">Комментарии</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{(totalComments / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-500">Репосты</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{(totalShares / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-cyan-500" />
            <span className="text-xs text-gray-500">Источники</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{sources.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">Ср. ER</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{avgER.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Динамика просмотров</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`, 'Просмотры']} />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Вовлечённость по типам</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`]} />
              <Bar dataKey="likes" fill="#ef4444" radius={[2, 2, 0, 0]} name="Лайки" />
              <Bar dataKey="comments" fill="#10b981" radius={[2, 2, 0, 0]} name="Комментарии" />
              <Bar dataKey="shares" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Репосты" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Рост подписчиков источников</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sourceMetricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`]} />
              <Line type="monotone" dataKey="followers" stroke="#06b6d4" strokeWidth={2} dot={false} name="Подписчики" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Распределение по категориям</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-xs text-gray-600">{cat.name} ({cat.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Publications */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" /> Топ публикаций по просмотрам
        </h3>
        <div className="space-y-3">
          {topPublications.map((pub, i) => (
            <div key={pub.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
              <span className="text-lg font-bold text-gray-300 w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{pub.title}</p>
                <p className="text-xs text-gray-500">{pub.sourceName}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {(pub.viewCount / 1000).toFixed(0)}K</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {(pub.likeCount / 1000).toFixed(1)}K</span>
                <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {(pub.shareCount / 1000).toFixed(1)}K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
