const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importTestData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simdag_main_db'
  });

  try {
    console.log('Connected to database');
    
    // Read SQL file
    const sqlFile = path.join(__dirname, 'test_bbm_data.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim().startsWith('--') || statement.trim().length === 0) {
        continue;
      }
      
      try {
        await connection.execute(statement.trim());
        console.log('Executed statement successfully');
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log('Duplicate entry, skipping...');
        } else {
          console.error('Error executing statement:', error.message);
        }
      }
    }
    
    console.log('Test data imported successfully');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

importTestData();