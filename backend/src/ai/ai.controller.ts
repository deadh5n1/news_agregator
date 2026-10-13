import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('rewrite')
  async rewrite(@Body() body: {
    text: string;
    provider: string;
    style: string;
    options?: { temperature?: number; maxTokens?: number; customPrompt?: string; model?: string };
  }) {
    return this.aiService.rewrite(
      body.text,
      body.provider as any,
      body.style as any,
      body.options,
    );
  }
}
