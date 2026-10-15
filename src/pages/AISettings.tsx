import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Key, Save, Check, AlertCircle, Eye, EyeOff, TestTube, Loader, Info } from 'lucide-react';
import clsx from 'clsx';

interface AIProviderStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  configured: boolean;
}

export default function AISettings() {
  const { setNotification } = useAppStore();
  const [providers, setProviders] = useState<AIProviderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      // В реальности здесь должен быть вызов backend API
      // const response = await fetch('/api/ai/providers', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Демо-данные
      setProviders([
        {
          id: 'openai',
          name: 'OpenAI',
          description: 'GPT-4, GPT-3.5',
          icon: '🧠',
          color: 'from-green-500 to-emerald-600',
          enabled: false,
          configured: false,
        },
        {
          id: 'anthropic',
          name: 'Anthropic',
          description: 'Claude 3 Opus, Sonnet, Haiku',
          icon: '🎭',
          color: 'from-purple-500 to-pink-600',
          enabled: false,
          configured: false,
        },
        {
          id: 'deepseek',
          name: 'DeepSeek',
          description: 'DeepSeek V3, R1 (очень дешёвый)',
          icon: '🔮',
          color: 'from-cyan-500 to-blue-600',
          enabled: true,
          configured: true,
        },
        {
          id: 'openrouter',
          name: 'OpenRouter',
          description: '100+ моделей через один API',
          icon: '🌐',
          color: 'from-orange-500 to-red-600',
          enabled: false,
          configured: false,
        },
        {
          id: 'yandex',
          name: 'YandexGPT',
          description: 'Лучше понимает русский контекст',
          icon: '🇷🇺',
          color: 'from-red-500 to-orange-600',
          enabled: false,
          configured: false,
        },
        {
          id: 'gigachat',
          name: 'GigaChat',
          description: 'Сбер — оптимизирован для бизнеса',
          icon: '💼',
          color: 'from-indigo-500 to-blue-600',
          enabled: false,
          configured: false,
        }
      ]);
    } catch (error) {
      setNotification({ type: 'error', message: 'Не удалось загрузить настройки AI' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (providerId: string) => {
    setTesting(providerId);

    try {
      // В реальности здесь должен быть вызов backend API
      // const response = await fetch('/api/ai/test-connection', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ provider: providerId })
      // });
      // const data = await response.json();

      // Имитация теста
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setNotification({ type: 'success', message: 'Тест подключения: OK' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Ошибка подключения' });
    } finally {
      setTesting(null);
    }
  };

  const enabledCount = providers.filter(p => p.enabled && p.configured).length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки AI</h1>
          <p className="text-sm text-gray-500 mt-1">Статус подключения AI провайдеров</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Активно: <span className="font-semibold text-blue-600">{enabledCount}</span> из {providers.length}
          </span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Безопасность API ключей</p>
            <p className="text-xs text-blue-800 mt-1">
              API ключи хранятся только на сервере в защищённых переменных окружения. 
              Для настройки провайдеров обратитесь к администратору сервера или отредактируйте файл <code className="bg-blue-100 px-1 rounded">.env</code> на backend.
            </p>
            <p className="text-xs text-blue-800 mt-2">
              <strong>Как настроить:</strong> Откройте файл <code className="bg-blue-100 px-1 rounded">.env</code> на сервере и добавьте ключи:
            </p>
            <ul className="text-xs text-blue-800 mt-1 ml-4 list-disc">
              <li><code>OPENAI_API_KEY=sk-...</code></li>
              <li><code>ANTHROPIC_API_KEY=sk-ant-...</code></li>
              <li><code>DEEPSEEK_API_KEY=sk-...</code></li>
              <li><code>OPENROUTER_API_KEY=sk-or-...</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={clsx(
              'bg-white rounded-xl border p-5 transition-all',
              provider.enabled && provider.configured ? 'border-green-300 shadow-sm' : 'border-gray-200'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={clsx(
                'w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center flex-shrink-0',
                provider.color
              )}>
                <span className="text-2xl">{provider.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                  {provider.enabled && provider.configured ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Подключено
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      Не настроено
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

                {/* Status */}
                <div className="flex items-center gap-3 mb-4">
                  {provider.configured ? (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> API ключ настроен на сервере
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Требуется настройка в .env
                    </span>
                  )}
                </div>

                {/* Test Button */}
                {provider.configured && (
                  <button
                    onClick={() => handleTest(provider.id)}
                    disabled={testing === provider.id}
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2',
                      testing === provider.id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    )}
                  >
                    {testing === provider.id ? (
                      <><Loader className="w-4 h-4 animate-spin" /> Тестирование...</>
                    ) : (
                      <><TestTube className="w-4 h-4" /> Тест подключения</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">Рекомендации</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">💰 Экономия бюджета</p>
            <p className="text-purple-100">Используйте DeepSeek V3 — в 100 раз дешевле GPT-4 при отличном качестве</p>
          </div>
          <div>
            <p className="font-medium mb-1">🎯 Максимальное качество</p>
            <p className="text-purple-100">GPT-4 или Claude 3 Opus для важных публикаций</p>
          </div>
          <div>
            <p className="font-medium mb-1">🔄 Гибкость</p>
            <p className="text-purple-100">OpenRouter — доступ ко всем моделям через один API</p>
          </div>
          <div>
            <p className="font-medium mb-1">🇷🇺 Русский контекст</p>
            <p className="text-purple-100">YandexGPT или DeepSeek лучше понимают русский язык</p>
          </div>
        </div>
      </div>
    </div>
  );
}
