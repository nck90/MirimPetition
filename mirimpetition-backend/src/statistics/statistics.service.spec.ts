import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticsService } from './statistics.service';
import { Petition } from '../entities/petition.entity';
import { Vote } from '../entities/vote.entity';
import { User } from '../entities/user.entity';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let petitionRepository: Repository<Petition>;
  let voteRepository: Repository<Vote>;
  let userRepository: Repository<User>;

  const mockPetitionRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockVoteRepository = {
    count: jest.fn(),
  };

  const mockUserRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Petition),
          useValue: mockPetitionRepository,
        },
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    petitionRepository = module.get<Repository<Petition>>(getRepositoryToken(Petition));
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPetitionStatistics', () => {
    it('should return petition statistics', async () => {
      const mockStats = {
        total: 10,
        active: 7,
        closed: 3,
        approvalRate: 30,
      };

      mockPetitionRepository.count.mockResolvedValue(10);
      mockPetitionRepository.createQueryBuilder
        .mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockResolvedValue(7),
        } as any);

      const result = await service.getPetitionStatistics();

      expect(result).toEqual(mockStats);
    });
  });

  describe('getUserStatistics', () => {
    it('should return user statistics', async () => {
      const mockStats = {
        totalUsers: 100,
        activeUsers: 50,
        activityRate: 50,
        topContributors: [],
      };

      mockUserRepository.count.mockResolvedValue(100);
      mockUserRepository.createQueryBuilder.mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(50),
      } as any);

      const result = await service.getUserStatistics();

      expect(result).toEqual(mockStats);
    });
  });

  describe('getPopularPetitions', () => {
    it('should return popular petitions', async () => {
      const mockPetitions = [
        { id: '1', title: 'Top Petition 1', voteCount: 100 },
        { id: '2', title: 'Top Petition 2', voteCount: 80 },
      ];

      mockPetitionRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPetitions),
      } as any);

      const result = await service.getPopularPetitions(5, '7d');

      expect(result).toEqual(mockPetitions);
    });
  });
}); 