import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios, { AxiosError } from 'axios';
import { AIProvider, RewriteStyle } from './dto/rewrite.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly TIMEOUT = 30000; // 30 секунд

  constructor(private prisma: PrismaService) {}

  async rewrite(
    text: string,
    provider: AIProvider,
    style: RewriteStyle,
    options?: { temperature?: number; maxTokens?: number; customPrompt?: string; model?: string },
  ) {
    if (!text || text.length < 10) {
      throw new BadRequestException('Text too short (minimum 10 characters)');
    }

    const startTime = Date.now();
    let result = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let success = false;
    let errorMessage: string | undefined;
    let usedModel = options?.model || 'default';

    try {
      switch (provider) {
        case AIProvider.OPENAI:
          const openaiResult = await this.rewriteWithOpenAI(text, style, options);
          result = openaiResult.text;
          inputTokens = openaiResult.inputTokens;
          outputTokens = openaiResult.outputTokens;
          usedModel = openaiResult.model;
          break;
        case AIProvider.ANTHROPIC:
          const anthropicResult = await this.rewriteWithAnthropic(text, style, options);
          result = anthropicResult.text;
          inputTokens = anthropicResult.inputTokens;
          outputTokens = anthropicResult.outputTokens;
          usedModel = anthropicResult.model;
          break;
        case AIProvider.DEEPSEEK:
          const deepseekResult = await this.rewriteWithDeepSeek(text, style, options);
          result = deepseekResult.text;
          inputTokens = deepseekResult.inputTokens;
          outputTokens = deepseekResult.outputTokens;
          usedModel = deepseekResult.model;
          break;
        case AIProvider.OPENROUTER:
          const openrouterResult = await this.rewriteWithOpenRouter(text, style, options);
          result = openrouterResult.text;
          inputTokens = openrouterResult.inputTokens;
          outputTokens = openrouterResult.outputTokens;
          usedModel = openrouterResult.model;
          break;
        case AIProvider.YANDEX:
          const yandexResult = await this.rewriteWithYandex(text, style, options);
          result = yandexResult.text;
          inputTokens = yandexResult.inputTokens;
          outputTokens = yandexResult.outputTokens;
          usedModel = yandexResult.model;
          break;
        case AIProvider.GIGACHAT:
          throw new BadRequestException('GigaChat integration requires additional setup');
        default:
          throw new BadRequestException(`Unsupported provider: ${provider}`);
      }
      success = true;
    } catch (error: any) {
      errorMessage = error.message;
      this.logger.error(`AI rewrite failed: ${errorMessage}`, error.stack);
      throw error;
    } finally {
      const latency = Date.now() - startTime;
      
      // Логируем использование AI (не блокируем основной поток)
      this.prisma.aIUsage.create({
         {
          id: uuidv4(),
          userId: 'system', // В реальности брать из JWT
          provider,
          model: usedModel,
          inputTokens,
          outputTokens,
          cost: this.calculateCost(provider, usedModel, inputTokens, outputTokens),
          latency,
          success,
          errorMessage,
        },
      }).catch(err => {
        this.logger.error('Failed to log AI usage', err);
      });
    }

    return {
      rewrittenText: result,
      provider,
      model: usedModel,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      cost: this.calculateCost(provider, usedModel, inputTokens, outputTokens),
      latency: Date.now() - startTime,
    };
  }

  async testConnection(provider: AIProvider, apiKey: string, model?: string): Promise<{ success: boolean; message: string; latency?: number }> {
    const startTime = Date.now();
    
    try {
      const testText = 'Test connection';
      
      switch (provider) {
        case AIProvider.OPENAI:
          await this.callOpenAI(apiKey, model || 'gpt-3.5-turbo', testText);
          break;
        case AIProvider.ANTHROPIC:
          await this.callAnthropic(apiKey, model || 'claude-3-haiku-20240307', testText);
          break;
        case AIProvider.DEEPSEEK:
          await this.callDeepSeek(apiKey, model || 'deepseek-chat', testText);
          break;
        case AIProvider.OPENROUTER:
          await this.callOpenRouter(apiKey, model || 'openai/gpt-3.5-turbo', testText);
          break;
        case AIProvider.YANDEX:
          throw new BadRequestException('YandexGPT test requires IAM token and folder ID');
        case AIProvider.GIGACHAT:
          throw new BadRequestException('GigaChat test not implemented');
        default:
          throw new BadRequestException(`Unsupported provider: ${provider}`);
      }

      return {
        success: true,
        message: 'Connection successful',
        latency: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Connection failed',
      };
    }
  }

  async getAvailableProviders() {
    return [
      { id: 'openai', name: 'OpenAI', enabled: !!process.env.OPENAI_API_KEY },
      { id: 'anthropic', name: 'Anthropic', enabled: !!process.env.ANTHROPIC_API_KEY },
      { id: 'deepseek', name: 'DeepSeek', enabled: !!process.env.DEEPSEEK_API_KEY },
      { id: 'openrouter', name: 'OpenRouter', enabled: !!process.env.OPENROUTER_API_KEY },
      { id: 'yandex', name: 'YandexGPT', enabled: !!process.env.YANDEX_IAM_TOKEN },
      { id: 'gigachat', name: 'GigaChat', enabled: false },
    ];
  }

  private calculateCost(provider: string, model: string, inputTokens: number, outputTokens: number): number {
    // Упрощённый расчёт стоимости (в реальности нужны актуальные цены)
    const prices: Record<string, { input: number; output: number }> = {
      'openai:gpt-4-turbo-preview': { input: 0.00001, output: 0.00003 },
      'openai:gpt-3.5-turbo': { input: 0.0000015, output: 0.000002 },
      'anthropic:claude-3-opus': { input: 0.000015, output: 0.000075 },
      'anthropic:claude-3-sonnet': { input: 0.000003, output: 0.000015 },
      'deepseek:deepseek-chat': { input: 0.00000014, output: 0.00000028 },
      'deepseek:deepseek-reasoner': { input: 0.00000055, output: 0.00000219 },
    };

    const key = `${provider}:${model}`;
    const price = prices[key] || { input: 0.00001, output: 0.00003 };

    return (inputTokens * price.input) + (outputTokens * price.output);
  }

  private async rewriteWithOpenAI(text: string, style: RewriteStyle, options?: any) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new BadRequestException('OpenAI API key not configured');

    const model = options?.model || 'gpt-4-turbo-preview';
    const response = await this.callOpenAI(apiKey, model, `${this.getSystemPrompt(style)}\n\n${options?.customPrompt || ''}\n\nТекст:\n${text}`, options?.temperature, options?.maxTokens);

    return {
      text: response.text,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      model,
    };
  }

  private async callOpenAI(apiKey: string, model: string, content: string, temperature = 0.7, maxTokens = 1000) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model,
        messages: [
          { role: 'system', content: 'Ты — профессиональный редактор.' },
          { role: 'user', content },
        ],
        temperature,
        max_tokens: maxTokens,
      }, {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: this.TIMEOUT,
      });

      return {
        text: response.data.choices[0]?.message?.content || '',
        usage: response.data.usage,
      };
    } catch (error: any) {
      this.handleAxiosError(error, 'OpenAI');
    }
  }

  private async rewriteWithAnthropic(text: string, style: RewriteStyle, options?: any) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new BadRequestException('Anthropic API key not configured');

    const model = options?.model || 'claude-3-sonnet-20240229';
    const response = await this.callAnthropic(apiKey, model, `${this.getSystemPrompt(style)}\n\n${options?.customPrompt || ''}\n\nТекст:\n${text}`, options?.maxTokens);

    return {
      text: response.text,
      inputTokens: response.usage?.input_tokens || 0,
      outputTokens: response.usage?.output_tokens || 0,
      model,
    };
  }

  private async callAnthropic(apiKey: string, model: string, content: string, maxTokens = 1000) {
    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content }],
      }, {
        headers: { 
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        timeout: this.TIMEOUT,
      });

      return {
        text: response.data.content[0]?.text || '',
        usage: response.data.usage,
      };
    } catch (error: any) {
      this.handleAxiosError(error, 'Anthropic');
    }
  }

  private async rewriteWithDeepSeek(text: string, style: RewriteStyle, options?: any) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new BadRequestException('DeepSeek API key not configured');

    const model = options?.model || 'deepseek-chat';
    const response = await this.callDeepSeek(apiKey, model, `${this.getSystemPrompt(style)}\n\n${options?.customPrompt || ''}\n\nТекст:\n${text}`, options?.temperature, options?.maxTokens);

    return {
      text: response.text,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      model,
    };
  }

  private async callDeepSeek(apiKey: string, model: string, content: string, temperature = 0.7, maxTokens = 1000) {
    try {
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        model,
        messages: [
          { role: 'system', content: 'Ты — профессиональный редактор.' },
          { role: 'user', content },
        ],
        temperature,
        max_tokens: maxTokens,
      }, {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: this.TIMEOUT,
      });

      return {
        text: response.data.choices[0]?.message?.content || '',
        usage: response.data.usage,
      };
    } catch (error: any) {
      this.handleAxiosError(error, 'DeepSeek');
    }
  }

  private async rewriteWithOpenRouter(text: string, style: RewriteStyle, options?: any) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new BadRequestException('OpenRouter API key not configured');

    const model = options?.model || 'anthropic/claude-3-sonnet';
    const response = await this.callOpenRouter(apiKey, model, `${this.getSystemPrompt(style)}\n\n${options?.customPrompt || ''}\n\nТекст:\n${text}`, options?.temperature, options?.maxTokens);

    return {
      text: response.text,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
      model,
    };
  }

  private async callOpenRouter(apiKey: string, model: string, content: string, temperature = 0.7, maxTokens = 1000) {
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model,
        messages: [
          { role: 'system', content: 'Ты — профессиональный редактор.' },
          { role: 'user', content },
        ],
        temperature,
        max_tokens: maxTokens,
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'https://maxnews.ru',
          'X-Title': 'MaxNews AI Rewrite',
        },
        timeout: this.TIMEOUT,
      });

      return {
        text: response.data.choices[0]?.message?.content || '',
        usage: response.data.usage,
      };
    } catch (error: any) {
      this.handleAxiosError(error, 'OpenRouter');
    }
  }

  private async rewriteWithYandex(text: string, style: RewriteStyle, options?: any) {
    const token = process.env.YANDEX_IAM_TOKEN;
    const folderId = process.env.YANDEX_FOLDER_ID;
    if (!token || !folderId) throw new BadRequestException('YandexGPT not configured');

    const model = options?.model || 'yandexgpt';
    
    try {
      const response = await axios.post('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
        modelUri: `gpt://${folderId}/${model}`,
        completionOptions: {
          stream: false,
          temperature: options?.temperature || 0.7,
          maxTokens: String(options?.maxTokens || 1000),
        },
        messages: [
          { role: 'system', text: 'Ты — профессиональный редактор.' },
          { role: 'user', text: `${this.getSystemPrompt(style)}\n\n${options?.customPrompt || ''}\n\nТекст:\n${text}` },
        ],
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: this.TIMEOUT,
      });

      return {
        text: response.data.result?.alternatives?.[0]?.message?.text || '',
        inputTokens: 0, // Yandex не возвращает токены
        outputTokens: 0,
        model,
      };
    } catch (error: any) {
      this.handleAxiosError(error, 'YandexGPT');
    }
  }

  private getSystemPrompt(style: RewriteStyle): string {
    const prompts: Record<RewriteStyle, string> = {
      [RewriteStyle.INFORMATIVE]: 'Перепиши новость в информативном стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений.',
      [RewriteStyle.ENGAGING]: 'Перепиши новость в вовлекающем стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений.',
      [RewriteStyle.ANALYTICAL]: 'Перепиши новость в аналитическом стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений.',
      [RewriteStyle.CASUAL]: 'Перепиши новость в разговорном стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений.',
      [RewriteStyle.PROFESSIONAL]: 'Перепиши новость в профессиональном стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений.',
    };
    return prompts[style] + '\n\nВАЖНО: Запрещено выдумывать факты, которых нет в оригинальном тексте.';
  }

  private handleAxiosError(error: any, provider: string): never {
    if (error.code === 'ECONNABORTED') {
      throw new BadRequestException(`${provider} request timeout`);
    }
    
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.response.statusText;
      
      if (status === 401) {
        throw new BadRequestException(`${provider} authentication failed: invalid API key`);
      } else if (status === 429) {
        throw new BadRequestException(`${provider} rate limit exceeded`);
      } else if (status >= 500) {
        throw new BadRequestException(`${provider} server error: ${message}`);
      } else {
        throw new BadRequestException(`${provider} error: ${message}`);
      }
    }
    
    if (error.request) {
      throw new BadRequestException(`${provider} network error: no response received`);
    }
    
    throw new BadRequestException(`${provider} error: ${error.message}`);
  }
}
