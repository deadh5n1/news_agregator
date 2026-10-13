import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

type AIProvider = 'openai' | 'anthropic' | 'yandex' | 'gigachat' | 'deepseek' | 'openrouter';
type RewriteStyle = 'informative' | 'engaging' | 'analytical' | 'casual' | 'professional';

@Injectable()
export class AIService {
  constructor(private prisma: PrismaService) {}

  async rewrite(
    text: string,
    provider: AIProvider,
    style: RewriteStyle,
    options?: { temperature?: number; maxTokens?: number; customPrompt?: string; model?: string },
  ) {
    if (!text || text.length < 10) {
      throw new BadRequestException('Text too short');
    }

    const startTime = Date.now();
    let result = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let success = false;
    let errorMessage: string | undefined;

    try {
      switch (provider) {
        case 'openai':
          result = await this.rewriteWithOpenAI(text, style, options);
          break;
        case 'anthropic':
          result = await this.rewriteWithAnthropic(text, style, options);
          break;
        case 'deepseek':
          result = await this.rewriteWithDeepSeek(text, style, options);
          break;
        case 'openrouter':
          result = await this.rewriteWithOpenRouter(text, style, options);
          break;
        case 'yandex':
          result = await this.rewriteWithYandex(text, style, options);
          break;
        case 'gigachat':
          result = await this.rewriteWithGigaChat(text, style, options);
          break;
        default:
          throw new BadRequestException(`Unsupported provider: ${provider}`);
      }
      success = true;
    } catch (error: any) {
      errorMessage = error.message;
      throw error;
    } finally {
      const latency = Date.now() - startTime;
      // Логируем использование AI
      await this.prisma.aIUsage.create({
        data: {
          userId: 'system',
          provider,
          model: options?.model || 'default',
          inputTokens,
          outputTokens,
          cost: 0,
          latency,
          success,
          errorMessage,
        },
      });
    }

    return {
      rewrittenText: result,
      provider,
      model: options?.model || 'default',
      tokensUsed: inputTokens + outputTokens,
      latency: Date.now() - startTime,
    };
  }

  private async rewriteWithOpenAI(text: string, style: RewriteStyle, options?: any): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new BadRequestException('OpenAI API key not configured');

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: options?.model || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: this.getSystemPrompt(style) },
        { role: 'user', content: `${options?.customPrompt || ''}\n\nТекст:\n${text}` },
      ],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    }, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    return response.data.choices[0]?.message?.content || '';
  }

  private async rewriteWithAnthropic(text: string, style: RewriteStyle, options?: any): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new BadRequestException('Anthropic API key not configured');

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: options?.model || 'claude-3-sonnet-20240229',
      max_tokens: options?.maxTokens || 1000,
      messages: [{ role: 'user', content: `${this.getSystemPrompt(style)}\n\n${options?.customPrompt || ''}\n\nТекст:\n${text}` }],
    }, {
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    });

    return response.data.content[0]?.text || '';
  }

  private async rewriteWithDeepSeek(text: string, style: RewriteStyle, options?: any): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new BadRequestException('DeepSeek API key not configured');

    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: options?.model || 'deepseek-chat',
      messages: [
        { role: 'system', content: this.getSystemPrompt(style) },
        { role: 'user', content: `${options?.customPrompt || ''}\n\nТекст:\n${text}` },
      ],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    }, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    return response.data.choices[0]?.message?.content || '';
  }

  private async rewriteWithOpenRouter(text: string, style: RewriteStyle, options?: any): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new BadRequestException('OpenRouter API key not configured');

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: options?.model || 'anthropic/claude-3-sonnet',
      messages: [
        { role: 'system', content: this.getSystemPrompt(style) },
        { role: 'user', content: `${options?.customPrompt || ''}\n\nТекст:\n${text}` },
      ],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.APP_URL || 'https://maxnews.ru',
        'X-Title': 'MaxNews AI Rewrite',
      },
    });

    return response.data.choices[0]?.message?.content || '';
  }

  private async rewriteWithYandex(text: string, style: RewriteStyle, options?: any): Promise<string> {
    const token = process.env.YANDEX_IAM_TOKEN;
    const folderId = process.env.YANDEX_FOLDER_ID;
    if (!token || !folderId) throw new BadRequestException('YandexGPT not configured');

    const response = await axios.post('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      modelUri: `gpt://${folderId}/${options?.model || 'yandexgpt'}`,
      completionOptions: { stream: false, temperature: options?.temperature || 0.7, maxTokens: String(options?.maxTokens || 1000) },
      messages: [
        { role: 'system', text: this.getSystemPrompt(style) },
        { role: 'user', text: `${options?.customPrompt || ''}\n\nТекст:\n${text}` },
      ],
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.result?.alternatives?.[0]?.message?.text || '';
  }

  private async rewriteWithGigaChat(text: string, style: RewriteStyle, options?: any): Promise<string> {
    // Simplified - would need OAuth token flow
    throw new BadRequestException('GigaChat integration requires additional setup');
  }

  private getSystemPrompt(style: RewriteStyle): string {
    const prompts: Record<RewriteStyle, string> = {
      informative: 'Ты — профессиональный редактор. Перепиши новость в информативном стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений. Добавь структуру с буллетами.',
      engaging: 'Ты — редактор новостного канала. Перепиши новость в вовлекающем стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений. Добавь эмоции и CTA.',
      analytical: 'Ты — аналитик. Перепиши новость в аналитическом стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений. Добавь контекст на основе ТОЛЬКО имеющейся информации.',
      casual: 'Ты — редактор. Перепиши новость в разговорном стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений.',
      professional: 'Ты — деловой редактор. Перепиши новость в профессиональном стиле. Сохрани ВСЕ факты из оригинала, НЕ добавляй новых утверждений.',
    };
    return prompts[style] + '\n\nВАЖНО: Запрещено выдумывать факты, которых нет в оригинальном тексте.';
  }
}
