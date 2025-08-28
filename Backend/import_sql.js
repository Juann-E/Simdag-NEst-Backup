const mysql = require('mysql2/promise');

async function importSQL() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'simdag_main_db'
    });

    console.log('Connected to MySQL database');

    // Execute SQL statements one by one
    console.log('Creating komoditas_stock_pangan table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS komoditas_stock_pangan (
        id_komoditas INT AUTO_INCREMENT PRIMARY KEY,
        komoditas VARCHAR(100) NOT NULL,
        satuan VARCHAR(50) NOT NULL,
        keterangan TEXT,
        gambar VARCHAR(255),
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating distributor table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS distributor (
        id_distributor INT AUTO_INCREMENT PRIMARY KEY,
        nama_distributor VARCHAR(100) NOT NULL,
        id_kecamatan INT NOT NULL,
        id_kelurahan INT NOT NULL,
        alamat TEXT NOT NULL,
        koordinat VARCHAR(255),
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        keterangan TEXT,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_kecamatan) REFERENCES kecamatan(id_kecamatan),
        FOREIGN KEY (id_kelurahan) REFERENCES kelurahan(id_kelurahan)
      )
    `);

    console.log('Creating transaksi_stock_pangan table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS transaksi_stock_pangan (
        id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
        tahun INT NOT NULL,
        bulan INT NOT NULL,
        id_distributor INT NOT NULL,
        id_komoditas INT NOT NULL,
        stock_awal DECIMAL(10,2) NOT NULL DEFAULT 0,
        pengadaan DECIMAL(10,2) NOT NULL DEFAULT 0,
        penyaluran DECIMAL(10,2) NOT NULL DEFAULT 0,
        keterangan TEXT,
        time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_distributor) REFERENCES distributor(id_distributor),
        FOREIGN KEY (id_komoditas) REFERENCES komoditas_stock_pangan(id_komoditas)
      )
    `);

    console.log('Inserting komoditas data...');
    await connection.execute(`
      INSERT IGNORE INTO komoditas_stock_pangan (id_komoditas, komoditas, satuan) VALUES
      (1, 'Beras', 'kg'),
      (2, 'Gula Pasir', 'kg'),
      (3, 'Minyak Goreng', 'liter'),
      (4, 'Tepung Terigu', 'kg'),
      (5, 'Daging Sapi', 'kg'),
      (6, 'Daging Ayam', 'kg'),
      (7, 'Telur Ayam', 'kg'),
      (8, 'Cabai Merah', 'kg'),
      (9, 'Bawang Merah', 'kg'),
      (10, 'Bawang Putih', 'kg')
    `);

    console.log('Inserting distributor data...');
    await connection.execute(`
      INSERT IGNORE INTO distributor (id_distributor, nama_distributor, id_kecamatan, id_kelurahan, alamat, keterangan) VALUES
      (1, 'PT Distributor Utama', 1, 1, 'Jl. Raya No. 123, Surabaya', 'Distributor utama beras dan gula'),
      (2, 'CV Sumber Pangan', 1, 2, 'Jl. Merdeka No. 456, Malang', 'Distributor minyak goreng dan tepung'),
      (3, 'UD Berkah Jaya', 1, 3, 'Jl. Pahlawan No. 789, Sidoarjo', 'Distributor daging dan telur'),
      (4, 'PT Pangan Nusantara', 1, 4, 'Jl. Diponegoro No. 321, Gresik', 'Distributor sayuran dan bumbu'),
      (5, 'CV Makmur Sejahtera', 1, 5, 'Jl. Sudirman No. 654, Mojokerto', 'Distributor umum semua komoditas')
    `);

    console.log('Inserting transaction data...');
    const transactionData = [
      [2025, 3, 1000, 500, 300, 1, 1, 'Transaksi Beras Maret'],
      [2025, 3, 800, 200, 150, 2, 2, 'Transaksi Gula Pasir Maret'],
      [2025, 3, 600, 300, 200, 3, 3, 'Transaksi Minyak Goreng Maret'],
      [2025, 4, 1200, 600, 400, 1, 1, 'Transaksi Beras April'],
      [2025, 4, 850, 250, 180, 2, 2, 'Transaksi Gula Pasir April'],
      [2025, 4, 700, 350, 250, 3, 3, 'Transaksi Minyak Goreng April'],
      [2025, 5, 1400, 700, 500, 1, 2, 'Transaksi Beras Mei'],
      [2025, 5, 920, 300, 220, 2, 3, 'Transaksi Gula Pasir Mei'],
      [2025, 5, 800, 400, 300, 3, 4, 'Transaksi Minyak Goreng Mei'],
      [2025, 6, 1600, 800, 600, 1, 3, 'Transaksi Beras Juni'],
      [2025, 6, 1000, 350, 260, 2, 4, 'Transaksi Gula Pasir Juni'],
      [2025, 6, 900, 450, 350, 3, 5, 'Transaksi Minyak Goreng Juni'],
      [2025, 7, 1800, 900, 700, 1, 4, 'Transaksi Beras Juli'],
      [2025, 7, 1090, 400, 300, 2, 5, 'Transaksi Gula Pasir Juli'],
      [2025, 7, 1000, 500, 400, 3, 1, 'Transaksi Minyak Goreng Juli'],
      [2025, 8, 2000, 1000, 800, 1, 5, 'Transaksi Beras Agustus'],
      [2025, 8, 1190, 450, 350, 2, 1, 'Transaksi Gula Pasir Agustus'],
      [2025, 8, 1100, 550, 450, 3, 2, 'Transaksi Minyak Goreng Agustus']
    ];

    for (const data of transactionData) {
      await connection.execute(
        'INSERT IGNORE INTO transaksi_stock_pangan (tahun, bulan, stock_awal, pengadaan, penyaluran, id_komoditas, id_distributor, keterangan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        data
      );
    }

    console.log('All data inserted successfully!');

    // Close connection
    await connection.end();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error importing SQL:', error);
    process.exit(1);
  }
}

importSQL();