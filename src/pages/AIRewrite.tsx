import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, RefreshCw, Copy, Check, ArrowRight, Settings2, Zap, Brain, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

type AIModel = 'gpt4' | 'gpt35' | 'claude' | 'yandexgpt' | 'gigachat';

interface AIModelConfig {
  id: AIModel;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxTokens: number;
}

const aiModels: AIModelConfig[] = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    description: 'Самая мощная модель OpenAI',
    icon: '🧠',
    color: 'from-green-500 to-emerald-600',
    maxTokens: 8192
  },
  {
    id: 'gpt35',
    name: 'GPT-3.5',
    description: 'Быстрая и экономичная',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-600',
    maxTokens: 4096
  },
  {
    id: 'claude',
    name: 'Claude 3',
    description: 'Anthropic — отличный для текстов',
    icon: '🎭',
    color: 'from-purple-500 to-pink-600',
    maxTokens: 100000
  },
  {
    id: 'yandexgpt',
    name: 'YandexGPT',
    description: 'Лучше понимает русский контекст',
    icon: '🇷🇺',
    color: 'from-red-500 to-orange-600',
    maxTokens: 8000
  },
  {
    id: 'gigachat',
    name: 'GigaChat',
    description: 'Сбер — оптимизирован для бизнеса',
    icon: '💼',
    color: 'from-indigo-500 to-blue-600',
    maxTokens: 4000
  }
];

type RewriteStyle = 'informative' | 'engaging' | 'analytical' | 'casual' | 'professional';

const rewriteStyles = [
  { id: 'informative' as RewriteStyle, name: 'Информативный', emoji: '📰', description: 'Чётко и по делу' },
  { id: 'engaging' as RewriteStyle, name: 'Вовлекающий', emoji: '🔥', description: 'Эмоции и CTA' },
  { id: 'analytical' as RewriteStyle, name: 'Аналитический', emoji: '🔍', description: 'Глубокий разбор' },
  { id: 'casual' as RewriteStyle, name: 'Разговорный', emoji: '💬', description: 'Простой язык' },
  { id: 'professional' as RewriteStyle, name: 'Профессиональный', emoji: '💼', description: 'Деловой стиль' }
];

export default function AIRewrite() {
  const { publications, setNotification } = useAppStore();
  const [selectedPublication, setSelectedPublication] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt4');
  const [selectedStyle, setSelectedStyle] = useState<RewriteStyle>('engaging');
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [copied, setCopied] = useState(false);

  const selected = publications.find(p => p.id === selectedPublication);
  const currentModel = aiModels.find(m => m.id === selectedModel)!;

  const handleRewrite = async () => {
    if (!selected) return;

    setIsGenerating(true);
    setRewrittenText('');

    // Имитация генерации
    const mockResults: Record<AIModel, Record<RewriteStyle, string>> = {
      gpt4: {
        informative: `📱 ${selected.title}\n\n${selected.bodyText.slice(0, 200)}...\n\nКлючевые моменты:\n• Главное событие произошло сегодня\n• Эксперты уже оценили последствия\n• Рынок отреагировал позитивно\n\n#новости #технологии`,
        engaging: `🔥 ${selected.title}\n\nЭто просто БОМБА! 💣\n\n${selected.bodyText.slice(0, 150)}...\n\nЧто это значит для вас?\n✅ Новые возможности\n✅ Экономия времени\n✅ Прорыв в индустрии\n\nУже тестируете? Делитесь впечатлениями! 👇\n\n#хайп #тренды`,
        analytical: `🔬 Глубокий анализ: ${selected.title}\n\n${selected.bodyText.slice(0, 180)}...\n\nКонтекст:\nЭто событие вписывается в общий тренд развития отрасли. За последние 6 месяцев мы наблюдаем ускорение процессов...\n\nПрогноз:\nОжидаем дальнейшее развитие ситуации в ближайшие недели.\n\n#аналитика #прогноз`,
        casual: `Привет! 👋\n\nТут такое дело — ${selected.title.toLowerCase()}\n\nКороче, ${selected.bodyText.slice(0, 150).toLowerCase()}...\n\nВ общем, штука интересная. Посмотрим, что будет дальше 🤷‍♂️\n\n#жиза #новости`,
        professional: `${selected.title}\n\nУважаемые коллеги,\n\nСообщаем о значимом событии: ${selected.bodyText.slice(0, 200)}...\n\nДанное событие имеет стратегическое значение для отрасли. Рекомендуем обратить внимание на следующие аспекты:\n\n1. Операционные последствия\n2. Рыночные эффекты\n3. Долгосрочные перспективы\n\nС уважением,\nРедакция\n\n#бизнес #стратегия`
      },
      gpt35: {
        informative: `📰 ${selected.title}\n\n${selected.bodyText.slice(0, 180)}...\n\nОсновные факты:\n• Событие произошло сегодня\n• Затронет многих пользователей\n• Реакция рынка положительная\n\n#новости`,
        engaging: `⚡ ${selected.title}\n\nВау! Только что случилось нечто крутое!\n\n${selected.bodyText.slice(0, 150)}...\n\nЭто реально меняет правила игры! 🎮\n\nКто уже в теме? Ставьте ❤️\n\n#круто #тренды`,
        analytical: `📊 Анализ: ${selected.title}\n\n${selected.bodyText.slice(0, 160)}...\n\nЧто важно:\n→ Контекст события\n→ Возможные последствия\n→ Что делать дальше\n\n#аналитика`,
        casual: `Йоу! ${selected.title}\n\nКороче, ${selected.bodyText.slice(0, 140).toLowerCase()}...\n\nНу такое, посмотрим че будет 😎\n\n#жиза`,
        professional: `${selected.title}\n\nИнформируем вас о следующем: ${selected.bodyText.slice(0, 180)}...\n\nРекомендуем принять к сведению.\n\n#бизнес`
      },
      claude: {
        informative: `📝 ${selected.title}\n\n${selected.bodyText.slice(0, 200)}...\n\nКлючевые аспекты:\n• Фактическая сторона события\n• Контекст и предыстория\n• Потенциальное влияние\n\nПодробности в источнике.\n\n#факты #новости`,
        engaging: `✨ ${selected.title}\n\nПредставьте: ${selected.bodyText.slice(0, 150).toLowerCase()}...\n\nЗвучит как начало захватывающей истории, не так ли? 📖\n\nЧто дальше? Следите за развитием событий!\n\n#история #интересно`,
        analytical: `🎯 ${selected.title}: взгляд в глубину\n\n${selected.bodyText.slice(0, 180)}...\n\nМногомерный анализ:\n\n1️⃣ Технический аспект\n2️⃣ Социальное влияние\n3️⃣ Экономические последствия\n4️⃣ Долгосрочные тренды\n\nКаждый из этих аспектов заслуживает отдельного внимания.\n\n#глубокий_анализ`,
        casual: `Слушайте, ${selected.title.toLowerCase()}\n\n${selected.bodyText.slice(0, 150).toLowerCase()}...\n\nЧестно? Это интересно. Давайте обсудим в комментариях 💭\n\n#обсудим`,
        professional: `Уважаемые читатели,\n\n${selected.title}\n\n${selected.bodyText.slice(0, 200)}...\n\nС уважением к вашему времени, представляем структурированный обзор ситуации с рекомендациями для дальнейших действий.\n\n#профессионально`
      },
      yandexgpt: {
        informative: `📰 ${selected.title}\n\n${selected.bodyText.slice(0, 190)}...\n\nВажно знать:\n• Основные факты\n• Контекст события\n• Что дальше\n\n#новости #важно`,
        engaging: `🔥 ${selected.title}\n\nРебята, это просто огонь! 💥\n\n${selected.bodyText.slice(0, 150)}...\n\nКто не в курсе — срочно читайте! 📚\n\nСтавьте лайк, если согласны! 👍\n\n#топ #огонь`,
        analytical: `🔍 Разбираемся: ${selected.title}\n\n${selected.bodyText.slice(0, 170)}...\n\nДавайте по полочкам:\n\n📌 Что произошло?\n📌 Почему это важно?\n📌 Что это значит для нас?\n\n#разбор #аналитика`,
        casual: `Короче, ${selected.title.toLowerCase()}\n\n${selected.bodyText.slice(0, 140).toLowerCase()}...\n\nНу че, бывает 🤷‍♂️\n\n#жиза #новости`,
        professional: `Коллеги,\n\nДоводим до вашего сведения: ${selected.title}\n\n${selected.bodyText.slice(0, 180)}...\n\nПросим учесть в работе.\n\n#деловое #инфо`
      },
      gigachat: {
        informative: `ℹ️ ${selected.title}\n\n${selected.bodyText.slice(0, 185)}...\n\nКлючевые моменты:\n✓ Факты\n✓ Контекст\n✓ Перспективы\n\n#информация #новости`,
        engaging: `🚀 ${selected.title}\n\nВнимание! Важная новость!\n\n${selected.bodyText.slice(0, 150)}...\n\nЭто меняет всё! 💫\n\nПрисоединяйтесь к обсуждению! 💬\n\n#важно #обсуждение`,
        analytical: `📈 ${selected.title}: бизнес-взгляд\n\n${selected.bodyText.slice(0, 175)}...\n\nБизнес-импликация:\n• Влияние на рынок\n• Возможности для компаний\n• Риски и вызовы\n\n#бизнес #аналитика`,
        casual: `Слушайте, ${selected.title.toLowerCase()}\n\n${selected.bodyText.slice(0, 145).toLowerCase()}...\n\nИнтересная штука, да? 😊\n\n#интересно`,
        professional: `Уважаемые партнёры,\n\nИнформируем о следующем событии: ${selected.title}\n\n${selected.bodyText.slice(0, 190)}...\n\nРекомендуем рассмотреть возможности сотрудничества.\n\n#партнёрство #бизнес`
      }
    };

    // Симуляция задержки генерации
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = mockResults[selectedModel][selectedStyle];
    
    // Постепенное появление текста
    const words = result.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      currentText += (i === 0 ? '' : ' ') + words[i];
      setRewrittenText(currentText);
    }

    setIsGenerating(false);
    setNotification({ type: 'success', message: `Текст переписан с помощью ${currentModel.name}` });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
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
          <p className="text-sm text-gray-500 mt-1">Перепишите новости с помощью нейросетей</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Selection */}
        <div className="space-y-4">
          {/* Publication Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">1. Выберите новость</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {publications.slice(0, 6).map(pub => (
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
                  <p className="text-xs text-gray-500 mt-1">{pub.sourceName}</p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">2. Выберите AI модель</h3>
            <div className="space-y-2">
              {aiModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={clsx(
                    'w-full text-left p-3 rounded-lg border transition-all',
                    selectedModel === model.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{model.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{model.name}</p>
                      <p className="text-xs text-gray-500">{model.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">3. Стиль рерайта</h3>
            <div className="grid grid-cols-1 gap-2">
              {rewriteStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={clsx(
                    'p-3 rounded-lg border transition-all text-left',
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
        </div>

        {/* Middle Panel - Original Text */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Оригинальный текст</h3>
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Источник: {selected.sourceName}</p>
                <h4 className="text-base font-semibold text-gray-900 mb-2">{selected.title}</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {selected.bodyText}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Выберите новость для рерайта</p>
            </div>
          )}
        </div>

        {/* Right Panel - Result */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Результат рерайта</h3>
            {rewrittenText && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                {copied ? <><Check className="w-3 h-3" /> Скопировано</> : <><Copy className="w-3 h-3" /> Копировать</>}
              </button>
            )}
          </div>

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm text-gray-600 mt-4">Генерация текста...</p>
              <p className="text-xs text-gray-400 mt-1">{currentModel.name} • {rewriteStyles.find(s => s.id === selectedStyle)?.name}</p>
            </div>
          ) : rewrittenText ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-purple-100">
                {rewrittenText}
              </div>
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
              <p className="text-sm">Здесь появится результат</p>
            </div>
          )}

          {/* Generate Button */}
          {selected && !isGenerating && !rewrittenText && (
            <button
              onClick={handleRewrite}
              className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Переписать с помощью {currentModel.name}
            </button>
          )}

          {/* Advanced Settings */}
          <div className="mt-4 border-t pt-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <Settings2 className="w-4 h-4" />
              Расширенные настройки
            </button>
            {showSettings && (
              <div className="mt-3 space-y-3">
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
                    max={currentModel.maxTokens}
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
            )}
          </div>
        </div>
      </div>

      {/* Info Block */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Как работает AI рерайт
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">1. Анализ оригинала</p>
            <p className="text-purple-100">AI изучает структуру, ключевые факты и контекст новости</p>
          </div>
          <div>
            <p className="font-medium mb-1">2. Генерация текста</p>
            <p className="text-purple-100">Создаёт новый текст в выбранном стиле с сохранением смысла</p>
          </div>
          <div>
            <p className="font-medium mb-1">3. Адаптация</p>
            <p className="text-purple-100">Добавляет эмодзи, хештеги и CTA под ваш канал</p>
          </div>
        </div>
      </div>
    </div>
  );
}
