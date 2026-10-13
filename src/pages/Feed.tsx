import { useAppStore } from '../store/useAppStore';
import { Search, Filter, Eye, Heart, MessageCircle, Share2, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Feed() {
  const { publications, sources } = useAppStore();
  const [filterSource, setFilterSource] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'importance'>('date');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = publications
    .filter(p => {
      if (filterSource !== 'ALL' && p.sourceId !== filterSource) return false;
      if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.bodyText.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime();
      if (sortBy === 'views') return b.viewCount - a.viewCount;
      return b.importanceScore - a.importanceScore;
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Лента публикаций</h1>
          <p className="text-sm text-gray-500 mt-1">Собранные посты из каналов-источников</p>
        </div>
        <div className="text-sm text-gray-500">
          Всего: <span className="font-semibold text-gray-800">{publications.length}</span> постов
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по тексту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Все источники</option>
            {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'importance')}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">По дате</option>
            <option value="views">По просмотрам</option>
            <option value="importance">По важности</option>
          </select>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {filtered.map((pub) => (
          <div key={pub.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{pub.sourceName}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(pub.collectedAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {pub.importanceScore >= 9 && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> HOT
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-900 mb-2">{pub.title}</h3>

                {/* Body */}
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{pub.bodyText}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {pub.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {pub.viewCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {pub.likeCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {pub.commentCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {pub.shareCount.toLocaleString()}</span>
                  <span className="ml-auto text-xs font-medium text-gray-400">Важность: {pub.importanceScore}/10</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Публикации не найдены</p>
        </div>
      )}
    </div>
  );
}
