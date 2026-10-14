import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { Roles } from '../auth/roles.decorator';
import { Throttle } from '../auth/throttle.decorator';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Publications')
@ApiBearerAuth()
@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService) {}

  @Get()
  @Throttle(100, 60000)
  @ApiQuery({ name: 'sourceId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  findAll(
    @Query('sourceId') sourceId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.publicationsService.findAll({
      sourceId,
      status: status as any,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }
}
