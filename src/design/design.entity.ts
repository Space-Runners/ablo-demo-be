import { Client } from '../clients/client.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Template } from '../template/template.entity';
import { DesignSide } from './side/design-side.entity';
import { TemplateColor } from '../template/color/template-color.entity';
import { Size } from '../template/size/size.entity';

@Entity()
export class Design {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  garmentId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  clientId: string;

  @ManyToOne(() => Client, (client) => client.designs, { nullable: false })
  client: Client;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.designs, { nullable: true })
  user: User;

  @ManyToOne(() => Template, (template) => template.designs, {
    nullable: false,
  })
  template: Template;

  @ManyToOne(() => TemplateColor, (color) => color.designs, { nullable: false })
  color: TemplateColor;

  @ManyToOne(() => Size, (size) => size.designs, { nullable: false })
  size: Size;

  @OneToMany(() => DesignSide, (side) => side.design)
  sides: DesignSide[];
}
