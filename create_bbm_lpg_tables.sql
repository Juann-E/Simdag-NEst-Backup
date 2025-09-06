-- SQL untuk membuat tabel-tabel BBM LPG
-- Dibuat berdasarkan saran struktur database

-- 1. Tabel Jenis BBM
CREATE TABLE `jenis_bbm` (
  `id_jenis_bbm` int NOT NULL AUTO_INCREMENT,
  `jenis_bbm` varchar(100) NOT NULL,
  `keterangan` text,
  PRIMARY KEY (`id_jenis_bbm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Tabel Realisasi Bulanan LPG
CREATE TABLE `realisasi_bulanan_lpg` (
  `id_realisasi_lpg` int NOT NULL AUTO_INCREMENT,
  `id_agen` int NOT NULL,
  `tanggal` date NOT NULL COMMENT 'Format: YYYY-MM-01 untuk bulan dan tahun',
  `realisasi_tabung` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_realisasi_lpg`),
  KEY `FK_realisasi_lpg_agen` (`id_agen`),
  CONSTRAINT `FK_realisasi_lpg_agen` FOREIGN KEY (`id_agen`) REFERENCES `agen` (`id_agen`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Tabel Realisasi Bulanan BBM
CREATE TABLE `realisasi_bulanan_bbm` (
  `id_realisasi_bbm` int NOT NULL AUTO_INCREMENT,
  `id_spbu` int NOT NULL,
  `tanggal` date NOT NULL COMMENT 'Format: YYYY-MM-01 untuk bulan dan tahun',
  `id_jenis_bbm` int NOT NULL,
  `realisasi_liter` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_realisasi_bbm`),
  KEY `FK_realisasi_bbm_spbu` (`id_spbu`),
  KEY `FK_realisasi_bbm_jenis` (`id_jenis_bbm`),
  CONSTRAINT `FK_realisasi_bbm_spbu` FOREIGN KEY (`id_spbu`) REFERENCES `spbu` (`id_spbu`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_realisasi_bbm_jenis` FOREIGN KEY (`id_jenis_bbm`) REFERENCES `jenis_bbm` (`id_jenis_bbm`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert data dummy untuk Jenis BBM
INSERT INTO `jenis_bbm` (`jenis_bbm`, `keterangan`) VALUES
('Pertalite', 'BBM jenis Pertalite dengan RON 90'),
('Pertamax', 'BBM jenis Pertamax dengan RON 92'),
('Pertamax Turbo', 'BBM jenis Pertamax Turbo dengan RON 98'),
('Solar', 'BBM jenis Solar untuk kendaraan diesel'),
('Dexlite', 'BBM jenis Dexlite untuk kendaraan diesel'),
('Pertamina Dex', 'BBM jenis Pertamina Dex premium diesel');

-- Insert data dummy untuk Realisasi Bulanan LPG (contoh untuk beberapa agen)
INSERT INTO `realisasi_bulanan_lpg` (`id_agen`, `tanggal`, `realisasi_tabung`) VALUES
(1, '2024-01-01', 1500.00),
(1, '2024-02-01', 1650.00),
(1, '2024-03-01', 1400.00),
(2, '2024-01-01', 2000.00),
(2, '2024-02-01', 2100.00),
(2, '2024-03-01', 1950.00);

-- Insert data dummy untuk Realisasi Bulanan BBM (contoh untuk beberapa SPBU)
INSERT INTO `realisasi_bulanan_bbm` (`id_spbu`, `tanggal`, `id_jenis_bbm`, `realisasi_liter`) VALUES
(1, '2024-01-01', 1, 15000.00),
(1, '2024-01-01', 2, 8000.00),
(1, '2024-01-01', 4, 12000.00),
(1, '2024-02-01', 1, 16500.00),
(1, '2024-02-01', 2, 8500.00),
(1, '2024-02-01', 4, 13000.00),
(2, '2024-01-01', 1, 20000.00),
(2, '2024-01-01', 2, 10000.00),
(2, '2024-01-01', 4, 15000.00);

-- Membuat index untuk optimasi query
CREATE INDEX `idx_realisasi_lpg_tanggal` ON `realisasi_bulanan_lpg` (`tanggal`);
CREATE INDEX `idx_realisasi_bbm_tanggal` ON `realisasi_bulanan_bbm` (`tanggal`);
CREATE INDEX `idx_realisasi_lpg_agen_tanggal` ON `realisasi_bulanan_lpg` (`id_agen`, `tanggal`);
CREATE INDEX `idx_realisasi_bbm_spbu_tanggal` ON `realisasi_bulanan_bbm` (`id_spbu`, `tanggal`);