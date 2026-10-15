import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Processor('publish')
export class PublishProcessor {
  private readonly logger = new Logger(PublishProcessor.name);
  private readonly MAX_ATTEMPTS = 3;
  private readonly BACKOFF_DELAY = 5000; // 5 секунд

  constructor(private prisma: PrismaService) {}

  @Process({
    name: 'publish',
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: this.BACKOFF_DELAY,
    },
  })
  async handlePublish(job: Job<{ scheduleId: string }>) {
    const { scheduleId } = job.data;
    const attempt = job.attemptsMade + 1;

    this.logger.log(`Processing publish job ${scheduleId}, attempt ${attempt}/${this.MAX_ATTEMPTS}`);

    try {
      // Получаем задание
      const schedule = await this.prisma.publicationSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          preparedPublication: {
            include: {
              originalPublication: true,
            },
          },
        },
      });

      if (!schedule) {
        throw new Error(`Schedule ${scheduleId} not found`);
      }

      // Проверяем статус публикации
      if (schedule.preparedPublication.status !== 'APPROVED' && schedule.preparedPublication.status !== 'SCHEDULED') {
        throw new Error(`Publication status is ${schedule.preparedPublication.status}, expected APPROVED or SCHEDULED`);
      }

      // Обновляем статус на PUBLISHING
      await this.prisma.publicationSchedule.update({
        where: { id: scheduleId },
         { status: 'PUBLISHING' },
      });

      // Пытаемся опубликовать в MAX
      const publishResult = await this.publishToMax(schedule);

      if (!publishResult.success) {
        // Если публикация не удалась, но есть шанс на повтор
        if (attempt < this.MAX_ATTEMPTS) {
          throw new Error(publishResult.error || 'Publication failed, will retry');
        } else {
          // Все попытки исчерпаны
          await this.prisma.publicationSchedule.update({
            where: { id: scheduleId },
             {
              status: 'FAILED',
              errorMessage: publishResult.error || 'All retry attempts failed',
              retryCount: attempt,
            },
          });

          await this.prisma.preparedPublication.update({
            where: { id: schedule.preparedPublicationId },
             { status: 'FAILED' },
          });

          // Логируем операцию
          await this.prisma.operationLog.create({
             {
              id: uuidv4(),
              entityType: 'PublicationSchedule',
              entityId: scheduleId,
              action: 'PUBLISH_FAILED',
              meta {
                error: publishResult.error,
                attempts: attempt,
              },
            },
          });

          return { success: false, error: publishResult.error };
        }
      }

      // Публикация успешна - MAX подтвердил отправку
      await this.prisma.publicationSchedule.update({
        where: { id: scheduleId },
         {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          retryCount: attempt - 1,
        },
      });

      await this.prisma.preparedPublication.update({
        where: { id: schedule.preparedPublicationId },
         { status: 'PUBLISHED' },
      });

      // Логируем операцию
      await this.prisma.operationLog.create({
         {
          id: uuidv4(),
          entityType: 'PublicationSchedule',
          entityId: scheduleId,
          action: 'PUBLISHED',
          meta {
            maxMessageId: publishResult.messageId,
            attempts: attempt,
          },
        },
      });

      this.logger.log(`Successfully published schedule ${scheduleId}`);

      return { success: true, messageId: publishResult.messageId };
    } catch (error: any) {
      this.logger.error(`Failed to publish schedule ${scheduleId}: ${error.message}`, error.stack);

      // Обновляем статус на FAILED только если все попытки исчерпаны
      if (attempt >= this.MAX_ATTEMPTS) {
        await this.prisma.publicationSchedule.update({
          where: { id: scheduleId },
           {
            status: 'FAILED',
            errorMessage: error.message,
            retryCount: attempt,
          },
        }).catch(err => {
          this.logger.error('Failed to update schedule status', err);
        });

        await this.prisma.preparedPublication.update({
          where: { id: (await this.prisma.publicationSchedule.findUnique({ where: { id: scheduleId } }))?.preparedPublicationId },
           { status: 'FAILED' },
        }).catch(err => {
          this.logger.error('Failed to update publication status', err);
        });
      }

      throw error;
    }
  }

  /**
   * Публикация в MAX мессенджер
   * В реальности здесь должен быть вызов API MAX
   */
  private async publishToMax(schedule: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const botToken = process.env.MAX_BOT_TOKEN;
    const channelId = process.env.MAX_CHANNEL_ID;

    // Проверка конфигурации
    if (!botToken || !channelId) {
      return {
        success: false,
        error: 'MAX integration not configured. Set MAX_BOT_TOKEN and MAX_CHANNEL_ID environment variables.',
      };
    }

    try {
      // В реальности здесь должен быть вызов API MAX
      // Пример:
      // const response = await axios.post('https://max-api.example.com/sendMessage', {
      //   chat_id: channelId,
      //   text: schedule.preparedPublication.adaptedText,
      //   parse_mode: 'HTML',
      // }, {
      //   headers: { Authorization: `Bearer ${botToken}` },
      //   timeout: 10000,
      // });
      // 
      // return {
      //   success: true,
      //   messageId: response.data.result.message_id,
      // };

      // Пока интеграция не готова, возвращаем ошибку
      return {
        success: false,
        error: 'MAX API integration not implemented yet. Configure MAX_BOT_TOKEN and MAX_CHANNEL_ID to enable publishing.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: `MAX API error: ${error.message}`,
      };
    }
  }
}
