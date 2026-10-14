import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SourcesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.source.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const source = await this.prisma.source.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!source) {
      throw new NotFoundException(`Source with ID ${id} not found`);
    }

    return source;
  }

  async create(createSourceDto: CreateSourceDto) {
    // Проверка на дубликаты
    const existing = await this.prisma.source.findUnique({
      where: { externalId: createSourceDto.externalId },
    });

    if (existing) {
      throw new ConflictException(`Source with externalId ${createSourceDto.externalId} already exists`);
    }

    return this.prisma.source.create({
       {
        id: uuidv4(),
        ...createSourceDto,
        addedById: 'system', // В реальности брать из JWT
      },
    });
  }

  async update(id: string, updateSourceDto: UpdateSourceDto) {
    await this.findOne(id); // Проверка существования

    return this.prisma.source.update({
      where: { id },
       updateSourceDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Проверка существования

    return this.prisma.source.delete({
      where: { id },
    });
  }
}
