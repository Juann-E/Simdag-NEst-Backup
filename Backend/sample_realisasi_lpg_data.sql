-- Sample data untuk testing realisasi bulanan LPG
-- Pastikan tabel agen sudah ada data sebelum menjalankan script ini

-- Data realisasi LPG untuk tahun 2025 (bulan dan tahun sebagai integer)
INSERT INTO `realisasi_bulanan_lpg` (`id_agen`, `bulan`, `tahun`, `realisasi_tabung`) VALUES
(1, 1, 2025, 1400),  -- Januari 2025
(2, 1, 2025, 1050),  -- Januari 2025
(3, 1, 2025, 850),   -- Januari 2025
(1, 2, 2025, 1420),  -- Februari 2025
(2, 2, 2025, 1150),  -- Februari 2025
(3, 2, 2025, 900),   -- Februari 2025
(1, 3, 2025, 1380),  -- Maret 2025
(2, 3, 2025, 1200),  -- Maret 2025
(3, 3, 2025, 950),   -- Maret 2025
(1, 4, 2025, 1450),  -- April 2025
(2, 4, 2025, 1100),  -- April 2025
(3, 4, 2025, 800),   -- April 2025
(1, 5, 2025, 1500),  -- Mei 2025
(2, 5, 2025, 1250),  -- Mei 2025
(3, 5, 2025, 1000),  -- Mei 2025
(1, 6, 2025, 1350),  -- Juni 2025
(2, 6, 2025, 1180),  -- Juni 2025
(3, 6, 2025, 920),   -- Juni 2025
(1, 7, 2025, 1480),  -- Juli 2025
(2, 7, 2025, 1220),  -- Juli 2025
(3, 7, 2025, 980),   -- Juli 2025
(1, 8, 2025, 1520),  -- Agustus 2025
(2, 8, 2025, 1300),  -- Agustus 2025
(3, 8, 2025, 1050),  -- Agustus 2025
(1, 9, 2025, 1400),  -- September 2025
(2, 9, 2025, 1150),  -- September 2025
(3, 9, 2025, 900),   -- September 2025
(1, 10, 2025, 1600), -- Oktober 2025
(2, 10, 2025, 1350), -- Oktober 2025
(3, 10, 2025, 1100), -- Oktober 2025
(1, 11, 2025, 1550), -- November 2025
(2, 11, 2025, 1280), -- November 2025
(3, 11, 2025, 1020), -- November 2025
(1, 12, 2025, 1700), -- Desember 2025
(2, 12, 2025, 1400), -- Desember 2025
(3, 12, 2025, 1200); -- Desember 2025

-- Untuk tahun 2024 juga (beberapa bulan)
INSERT INTO `realisasi_bulanan_lpg` (`id_agen`, `bulan`, `tahun`, `realisasi_tabung`) VALUES
(1, 10, 2024, 1300), -- Oktober 2024
(2, 10, 2024, 1100), -- Oktober 2024
(3, 10, 2024, 850),  -- Oktober 2024
(1, 11, 2024, 1350), -- November 2024
(2, 11, 2024, 1150), -- November 2024
(3, 11, 2024, 900),  -- November 2024
(1, 12, 2024, 1400), -- Desember 2024
(2, 12, 2024, 1200), -- Desember 2024
(3, 12, 2024, 950);  -- Desember 2024