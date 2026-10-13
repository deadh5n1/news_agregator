import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Key, Save, Check, AlertCircle, Eye, EyeOff, TestTube, Loader } from 'lucide-react';
import clsx from 'clsx';

interface AIProviderConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  apiKey: string;
  model: string;
  enabled: boolean;
  baseUrl?: string;
}

export default function AISettings() {
  const { setNotification } = useAppStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, 'success' | 'error' | null>>({});

  // Загружаем настройки из localStorage
  const [providers, setProviders] = useState<AIProviderConfig[]>(() => {
    const saved = localStorage.getItem('ai-providers-config');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT-4, GPT-3.5',
        icon: '🧠',
        color: 'from-green-500 to-emerald-600',
        apiKey: '',
        model: 'gpt-4-turbo-preview',
        enabled: false,
        baseUrl: 'https://api.openai.com/v1'
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Claude 3 Opus, Sonnet, Haiku',
        icon: '🎭',
        color: 'from-purple-500 to-pink-600',
        apiKey: '',
        model: 'claude-3-sonnet-20240229',
        enabled: false,
        baseUrl: 'https://api.anthropic.com/v1'
      },
      {
        id: 'deepseek',
        name: 'DeepSeek',
        description: 'DeepSeek V3, R1 (очень дешёвый)',
        icon: '🔮',
        color: 'from-cyan-500 to-blue-600',
        apiKey: '',
        model: 'deepseek-chat',
        enabled: false,
        baseUrl: 'https://api.deepseek.com/v1'
      },
      {
        id: 'openrouter',
        name: 'OpenRouter',
        description: '100+ моделей через один API',
        icon: '🌐',
        color: 'from-orange-500 to-red-600',
        apiKey: '',
        model: 'anthropic/claude-3-sonnet',
        enabled: false,
        baseUrl: 'https://openrouter.ai/api/v1'
      },
      {
        id: 'yandex',
        name: 'YandexGPT',
        description: 'Лучше понимает русский контекст',
        icon: '🇷🇺',
        color: 'from-red-500 to-orange-600',
        apiKey: '',
        model: 'yandexgpt',
        enabled: false,
        baseUrl: 'https://llm.api.cloud.yandex.net'
      },
      {
        id: 'gigachat',
        name: 'GigaChat',
        description: 'Сбер — оптимизирован для бизнеса',
        icon: '💼',
        color: 'from-indigo-500 to-blue-600',
        apiKey: '',
        model: 'GigaChat',
        enabled: false,
        baseUrl: 'https://gigachat.devices.sberbank.ru/api/v1'
      }
    ];
  });

  const handleSave = () => {
    localStorage.setItem('ai-providers-config', JSON.stringify(providers));
    setNotification({ type: 'success', message: 'Настройки AI сохранены' });
  };

  const handleToggle = (id: string) => {
    setProviders(providers.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleUpdate = (id: string, field: keyof AIProviderConfig, value: string) => {
    setProviders(providers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleTest = async (provider: AIProviderConfig) => {
    setTesting(provider.id);
    setTestResult({ ...testResult, [provider.id]: null });

    // Имитация теста (в реальности нужно вызвать backend API)
    setTimeout(() => {
      const success = provider.apiKey.length > 10;
      setTestResult({ ...testResult, [provider.id]: success ? 'success' : 'error' });
      setTesting(null);
      
      if (success) {
        setNotification({ type: 'success', message: `${provider.name}: подключение успешно` });
      } else {
        setNotification({ type: 'error', message: `${provider.name}: неверный API ключ` });
      }
    }, 1500);
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys({ ...showKeys, [id]: !showKeys[id] });
  };

  const enabledCount = providers.filter(p => p.enabled).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки AI</h1>
          <p className="text-sm text-gray-500 mt-1">Конфигурация AI моделей для рерайта новостей</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Активно: <span className="font-semibold text-blue-600">{enabledCount}</span> из {providers.length}
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Сохранить
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Как получить API ключи:</strong>
        </p>
        <ul className="text-xs text-blue-800 mt-2 space-y-1">
          <li>• <strong>OpenAI:</strong> <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com/api-keys</a></li>
          <li>• <strong>Anthropic:</strong> <a href="https://console.anthropic.com/settings/keys" target="_blank" className="underline">console.anthropic.com/settings/keys</a></li>
          <li>• <strong>DeepSeek:</strong> <a href="https://platform.deepseek.com/api_keys" target="_blank" className="underline">platform.deepseek.com/api_keys</a></li>
          <li>• <strong>OpenRouter:</strong> <a href="https://openrouter.ai/keys" target="_blank" className="underline">openrouter.ai/keys</a> (мин. $5)</li>
          <li>• <strong>YandexGPT:</strong> <a href="https://console.cloud.yandex.ru/" target="_blank" className="underline">console.cloud.yandex.ru</a></li>
          <li>• <strong>GigaChat:</strong> <a href="https://developers.sber.ru/studio/workspaces" target="_blank" className="underline">developers.sber.ru/studio/workspaces</a></li>
        </ul>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={clsx(
              'bg-white rounded-xl border p-5 transition-all',
              provider.enabled ? 'border-blue-300 shadow-sm' : 'border-gray-200'
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
                  {provider.enabled && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Активен
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{provider.description}</p>

                {/* Toggle */}
                <div className="flex items-center gap-3 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={provider.enabled}
                      onChange={() => handleToggle(provider.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-sm text-gray-700">
                    {provider.enabled ? 'Включено' : 'Выключено'}
                  </span>
                </div>

                {/* API Key */}
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">API Key</label>
                  <div className="relative">
                    <input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      value={provider.apiKey}
                      onChange={(e) => handleUpdate(provider.id, 'apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => toggleKeyVisibility(provider.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Model */}
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Модель</label>
                  <input
                    type="text"
                    value={provider.model}
                    onChange={(e) => handleUpdate(provider.id, 'model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Base URL */}
                {provider.baseUrl && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Base URL</label>
                    <input
                      type="text"
                      value={provider.baseUrl}
                      onChange={(e) => handleUpdate(provider.id, 'baseUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Test Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTest(provider)}
                    disabled={!provider.apiKey || testing === provider.id}
                    className={clsx(
                      'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2',
                      !provider.apiKey || testing === provider.id
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

                  {testResult[provider.id] === 'success' && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Подключение работает
                    </span>
                  )}
                  {testResult[provider.id] === 'error' && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Ошибка подключения
                    </span>
                  )}
                </div>
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
