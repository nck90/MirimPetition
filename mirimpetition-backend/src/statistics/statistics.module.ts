import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { Petition } from '../entities/petition.entity';
import { Vote } from '../entities/vote.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Petition, Vote, User])],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {} 