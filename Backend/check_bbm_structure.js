const mysql = require('mysql2/promise');

async function testSimpleQuery() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simdag_main_db'
  });

  try {
    console.log('Testing simple BBM query...');
    
    // Test simple query without joins
    const [simpleResult] = await connection.execute(
      'SELECT * FROM realisasi_bulanan_bbm WHERE id_spbu = ? LIMIT 5',
      [1]
    );
    console.log('Simple BBM query result:');
    console.table(simpleResult);
    
    // Test with SPBU join
    const [withSpbuResult] = await connection.execute(
      `SELECT bbm.*, spbu.nama_usaha 
       FROM realisasi_bulanan_bbm bbm 
       LEFT JOIN spbu ON spbu.id_spbu = bbm.id_spbu 
       WHERE bbm.id_spbu = ? LIMIT 3`,
      [1]
    );
    console.log('\nWith SPBU join:');
    console.table(withSpbuResult);
    
    // Test with jenis_bbm join
    const [withJenisResult] = await connection.execute(
      `SELECT bbm.*, jenis.jenis_bbm 
       FROM realisasi_bulanan_bbm bbm 
       LEFT JOIN jenis_bbm jenis ON jenis.id_jenis_bbm = bbm.id_jenis_bbm 
       WHERE bbm.id_spbu = ? LIMIT 3`,
      [1]
    );
    console.log('\nWith jenis_bbm join:');
    console.table(withJenisResult);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await connection.end();
    console.log('Connection closed');
  }
}

testSimpleQuery();