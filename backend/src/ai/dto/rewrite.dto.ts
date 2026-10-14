import { IsString, IsEnum, IsOptional, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  DEEPSEEK = 'deepseek',
  OPENROUTER = 'openrouter',
  YANDEX = 'yandex',
  GIGACHAT = 'gigachat',
}

export enum RewriteStyle {
  INFORMATIVE = 'informative',
  ENGAGING = 'engaging',
  ANALYTICAL = 'analytical',
  CASUAL = 'casual',
  PROFESSIONAL = 'professional',
}

export class RewriteOptionsDto {
  @ApiPropertyOptional({ default: 0.7, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;

  @ApiPropertyOptional({ default: 1000, minimum: 100, maximum: 4000 })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(4000)
  maxTokens?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  customPrompt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;
}

export class RewriteDto {
  @ApiProperty({ description: 'Текст для рерайта', minLength: 10, maxLength: 10000 })
  @IsString()
  @MaxLength(10000, { message: 'Text must not exceed 10000 characters' })
  text: string;

  @ApiProperty({ enum: AIProvider, description: 'AI провайдер' })
  @IsEnum(AIProvider, { message: 'Invalid provider. Must be one of: openai, anthropic, deepseek, openrouter, yandex, gigachat' })
  provider: AIProvider;

  @ApiProperty({ enum: RewriteStyle, description: 'Стиль рерайта' })
  @IsEnum(RewriteStyle, { message: 'Invalid style. Must be one of: informative, engaging, analytical, casual, professional' })
  style: RewriteStyle;

  @ApiPropertyOptional()
  @IsOptional()
  options?: RewriteOptionsDto;
}
