import { Controller, Get } from '@nestjs/common';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService) {}

  @Get()
  findAll() {
    return this.publicationsService.findAll();
  }
}
