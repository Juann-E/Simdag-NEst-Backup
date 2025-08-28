-- Dummy data untuk Stock Pangan Chart
-- Tanggal: 26 Agustus 2025

-- Insert dummy data untuk KomoditasStockPangan jika belum ada
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
(10, 'Bawang Putih', 'kg');

-- Insert dummy data untuk Distributor jika belum ada
INSERT IGNORE INTO distributor (id_distributor, nama_distributor, id_kecamatan, id_kelurahan, alamat, keterangan) VALUES
(1, 'PT Distributor Utama', 1, 1, 'Jl. Raya No. 123, Surabaya', 'Distributor utama beras dan gula'),
(2, 'CV Sumber Pangan', 1, 2, 'Jl. Merdeka No. 456, Malang', 'Distributor minyak goreng dan tepung'),
(3, 'UD Berkah Jaya', 1, 3, 'Jl. Pahlawan No. 789, Sidoarjo', 'Distributor daging dan telur'),
(4, 'PT Pangan Nusantara', 1, 4, 'Jl. Diponegoro No. 321, Gresik', 'Distributor sayuran dan bumbu'),
(5, 'CV Makmur Sejahtera', 1, 5, 'Jl. Sudirman No. 654, Mojokerto', 'Distributor umum semua komoditas');

-- Insert dummy transaksi untuk 6 bulan terakhir (Maret - Agustus 2025)
INSERT INTO transaksi_stock_pangan (tahun, bulan, stock_awal, pengadaan, penyaluran, id_komoditas, id_distributor, keterangan) VALUES
-- Maret 2025
(2025, 3, 1000, 500, 300, 1, 1, 'Transaksi Beras Maret'),
(2025, 3, 800, 200, 150, 2, 2, 'Transaksi Gula Pasir Maret'),
(2025, 3, 600, 300, 200, 3, 3, 'Transaksi Minyak Goreng Maret'),
(2025, 3, 400, 150, 100, 4, 4, 'Transaksi Tepung Terigu Maret'),
(2025, 3, 300, 100, 80, 5, 5, 'Transaksi Daging Sapi Maret'),

-- April 2025
(2025, 4, 1200, 600, 400, 1, 1, 'Transaksi Beras April'),
(2025, 4, 850, 250, 180, 2, 2, 'Transaksi Gula Pasir April'),
(2025, 4, 700, 350, 250, 3, 3, 'Transaksi Minyak Goreng April'),
(2025, 4, 450, 180, 120, 4, 4, 'Transaksi Tepung Terigu April'),
(2025, 4, 320, 120, 90, 5, 5, 'Transaksi Daging Sapi April'),
(2025, 4, 200, 80, 60, 6, 1, 'Transaksi Daging Ayam April'),

-- Mei 2025
(2025, 5, 1400, 700, 500, 1, 2, 'Transaksi Beras Mei'),
(2025, 5, 920, 300, 220, 2, 3, 'Transaksi Gula Pasir Mei'),
(2025, 5, 800, 400, 300, 3, 4, 'Transaksi Minyak Goreng Mei'),
(2025, 5, 510, 200, 140, 4, 5, 'Transaksi Tepung Terigu Mei'),
(2025, 5, 350, 140, 100, 5, 1, 'Transaksi Daging Sapi Mei'),
(2025, 5, 220, 100, 70, 6, 2, 'Transaksi Daging Ayam Mei'),
(2025, 5, 150, 60, 40, 7, 3, 'Transaksi Telur Ayam Mei'),

-- Juni 2025
(2025, 6, 1600, 800, 600, 1, 3, 'Transaksi Beras Juni'),
(2025, 6, 1000, 350, 260, 2, 4, 'Transaksi Gula Pasir Juni'),
(2025, 6, 900, 450, 350, 3, 5, 'Transaksi Minyak Goreng Juni'),
(2025, 6, 570, 220, 160, 4, 1, 'Transaksi Tepung Terigu Juni'),
(2025, 6, 390, 160, 120, 5, 2, 'Transaksi Daging Sapi Juni'),
(2025, 6, 250, 120, 80, 6, 3, 'Transaksi Daging Ayam Juni'),
(2025, 6, 170, 80, 50, 7, 4, 'Transaksi Telur Ayam Juni'),
(2025, 6, 120, 50, 30, 8, 5, 'Transaksi Cabai Merah Juni'),

-- Juli 2025
(2025, 7, 1800, 900, 700, 1, 4, 'Transaksi Beras Juli'),
(2025, 7, 1090, 400, 300, 2, 5, 'Transaksi Gula Pasir Juli'),
(2025, 7, 1000, 500, 400, 3, 1, 'Transaksi Minyak Goreng Juli'),
(2025, 7, 630, 250, 180, 4, 2, 'Transaksi Tepung Terigu Juli'),
(2025, 7, 430, 180, 140, 5, 3, 'Transaksi Daging Sapi Juli'),
(2025, 7, 290, 140, 100, 6, 4, 'Transaksi Daging Ayam Juli'),
(2025, 7, 200, 100, 60, 7, 5, 'Transaksi Telur Ayam Juli'),
(2025, 7, 140, 60, 40, 8, 1, 'Transaksi Cabai Merah Juli'),
(2025, 7, 100, 40, 25, 9, 2, 'Transaksi Bawang Merah Juli'),

-- Agustus 2025 (bulan ini)
(2025, 8, 2000, 1000, 800, 1, 5, 'Transaksi Beras Agustus'),
(2025, 8, 1190, 450, 350, 2, 1, 'Transaksi Gula Pasir Agustus'),
(2025, 8, 1100, 550, 450, 3, 2, 'Transaksi Minyak Goreng Agustus'),
(2025, 8, 700, 280, 200, 4, 3, 'Transaksi Tepung Terigu Agustus'),
(2025, 8, 470, 200, 160, 5, 4, 'Transaksi Daging Sapi Agustus'),
(2025, 8, 330, 160, 120, 6, 5, 'Transaksi Daging Ayam Agustus'),
(2025, 8, 240, 120, 80, 7, 1, 'Transaksi Telur Ayam Agustus'),
(2025, 8, 160, 80, 50, 8, 2, 'Transaksi Cabai Merah Agustus'),
(2025, 8, 115, 50, 30, 9, 3, 'Transaksi Bawang Merah Agustus'),
(2025, 8, 80, 30, 20, 10, 4, 'Transaksi Bawang Putih Agustus');

-- Pesan konfirmasi
SELECT 'Dummy data Stock Pangan berhasil diinsert untuk tanggal 20-26 Agustus 2025' AS status;