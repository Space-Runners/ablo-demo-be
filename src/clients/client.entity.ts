import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ApiKey } from './api-key.entity';
import { User } from '../user/user.entity';
import { Template } from '../template/template.entity';
import { Image } from '../generator/image.entity';
import { Design } from '../design/design.entity';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  domain: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => ApiKey, (token) => token.client)
  apiKey: ApiKey;

  @OneToMany(() => Image, (photo) => photo.client)
  photos: Image[];

  @OneToMany(() => User, (user) => user.client)
  users: User[];

  @OneToMany(() => Template, (template) => template.client)
  templates: Template[];

  @OneToMany(() => Design, (design) => design.client)
  designs: Design[];
}
