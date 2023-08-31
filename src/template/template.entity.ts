import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Currency } from './currency/currency.entity';
import { Size } from './size/size.entity';
import { TemplateSide } from './side/template-side.entity';
import { TemplateColor } from './color/template-color.entity';
import { Design } from '../design/design.entity';

@Entity()
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  fabric: string;

  @Column({
    nullable: true,
  })
  currencyId?: number;

  @ManyToOne(() => Currency, null, { nullable: true })
  currency?: Currency;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  price: number;

  @Column({
    nullable: true,
  })
  madeIn: string;

  @Column({
    nullable: true,
  })
  fit: string;

  @Column({
    nullable: true,
  })
  material: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => TemplateColor, (templateColor) => templateColor.template)
  colors: TemplateColor[];

  @OneToMany(() => TemplateSide, (templateSide) => templateSide.template)
  sides: TemplateSide[];

  @ManyToMany(() => Size)
  @JoinTable()
  sizes: Size[];

  @Column({
    nullable: true,
  })
  userId?: string;

  @ManyToOne(() => User, (user) => user.designs, { nullable: true })
  user?: User;

  @OneToMany(() => Design, (design) => design.template)
  designs: Design[];
}
