const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    // Koneksi ke MySQL tanpa database spesifik
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('Connected to MySQL server');

    // Buat database
    await connection.execute('CREATE DATABASE IF NOT EXISTS simdag_main_db');
    console.log('Database simdag_main_db created or already exists');

    // Tutup koneksi pertama
    await connection.end();

    // Koneksi ke database yang baru dibuat
    const dbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'simdag_main_db',
      port: 3306
    });

    console.log('Connected to simdag_main_db database');

    // Baca file SQL
    const sqlFile = path.join(__dirname, '..', 'Data Gambaran', 'Simdag_Main_db.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL statements dan eksekusi satu per satu
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('CREATE DATABASE') && !stmt.startsWith('USE'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await dbConnection.execute(statement);
          console.log('Executed:', statement.substring(0, 50) + '...');
        } catch (err) {
          console.log('Warning:', err.message);
        }
      }
    }

    await dbConnection.end();
    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();