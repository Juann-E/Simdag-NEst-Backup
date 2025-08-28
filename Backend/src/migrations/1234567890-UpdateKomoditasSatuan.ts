import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKomoditasSatuan1234567890 implements MigrationInterface {
  name = 'UpdateKomoditasSatuan1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add new satuan column
    await queryRunner.query(
      `ALTER TABLE \`komoditas_stock_pangan\` ADD \`satuan\` varchar(50) NULL`
    );

    // Step 2: Migrate data from relation to direct column
    await queryRunner.query(`
      UPDATE komoditas_stock_pangan k 
      INNER JOIN satuan_barang_stock_pangan s ON s.id_satuan = k.id_satuan
      SET k.satuan = s.satuan_barang
    `);

    // Step 3: Set default value for records without satuan
    await queryRunner.query(`
      UPDATE komoditas_stock_pangan 
      SET satuan = 'kg' 
      WHERE satuan IS NULL OR satuan = ''
    `);

    // Step 4: Make satuan column NOT NULL
    await queryRunner.query(
      `ALTER TABLE \`komoditas_stock_pangan\` MODIFY \`satuan\` varchar(50) NOT NULL`
    );

    // Step 5: Drop foreign key constraint if exists
    try {
      await queryRunner.query(
        `ALTER TABLE \`komoditas_stock_pangan\` DROP FOREIGN KEY \`FK_komoditas_satuan\``
      );
    } catch (error) {
      // Foreign key might not exist, ignore error
      console.log('Foreign key FK_komoditas_satuan not found, skipping...');
    }

    // Step 6: Drop id_satuan column
    await queryRunner.query(
      `ALTER TABLE \`komoditas_stock_pangan\` DROP COLUMN \`id_satuan\``
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse migration - add back id_satuan column and relation
    await queryRunner.query(
      `ALTER TABLE \`komoditas_stock_pangan\` ADD \`id_satuan\` int NULL`
    );

    // Try to restore relation data (this might not be perfect)
    await queryRunner.query(`
      UPDATE komoditas_stock_pangan k 
      INNER JOIN satuan_barang_stock_pangan s ON s.satuan_barang = k.satuan
      SET k.id_satuan = s.id_satuan
    `);

    // Add back foreign key constraint
    await queryRunner.query(
      `ALTER TABLE \`komoditas_stock_pangan\` ADD CONSTRAINT \`FK_komoditas_satuan\` FOREIGN KEY (\`id_satuan\`) REFERENCES \`satuan_barang_stock_pangan\`(\`id_satuan\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    // Drop satuan column
    await queryRunner.query(
      `ALTER TABLE \`komoditas_stock_pangan\` DROP COLUMN \`satuan\``
    );
  }
}