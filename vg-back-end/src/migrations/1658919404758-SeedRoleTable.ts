import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

// Entities
import { Role } from '../entities/role/role.entity';

// Seeds
import { roleSeed } from '../modules/user/seeds/role.seed';

export class SeedRoleTable1658919404758 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(Role).save(roleSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
