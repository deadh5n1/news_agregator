import { useAppStore } from '../store/useAppStore';
import { FileEdit, Plus, Eye, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Templates() {
  const { templates } = useAppStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selected = templates.find(t => t.id === selectedTemplate);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Шаблоны публикаций</h1>
          <p className="text-sm text-gray-500 mt-1">Структура и формат адаптации постов</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Новый шаблон
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={clsx(
                'w-full text-left p-4 rounded-xl border transition-all',
                selectedTemplate === template.id
                  ? 'border-blue-300 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileEdit className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">{template.name}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{template.structure}</p>
              <div className="mt-2">
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded-full',
                  template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                )}>
                  {template.isActive ? 'Активен' : 'Неактивен'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Template Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                <button
                  onClick={() => handleCopy(selected.structure, selected.id)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                >
                  {copiedId === selected.id ? <><Check className="w-3 h-3 text-green-600" /> Скопировано</> : <><Copy className="w-3 h-3" /> Копировать</>}
                </button>
              </div>

              {/* Structure */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Структура шаблона</label>
                <div className="bg-gray-900 rounded-lg p-4 text-sm text-green-400 font-mono whitespace-pre-wrap">
                  {selected.structure}
                </div>
              </div>

              {/* Placeholders */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Плейсхолдеры</label>
                <div className="flex flex-wrap gap-2">
                  {['{emoji}', '{заголовок}', '{ключевые факты}', '{контекст}', '{CTA}', '{хештеги}', '{дата}'].map(ph => (
                    <span key={ph} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded font-mono">{ph}</span>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Пример</label>
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-blue-100">
                  {selected.example}
                </div>
              </div>

              {/* Emoji picker hint */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Совет:</strong> Эмодзи подбираются автоматически по категории новости:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs text-yellow-700">
                  <span>🔬 Наука</span>
                  <span>💰 Бизнес</span>
                  <span>🏒 Спорт</span>
                  <span>🤖 Технологии</span>
                  <span>🏛️ Политика</span>
                  <span>🎭 Культура</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileEdit className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Выберите шаблон для просмотра</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
