import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeamPhotosTable1757381978000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'team_photos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'member_id',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
          },
          {
            name: 'position',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'nip',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'photo',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'responsibilities',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('team_photos');
  }
}