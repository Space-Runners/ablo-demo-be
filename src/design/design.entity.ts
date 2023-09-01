import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Design {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.designs, { nullable: true })
  user: User;
}
