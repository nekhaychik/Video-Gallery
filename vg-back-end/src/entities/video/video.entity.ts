import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Entities
import { BaseEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

@Entity('video', {})
export class Video extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ nullable: false })
  path: string;

  @Column({ nullable: false })
  authorId: number;

  @ManyToOne(() => User, (user: User) => user.id)
  author: User;

}
