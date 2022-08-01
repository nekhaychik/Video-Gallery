import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// Entities
import { User } from './user.entity';

@Entity('role')
export class Role {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => User, (user: User) => user.role)
  users: User[];

}
