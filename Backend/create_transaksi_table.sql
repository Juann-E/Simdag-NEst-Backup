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
);