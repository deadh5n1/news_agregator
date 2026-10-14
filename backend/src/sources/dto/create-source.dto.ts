import { IsString, IsOptional, IsEnum, IsInt, Min, Max, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SourcePriority } from '@prisma/client';

export class CreateSourceDto {
  @ApiProperty({ example: 'max_ch_001' })
  @IsString()
  externalId: string;

  @ApiProperty({ example: 'ТехноНовости' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://max.app/technonews' })
  @IsUrl({}, { message: 'Invalid URL format' })
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ default: 'ru' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ enum: SourcePriority, default: SourcePriority.MEDIUM })
  @IsOptional()
  @IsEnum(SourcePriority)
  priority?: SourcePriority;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  pollingIntervalMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
