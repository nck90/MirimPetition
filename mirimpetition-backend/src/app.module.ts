import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Petition } from './entities/petition.entity';
import { Vote } from './entities/vote.entity';
import { Comment } from './entities/comment.entity';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('config.database.host'),
        port: configService.get('config.database.port'),
        username: configService.get('config.database.username'),
        password: configService.get('config.database.password'),
        database: configService.get('config.database.database'),
        entities: [User, Petition, Vote, Comment, Notification],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [{
          ttl: configService.get<number>('config.throttle.ttl') || 60,
          limit: configService.get<number>('config.throttle.limit') || 10,
        }],
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('config.bull.redis.host'),
          port: configService.get('config.bull.redis.port'),
        },
        defaultJobOptions: {
          attempts: configService.get('config.bull.defaultJobOptions.attempts'),
          backoff: {
            type: 'exponential',
            delay: configService.get('config.bull.defaultJobOptions.backoff.delay'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('config.cache.ttl'),
        max: configService.get('config.cache.maxItems'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
