import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateVideoUserTable1659077714034 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'video_user',
        columns: [
          {
            name: 'videoId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'userId',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'video_user',
      new TableForeignKey({
        columnNames: ['videoId'],
        referencedTableName: 'video',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'video_user',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('video_user');
  }

}
