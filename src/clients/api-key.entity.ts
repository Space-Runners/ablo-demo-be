import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    default: true,
  })
  isActive: boolean;

  @Column()
  key: string;

  @CreateDateColumn()
  public createdAt: Date;

  @OneToOne(() => Client, (client) => client.apiKey, { onDelete: 'CASCADE' })
  @JoinColumn()
  client: Client;

  @Column()
  clientId: string;
}
