import { useAppStore } from '../store/useAppStore';
import { Calendar, Clock, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const timeSlots = ['09:00', '11:00', '13:00', '15:00', '18:00', '20:00'];

export default function Scheduler() {
  const { schedules, preparedPublications, setNotification } = useAppStore();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedDate, setSelectedDate] = useState('2026-01-15');

  const getPrepared = (id: string) => preparedPublications.find(p => p.id === id);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'border-green-200 bg-green-50';
      case 'FAILED': return 'border-red-200 bg-red-50';
      case 'PUBLISHING': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Планировщик</h1>
          <p className="text-sm text-gray-500 mt-1">Расписание публикаций по слотам</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium', viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600')}
          >
            Список
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium', viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600')}
          >
            Календарь
          </button>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Добавить слот
          </button>
        </div>
      </div>

      {/* Time Slots Config */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Слоты публикаций</h3>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map(slot => (
            <div key={slot} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{slot}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Минимальный интервал между постами: 2 часа • Лимит в день: 6 публикаций</p>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const prepared = getPrepared(schedule.preparedPublicationId);
            return (
              <div key={schedule.id} className={clsx('bg-white rounded-xl border p-5', statusColor(schedule.status))}>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">{new Date(schedule.scheduledAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    <span className="text-lg font-bold text-gray-800">{new Date(schedule.scheduledAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(schedule.status)}
                      <span className="text-sm font-medium text-gray-800">{prepared?.title || 'Публикация'}</span>
                    </div>
                    <p className="text-xs text-gray-500">Источник: {prepared?.sourceName}</p>
                    {schedule.errorMessage && (
                      <p className="text-xs text-red-600 mt-1">Ошибка: {schedule.errorMessage}</p>
                    )}
                    {schedule.publishedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Опубликовано: {new Date(schedule.publishedAt).toLocaleString('ru-RU')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      schedule.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                      schedule.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    )}>
                      {schedule.status}
                    </span>
                    {schedule.retryCount > 0 && (
                      <span className="text-xs text-orange-600">Попыток: {schedule.retryCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Январь 2026</h3>
            <div className="flex gap-1">
              {['13', '14', '15', '16', '17'].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(`2026-01-${day}`)}
                  className={clsx(
                    'w-8 h-8 rounded-lg text-xs font-medium',
                    selectedDate === `2026-01-${day}` ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {timeSlots.map(slot => {
              const slotSchedule = schedules.find(s =>
                new Date(s.scheduledAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) === slot
              );
              const prepared = slotSchedule ? getPrepared(slotSchedule.preparedPublicationId) : null;
              return (
                <div key={slot} className={clsx(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  slotSchedule ? 'border-blue-200 bg-blue-50' : 'border-dashed border-gray-200'
                )}>
                  <span className="text-sm font-mono text-gray-500 w-12">{slot}</span>
                  {prepared ? (
                    <div className="flex-1 flex items-center gap-2">
                      {statusIcon(slotSchedule!.status)}
                      <span className="text-sm text-gray-700">{prepared.title}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Свободно</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
