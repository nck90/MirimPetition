import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Petition } from './petition.entity';

export enum VoteType {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
  NEUTRAL = 'NEUTRAL',
}

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  type!: VoteType;

  @ManyToOne(() => User, (user) => user.votes)
  user!: User;

  @ManyToOne(() => Petition, (petition) => petition.votes)
  petition!: Petition;

  @CreateDateColumn()
  createdAt!: Date;
} 