import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { user: { id: userId }, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id, user: { id: userId } },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true },
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.notificationRepository.delete({ id, user: { id: userId } });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.notificationRepository.delete({ user: { id: userId } });
  }

  async deleteByType(type: NotificationType, userId: string): Promise<void> {
    await this.notificationRepository.delete({ type, user: { id: userId } });
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async sendNotification(data: Partial<Notification>): Promise<void> {
    await this.create(data);
  }

  async sendBulkNotifications(
    userIds: string[],
    type: NotificationType,
    title: string,
    content: string,
  ) {
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      content,
      isRead: false,
    }));

    await this.notificationRepository.save(notifications);
  }

  async getNotificationStats(userId: string) {
    const stats = await this.notificationRepository
      .createQueryBuilder('notification')
      .select('notification.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('notification.userId = :userId', { userId })
      .groupBy('notification.type')
      .getRawMany();

    return stats;
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationRepository.findOne({ where: { id } });
  }
} 