const mysql = require('mysql2/promise');

async function addFebruaryData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simdag_main_db'
  });

  try {
    console.log('Adding February 2025 data...');
    
    // Insert main records for February 2025
    await connection.execute(`
      INSERT INTO realisasi_bulanan_lpg (id_agen, keterangan) VALUES 
      (1, 'Data realisasi Februari 2025'),
      (2, 'Data realisasi Februari 2025'),
      (3, 'Data realisasi Februari 2025')
    `);
    
    // Get the inserted IDs
    const [mainRecords] = await connection.execute(`
      SELECT id_realisasi_lpg, id_agen FROM realisasi_bulanan_lpg 
      WHERE keterangan = 'Data realisasi Februari 2025'
      ORDER BY id_realisasi_lpg
    `);
    
    console.log('Inserted main records:', mainRecords);
    
    // Insert detail records for February 2025
    for (const record of mainRecords) {
      const realisasiTabung = record.id_agen === 1 ? 1800 : record.id_agen === 2 ? 1400 : 1100;
      await connection.execute(`
        INSERT INTO realisasi_bulanan_lpg_detail (id_realisasi_lpg, bulan, tahun, realisasi_tabung) 
        VALUES (?, 2, 2025, ?)
      `, [record.id_realisasi_lpg, realisasiTabung]);
    }
    
    console.log('February 2025 data added successfully!');
    
    // Verify the data
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
    console.log('February 2025 data verification:', febData);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

addFebruaryData();