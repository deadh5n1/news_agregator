import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.publication.findMany({
      include: { source: true },
      orderBy: { collectedAt: 'desc' },
      take: 100,
    });
  }
}
