import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entities
import { BaseEntity } from '../base/base.entity';

@Entity('video', {})
export class Video extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ nullable: false })
  path: string;

  toJSON() {
    return this;
  }

}
