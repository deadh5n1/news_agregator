import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Check, X, Edit3, MessageSquare, Clock, Send, Eye } from 'lucide-react';
import clsx from 'clsx';

export default function Moderation() {
  const { preparedPublications, updatePreparedStatus, updatePreparedText, schedulePublication, setNotification } = useAppStore();
  const [selectedPub, setSelectedPub] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');
  const [comment, setComment] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('13:00');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = preparedPublications.filter(p => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  const selected = preparedPublications.find(p => p.id === selectedPub);

  const handleApprove = (id: string) => {
    updatePreparedStatus(id, 'APPROVED', comment || 'Одобрено');
    setComment('');
    setNotification({ type: 'success', message: 'Публикация одобрена' });
  };

  const handleReject = (id: string) => {
    updatePreparedStatus(id, 'REJECTED', comment || 'Отклонено');
    setComment('');
    setNotification({ type: 'info', message: 'Публикация отклонена' });
  };

  const handleSaveEdit = (id: string) => {
    updatePreparedText(id, editText);
    setEditMode(false);
    setNotification({ type: 'success', message: 'Текст обновлён' });
  };

  const handleSchedule = () => {
    if (selectedPub && scheduleDate) {
      schedulePublication(selectedPub, `${scheduleDate}T${scheduleTime}:00Z`);
      setShowScheduleModal(false);
      setNotification({ type: 'success', message: 'Публикация запланирована' });
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      SCHEDULED: 'bg-blue-100 text-blue-700',
      PUBLISHED: 'bg-purple-100 text-purple-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Модерация</h1>
          <p className="text-sm text-gray-500 mt-1">Проверка и адаптация публикаций перед публикацией</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'DRAFT', 'APPROVED', 'REJECTED', 'SCHEDULED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                filterStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {status === 'ALL' ? 'Все' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-3">
          {filtered.map((pub) => (
            <button
              key={pub.id}
              onClick={() => { setSelectedPub(pub.id); setEditMode(false); }}
              className={clsx(
                'w-full text-left p-4 rounded-xl border transition-all',
                selectedPub === pub.id
                  ? 'border-blue-300 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', statusBadge(pub.status))}>
                  {pub.status}
                </span>
                <span className="text-xs text-gray-400">{pub.sourceName}</span>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate">{pub.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pub.adaptedText.slice(0, 100)}...</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">Нет публикаций</div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
                  <p className="text-sm text-gray-500">Источник: {selected.sourceName}</p>
                </div>
                <span className={clsx('text-xs px-3 py-1 rounded-full font-medium', statusBadge(selected.status))}>
                  {selected.status}
                </span>
              </div>

              {/* Text */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Текст публикации</label>
                  {!editMode && (
                    <button
                      onClick={() => { setEditMode(true); setEditText(selected.adaptedText); }}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Редактировать
                    </button>
                  )}
                </div>
                {editMode ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      rows={12}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(selected.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {selected.adaptedText}
                  </div>
                )}
              </div>

              {/* Hashtags */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Хештеги</label>
                <div className="flex flex-wrap gap-1.5">
                  {selected.customHashtags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {selected.ctaText && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">CTA</label>
                  <p className="text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg">{selected.ctaText}</p>
                </div>
              )}

              {/* Moderation comment */}
              {selected.moderationComment && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Комментарий модератора</label>
                  <p className="text-sm text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    {selected.moderationComment}
                  </p>
                </div>
              )}

              {/* Comment input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Комментарий модератора..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {selected.status === 'DRAFT' && (
                  <>
                    <button
                      onClick={() => handleApprove(selected.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(selected.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Отклонить
                    </button>
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" /> Запланировать
                    </button>
                  </>
                )}
                {selected.status === 'APPROVED' && (
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Запланировать публикацию
                  </button>
                )}
                {selected.status === 'REJECTED' && (
                  <button
                    onClick={() => handleApprove(selected.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Переодобрить
                  </button>
                )}
                {selected.status === 'PUBLISHED' && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Eye className="w-4 h-4" /> Опубликовано
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Edit3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Выберите публикацию для модерации</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Запланировать публикацию</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Дата</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Время</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Запланировать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
