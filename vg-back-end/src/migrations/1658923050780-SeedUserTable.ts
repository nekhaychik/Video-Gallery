import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

// Entities
import { User } from '../entities/user/user.entity';

// Seeds
import { userSeed } from '../modules/user/seeds/user.seed';

export class SeedUserTable1658923050780 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(User).save(userSeed)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
