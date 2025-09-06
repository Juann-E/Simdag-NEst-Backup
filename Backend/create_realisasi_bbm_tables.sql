-- Create table for realisasi_bulanan_bbm (main table)
CREATE TABLE realisasi_bulanan_bbm (
    id_realisasi_bbm INT AUTO_INCREMENT PRIMARY KEY,
    id_spbu INT NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_spbu) REFERENCES spbu(id_spbu) ON DELETE CASCADE,
    UNIQUE KEY unique_spbu (id_spbu)
);

-- Create table for realisasi_bulanan_bbm_detail (detail table)
CREATE TABLE realisasi_bulanan_bbm_detail (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_realisasi_bbm INT NOT NULL,
    bulan INT NOT NULL CHECK (bulan >= 1 AND bulan <= 12),
    tahun INT NOT NULL CHECK (tahun >= 2020 AND tahun <= 2030),
    id_jenis_bbm INT NOT NULL,
    realisasi_liter DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_realisasi_bbm) REFERENCES realisasi_bulanan_bbm(id_realisasi_bbm) ON DELETE CASCADE,
    FOREIGN KEY (id_jenis_bbm) REFERENCES jenis_bbm(id_jenis_bbm) ON DELETE CASCADE,
    UNIQUE KEY unique_realisasi_bulan_tahun_jenis (id_realisasi_bbm, bulan, tahun, id_jenis_bbm)
);

-- Add indexes for better performance
CREATE INDEX idx_realisasi_bbm_spbu ON realisasi_bulanan_bbm(id_spbu);
CREATE INDEX idx_realisasi_bbm_detail_realisasi ON realisasi_bulanan_bbm_detail(id_realisasi_bbm);
CREATE INDEX idx_realisasi_bbm_detail_bulan_tahun ON realisasi_bulanan_bbm_detail(bulan, tahun);
CREATE INDEX idx_realisasi_bbm_detail_jenis ON realisasi_bulanan_bbm_detail(id_jenis_bbm);