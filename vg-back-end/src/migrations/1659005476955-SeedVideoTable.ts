import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

// Entities
import { Video } from '../modules/video/entity/video.entity';

// Seeds
import { videoSeed } from '../modules/video/seed/video.seed';

export class SeedVideoTable1658831613059 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(Video).save(videoSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
