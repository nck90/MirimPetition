import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';

export enum PetitionStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum PetitionCategory {
  ACADEMIC = 'academic',
  FACILITY = 'facility',
  WELFARE = 'welfare',
  OTHER = 'other',
}

@Entity('petitions')
export class Petition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column({
    type: 'enum',
    enum: PetitionStatus,
    default: PetitionStatus.PENDING,
  })
  status!: PetitionStatus;

  @Column({
    type: 'enum',
    enum: PetitionCategory,
  })
  category!: PetitionCategory;

  @Column({ default: 0 })
  agreeCount!: number;

  @Column({ default: 0 })
  disagreeCount!: number;

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: 0 })
  voteCount!: number;

  @Column({ default: false })
  isOfficialResponse!: boolean;

  @Column('text', { nullable: true })
  officialResponse?: string;

  @ManyToOne(() => User, (user) => user.petitions)
  user!: User;

  @Column()
  userId!: string;

  @OneToMany(() => Vote, (vote) => vote.petition)
  votes!: Vote[];

  @OneToMany(() => Comment, (comment) => comment.petition)
  comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 