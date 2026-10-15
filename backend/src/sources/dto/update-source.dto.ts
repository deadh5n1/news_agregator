import { PartialType } from '@nestjs/swagger';
import { CreateSourceDto } from './create-source.dto';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SourceStatus } from '@prisma/client';

export class UpdateSourceDto extends PartialType(CreateSourceDto) {
  @ApiPropertyOptional({ enum: SourceStatus })
  @IsOptional()
  @IsEnum(SourceStatus)
  status?: SourceStatus;
}
