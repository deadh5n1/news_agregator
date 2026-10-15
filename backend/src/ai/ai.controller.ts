import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIService } from './ai.service';
import { RewriteDto } from './dto/rewrite.dto';
import { TestConnectionDto } from './dto/test-connection.dto';
import { Roles } from '../auth/roles.decorator';
import { Throttle } from '../auth/throttle.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('rewrite')
  @Roles('ADMIN', 'EDITOR')
  @Throttle(20, 60000) // 20 запросов в минуту
  async rewrite(@Body() rewriteDto: RewriteDto) {
    return this.aiService.rewrite(
      rewriteDto.text,
      rewriteDto.provider,
      rewriteDto.style,
      rewriteDto.options,
    );
  }

  @Post('test-connection')
  @Roles('ADMIN')
  @Throttle(10, 60000) // 10 тестов в минуту
  async testConnection(@Body() testDto: TestConnectionDto) {
    return this.aiService.testConnection(testDto.provider, testDto.apiKey, testDto.model);
  }

  @Post('providers')
  @Roles('ADMIN')
  async getProviders() {
    return this.aiService.getAvailableProviders();
  }
}
