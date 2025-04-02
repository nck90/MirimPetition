import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { CacheModule } from '../cache/cache.module';
import { BullModule } from '../bull/bull.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    CacheModule,
    BullModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {} 