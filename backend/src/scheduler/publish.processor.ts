import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

@Processor('publish')
export class PublishProcessor {
  constructor(private prisma: PrismaService) {}

  @Process('publish')
  async handlePublish(job: Job<{ scheduleId: string }>) {
    const { scheduleId } = job.data;

    try {
      // Обновляем статус на PUBLISHING
      await this.prisma.publicationSchedule.update({
        where: { id: scheduleId },
        data: { status: 'PUBLISHING' },
      });

      // Здесь должна быть логика публикации в MAX
      // await this.publishToMax(scheduleId);

      // Обновляем статус на PUBLISHED
      await this.prisma.publicationSchedule.update({
        where: { id: scheduleId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });

      // Логируем операцию
      await this.prisma.operationLog.create({
        data: {
          entityType: 'PublicationSchedule',
          entityId: scheduleId,
          action: 'PUBLISHED',
          metadata: { jobId: job.id },
        },
      });

      return { success: true };
    } catch (error: any) {
      // Обновляем статус на FAILED
      await this.prisma.publicationSchedule.update({
        where: { id: scheduleId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          retryCount: { increment: 1 },
        },
      });

      throw error;
    }
  }
}
