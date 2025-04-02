import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';

interface QueueError extends Error {
  message: string;
}

@Injectable()
export class BullService implements BullOptionsFactory {
  private readonly logger = new Logger(BullService.name);
  private queues: Map<string, Queue> = new Map();

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.notificationQueue.on('completed', (job) => {
      this.logger.debug(`Job ${job.id} completed`);
    });

    this.notificationQueue.on('failed', (job, error: QueueError) => {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
    });

    this.notificationQueue.on('error', (error: QueueError) => {
      this.logger.error(`Queue error: ${error.message}`);
    });
  }

  createBullOptions(): BullModuleOptions {
    return {
      redis: {
        host: this.configService.get('redis.host'),
        port: this.configService.get('redis.port'),
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    };
  }

  async addNotificationJob(data: any) {
    return this.notificationQueue.add(data);
  }

  async addJob(queueName: string, data: any): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    await queue.add(data);
  }

  setQueue(queueName: string, queue: Queue): void {
    this.queues.set(queueName, queue);
  }
} 