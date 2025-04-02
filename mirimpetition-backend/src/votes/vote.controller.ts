import { Controller, Post, Get, Body, Param, UseGuards, Delete, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@ApiTags('votes')
@Controller('votes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post(':petitionId')
  @ApiOperation({ summary: 'Create a new vote' })
  @ApiResponse({ status: 201, description: 'Vote created successfully' })
  async create(
    @Param('petitionId') petitionId: string,
    @Req() req: RequestWithUser,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    return this.voteService.create(petitionId, req.user.id, createVoteDto.type);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vote' })
  @ApiResponse({ status: 204, description: 'Vote deleted successfully' })
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.voteService.remove(id, req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all votes by user ID' })
  @ApiResponse({ status: 200, description: 'Returns all votes for the user' })
  async findByUserId(@Param('userId') userId: string) {
    return this.voteService.findByUserId(userId);
  }

  @Get('petition/:petitionId')
  @ApiOperation({ summary: 'Get all votes for a petition' })
  @ApiResponse({ status: 200, description: 'Returns all votes for the petition' })
  async findByPetitionId(@Param('petitionId') petitionId: string) {
    return this.voteService.findByPetitionId(petitionId);
  }
} 