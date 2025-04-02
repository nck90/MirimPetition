import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Petition } from '../entities/petition.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CommentService {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
    private readonly cacheService: CacheService,
  ) {}

  async create(
    petitionId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      petition: { id: petitionId },
      user: { id: userId },
    });

    const savedComment = await this.commentRepository.save(comment);
    await this.invalidateCommentCache(petitionId);
    return savedComment;
  }

  async findAll(petitionId: string): Promise<Comment[]> {
    const cacheKey = `comments:${petitionId}`;
    const cachedComments = await this.cacheService.get<Comment[]>(cacheKey);
    if (cachedComments) {
      return cachedComments;
    }

    const comments = await this.commentRepository.find({
      where: { petition: { id: petitionId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    await this.cacheService.set(cacheKey, comments);
    return comments;
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'petition'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['petition'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (!comment.petition) {
      throw new NotFoundException('Associated petition not found');
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentRepository.save(comment);
    await this.invalidateCommentCache(comment.petition.id);
    return updatedComment;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['petition'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (!comment.petition) {
      throw new NotFoundException('Associated petition not found');
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
    await this.invalidateCommentCache(comment.petition.id);
  }

  async getOfficialResponses(petitionId: string): Promise<Comment[]> {
    const cacheKey = `official_responses_${petitionId}`;
    const cachedResponses = await this.cacheService.get<Comment[]>(cacheKey);

    if (cachedResponses) {
      return cachedResponses;
    }

    const responses = await this.commentRepository.find({
      where: {
        petition: { id: petitionId },
        isOfficialResponse: true,
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    await this.cacheService.set(cacheKey, responses, this.CACHE_TTL);
    return responses;
  }

  async getCommentCount(petitionId: string): Promise<number> {
    const cacheKey = `comment_count_${petitionId}`;
    const cachedCount = await this.cacheService.get<number>(cacheKey);

    if (cachedCount !== null) {
      return cachedCount;
    }

    const count = await this.commentRepository.count({
      where: { petition: { id: petitionId } },
    });

    await this.cacheService.set(cacheKey, count, this.CACHE_TTL);
    return count;
  }

  async getUserComments(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Comment[], number]> {
    const cacheKey = `user_comments_${userId}_${page}_${limit}`;
    const cachedData = await this.cacheService.get<[Comment[], number]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['petition'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const result: [Comment[], number] = [comments, total];
    await this.cacheService.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  private async invalidateCommentCache(petitionId: string): Promise<void> {
    await this.cacheService.del(`comments:${petitionId}`);
  }

  async markAsOfficialResponse(id: string, userId: string): Promise<Comment> {
    const comment = await this.findOne(id);
    const petition = await this.petitionRepository.findOne({
      where: { id: comment.petition.id },
      relations: ['user'],
    });

    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    if (petition.user.id !== userId) {
      throw new ForbiddenException('Only petition creator can mark comments as official responses');
    }

    comment.isOfficialResponse = true;
    const updatedComment = await this.commentRepository.save(comment);
    await this.invalidateCommentCache(petition.id);
    return updatedComment;
  }

  async removeOfficialResponse(id: string, userId: string): Promise<Comment> {
    const comment = await this.findOne(id);
    const petition = await this.petitionRepository.findOne({
      where: { id: comment.petition.id },
      relations: ['user'],
    });

    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    if (petition.user.id !== userId) {
      throw new ForbiddenException('Only petition creator can remove official response status');
    }

    comment.isOfficialResponse = false;
    const updatedComment = await this.commentRepository.save(comment);
    await this.invalidateCommentCache(petition.id);
    return updatedComment;
  }
} 