import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class CreateUserTable1658922202958 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'isDeleted',
            type: 'tinyint',
            default: '0',
          },
          {
            name: 'roleId',
            type: 'int',
            default: '2',
          },
        ],
        uniques: [
          {
            columnNames: ['email'],
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedTableName: 'role',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }

}
