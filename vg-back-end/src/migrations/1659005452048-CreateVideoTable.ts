import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateVideoTable1658831111628 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'video',
        columns:[
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'path',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'authorId',
            type: 'int',
            isNullable: false,
            default: '1',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'video',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('video');
  }

}
