import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { Roles } from '../auth/roles.decorator';
import { Throttle } from '../auth/throttle.decorator';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Sources')
@ApiBearerAuth()
@Controller('sources')
export class SourcesController {
  constructor(private sourcesService: SourcesService) {}

  @Get()
  @Throttle(100, 60000) // 100 запросов в минуту
  findAll() {
    return this.sourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sourcesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(createSourceDto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourcesService.update(id, updateSourceDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.sourcesService.remove(id);
  }
}
