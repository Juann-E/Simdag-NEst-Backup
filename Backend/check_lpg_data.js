const mysql = require('mysql2/promise');

async function checkLpgData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simdag_main_db'
  });

  try {
    console.log('=== Checking table structure ===');
    const [mainStructure] = await connection.execute('DESCRIBE realisasi_bulanan_lpg');
    console.log('Main table structure:', mainStructure);
    
    const [detailStructure] = await connection.execute('DESCRIBE realisasi_bulanan_lpg_detail');
    console.log('Detail table structure:', detailStructure);
    
    const [agenStructure] = await connection.execute('DESCRIBE agen');
    console.log('Agen table structure:', agenStructure);
    
    console.log('\n=== Checking realisasi_bulanan_lpg table ===');
    const [mainRows] = await connection.execute('SELECT * FROM realisasi_bulanan_lpg LIMIT 10');
    console.log('Main table data:', mainRows);
    
    console.log('\n=== Checking realisasi_bulanan_lpg_detail table ===');
    const [detailRows] = await connection.execute('SELECT * FROM realisasi_bulanan_lpg_detail LIMIT 10');
    console.log('Detail table data:', detailRows);
    
    console.log('\n=== Checking data for February 2025 ===');
    const [febData] = await connection.execute(`
      SELECT 
        main.id_realisasi_lpg, main.id_agen, 
        detail.bulan, detail.tahun, detail.id_detail, detail.realisasi_tabung,
        agen.nama_usaha, agen.alamat
      FROM realisasi_bulanan_lpg main
      LEFT JOIN realisasi_bulanan_lpg_detail detail ON main.id_realisasi_lpg = detail.id_realisasi_lpg
      LEFT JOIN agen ON main.id_agen = agen.id_agen
      WHERE detail.bulan = 2 AND detail.tahun = 2025
      ORDER BY main.id_realisasi_lpg
    `);
    console.log('February 2025 data with joins:', febData);
    
    console.log('\n=== Checking data for January 2025 ===');
    const [janData] = await connection.execute(`
      SELECT 
        main.id_realisasi_lpg, main.id_agen, 
        detail.bulan, detail.tahun, detail.id_detail, detail.realisasi_tabung,
        agen.nama_usaha, agen.alamat
      FROM realisasi_bulanan_lpg main
      LEFT JOIN realisasi_bulanan_lpg_detail detail ON main.id_realisasi_lpg = detail.id_realisasi_lpg
      LEFT JOIN agen ON main.id_agen = agen.id_agen
      WHERE detail.bulan = 1 AND detail.tahun = 2025
      ORDER BY main.id_realisasi_lpg
    `);
    console.log('January 2025 data with joins:', janData);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkLpgData();