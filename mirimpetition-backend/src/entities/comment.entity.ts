import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Petition } from './petition.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @Column({ default: false })
  isOfficialResponse!: boolean;

  @ManyToOne(() => User, (user) => user.comments)
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Petition, (petition) => petition.comments)
  petition!: Petition;

  @Column()
  petitionId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 