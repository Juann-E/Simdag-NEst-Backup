-- Buat database
CREATE DATABASE IF NOT EXISTS Simdag_Main_db;
USE Simdag_Main_db;

-- Tabel users
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','operator') DEFAULT 'operator',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel nama_pasar
CREATE TABLE nama_pasar (
    id_pasar INT AUTO_INCREMENT PRIMARY KEY,
    nama_pasar VARCHAR(100) NOT NULL,
    alamat TEXT,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gambar VARCHAR(255) NULL,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL
);

-- Tabel satuan_barang
CREATE TABLE satuan_barang (
    id_satuan INT AUTO_INCREMENT PRIMARY KEY,
    satuan_barang VARCHAR(50) NOT NULL,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel nama_barang
CREATE TABLE nama_barang (
    id_barang INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(100) NOT NULL,
    id_satuan INT NOT NULL,
    keterangan TEXT,
    gambar VARCHAR(255), -- <--- kolom baru
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_satuan) REFERENCES satuan_barang(id_satuan)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Tabel barang_pasar_grid
CREATE TABLE barang_pasar_grid (
    id_barang_pasar INT AUTO_INCREMENT PRIMARY KEY,
    id_pasar INT NOT NULL,
    id_barang INT NOT NULL,
    keterangan TEXT,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pasar) REFERENCES nama_pasar(id_pasar)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_barang) REFERENCES nama_barang(id_barang)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- Tabel harga_barang_pasar
CREATE TABLE harga_barang_pasar (
    id_harga INT AUTO_INCREMENT PRIMARY KEY,
    id_barang_pasar INT NOT NULL,
    harga DECIMAL(15,2) NOT NULL,
    keterangan TEXT,
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_harga DATE NOT NULL,
    FOREIGN KEY (id_barang_pasar) REFERENCES barang_pasar_grid(id_barang_pasar)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- Optional: View untuk menghitung persentase perubahan harga H-1 vs terbaru
CREATE VIEW view_perubahan_harga AS
SELECT 
    h1.id_barang_pasar,
    bpg.id_pasar,
    np.nama_pasar,
    nb.nama_barang,
    h1.harga AS harga_terbaru,
    h2.harga AS harga_h_1,
    ROUND(((h1.harga - h2.harga) / h2.harga) * 100, 2) AS persen_perubahan
FROM harga_barang_pasar h1
JOIN harga_barang_pasar h2 
    ON h1.id_barang_pasar = h2.id_barang_pasar
    AND DATE(h2.time_stamp) = DATE(h1.time_stamp) - INTERVAL 1 DAY
JOIN barang_pasar_grid bpg ON h1.id_barang_pasar = bpg.id_barang_pasar
JOIN nama_pasar np ON bpg.id_pasar = np.id_pasar
JOIN nama_barang nb ON bpg.id_barang = nb.id_barang;



-- ======================== SPBU LPG================================================

-- Table kecamatan
CREATE TABLE kecamatan (
    id_kecamatan INT AUTO_INCREMENT PRIMARY KEY,
    nama_kecamatan VARCHAR(100) NOT NULL,
    keterangan TEXT
);

-- Tabel Kelurahan 
CREATE TABLE kelurahan (
    id_kelurahan INT AUTO_INCREMENT PRIMARY KEY,
    id_kecamatan INT NOT NULL,
    nama_kelurahan VARCHAR(100) NOT NULL,
    keterangan TEXT,
    CONSTRAINT fk_kelurahan_kecamatan
      FOREIGN KEY (id_kecamatan) REFERENCES kecamatan(id_kecamatan)
      ON DELETE CASCADE
);

-- table spbu
CREATE TABLE spbu (
    id_spbu INT AUTO_INCREMENT PRIMARY KEY,
    no_spbu VARCHAR(50) NOT NULL,
    id_kecamatan INT NOT NULL,
    id_kelurahan INT NOT NULL,
    alamat TEXT NOT NULL,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    telepon VARCHAR(50),
    penanggung_jawab VARCHAR(100),
    FOREIGN KEY (id_kecamatan) REFERENCES kecamatan(id_kecamatan),
    FOREIGN KEY (id_kelurahan) REFERENCES kelurahan(id_kelurahan)
);
