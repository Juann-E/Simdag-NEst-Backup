const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importBbmLpgSQL() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'simdag_main_db'
    });

    console.log('Connected to MySQL database');

    // Read SQL file
    const sqlFile = path.join(__dirname, '..', 'create_bbm_lpg_tables.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Remove comments and split SQL statements by semicolon
    const cleanedContent = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    const statements = cleanedContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && stmt.toUpperCase().includes('CREATE TABLE'));

    console.log('CREATE TABLE statements to execute:');
    statements.forEach((stmt, i) => {
      const tableName = stmt.match(/CREATE TABLE `?([^`\s]+)`?/i);
      console.log(`${i + 1}: ${tableName ? tableName[1] : 'Unknown table'}`);
    });

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}...`);
          await connection.execute(statement);
          console.log(`Statement ${i + 1} executed successfully`);
        } catch (error) {
          console.log(`Error in statement ${i + 1}:`, error.message);
          // Continue with next statement even if one fails
        }
      }
    }

    console.log('BBM LPG tables import completed!');
    await connection.end();

  } catch (error) {
    console.error('Error importing BBM LPG tables:', error);
    process.exit(1);
  }
}

// Run the import
importBbmLpgSQL();