import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Template } from '../template.entity';
import { TemplateImage } from '../image/template-image.entity';
import { DesignSide } from '../../design/side/design-side.entity';

@Entity()
export class TemplateSide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    default: true,
  })
  hasArea: boolean;

  @Column({
    nullable: true,
  })
  top?: number;

  @Column({
    nullable: true,
  })
  left?: number;

  @Column({
    nullable: true,
  })
  heightCm?: number;

  @Column({
    nullable: true,
  })
  widthCm?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => TemplateImage, (templateImage) => templateImage.templateSide)
  images: TemplateImage[];

  @Column()
  templateId: string;

  @ManyToOne(() => Template, (template) => template.sides, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  template: Template;

  @OneToMany(() => DesignSide, (designSide) => designSide.templateSide)
  designSide: DesignSide;
}
