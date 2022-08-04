import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// Entities
import { BaseEntity } from '../base/base.entity';
import { Role } from '../role/role.entity';

@Entity('user', { orderBy: { id: 'DESC' } })
export class User extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 100, nullable: false })
  @Unique(['email'])
  email: string;

  @Column({ length: 100, nullable: false, select: false })
  password: string;

  @Column({ length: 255, nullable: false })
  firstName: string;

  @Column({ length: 255, nullable: false })
  lastName: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: false })
  roleId: number;

  @ManyToOne(() => Role, (role: Role) => role.id)
  role: Role;

  toJSON() {
    delete this.isDeleted;
    return this;
  }

}
