-- Migration script untuk mengubah struktur komoditas_stock_pangan
-- Dari menggunakan relasi ke satuan_barang_stock_pangan menjadi kolom satuan langsung

-- Step 1: Backup data existing (opsional)
-- CREATE TABLE komoditas_stock_pangan_backup AS SELECT * FROM komoditas_stock_pangan;

-- Step 2: Tambah kolom satuan baru
ALTER TABLE komoditas_stock_pangan 
ADD COLUMN satuan VARCHAR(50);

-- Step 3: Migrate data dari relasi ke kolom satuan
UPDATE komoditas_stock_pangan k 
SET satuan = (
    SELECT s.satuan_barang 
    FROM satuan_barang_stock_pangan s 
    WHERE s.id_satuan = k.id_satuan
)
WHERE k.id_satuan IS NOT NULL;

-- Step 4: Set default value untuk data yang tidak memiliki satuan
UPDATE komoditas_stock_pangan 
SET satuan = 'kg' 
WHERE satuan IS NULL OR satuan = '';

-- Step 5: Buat kolom satuan menjadi NOT NULL
ALTER TABLE komoditas_stock_pangan 
MODIFY COLUMN satuan VARCHAR(50) NOT NULL;

-- Step 6: Hapus foreign key constraint dan kolom id_satuan
ALTER TABLE komoditas_stock_pangan 
DROP FOREIGN KEY IF EXISTS FK_komoditas_satuan;

ALTER TABLE komoditas_stock_pangan 
DROP COLUMN id_satuan;

-- Verification query - jalankan untuk memastikan migrasi berhasil
-- SELECT id_komoditas, komoditas, satuan, keterangan FROM komoditas_stock_pangan LIMIT 10;

-- Note: Setelah migrasi berhasil, tabel satuan_barang_stock_pangan masih bisa digunakan
-- untuk keperluan lain atau bisa dihapus jika tidak diperlukan lagi