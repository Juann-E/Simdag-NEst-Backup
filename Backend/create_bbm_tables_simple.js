const mysql = require('mysql2/promise');

async function createBbmTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'simdag_main_db'
    });

    console.log('Connected to MySQL database');

    // Create jenis_bbm table
    console.log('Creating jenis_bbm table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jenis_bbm (
        id_jenis_bbm int NOT NULL AUTO_INCREMENT,
        jenis_bbm varchar(100) NOT NULL,
        keterangan text,
        PRIMARY KEY (id_jenis_bbm)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('jenis_bbm table created successfully');

    // Create realisasi_bulanan_lpg table
    console.log('Creating realisasi_bulanan_lpg table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS realisasi_bulanan_lpg (
        id_realisasi_lpg int NOT NULL AUTO_INCREMENT,
        id_agen int NOT NULL,
        tanggal date NOT NULL COMMENT 'Format: YYYY-MM-01 untuk bulan dan tahun',
        realisasi_tabung decimal(10,2) NOT NULL DEFAULT '0.00',
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id_realisasi_lpg),
        KEY FK_realisasi_lpg_agen (id_agen),
        CONSTRAINT FK_realisasi_lpg_agen FOREIGN KEY (id_agen) REFERENCES agen (id_agen) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('realisasi_bulanan_lpg table created successfully');

    // Create realisasi_bulanan_bbm table
    console.log('Creating realisasi_bulanan_bbm table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS realisasi_bulanan_bbm (
        id_realisasi_bbm int NOT NULL AUTO_INCREMENT,
        id_spbu int NOT NULL,
        tanggal date NOT NULL COMMENT 'Format: YYYY-MM-01 untuk bulan dan tahun',
        id_jenis_bbm int NOT NULL,
        realisasi_liter decimal(10,2) NOT NULL DEFAULT '0.00',
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id_realisasi_bbm),
        KEY FK_realisasi_bbm_spbu (id_spbu),
        KEY FK_realisasi_bbm_jenis (id_jenis_bbm),
        CONSTRAINT FK_realisasi_bbm_spbu FOREIGN KEY (id_spbu) REFERENCES spbu (id_spbu) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT FK_realisasi_bbm_jenis FOREIGN KEY (id_jenis_bbm) REFERENCES jenis_bbm (id_jenis_bbm) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('realisasi_bulanan_bbm table created successfully');

    // Insert sample data for jenis_bbm
    console.log('Inserting sample data for jenis_bbm...');
    await connection.execute(`
      INSERT IGNORE INTO jenis_bbm (jenis_bbm, keterangan) VALUES
      ('Pertalite', 'BBM jenis Pertalite dengan RON 90'),
      ('Pertamax', 'BBM jenis Pertamax dengan RON 92'),
      ('Pertamax Turbo', 'BBM jenis Pertamax Turbo dengan RON 98'),
      ('Solar', 'BBM jenis Solar untuk kendaraan diesel'),
      ('Dexlite', 'BBM jenis Dexlite untuk kendaraan diesel'),
      ('Pertamina Dex', 'BBM jenis Pertamina Dex premium diesel')
    `);
    console.log('Sample data inserted successfully');

    console.log('All BBM LPG tables created successfully!');
    await connection.end();

  } catch (error) {
    console.error('Error creating BBM LPG tables:', error);
    process.exit(1);
  }
}

// Run the creation
createBbmTables();