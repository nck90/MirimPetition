import { Controller, Get, Query, UseGuards, ValidationPipe, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchPetitionsDto } from './dto/search-petitions.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get('petitions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search petitions' })
  async searchPetitions(
    @Query(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    })) query: SearchPetitionsDto
  ) {
    try {
      this.logger.log(`Searching petitions with query: ${JSON.stringify(query)}`);
      const result = await this.searchService.searchPetitions(query.keyword || '', {
        status: query.status,
        category: query.category,
        page: query.page,
        limit: query.limit,
      });
      this.logger.log(`Search result: ${JSON.stringify(result)}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Search error: ${error?.message || 'Unknown error'}`);
      throw new HttpException(
        'Failed to search petitions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('popular')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get popular petitions' })
  getPopularPetitions() {
    return this.searchService.getPopularPetitions();
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get recent petitions' })
  getRecentPetitions() {
    return this.searchService.getRecentPetitions();
  }
} 