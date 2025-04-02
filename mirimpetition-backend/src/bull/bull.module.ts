import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullService } from './bull.service';
import { NotificationProcessor } from './processors/notification.processor';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [ConfigModule, NotificationModule],
  providers: [BullService, NotificationProcessor],
  exports: [BullService],
})
export class BullModule {} 