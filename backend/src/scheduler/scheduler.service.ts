import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue('publish') private publishQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async schedulePublication(preparedPublicationId: string, scheduledAt: Date) {
    // Проверка прошедшего времени
    const now = new Date();
    if (scheduledAt <= now) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Проверка, нет ли уже задания для этой публикации
    const existing = await this.prisma.publicationSchedule.findUnique({
      where: { preparedPublicationId },
    });

    if (existing) {
      if (existing.status === 'PUBLISHED') {
        throw new BadRequestException('Publication already published');
      }
      if (existing.status === 'PUBLISHING') {
        throw new BadRequestException('Publication is currently being published');
      }
      if (existing.status === 'SCHEDULED' || existing.status === 'QUEUED') {
        throw new BadRequestException('Publication already scheduled');
      }
    }

    // Проверяем статус публикации
    const publication = await this.prisma.preparedPublication.findUnique({
      where: { id: preparedPublicationId },
    });

    if (!publication) {
      throw new BadRequestException('Publication not found');
    }

    if (publication.status !== 'APPROVED') {
      throw new BadRequestException(`Publication must be APPROVED before scheduling, current status: ${publication.status}`);
    }

    // Используем транзакцию для атомарности
    const schedule = await this.prisma.$transaction(async (tx) => {
      // Если есть старая запись - удаляем
      if (existing) {
        await tx.publicationSchedule.delete({
          where: { id: existing.id },
        });
      }

      // Создаём новую запись
      const newSchedule = await tx.publicationSchedule.create({
         {
          id: uuidv4(),
          preparedPublicationId,
          scheduledAt,
          status: 'SCHEDULED',
        },
      });

      // Обновляем статус публикации
      await tx.preparedPublication.update({
        where: { id: preparedPublicationId },
         { status: 'SCHEDULED' },
      });

      return newSchedule;
    });

    // Добавляем в очередь с задержкой
    const delay = scheduledAt.getTime() - Date.now();
    
    try {
      await this.publishQueue.add(
        'publish',
        { scheduleId: schedule.id },
        {
          delay,
          jobId: schedule.id,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      this.logger.log(`Scheduled publication ${preparedPublicationId} for ${scheduledAt.toISOString()}`);
    } catch (error: any) {
      // Если не удалось добавить в очередь, откатываем изменения
      this.logger.error('Failed to add job to queue', error);
      
      await this.prisma.$transaction(async (tx) => {
        await tx.publicationSchedule.delete({
          where: { id: schedule.id },
        });

        await tx.preparedPublication.update({
          where: { id: preparedPublicationId },
           { status: 'APPROVED' },
        });
      });

      throw new BadRequestException('Failed to schedule publication: queue error');
    }

    return schedule;
  }

  async cancelSchedule(scheduleId: string) {
    const schedule = await this.prisma.publicationSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }

    if (schedule.status === 'PUBLISHED') {
      throw new BadRequestException('Cannot cancel already published schedule');
    }

    if (schedule.status === 'PUBLISHING') {
      throw new BadRequestException('Cannot cancel schedule that is being published');
    }

    // Удаляем задание из очереди
    const job = await this.publishQueue.getJob(scheduleId);
    if (job) {
      await job.remove();
    }

    // Обновляем статусы
    await this.prisma.$transaction(async (tx) => {
      await tx.publicationSchedule.update({
        where: { id: scheduleId },
         { status: 'FAILED', errorMessage: 'Cancelled by user' },
      });

      await tx.preparedPublication.update({
        where: { id: schedule.preparedPublicationId },
         { status: 'APPROVED' },
      });
    });

    return { success: true };
  }

  async getSchedules(filters?: { status?: string; limit?: number; offset?: number }) {
    const where: any = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.publicationSchedule.findMany({
      where,
      include: {
        preparedPublication: {
          include: {
            source: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }
}
