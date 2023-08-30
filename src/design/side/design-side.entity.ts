import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Design } from '../design.entity';
import { TemplateSide } from '../../template/side/template-side.entity';

@Entity()
export class DesignSide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Design, (design) => design.sides, { nullable: false })
  design: Design;

  @OneToOne(() => TemplateSide, (side) => side.designSide, { nullable: false })
  @JoinColumn()
  templateSide: TemplateSide;

  @Column({ default: false })
  hasGraphics: boolean;

  @Column({ default: false })
  hasText: boolean;

  @Column()
  canvasStateUrl: string;

  @Column()
  imageUrl: string;

  @Column()
  previewUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
