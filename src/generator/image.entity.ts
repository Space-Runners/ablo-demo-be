import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Client } from '../clients/client.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  url: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({
    nullable: true,
  })
  userId: string;

  @ManyToOne(() => Client, (client) => client.photos, { nullable: false })
  client: Client;

  @Column({
    default: false,
  })
  temporary: boolean;
}
