const mysql = require('mysql2/promise');

async function addKeteranganColumn() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'simdag_main_db'
    });

    console.log('Connected to MySQL database');

    // Check if keterangan column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'simdag_main_db' 
      AND TABLE_NAME = 'realisasi_bulanan_lpg' 
      AND COLUMN_NAME = 'keterangan'
    `);

    if (columns.length > 0) {
      console.log('Column keterangan already exists in realisasi_bulanan_lpg table');
    } else {
      // Add keterangan column
      console.log('Adding keterangan column to realisasi_bulanan_lpg table...');
      await connection.execute(`
        ALTER TABLE realisasi_bulanan_lpg 
        ADD COLUMN keterangan TEXT NULL
      `);
      console.log('Column keterangan added successfully to realisasi_bulanan_lpg table');
    }

    await connection.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addKeteranganColumn();