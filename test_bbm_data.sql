-- Insert additional test data for BBM reports

-- Insert more SPBU data
INSERT INTO `spbu` (`id_spbu`, `no_spbu`, `id_kecamatan`, `id_kelurahan`, `alamat`, `latitude`, `longitude`, `telepon`, `penanggung_jawab`, `nomor_hp_penanggung_jawab`, `status`, `nama_usaha`) VALUES
(3, '44.507.04', 1, 1, 'Jl. Soekarno - Hatta', -7.3373870, 110.5003844, '098765', 'Budi', '081234567890', 'Aktif', 'SPBU Soekarno Hatta'),
(4, '44.507.05', 2, 2, 'Jl. Diponegoro No 173', -7.3364602, 110.5036906, '098766', 'Sari', '081234567891', 'Aktif', 'SPBU Diponegoro');

-- Insert more jenis BBM data
INSERT INTO `jenis_bbm` (`id_jenis_bbm`, `jenis_bbm`, `keterangan`) VALUES
(8, 'PREMIUM', 'BBM jenis Premium'),
(9, 'BIO SOLAR', 'BBM jenis Bio Solar'),
(10, 'PERTAMAX PLUS', 'BBM jenis Pertamax Plus');

-- Insert realisasi BBM for SPBU 3
INSERT INTO `realisasi_bulanan_bbm` (`id_realisasi_bbm`, `id_spbu`, `keterangan`, `created_at`, `updated_at`) VALUES
(2, 3, 'Data SPBU Soekarno Hatta', '2025-09-03 05:28:42', '2025-09-03 05:28:42'),
(3, 4, 'Data SPBU Diponegoro', '2025-09-03 05:28:42', '2025-09-03 05:28:42');

-- Insert detailed realisasi for February 2022
INSERT INTO `realisasi_bulanan_bbm_detail` (`id_detail`, `id_realisasi_bbm`, `bulan`, `tahun`, `id_jenis_bbm`, `realisasi_liter`, `created_at`, `updated_at`) VALUES
-- SPBU 3 (Soekarno Hatta) - February 2022
(2, 2, 2, 2022, 1, 340564.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'), -- Pertalite
(3, 2, 2, 2022, 2, 90034.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'),  -- Pertamax
(4, 2, 2, 2022, 9, 113985.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'), -- Bio Solar
(5, 2, 2, 2022, 5, 17044.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'),  -- Dexlite

-- SPBU 4 (Diponegoro) - February 2022
(6, 3, 2, 2022, 1, 276063.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'), -- Pertalite
(7, 3, 2, 2022, 2, 42303.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'),  -- Pertamax
(8, 3, 2, 2022, 9, 69504.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'),  -- Bio Solar
(9, 3, 2, 2022, 5, 4983.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00');   -- Dexlite

-- Insert data for yearly report (multiple months)
-- SPBU 3 - January 2022
INSERT INTO `realisasi_bulanan_bbm_detail` (`id_detail`, `id_realisasi_bbm`, `bulan`, `tahun`, `id_jenis_bbm`, `realisasi_liter`, `created_at`, `updated_at`) VALUES
(10, 2, 1, 2022, 1, 320000.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'), -- Pertalite
(11, 2, 1, 2022, 2, 85000.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'),  -- Pertamax
(12, 2, 1, 2022, 9, 110000.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'), -- Bio Solar

-- SPBU 3 - March 2022
(13, 2, 3, 2022, 1, 350000.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'), -- Pertalite
(14, 2, 3, 2022, 2, 95000.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'),  -- Pertamax
(15, 2, 3, 2022, 9, 120000.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00'); -- Bio Solar