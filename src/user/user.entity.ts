import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { Role } from './role.entity';
import { Template } from '../template/template.entity';
import { Design } from '../design/design.entity';
import { ResetToken } from './reset-token.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({
    nullable: true,
  })
  socialLogin: string;

  @Column({
    nullable: true,
  })
  socialId: string;

  @Column({
    nullable: false,
    default: false,
  })
  verified: boolean;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => Template, (template) => template.user)
  templates: Template[];

  @OneToMany(() => Design, (design) => design.user)
  designs: Design[];

  @OneToOne(() => ResetToken, (resetToken) => resetToken.user)
  resetToken: ResetToken;
}
