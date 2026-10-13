import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { PublishProcessor } from './publish.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'publish' }),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, PublishProcessor],
  exports: [SchedulerService],
})
export class SchedulerModule {}
