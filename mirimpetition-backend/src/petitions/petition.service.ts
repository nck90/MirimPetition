import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Petition, PetitionStatus, PetitionCategory } from '../entities/petition.entity';
import { User } from '../entities/user.entity';
import { Vote, VoteType } from '../entities/vote.entity';
import { CreatePetitionDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';

@Injectable()
export class PetitionService {
  constructor(
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async create(userId: string, createPetitionDto: CreatePetitionDto): Promise<Petition> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const petition = this.petitionRepository.create({
      ...createPetitionDto,
      status: PetitionStatus.PENDING,
      user,
    });

    return this.petitionRepository.save(petition);
  }

  async findAll(options: {
    skip?: number;
    take?: number;
    category?: string;
    status?: PetitionStatus;
    orderBy?: string;
  }): Promise<[Petition[], number]> {
    const queryBuilder = this.petitionRepository
      .createQueryBuilder('petition')
      .leftJoinAndSelect('petition.user', 'user')
      .leftJoinAndSelect('petition.votes', 'votes');

    if (options.category) {
      queryBuilder.andWhere('petition.category = :category', { category: options.category });
    }

    if (options.status) {
      queryBuilder.andWhere('petition.status = :status', { status: options.status });
    }

    if (options.orderBy === 'voteCount') {
      queryBuilder.orderBy('petition.voteCount', 'DESC');
    } else {
      queryBuilder.orderBy('petition.createdAt', 'DESC');
    }

    if (options.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options.take !== undefined) {
      queryBuilder.take(options.take);
    }

    return queryBuilder.getManyAndCount();
  }

  async findOne(id: string): Promise<Petition> {
    const petition = await this.petitionRepository.findOne({
      where: { id },
      relations: ['user', 'votes', 'comments'],
    });

    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    return petition;
  }

  async update(id: string, updatePetitionDto: UpdatePetitionDto): Promise<Petition> {
    const petition = await this.findOne(id);
    
    Object.assign(petition, updatePetitionDto);
    return this.petitionRepository.save(petition);
  }

  async remove(id: string): Promise<void> {
    const result = await this.petitionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Petition not found');
    }
  }

  async search(
    keyword?: string,
    category?: PetitionCategory,
    status?: PetitionStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Petition[], number]> {
    const where: FindOptionsWhere<Petition> = {};

    if (keyword) {
      where['title'] = Like(`%${keyword}%`);
    }

    if (category) {
      where['category'] = category;
    }

    if (status) {
      where['status'] = status;
    }

    const [petitions, total] = await this.petitionRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user', 'votes', 'comments'],
    });

    return [petitions, total];
  }

  async updateStatus(id: string, status: PetitionStatus): Promise<Petition> {
    const petition = await this.findOne(id);
    petition.status = status;
    return this.petitionRepository.save(petition);
  }

  async getPopular(limit: number): Promise<Petition[]> {
    return this.petitionRepository.find({
      order: { voteCount: 'DESC' },
      take: limit,
      relations: ['user', 'votes', 'comments'],
    });
  }

  async getRecent(limit: number): Promise<Petition[]> {
    return this.petitionRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user', 'votes', 'comments'],
    });
  }

  async vote(petitionId: string, userId: string, type: VoteType): Promise<Vote> {
    const petition = await this.findOne(petitionId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingVote = await this.voteRepository.findOne({
      where: {
        petition: { id: petitionId },
        user: { id: userId },
      },
    });

    if (existingVote) {
      throw new ForbiddenException('User has already voted on this petition');
    }

    const vote = this.voteRepository.create({
      type,
      petition,
      user,
    });

    await this.voteRepository.save(vote);

    // Update petition vote counts
    if (type === VoteType.AGREE) {
      petition.agreeCount += 1;
    } else {
      petition.disagreeCount += 1;
    }
    petition.voteCount += 1;

    await this.petitionRepository.save(petition);

    return vote;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.petitionRepository.increment({ id }, 'viewCount', 1);
  }
} 