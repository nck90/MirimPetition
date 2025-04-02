import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Petition } from './petition.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';
import { Notification } from './notification.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';

export { UserRole };

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  studentId!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ default: false })
  isAdmin!: boolean;

  @OneToMany(() => Petition, (petition) => petition.user)
  petitions!: Petition[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes!: Vote[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
} 