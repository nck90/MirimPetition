import { Process, Processor } from '@nestjs/bull';
import { Logger, NotFoundException } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationService } from '../../notifications/notification.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

interface NotificationJobData {
  notificationId: string;
  userId: string;
}

interface ProcessorError extends Error {
  message: string;
}

@Processor('notifications')
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly notificationService: NotificationService) {}

  @Process()
  async handleNotification(job: Job<NotificationJobData>) {
    this.logger.debug(`Processing notification job ${job.id}`);

    try {
      const { notificationId, userId } = job.data;
      const notification = await this.notificationService.findOne(notificationId);

      if (!notification) {
        throw new NotFoundException(`Notification ${notificationId} not found`);
      }

      this.server.to(userId).emit('notification', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        createdAt: notification.createdAt,
      });

      this.logger.debug(`Notification ${notificationId} processed successfully`);
    } catch (error) {
      const processorError = error as ProcessorError;
      this.logger.error(`Failed to process notification job ${job.id}: ${processorError.message}`);
      throw error;
    }
  }
} 