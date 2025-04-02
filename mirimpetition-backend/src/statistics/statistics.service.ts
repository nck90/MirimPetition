import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Petition, PetitionStatus } from '../entities/petition.entity';
import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';

export interface CategoryStats {
  total: number;
  active: number;
  closed: number;
}

export interface CategoryStatistics {
  [key: string]: CategoryStats;
}

export interface PetitionStats {
  total: number;
  active: number;
  closed: number;
  approvalRate: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  activityRate: number;
  topContributors: Array<{
    id: string;
    name: string;
    petitionCount: number;
    voteCount: number;
  }>;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async getPetitionStatistics(startDate?: Date, endDate?: Date): Promise<any> {
    const query = this.petitionRepository.createQueryBuilder('petition');

    if (startDate && endDate) {
      query.where('petition.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const totalPetitions = await query.getCount();
    const activePetitions = await query
      .where('petition.status = :status', { status: PetitionStatus.ACTIVE })
      .getCount();
    const closedPetitions = await query
      .where('petition.status = :status', { status: PetitionStatus.CLOSED })
      .getCount();

    return {
      total: totalPetitions,
      active: activePetitions,
      closed: closedPetitions,
    };
  }

  async getCategoryStatistics(): Promise<any> {
    const categories = await this.petitionRepository
      .createQueryBuilder('petition')
      .select('petition.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('petition.status = :status', { status: PetitionStatus.ACTIVE })
      .groupBy('petition.category')
      .getRawMany();

    return categories;
  }

  async getUserStatistics(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :date', {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      })
      .getCount();

    const topContributors = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'COUNT(DISTINCT petition.id) as petitionCount',
        'COUNT(DISTINCT vote.id) as voteCount',
      ])
      .leftJoin('user.petitions', 'petition')
      .leftJoin('user.votes', 'vote')
      .groupBy('user.id')
      .orderBy('petitionCount', 'DESC')
      .addOrderBy('voteCount', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      total: totalUsers,
      active: activeUsers,
      topContributors,
    };
  }

  async getPopularPetitions(limit: number = 10, period: string = 'week'): Promise<any> {
    const date = new Date();
    switch (period) {
      case 'day':
        date.setDate(date.getDate() - 1);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }

    return this.petitionRepository
      .createQueryBuilder('petition')
      .select([
        'petition.id',
        'petition.title',
        'COUNT(DISTINCT vote.id) as voteCount',
        'COUNT(DISTINCT comment.id) as commentCount',
      ])
      .leftJoin('petition.votes', 'vote')
      .leftJoin('petition.comments', 'comment')
      .where('petition.createdAt >= :date', { date })
      .andWhere('petition.status = :status', { status: PetitionStatus.ACTIVE })
      .groupBy('petition.id')
      .orderBy('voteCount', 'DESC')
      .addOrderBy('commentCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getVoteStatistics(petitionId: string) {
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .select('vote.choice', 'choice')
      .addSelect('COUNT(*)', 'count')
      .where('vote.petitionId = :petitionId', { petitionId })
      .groupBy('vote.choice')
      .getRawMany();

    return votes;
  }
} 