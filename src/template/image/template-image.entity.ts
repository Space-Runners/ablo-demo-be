import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { TemplateSide } from '../side/template-side.entity';
import { TemplateColor } from '../color/template-color.entity';

@Entity()
@Unique(['templateColorId', 'templateSideId'])
export class TemplateImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  templateColorId: string;

  @ManyToOne(() => TemplateColor, (templateColor) => templateColor.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  templateColor: TemplateColor;

  @Column()
  templateSideId: string;

  @ManyToOne(() => TemplateSide, (templateSide) => templateSide.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  templateSide: TemplateSide;
}
