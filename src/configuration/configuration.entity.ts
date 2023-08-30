import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

interface Parameters {
  cfg_scale: number;
  clip_guidance_preset: string;
  height: number;
  width: number;
  samples: number;
  steps: number;
}

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  engineId: string;

  @Column()
  keywords: string;

  @Column('jsonb', { nullable: false, default: {} })
  parameters: Parameters;

  @CreateDateColumn()
  public createdAt: Date;
}
