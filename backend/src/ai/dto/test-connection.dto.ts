import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AIProvider } from './rewrite.dto';

export class TestConnectionDto {
  @ApiProperty({ enum: AIProvider })
  @IsEnum(AIProvider)
  provider: AIProvider;

  @ApiProperty({ description: 'API ключ для тестирования' })
  @IsString()
  @MinLength(10, { message: 'API key must be at least 10 characters' })
  apiKey: string;

  @ApiPropertyOptional({ description: 'Модель для тестирования' })
  @IsOptional()
  @IsString()
  model?: string;
}
