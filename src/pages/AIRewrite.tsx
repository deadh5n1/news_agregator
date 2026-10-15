import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, Play, RefreshCw, Copy, Check, ArrowRight, Settings, Zap, Brain, MessageSquare, Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

type AIModel = 'openai' | 'anthropic' | 'deepseek' | 'openrouter' | 'yandex' | 'gigachat';
type RewriteStyle = 'informative' | 'engaging' | 'analytical' | 'casual' | 'professional';

interface AIProviderConfig {
  id: string;
  name: string;
  icon: string;
  apiKey: string;
  model: string;
  enabled: boolean;
}

const rewriteStyles = [
  { id: 'informative' as RewriteStyle, name: 'Информативный', emoji: '📰', description: 'Чётко и по делу' },
  { id: 'engaging' as RewriteStyle, name: 'Вовлекающий', emoji: '🔥', description: 'Эмоции и CTA' },
  { id: 'analytical' as RewriteStyle, name: 'Аналитический', emoji: '🔍', description: 'Глубокий разбор' },
  { id: 'casual' as RewriteStyle, name: 'Разговорный', emoji: '💬', description: 'Простой язык' },
  { id: 'professional' as RewriteStyle, name: 'Профессиональный', emoji: '💼', description: 'Деловой стиль' }
];

export default function AIRewrite() {
  const { publications, setNotification } = useAppStore();
  
  // State
  const [selectedPublication, setSelectedPublication] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>('deepseek');
  const [selectedStyle, setSelectedStyle] = useState<RewriteStyle>('engaging');
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const selected = publications.find(p => p.id === selectedPublication);
  const currentProvider = providers.find(p => p.id === selectedModel);

  // Load AI providers config
  useEffect(() => {
    const saved = localStorage.getItem('ai-providers-config');
    if (saved) {
      setProviders(JSON.parse(saved));
    } else {
      // Default providers
      setProviders([
        { id: 'openai', name: 'OpenAI', icon: '🧠', apiKey: '', model: 'gpt-4-turbo-preview', enabled: false },
        { id: 'anthropic', name: 'Anthropic', icon: '🎭', apiKey: '', model: 'claude-3-sonnet-20240229', enabled: false },
        { id: 'deepseek', name: 'DeepSeek', icon: '🔮', apiKey: '', model: 'deepseek-chat', enabled: true },
        { id: 'openrouter', name: 'OpenRouter', icon: '🌐', apiKey: '', model: 'anthropic/claude-3-sonnet', enabled: false },
        { id: 'yandex', name: 'YandexGPT', icon: '🇷🇺', apiKey: '', model: 'yandexgpt', enabled: false },
        { id: 'gigachat', name: 'GigaChat', icon: '💼', apiKey: '', model: 'GigaChat', enabled: false },
      ]);
    }
  }, []);

  // Update original text when publication changes
  useEffect(() => {
    if (selected) {
      setOriginalText(selected.bodyText);
      setRewrittenText('');
      setGenerationProgress(0);
    }
  }, [selectedPublication]);

  const enabledProviders = providers.filter(p => p.enabled);

  const handleRewrite = async () => {
    if (!selected) {
      setNotification({ type: 'error', message: 'Выберите новость для рерайта' });
      return;
    }

    setIsGenerating(true);
    setRewrittenText('');
    setGenerationProgress(0);

    try {
      // Вызов backend API для рерайта
      // В реальности здесь должен быть вызов с авторизацией
      // const token = localStorage.getItem('auth-token');
      // const response = await fetch('/api/ai/rewrite', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     text: originalText,
      //     provider: selectedModel,
      //     style: selectedStyle,
      //     options: { temperature, maxTokens, customPrompt }
      //   })
      // });
      // 
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'AI rewrite failed');
      // }
      // 
      // const data = await response.json();
      // setRewrittenText(data.rewrittenText);

      // ДЕМО: Имитация генерации с прогрессом
      // Удалить этот блок когда backend будет готов
      const mockResult = generateMockResult(selected, selectedStyle);
      const words = mockResult.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        currentText += (i === 0 ? '' : ' ') + words[i];
        setRewrittenText(currentText);
        setGenerationProgress(Math.round((i / words.length) * 100));
      }

      setNotification({ type: 'success', message: `Рерайт завершён с помощью ${currentProvider?.name || 'AI'}` });
    } catch (error: any) {
      setNotification({ type: 'error', message: `Ошибка: ${error.message}` });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  };

  const generateMockResult = (pub: any, style: RewriteStyle): string => {
    const templates: Record<RewriteStyle, string> = {
      informative: `📰 ${pub.title}\n\n${pub.bodyText.slice(0, 200)}...\n\nКлючевые факты:\n• Главное событие\n• Контекст ситуации\n• Возможные последствия\n\n#новости #факты`,
      engaging: `🔥 ${pub.title}\n\nЭто просто БОМБА! 💣\n\n${pub.bodyText.slice(0, 150)}...\n\nЧто это значит для вас?\n✅ Новые возможности\n✅ Важные изменения\n\nУже в курсе? Делитесь мнением! 👇\n\n#тренды #важно`,
      analytical: `🔬 Глубокий анализ: ${pub.title}\n\n${pub.bodyText.slice(0, 180)}...\n\nКонтекст:\nЭто событие вписывается в общий тренд. За последние месяцы наблюдаем ускорение процессов...\n\nПрогноз:\nОжидаем дальнейшее развитие ситуации.\n\n#аналитика #прогноз`,
      casual: `Привет! 👋\n\nТут такое дело — ${pub.title.toLowerCase()}\n\nКороче, ${pub.bodyText.slice(0, 150).toLowerCase()}...\n\nВ общем, штука интересная. Посмотрим, что будет дальше 🤷‍♂️\n\n#жиза #новости`,
      professional: `${pub.title}\n\nУважаемые коллеги,\n\nСообщаем о значимом событии: ${pub.bodyText.slice(0, 200)}...\n\nДанное событие имеет стратегическое значение. Рекомендуем обратить внимание.\n\nС уважением,\nРедакция\n\n#бизнес #стратегия`
    };
    return templates[style];
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-purple-600" />
            AI Рерайт новостей
          </h1>
          <p className="text-sm text-gray-500 mt-1">Ручной запуск рерайта с просмотром до/после</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <Settings className="w-4 h-4" /> Настройки AI
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Быстрая настройка</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">AI Модель</label>
              <div className="space-y-2">
                {providers.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => provider.enabled && setSelectedModel(provider.id as AIModel)}
                    disabled={!provider.enabled}
                    className={clsx(
                      'w-full text-left p-3 rounded-lg border transition-all',
                      selectedModel === provider.id
                        ? 'border-purple-300 bg-purple-50'
                        : provider.enabled
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{provider.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.model}</p>
                      </div>
                      {provider.enabled && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                  </button>
                ))}
              </div>
              {enabledProviders.length === 0 && (
                <p className="text-xs text-yellow-600 mt-2">
                  ⚠️ Нет активных моделей. Настройте API ключи в разделе "Настройки AI"
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Параметры генерации</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Temperature: {temperature}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400">Выше = креативнее, ниже = точнее</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Max tokens: {maxTokens}</label>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Дополнительный промпт</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Например: Добавь больше эмодзи..."
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Text */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Оригинал (ДО обработки)
            </h3>
            {originalText && (
              <button
                onClick={() => handleCopy(originalText)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Копировать
              </button>
            )}
          </div>

          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Источник: {selected.sourceName}</p>
                <h4 className="text-base font-semibold text-gray-900 mb-2">{selected.title}</h4>
              </div>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={15}
                placeholder="Текст новости..."
              />
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Выберите новость из списка справа</p>
            </div>
          )}
        </div>

        {/* Right: Rewritten Text */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Результат (ПОСЛЕ обработки)
            </h3>
            {rewrittenText && (
              <button
                onClick={() => handleCopy(rewrittenText)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {copied ? <><Check className="w-3 h-3" /> Скопировано</> : <><Copy className="w-3 h-3" /> Копировать</>}
              </button>
            )}
          </div>

          {isGenerating ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                  <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-gray-600 mt-4">Генерация текста...</p>
                <p className="text-xs text-gray-400 mt-1">{currentProvider?.name} • {rewriteStyles.find(s => s.id === selectedStyle)?.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Прогресс</span>
                  <span className="text-xs font-medium text-purple-600">{generationProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
              </div>
              {rewrittenText && (
                <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-purple-100 max-h-64 overflow-y-auto">
                  {rewrittenText}
                </div>
              )}
            </div>
          ) : rewrittenText ? (
            <div className="space-y-4">
              <textarea
                value={rewrittenText}
                onChange={(e) => setRewrittenText(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-sm text-gray-700 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={15}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRewrite}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Переписать
                </button>
                <button
                  onClick={() => setNotification({ type: 'success', message: 'Добавлено в очередь модерации' })}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> В модерацию
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Здесь появится результат рерайта</p>
              <p className="text-xs text-gray-400 mt-1">Нажмите "Запустить рерайт" ниже</p>
            </div>
          )}
        </div>
      </div>

      {/* Publications List & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publications List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Выберите новость для рерайта</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {publications.slice(0, 10).map(pub => (
              <button
                key={pub.id}
                onClick={() => setSelectedPublication(pub.id)}
                className={clsx(
                  'w-full text-left p-3 rounded-lg border transition-all',
                  selectedPublication === pub.id
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <p className="text-sm font-medium text-gray-800 truncate">{pub.title}</p>
                <p className="text-xs text-gray-500 mt-1">{pub.sourceName} • {pub.bodyText.slice(0, 80)}...</p>
              </button>
            ))}
          </div>
        </div>

        {/* Style & Launch */}
        <div className="space-y-4">
          {/* Style Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Стиль рерайта</h3>
            <div className="space-y-2">
              {rewriteStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={clsx(
                    'w-full p-3 rounded-lg border transition-all text-left',
                    selectedStyle === style.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{style.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{style.name}</p>
                      <p className="text-xs text-gray-500">{style.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleRewrite}
            disabled={!selected || isGenerating || !currentProvider?.apiKey}
            className={clsx(
              'w-full px-4 py-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all',
              !selected || isGenerating || !currentProvider?.apiKey
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            )}
          >
            {isGenerating ? (
              <><Loader className="w-5 h-5 animate-spin" /> Обработка...</>
            ) : (
              <><Play className="w-5 h-5" /> Запустить рерайт</>
            )}
          </button>

          {!currentProvider?.apiKey && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Настройте API ключ для {currentProvider?.name || 'выбранной модели'} в настройках</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
