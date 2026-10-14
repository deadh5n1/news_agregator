import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Public } from '../auth/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('publish') private publishQueue: Queue,
  ) {}

  @Public()
  @Get()
  async check() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'unknown',
      redis: 'unknown',
    };

    // Проверка PostgreSQL
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch (error: any) {
      checks.database = 'error: ' + error.message;
      checks.status = 'degraded';
    }

    // Проверка Redis
    try {
      const redisClient = this.publishQueue.client;
      await redisClient.ping();
      checks.redis = 'ok';
    } catch (error: any) {
      checks.redis = 'error: ' + error.message;
      checks.status = 'degraded';
    }

    return checks;
  }
}
