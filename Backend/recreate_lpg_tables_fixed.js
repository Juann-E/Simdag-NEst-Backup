const mysql = require('mysql2/promise');
require('dotenv').config();

async function recreateLpgTables() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'simdag_main_db'
    });

    console.log('Connected to MySQL database');

    // Drop existing tables if they exist
    console.log('Dropping existing tables if they exist...');
    await connection.execute('DROP TABLE IF EXISTS `realisasi_bulanan_lpg_detail`');
    await connection.execute('DROP TABLE IF EXISTS `realisasi_bulanan_lpg`');
    console.log('Existing tables dropped successfully');

    // Create realisasi_bulanan_lpg table (main table)
    console.log('Creating realisasi_bulanan_lpg table...');
    const createMainTableQuery = `
      CREATE TABLE \`realisasi_bulanan_lpg\` (
        \`id_realisasi_lpg\` int NOT NULL AUTO_INCREMENT,
        \`id_agen\` int NOT NULL,
        \`keterangan\` text,
        \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_realisasi_lpg\`),
        KEY \`FK_realisasi_lpg_agen\` (\`id_agen\`),
        CONSTRAINT \`FK_realisasi_lpg_agen\` FOREIGN KEY (\`id_agen\`) REFERENCES \`agen\` (\`id_agen\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;
    
    await connection.execute(createMainTableQuery);
    console.log('realisasi_bulanan_lpg table created successfully');

    // Create realisasi_bulanan_lpg_detail table (detail table)
    console.log('Creating realisasi_bulanan_lpg_detail table...');
    const createDetailTableQuery = `
      CREATE TABLE \`realisasi_bulanan_lpg_detail\` (
        \`id_detail\` int NOT NULL AUTO_INCREMENT,
        \`id_realisasi_lpg\` int NOT NULL,
        \`bulan\` int NOT NULL COMMENT 'Bulan (1-12)',
        \`tahun\` int NOT NULL COMMENT 'Tahun',
        \`realisasi_tabung\` int NOT NULL DEFAULT '0' COMMENT 'Jumlah tabung yang direalisasikan',
        \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_detail\`),
        KEY \`FK_detail_realisasi_lpg\` (\`id_realisasi_lpg\`),
        UNIQUE KEY \`unique_agen_bulan_tahun\` (\`id_realisasi_lpg\`, \`bulan\`, \`tahun\`),
        CONSTRAINT \`FK_detail_realisasi_lpg\` FOREIGN KEY (\`id_realisasi_lpg\`) REFERENCES \`realisasi_bulanan_lpg\` (\`id_realisasi_lpg\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`chk_bulan\` CHECK ((\`bulan\` >= 1) AND (\`bulan\` <= 12)),
        CONSTRAINT \`chk_tahun\` CHECK (\`tahun\` >= 2020)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;
    
    await connection.execute(createDetailTableQuery);
    console.log('realisasi_bulanan_lpg_detail table created successfully');

    // Create indexes for better performance
    console.log('Creating indexes...');
    await connection.execute('CREATE INDEX `idx_detail_bulan_tahun` ON `realisasi_bulanan_lpg_detail` (`bulan`, `tahun`)');
    await connection.execute('CREATE INDEX `idx_detail_tahun_bulan` ON `realisasi_bulanan_lpg_detail` (`tahun`, `bulan`)');
    console.log('Indexes created successfully');

    console.log('\n=== Tables created successfully! ===');
    console.log('1. realisasi_bulanan_lpg - Main table with agen reference and keterangan');
    console.log('2. realisasi_bulanan_lpg_detail - Detail table with bulan, tahun, and realisasi_tabung');
    console.log('\nStructure:');
    console.log('- Main table: id_realisasi_lpg, id_agen (FK), keterangan');
    console.log('- Detail table: id_detail, id_realisasi_lpg (FK), bulan, tahun, realisasi_tabung');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the function
recreateLpgTables()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });