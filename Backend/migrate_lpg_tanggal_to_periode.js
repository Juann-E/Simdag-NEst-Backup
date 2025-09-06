const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateLpgTanggalToPeriode() {
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

    // Check if tanggal column exists
    console.log('Checking current table structure...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'realisasi_bulanan_lpg'
    `, [process.env.DB_NAME || 'simdag_main_db']);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Current columns:', columnNames);
    
    const hasTanggal = columnNames.includes('tanggal');
    const hasPeriode = columnNames.includes('periode');
    
    if (!hasTanggal && hasPeriode) {
      console.log('Migration already completed. Table already has periode column and no tanggal column.');
      return;
    }
    
    if (!hasTanggal) {
      console.log('No tanggal column found. Adding periode column...');
      await connection.execute(`
        ALTER TABLE realisasi_bulanan_lpg 
        ADD COLUMN periode VARCHAR(7) NOT NULL AFTER id_agen
      `);
      console.log('Periode column added successfully');
      return;
    }

    // Step 1: Add periode column if it doesn't exist
    if (!hasPeriode) {
      console.log('Adding periode column...');
      await connection.execute(`
        ALTER TABLE realisasi_bulanan_lpg 
        ADD COLUMN periode VARCHAR(7) AFTER id_agen
      `);
      console.log('Periode column added successfully');
    }

    // Step 2: Migrate data from tanggal to periode
    console.log('Migrating data from tanggal to periode...');
    await connection.execute(`
      UPDATE realisasi_bulanan_lpg 
      SET periode = DATE_FORMAT(tanggal, '%Y-%m') 
      WHERE tanggal IS NOT NULL
    `);
    console.log('Data migration completed');

    // Step 3: Make periode column NOT NULL
    console.log('Making periode column NOT NULL...');
    await connection.execute(`
      ALTER TABLE realisasi_bulanan_lpg 
      MODIFY COLUMN periode VARCHAR(7) NOT NULL
    `);
    console.log('Periode column set to NOT NULL');

    // Step 4: Drop tanggal column
    console.log('Dropping tanggal column...');
    await connection.execute(`
      ALTER TABLE realisasi_bulanan_lpg 
      DROP COLUMN tanggal
    `);
    console.log('Tanggal column dropped successfully');

    // Verify the migration
    console.log('\nVerifying migration...');
    const [result] = await connection.execute(`
      SELECT id_realisasi_lpg, id_agen, periode, realisasi_tabung 
      FROM realisasi_bulanan_lpg 
      LIMIT 5
    `);
    
    console.log('Sample data after migration:');
    console.table(result);
    
    console.log('\n=== Migration completed successfully! ===');
    console.log('- tanggal column has been removed');
    console.log('- periode column (VARCHAR(7)) has been added');
    console.log('- Data has been migrated from YYYY-MM-DD format to YYYY-MM format');
    
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the migration
migrateLpgTanggalToPeriode()
  .then(() => {
    console.log('Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });