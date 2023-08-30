import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ResetToken extends BaseEntity {
  @PrimaryColumn({ unique: true })
  token: string;

  @CreateDateColumn({})
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  hasBeenUsed: boolean;

  @OneToOne(() => User, (user) => user.resetToken, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user: User;
}
