import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectQueue('publish') private publishQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async schedulePublication(preparedPublicationId: string, scheduledAt: Date) {
    // Проверяем, нет ли уже задания для этой публикации
    const existing = await this.prisma.publicationSchedule.findUnique({
      where: { preparedPublicationId },
    });

    if (existing) {
      throw new Error('Publication already scheduled');
    }

    const schedule = await this.prisma.publicationSchedule.create({
      data: {
        id: uuidv4(),
        preparedPublicationId,
        scheduledAt,
        status: 'SCHEDULED',
      },
    });

    // Добавляем в очередь с задержкой
    const delay = scheduledAt.getTime() - Date.now();
    if (delay > 0) {
      await this.publishQueue.add(
        'publish',
        { scheduleId: schedule.id },
        { delay, jobId: schedule.id },
      );
    }

    return schedule;
  }
}
