import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PetitionService } from './petition.service';
import { CreatePetitionDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { QueryDto } from '../common/dto/query.dto';
import { PetitionStatus } from '../entities/petition.entity';
import { VoteType } from '../entities/vote.entity';
import { UserRole } from '../entities/user.entity';

interface RequestWithUser extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}

@ApiTags('petitions')
@Controller('petitions')
export class PetitionController {
  constructor(private readonly petitionService: PetitionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new petition' })
  @ApiResponse({ status: 201, description: 'Petition created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Request() req: RequestWithUser, @Body() createPetitionDto: CreatePetitionDto) {
    return this.petitionService.create(req.user.id, createPetitionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all petitions' })
  @ApiResponse({ status: 200, description: 'Returns all petitions' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() queryDto: QueryDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    return this.petitionService.findAll({
      skip: (page - 1) * limit,
      take: limit,
      ...queryDto,
    });
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular petitions' })
  @ApiResponse({ status: 200, description: 'Returns popular petitions' })
  async getPopular(@Query('limit') limit: number = 10) {
    return this.petitionService.getPopular(limit);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent petitions' })
  @ApiResponse({ status: 200, description: 'Returns recent petitions' })
  async getRecent(@Query('limit') limit: number = 10) {
    return this.petitionService.getRecent(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a petition by ID' })
  @ApiResponse({ status: 200, description: 'Returns the petition' })
  @ApiResponse({ status: 404, description: 'Petition not found' })
  async findOne(@Param('id') id: string) {
    return this.petitionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a petition' })
  @ApiResponse({ status: 200, description: 'Petition updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Petition not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePetitionDto: UpdatePetitionDto,
  ) {
    return this.petitionService.update(id, updatePetitionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a petition' })
  @ApiResponse({ status: 200, description: 'Petition deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Petition not found' })
  async remove(@Param('id') id: string) {
    return this.petitionService.remove(id);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vote on a petition' })
  @ApiResponse({ status: 201, description: 'Vote created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Petition not found' })
  async vote(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body('type') type: VoteType,
  ) {
    return this.petitionService.vote(id, req.user.id, type);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update petition status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Petition not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: PetitionStatus,
  ) {
    return this.petitionService.updateStatus(id, status);
  }
} 