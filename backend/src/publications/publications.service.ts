import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublicationStatus } from '@prisma/client';

@Injectable()
export class PublicationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    sourceId?: string;
    status?: PublicationStatus;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (filters?.sourceId) {
      where.sourceId = filters.sourceId;
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.publication.findMany({
      where,
      include: { source: true },
      orderBy: { collectedAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }

  async findOne(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: { source: true },
    });

    if (!publication) {
      throw new NotFoundException(`Publication with ID ${id} not found`);
    }

    return publication;
  }
}
