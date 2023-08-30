import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Design } from '../../design/design.entity';

@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => Design, (design) => design.size)
  designs: Design[];
}
