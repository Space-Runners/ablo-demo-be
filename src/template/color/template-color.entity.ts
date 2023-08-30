import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Template } from '../template.entity';
import { TemplateImage } from '../image/template-image.entity';
import { Design } from '../../design/design.entity';

@Entity()
export class TemplateColor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  hex: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(
    () => TemplateImage,
    (templateImage) => templateImage.templateColor,
  )
  images: TemplateImage[];

  @Column()
  templateId: string;

  @ManyToOne(() => Template, (template) => template.colors, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  template: Template;

  @OneToMany(() => Design, (design) => design.color)
  designs: Design[];
}
