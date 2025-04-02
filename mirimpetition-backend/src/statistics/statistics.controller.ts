import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatisticsService, PetitionStats, CategoryStatistics, UserStats } from './statistics.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('statistics')
@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('petitions')
  @ApiOperation({ summary: 'Get petition statistics' })
  @ApiResponse({ status: 200, description: 'Petition statistics' })
  async getPetitionStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<PetitionStats> {
    return this.statisticsService.getPetitionStatistics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get category statistics' })
  @ApiResponse({ status: 200, description: 'Category statistics' })
  async getCategoryStatistics(): Promise<CategoryStatistics> {
    return this.statisticsService.getCategoryStatistics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics' })
  async getUserStatistics(): Promise<UserStats> {
    return this.statisticsService.getUserStatistics();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular petitions' })
  @ApiResponse({ status: 200, description: 'Popular petitions' })
  async getPopularPetitions(
    @Query('limit') limit: number = 10,
    @Query('period') period: string = '7d',
  ) {
    return this.statisticsService.getPopularPetitions(limit, period);
  }
} 