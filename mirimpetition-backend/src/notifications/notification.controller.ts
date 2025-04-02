import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification-type.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @ApiResponse({ status: 200, description: 'Returns all notifications' })
  async findAll(@Req() req: RequestWithUser) {
    return this.notificationService.findAll(req.user.id);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notifications for the current user' })
  @ApiResponse({ status: 200, description: 'Returns unread notifications' })
  async findUnread(@Req() req: RequestWithUser) {
    return this.notificationService.findUnread(req.user.id);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get count of unread notifications' })
  @ApiResponse({ status: 200, description: 'Returns count of unread notifications' })
  async getUnreadCount(@Req() req: RequestWithUser) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification marked as read successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Notification not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
  })
  async markAsRead(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All notifications marked as read successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
  })
  async markAllAsRead(@Req() req: RequestWithUser) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  async delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.notificationService.delete(id, req.user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all notifications' })
  @ApiResponse({ status: 200, description: 'All notifications deleted successfully' })
  async deleteAll(@Req() req: RequestWithUser) {
    return this.notificationService.deleteAll(req.user.id);
  }

  @Delete('type/:type')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notifications by type' })
  @ApiResponse({ status: 200, description: 'Notifications deleted successfully' })
  async deleteByType(@Param('type') type: NotificationType, @Req() req: RequestWithUser) {
    return this.notificationService.deleteByType(type, req.user.id);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get notification statistics (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns notification statistics by type',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
  })
  async getNotificationStats(@Req() req: RequestWithUser) {
    return this.notificationService.getNotificationStats(req.user.id);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Send bulk notifications to multiple users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bulk notifications sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User does not have admin role',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
  })
  async sendBulkNotifications(
    @Body() body: { userIds: string[]; type: NotificationType; title: string; content: string },
  ) {
    await this.notificationService.sendBulkNotifications(
      body.userIds,
      body.type,
      body.title,
      body.content,
    );
  }
} 