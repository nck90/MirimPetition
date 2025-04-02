import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote, VoteType } from '../entities/vote.entity';
import { Petition } from '../entities/petition.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(petitionId: string, userId: string, type: VoteType): Promise<Vote> {
    const petition = await this.petitionRepository.findOne({
      where: { id: petitionId },
      relations: ['votes'],
    });

    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

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

  async findByUserId(userId: string): Promise<Vote[]> {
    return this.voteRepository.find({
      where: { user: { id: userId } },
      relations: ['petition'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPetitionId(petitionId: string): Promise<Vote[]> {
    return this.voteRepository.find({
      where: { petition: { id: petitionId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vote> {
    const vote = await this.voteRepository.findOne({
      where: { id },
      relations: ['user', 'petition'],
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    return vote;
  }

  async remove(petitionId: string, userId: string): Promise<void> {
    const vote = await this.voteRepository.findOne({
      where: {
        petition: { id: petitionId },
        user: { id: userId },
      },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    const petition = await this.petitionRepository.findOne({
      where: { id: petitionId },
    });

    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    // Update petition vote counts
    if (vote.type === VoteType.AGREE) {
      petition.agreeCount -= 1;
    } else {
      petition.disagreeCount -= 1;
    }
    petition.voteCount -= 1;

    await this.petitionRepository.save(petition);
    await this.voteRepository.remove(vote);
  }
} 