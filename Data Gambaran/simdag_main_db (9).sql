-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2025 at 12:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simdag_main_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `agen`
--

CREATE TABLE `agen` (
  `id_agen` int(11) NOT NULL,
  `nama_usaha` varchar(100) NOT NULL,
  `id_kecamatan` int(11) NOT NULL,
  `id_kelurahan` int(11) NOT NULL,
  `alamat` text NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `telepon` varchar(50) DEFAULT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `nomor_hp_penanggung_jawab` varchar(20) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL DEFAULT 'Aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agen`
--

INSERT INTO `agen` (`id_agen`, `nama_usaha`, `id_kecamatan`, `id_kelurahan`, `alamat`, `latitude`, `longitude`, `telepon`, `penanggung_jawab`, `nomor_hp_penanggung_jawab`, `status`) VALUES
(1, 'Halu', 1, 1, 'halo', -7.3290722, 110.5035421, '4743232', 'Hola', '4837481', 'Aktif'),
(2, 'contoh', 2, 5, 'contoh', NULL, NULL, '123', 'coba', '321', 'Aktif'),
(3, 'ex', 3, 7, 'ex', NULL, NULL, '123', 'ex', '321', 'Aktif');

-- --------------------------------------------------------

--
-- Table structure for table `barang_pasar_grid`
--

CREATE TABLE `barang_pasar_grid` (
  `id_barang_pasar` int(11) NOT NULL,
  `id_pasar` int(11) DEFAULT NULL,
  `id_barang` int(11) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `time_stamp` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barang_pasar_grid`
--

INSERT INTO `barang_pasar_grid` (`id_barang_pasar`, `id_pasar`, `id_barang`, `keterangan`, `time_stamp`) VALUES
(15, 6, 6, '', '2025-08-17 20:37:23.260862'),
(16, 6, 7, '', '2025-08-17 20:37:25.683765'),
(17, 6, 8, '', '2025-08-17 20:37:30.080262'),
(18, 6, 9, '', '2025-08-17 20:37:32.296944'),
(19, 6, 10, '', '2025-08-17 20:37:34.738944'),
(20, 6, 11, '', '2025-08-17 20:37:37.495945'),
(21, 6, 12, '', '2025-08-17 20:37:40.234397'),
(22, 6, 13, '', '2025-08-17 20:37:42.459020'),
(23, 6, 14, '', '2025-08-17 20:37:45.101063'),
(24, 6, 15, '', '2025-08-17 20:37:47.364829'),
(25, 7, 6, '', '2025-08-17 20:37:51.863706'),
(26, 7, 7, '', '2025-08-17 20:37:54.336317'),
(27, 7, 8, '', '2025-08-17 20:37:56.898584'),
(28, 7, 9, '', '2025-08-17 20:37:59.063708'),
(29, 7, 10, '', '2025-08-17 20:38:00.992900'),
(30, 8, 6, '', '2025-08-17 20:38:05.250107'),
(31, 8, 7, '', '2025-08-17 20:38:08.478624'),
(32, 8, 8, '', '2025-08-17 20:38:10.641760'),
(33, 8, 9, '', '2025-08-17 20:38:13.570532'),
(34, 8, 10, '', '2025-08-17 20:38:15.858442'),
(35, 6, 16, '', '2025-08-19 09:54:58.637784');

-- --------------------------------------------------------

--
-- Table structure for table `distributor`
--

CREATE TABLE `distributor` (
  `id_distributor` int(11) NOT NULL,
  `nama_distributor` varchar(100) NOT NULL,
  `id_kecamatan` int(11) NOT NULL,
  `id_kelurahan` int(11) NOT NULL,
  `alamat` text NOT NULL,
  `koordinat` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `distributor`
--

INSERT INTO `distributor` (`id_distributor`, `nama_distributor`, `id_kecamatan`, `id_kelurahan`, `alamat`, `koordinat`, `latitude`, `longitude`, `keterangan`, `time_stamp`) VALUES
(1, 'PT. Distributor Pangan Nusantara', 1, 1, 'Jl. Raya Surabaya No. 123', '-7.331865337709907, 110.5054694862257', -7.3318653, 110.5054695, 'Distributor utama wilayah Sukolilo', '2025-08-25 15:29:45'),
(2, 'CV. Sumber Pangan Jaya', 2, 3, 'Jl. Pahlawan No. 45', '-7.331822773256562, 110.50397817817749', -7.3318228, 110.5039782, 'Distributor wilayah Gubeng', '2025-08-25 15:29:45'),
(3, 'UD. Berkah Pangan', 3, 5, 'Jl. Merdeka No. 78', '-7.330088268321866, 110.50330226158009', -7.3300883, 110.5033023, 'Distributor wilayah Wonokromo', '2025-08-25 15:29:45'),
(4, 'PT. Mitra Distribusi Indonesia', 4, 7, 'Jl. Industri No. 90', '-7.328492092168562, 110.50638143719043', -7.3284921, 110.5063814, 'Distributor wilayah Tegalsari', '2025-08-25 15:29:45'),
(5, 'CV. Cahaya Pangan Mandiri', 5, 9, 'Jl. Pemuda No. 12', '-7.327715284371715, 110.50233666644095', -7.3277153, 110.5023367, 'Distributor wilayah Genteng', '2025-08-25 15:29:45'),
(6, 'contoh', 1, 1, 'contoh', '-7.330380901571674, 110.50718608133964', -7.3303809, 110.5071861, 'coba', '2025-08-25 15:30:53');

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_spbu`
--

CREATE TABLE `dokumen_spbu` (
  `id_dokumenSPBU` int(11) NOT NULL,
  `id_spbu` int(11) NOT NULL,
  `id_ref_dSPBU` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `file_ext` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `harga_barang_pasar`
--

CREATE TABLE `harga_barang_pasar` (
  `id_harga` int(11) NOT NULL,
  `id_barang_pasar` int(11) NOT NULL,
  `harga` decimal(15,2) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `tanggal_harga` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `harga_barang_pasar`
--

INSERT INTO `harga_barang_pasar` (`id_harga`, `id_barang_pasar`, `harga`, `keterangan`, `time_stamp`, `tanggal_harga`) VALUES
(40, 15, 1000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(41, 16, 2000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(42, 18, 4000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(43, 17, 3000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(44, 21, 7000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(45, 19, 5000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(46, 20, 6000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(47, 22, 8000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(48, 23, 9000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(49, 24, 10000.00, NULL, '2025-08-17 13:38:58', '2025-08-15'),
(50, 15, 2000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(51, 16, 3000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(52, 17, 4000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(53, 20, 7000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(54, 18, 5000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(55, 19, 6000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(56, 21, 8000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(57, 22, 9000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(58, 23, 10000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(59, 24, 11000.00, NULL, '2025-08-17 13:41:22', '2025-08-16'),
(60, 15, 500.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(61, 16, 1500.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(62, 17, 2000.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(63, 19, 4000.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(64, 20, 5000.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(65, 18, 3000.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(66, 21, 6000.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(67, 22, 6998.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(68, 23, 8000.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(69, 24, 9000.00, NULL, '2025-08-17 13:42:15', '2025-08-17'),
(70, 15, 4000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(71, 16, 8000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(72, 18, 16000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(73, 17, 12000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(74, 19, 20000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(75, 20, 24000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(76, 21, 28000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(77, 22, 32000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(78, 23, 36000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(79, 24, 40000.00, NULL, '2025-08-17 13:46:12', '2025-08-18'),
(80, 25, 100.00, NULL, '2025-08-17 13:57:06', '2025-08-17'),
(81, 26, 200.00, NULL, '2025-08-17 13:57:06', '2025-08-17'),
(82, 27, 300.00, NULL, '2025-08-17 13:57:06', '2025-08-17'),
(83, 28, 400.00, NULL, '2025-08-17 13:57:06', '2025-08-17'),
(84, 29, 500.00, NULL, '2025-08-17 13:57:06', '2025-08-17'),
(85, 25, 10000.00, NULL, '2025-08-18 05:06:19', '2025-08-18'),
(86, 26, 20000.00, NULL, '2025-08-18 05:06:19', '2025-08-18'),
(87, 27, 30000.00, NULL, '2025-08-18 05:06:19', '2025-08-18'),
(88, 29, 50000.00, NULL, '2025-08-18 05:06:19', '2025-08-18'),
(89, 28, 40000.00, NULL, '2025-08-18 05:06:19', '2025-08-18'),
(90, 25, 1000.00, NULL, '2025-08-18 05:06:36', '2025-08-16'),
(91, 26, 2000.00, NULL, '2025-08-18 05:06:36', '2025-08-16'),
(92, 27, 3000.00, NULL, '2025-08-18 05:06:36', '2025-08-16'),
(93, 28, 4000.00, NULL, '2025-08-18 05:06:36', '2025-08-16'),
(94, 29, 5000.00, NULL, '2025-08-18 05:06:36', '2025-08-16'),
(95, 15, 20000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(96, 16, 40000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(97, 17, 1200.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(98, 18, 3000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(99, 19, 4000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(100, 20, 5000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(101, 21, 6000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(102, 22, 200000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(103, 23, 300000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(104, 24, 400000.00, NULL, '2025-08-19 02:04:43', '2025-08-19'),
(105, 15, 2000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(106, 16, 3000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(107, 18, 10000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(108, 17, 8000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(109, 19, 8000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(110, 20, 2000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(111, 21, 1000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(112, 22, 4000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(113, 23, 6000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(114, 24, 3000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(115, 35, 1000.00, NULL, '2025-08-20 00:34:52', '2025-08-19'),
(116, 15, 4000.00, NULL, '2025-08-20 00:36:18', '2025-08-20'),
(117, 16, 2000.00, NULL, '2025-08-20 00:36:18', '2025-08-20'),
(118, 17, 3000.00, NULL, '2025-08-20 00:36:18', '2025-08-20'),
(119, 18, 1000.00, NULL, '2025-08-20 00:36:18', '2025-08-20'),
(120, 19, 6000.00, NULL, '2025-08-20 00:36:18', '2025-08-20'),
(121, 20, 2000.00, NULL, '2025-08-20 00:36:44', '2025-08-20'),
(122, 21, 4000.00, NULL, '2025-08-20 00:36:44', '2025-08-20'),
(123, 22, 5000.00, NULL, '2025-08-20 00:36:44', '2025-08-20'),
(124, 23, 6000.00, NULL, '2025-08-20 00:36:44', '2025-08-20'),
(125, 24, 7000.00, NULL, '2025-08-20 00:36:44', '2025-08-20'),
(126, 35, 2000.00, NULL, '2025-08-20 00:36:44', '2025-08-20');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_bbm`
--

CREATE TABLE `jenis_bbm` (
  `id_jenis_bbm` int(11) NOT NULL,
  `jenis_bbm` varchar(100) NOT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jenis_bbm`
--

INSERT INTO `jenis_bbm` (`id_jenis_bbm`, `jenis_bbm`, `keterangan`) VALUES
(1, 'Pertalite', 'BBM jenis Pertalite dengan RON 90'),
(2, 'Pertamax', 'BBM jenis Pertamax dengan RON 92'),
(3, 'Pertamax Turbo', 'BBM jenis Pertamax Turbo dengan RON 98'),
(4, 'Solar', 'BBM jenis Solar untuk kendaraan diesel'),
(5, 'Dexlite', 'BBM jenis Dexlite untuk kendaraan diesel'),
(6, 'Pertamina Dex', 'BBM jenis Pertamina Dex premium diesel'),
(7, 'coba', 'coba');

-- --------------------------------------------------------

--
-- Table structure for table `kecamatan`
--

CREATE TABLE `kecamatan` (
  `id_kecamatan` int(11) NOT NULL,
  `nama_kecamatan` varchar(100) NOT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kecamatan`
--

INSERT INTO `kecamatan` (`id_kecamatan`, `nama_kecamatan`, `keterangan`) VALUES
(1, 'Sidorejo', ''),
(2, 'Argomulyo', ''),
(3, 'Sukolilo', 'Kecamatan Sukolilo'),
(4, 'Gubeng', 'Kecamatan Gubeng'),
(5, 'Wonokromo', 'Kecamatan Wonokromo'),
(6, 'Tegalsari', 'Kecamatan Tegalsari'),
(7, 'Genteng', 'Kecamatan Genteng');

-- --------------------------------------------------------

--
-- Table structure for table `kelurahan`
--

CREATE TABLE `kelurahan` (
  `id_kelurahan` int(11) NOT NULL,
  `nama_kelurahan` varchar(100) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `id_kecamatan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelurahan`
--

INSERT INTO `kelurahan` (`id_kelurahan`, `nama_kelurahan`, `keterangan`, `id_kecamatan`) VALUES
(1, 'Ngidul', '', 1),
(2, 'ledok', '', 2),
(3, 'Keputih', 'Kelurahan Keputih', 1),
(4, 'Klampis Ngasem', 'Kelurahan Klampis Ngasem', 1),
(5, 'Gubeng', 'Kelurahan Gubeng', 2),
(6, 'Airlangga', 'Kelurahan Airlangga', 2),
(7, 'Wonokromo', 'Kelurahan Wonokromo', 3),
(8, 'Jagir', 'Kelurahan Jagir', 3),
(9, 'Tegalsari', 'Kelurahan Tegalsari', 4),
(10, 'Kebon Rojo', 'Kelurahan Kebon Rojo', 4),
(11, 'Genteng', 'Kelurahan Genteng', 5),
(12, 'Embong Kaliasin', 'Kelurahan Embong Kaliasin', 5);

-- --------------------------------------------------------

--
-- Table structure for table `komoditas_stock_pangan`
--

CREATE TABLE `komoditas_stock_pangan` (
  `id_komoditas` int(11) NOT NULL,
  `komoditas` varchar(100) NOT NULL,
  `satuan` varchar(50) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `komoditas_stock_pangan`
--

INSERT INTO `komoditas_stock_pangan` (`id_komoditas`, `komoditas`, `satuan`, `keterangan`, `gambar`, `time_stamp`) VALUES
(1, 'Beras', 'kg', '', 'uploads\\komoditas\\komoditas-1756187581957-980583564.jpg', '2025-08-26 05:27:16'),
(2, 'Gula Pasir', 'kg', NULL, NULL, '2025-08-26 05:27:16'),
(3, 'Minyak Goreng', 'liter', NULL, NULL, '2025-08-26 05:27:16'),
(4, 'Tepung Terigu', 'kg', NULL, NULL, '2025-08-26 05:27:16'),
(5, 'Daging Sapi', 'kg', NULL, NULL, '2025-08-26 05:27:16'),
(6, 'Daging Ayam', 'kg', NULL, NULL, '2025-08-26 05:27:16'),
(7, 'Telur Ayam', 'kg', NULL, NULL, '2025-08-26 05:27:16'),
(8, 'Cabai Merah', 'kg', NULL, NULL, '2025-08-26 05:27:16'),
(9, 'Bawang Merah', 'kg', NULL, NULL, '2025-08-26 05:27:16'),
(10, 'Bawang Putih', 'kg', NULL, NULL, '2025-08-26 05:27:16');

-- --------------------------------------------------------

--
-- Table structure for table `nama_barang`
--

CREATE TABLE `nama_barang` (
  `id_barang` int(11) NOT NULL,
  `nama_barang` varchar(100) NOT NULL,
  `id_satuan` int(11) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `time_stamp` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nama_barang`
--

INSERT INTO `nama_barang` (`id_barang`, `nama_barang`, `id_satuan`, `keterangan`, `gambar`, `time_stamp`) VALUES
(6, 'Ikan Tongkol', 14, '', 'uploads\\barang\\1755537440387-683233749.jpg', '2025-08-17 20:35:44.549669'),
(7, 'Ikan Kembung', 14, '', 'uploads\\barang\\1755570529078-550420654.jpg', '2025-08-17 20:35:53.180345'),
(8, 'Tempe Kemasan (Plastik)', 14, 'Tempe Kemasan (Plastik)', 'uploads\\barang\\1755570606643-616069009.jpg', '2025-08-17 20:36:02.692123'),
(9, 'Minyak Goreng Kemasan Sederhana...', 13, '', NULL, '2025-08-17 20:36:18.746433'),
(10, 'Beras C4 (kw medium)', 14, '', NULL, '2025-08-17 20:36:34.234315'),
(11, 'Beras C4 (kw premium)', 14, 'Beras C4 (kw premium)', NULL, '2025-08-17 20:36:44.145001'),
(12, 'Daging Sapi (Sandung Lamur/Brisket)', 14, 'Daging Sapi (Sandung Lamur/Brisket)', NULL, '2025-08-17 20:36:51.305313'),
(13, 'Bawang Putih (Bombay)', 14, 'Bawang Putih (Bombay)', NULL, '2025-08-17 20:36:56.921642'),
(14, 'Bawang Putih (Sin Chug)', 14, 'Bawang Putih (Sin Chug)', NULL, '2025-08-17 20:37:02.539969'),
(15, 'Daging Sapi (Has Dalam)', 14, 'Daging Sapi (Has Dalam)', NULL, '2025-08-17 20:37:07.958193'),
(16, 'Ayam', 14, 'Ayam Bu Agus', NULL, '2025-08-19 09:54:52.816143'),
(17, 'Contoh', 8, 'coba', NULL, '2025-08-26 13:22:01.956461');

-- --------------------------------------------------------

--
-- Table structure for table `nama_pasar`
--

CREATE TABLE `nama_pasar` (
  `id_pasar` int(11) NOT NULL,
  `nama_pasar` varchar(100) NOT NULL,
  `alamat` text DEFAULT NULL,
  `time_stamp` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `gambar` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nama_pasar`
--

INSERT INTO `nama_pasar` (`id_pasar`, `nama_pasar`, `alamat`, `time_stamp`, `gambar`, `latitude`, `longitude`) VALUES
(6, 'Pasar Blauran', 'Jalan Taman Pahlawan, Kel. Kutowinanggun Lor, Kec. Tingkir', '2025-08-17 20:32:59.394593', 'uploads\\pasar\\1756187300712-968106010.jpg', -7.3279049, 110.5071476),
(7, 'Pasar Raya I', 'Jalan Jendral Sudirman, Kel. Kutowinanggun Kidul, Kec. Tingkir', '2025-08-17 20:33:07.104025', 'uploads\\pasar\\1755534418342-443735797.jpg', -7.3301565, 110.5050444),
(8, 'Pasar Rejosari', 'Jalan Hasanudin, Kel. Mangunsari, Kec. Sidomukti', '2025-08-17 20:33:14.837172', 'uploads\\pasar\\1755534424124-566955726.jpg', -7.3366686, 110.4981357);

-- --------------------------------------------------------

--
-- Table structure for table `pangkalan_lpg`
--

CREATE TABLE `pangkalan_lpg` (
  `id_pangkalan_lpg` int(11) NOT NULL,
  `nama_usaha` varchar(100) NOT NULL,
  `id_kecamatan` int(11) NOT NULL,
  `id_kelurahan` int(11) NOT NULL,
  `alamat` text NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `telepon` varchar(50) DEFAULT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `nomor_hp_penanggung_jawab` varchar(20) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL DEFAULT 'Aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pangkalan_lpg`
--

INSERT INTO `pangkalan_lpg` (`id_pangkalan_lpg`, `nama_usaha`, `id_kecamatan`, `id_kelurahan`, `alamat`, `latitude`, `longitude`, `telepon`, `penanggung_jawab`, `nomor_hp_penanggung_jawab`, `status`) VALUES
(1, 'laku', 1, 1, 'luka', -7.3313281, 110.5091640, '41412', 'loka', '4141341', 'Aktif');

-- --------------------------------------------------------

--
-- Table structure for table `realisasi_bulanan_bbm`
--

CREATE TABLE `realisasi_bulanan_bbm` (
  `id_realisasi_bbm` int(11) NOT NULL,
  `id_spbu` int(11) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `realisasi_bulanan_bbm`
--

INSERT INTO `realisasi_bulanan_bbm` (`id_realisasi_bbm`, `id_spbu`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 1, 'coba', '2025-09-03 05:28:42', '2025-09-03 05:28:42');

-- --------------------------------------------------------

--
-- Table structure for table `realisasi_bulanan_bbm_detail`
--

CREATE TABLE `realisasi_bulanan_bbm_detail` (
  `id_detail` int(11) NOT NULL,
  `id_realisasi_bbm` int(11) NOT NULL,
  `bulan` int(11) NOT NULL CHECK (`bulan` >= 1 and `bulan` <= 12),
  `tahun` int(11) NOT NULL CHECK (`tahun` >= 2020 and `tahun` <= 2030),
  `id_jenis_bbm` int(11) NOT NULL,
  `realisasi_liter` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `realisasi_bulanan_bbm_detail`
--

INSERT INTO `realisasi_bulanan_bbm_detail` (`id_detail`, `id_realisasi_bbm`, `bulan`, `tahun`, `id_jenis_bbm`, `realisasi_liter`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 2022, 7, 123.00, '2025-09-03 05:30:00', '2025-09-03 05:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `realisasi_bulanan_lpg`
--

CREATE TABLE `realisasi_bulanan_lpg` (
  `id_realisasi_lpg` int(11) NOT NULL,
  `id_agen` int(11) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `realisasi_bulanan_lpg`
--

INSERT INTO `realisasi_bulanan_lpg` (`id_realisasi_lpg`, `id_agen`, `keterangan`, `created_at`, `updated_at`) VALUES
(4, 1, 'coba', '2025-09-03 05:58:47', '2025-09-03 05:58:47');

-- --------------------------------------------------------

--
-- Table structure for table `realisasi_bulanan_lpg_detail`
--

CREATE TABLE `realisasi_bulanan_lpg_detail` (
  `id_detail` int(11) NOT NULL,
  `id_realisasi_lpg` int(11) NOT NULL,
  `bulan` int(11) NOT NULL COMMENT 'Bulan (1-12)',
  `tahun` int(11) NOT NULL COMMENT 'Tahun',
  `realisasi_tabung` int(11) NOT NULL DEFAULT 0 COMMENT 'Jumlah tabung yang direalisasikan',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `realisasi_bulanan_lpg_detail`
--

INSERT INTO `realisasi_bulanan_lpg_detail` (`id_detail`, `id_realisasi_lpg`, `bulan`, `tahun`, `realisasi_tabung`, `created_at`, `updated_at`) VALUES
(9, 4, 2, 2025, 123, '2025-09-03 05:59:00', '2025-09-03 05:59:00');

-- --------------------------------------------------------

--
-- Table structure for table `satuan_barang`
--

CREATE TABLE `satuan_barang` (
  `id_satuan` int(11) NOT NULL,
  `satuan_barang` varchar(50) NOT NULL,
  `time_stamp` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `satuan_barang`
--

INSERT INTO `satuan_barang` (`id_satuan`, `satuan_barang`, `time_stamp`) VALUES
(5, 'buah', '2025-08-17 20:33:41.884446'),
(6, '250 g', '2025-08-17 20:33:45.673905'),
(7, 'lembar', '2025-08-17 20:33:49.237785'),
(8, 'batang', '2025-08-17 20:33:52.528345'),
(9, '400 g', '2025-08-17 20:33:59.400042'),
(10, '385 g/kl', '2025-08-17 20:34:04.447185'),
(11, 'pak', '2025-08-17 20:34:08.933091'),
(12, 'bungkus', '2025-08-17 20:34:12.172070'),
(13, 'liter', '2025-08-17 20:34:16.477147'),
(14, 'kg', '2025-08-17 20:34:20.779079');

-- --------------------------------------------------------

--
-- Table structure for table `satuan_barang_stock_pangan`
--

CREATE TABLE `satuan_barang_stock_pangan` (
  `id_satuan` int(11) NOT NULL,
  `satuan_barang` varchar(50) NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `satuan_barang_stock_pangan`
--

INSERT INTO `satuan_barang_stock_pangan` (`id_satuan`, `satuan_barang`, `time_stamp`) VALUES
(1, 'Kg', '2025-08-25 15:36:04'),
(2, 'Liter', '2025-08-25 15:36:04'),
(3, 'Gram', '2025-08-25 15:36:04'),
(4, 'Ton', '2025-08-25 15:36:04'),
(5, 'Karung', '2025-08-25 15:36:04'),
(6, 'Dus', '2025-08-25 15:36:04'),
(7, 'Pcs', '2025-08-25 15:36:04'),
(8, 'Botol', '2025-08-25 15:36:04'),
(9, 'Kaleng', '2025-08-25 15:36:04'),
(10, 'Bungkus', '2025-08-25 15:36:04'),
(11, 'coba', '2025-08-25 15:39:19');

-- --------------------------------------------------------

--
-- Table structure for table `spbe`
--

CREATE TABLE `spbe` (
  `id_spbe` int(11) NOT NULL,
  `id_kecamatan` int(11) NOT NULL,
  `id_kelurahan` int(11) NOT NULL,
  `alamat` text NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `telepon` varchar(50) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL DEFAULT 'Aktif',
  `nama_usaha` varchar(100) NOT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `nomor_hp_penanggung_jawab` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spbe`
--

INSERT INTO `spbe` (`id_spbe`, `id_kecamatan`, `id_kelurahan`, `alamat`, `latitude`, `longitude`, `telepon`, `status`, `nama_usaha`, `penanggung_jawab`, `nomor_hp_penanggung_jawab`) VALUES
(1, 1, 1, 'nunu', -7.3299873, 110.5030700, '4242', 'Aktif', 'nuna', 'nanu', '4234242');

-- --------------------------------------------------------

--
-- Table structure for table `spbu`
--

CREATE TABLE `spbu` (
  `id_spbu` int(11) NOT NULL,
  `no_spbu` varchar(50) NOT NULL,
  `id_kecamatan` int(11) NOT NULL,
  `id_kelurahan` int(11) NOT NULL,
  `alamat` text NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `telepon` varchar(50) DEFAULT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `nomor_hp_penanggung_jawab` varchar(20) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL DEFAULT 'Aktif',
  `nama_usaha` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spbu`
--

INSERT INTO `spbu` (`id_spbu`, `no_spbu`, `id_kecamatan`, `id_kelurahan`, `alamat`, `latitude`, `longitude`, `telepon`, `penanggung_jawab`, `nomor_hp_penanggung_jawab`, `status`, `nama_usaha`) VALUES
(1, '12345', 1, 1, 'contoh', -7.3373870, 110.5003844, '098765', 'coba', '123456', 'Aktif', 'Contoh'),
(2, '3131', 2, 2, 'mbuh', -7.3364602, 110.5036906, '44242', 'idok', '324242', 'Aktif', 'nitou');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_stock_pangan`
--

CREATE TABLE `transaksi_stock_pangan` (
  `id_transaksi` int(11) NOT NULL,
  `tahun` int(4) NOT NULL,
  `bulan` int(2) NOT NULL,
  `id_distributor` int(11) NOT NULL,
  `id_komoditas` int(11) NOT NULL,
  `stock_awal` decimal(10,2) DEFAULT 0.00,
  `pengadaan` decimal(10,2) DEFAULT 0.00,
  `penyaluran` decimal(10,2) DEFAULT 0.00,
  `keterangan` text DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaksi_stock_pangan`
--

INSERT INTO `transaksi_stock_pangan` (`id_transaksi`, `tahun`, `bulan`, `id_distributor`, `id_komoditas`, `stock_awal`, `pengadaan`, `penyaluran`, `keterangan`, `time_stamp`) VALUES
(18, 2025, 3, 1, 1, 1000.00, 500.00, 300.00, 'Transaksi Beras Maret', '2025-08-26 05:27:16'),
(19, 2025, 3, 2, 2, 800.00, 200.00, 150.00, 'Transaksi Gula Pasir Maret', '2025-08-26 05:27:16'),
(20, 2025, 3, 3, 3, 600.00, 300.00, 200.00, 'Transaksi Minyak Goreng Maret', '2025-08-26 05:27:16'),
(21, 2025, 3, 4, 4, 400.00, 150.00, 100.00, 'Transaksi Tepung Terigu Maret', '2025-08-26 05:27:16'),
(22, 2025, 3, 5, 5, 300.00, 100.00, 80.00, 'Transaksi Daging Sapi Maret', '2025-08-26 05:27:16'),
(23, 2025, 4, 1, 1, 1200.00, 600.00, 400.00, 'Transaksi Beras April', '2025-08-26 05:27:16'),
(24, 2025, 4, 2, 2, 850.00, 250.00, 180.00, 'Transaksi Gula Pasir April', '2025-08-26 05:27:16'),
(25, 2025, 4, 3, 3, 700.00, 350.00, 250.00, 'Transaksi Minyak Goreng April', '2025-08-26 05:27:16'),
(26, 2025, 4, 4, 4, 450.00, 180.00, 120.00, 'Transaksi Tepung Terigu April', '2025-08-26 05:27:16'),
(27, 2025, 4, 5, 5, 320.00, 120.00, 90.00, 'Transaksi Daging Sapi April', '2025-08-26 05:27:16'),
(28, 2025, 4, 1, 6, 200.00, 80.00, 60.00, 'Transaksi Daging Ayam April', '2025-08-26 05:27:16'),
(29, 2025, 5, 2, 1, 1400.00, 700.00, 500.00, 'Transaksi Beras Mei', '2025-08-26 05:27:16'),
(30, 2025, 5, 3, 2, 920.00, 300.00, 220.00, 'Transaksi Gula Pasir Mei', '2025-08-26 05:27:16'),
(31, 2025, 5, 4, 3, 800.00, 400.00, 300.00, 'Transaksi Minyak Goreng Mei', '2025-08-26 05:27:16'),
(32, 2025, 5, 5, 4, 510.00, 200.00, 140.00, 'Transaksi Tepung Terigu Mei', '2025-08-26 05:27:16'),
(33, 2025, 5, 1, 5, 350.00, 140.00, 100.00, 'Transaksi Daging Sapi Mei', '2025-08-26 05:27:16'),
(34, 2025, 5, 2, 6, 220.00, 100.00, 70.00, 'Transaksi Daging Ayam Mei', '2025-08-26 05:27:16'),
(35, 2025, 5, 3, 7, 150.00, 60.00, 40.00, 'Transaksi Telur Ayam Mei', '2025-08-26 05:27:16'),
(36, 2025, 6, 3, 1, 1600.00, 800.00, 600.00, 'Transaksi Beras Juni', '2025-08-26 05:27:16'),
(37, 2025, 6, 4, 2, 1000.00, 350.00, 260.00, 'Transaksi Gula Pasir Juni', '2025-08-26 05:27:16'),
(38, 2025, 6, 5, 3, 900.00, 450.00, 350.00, 'Transaksi Minyak Goreng Juni', '2025-08-26 05:27:16'),
(39, 2025, 6, 1, 4, 570.00, 220.00, 160.00, 'Transaksi Tepung Terigu Juni', '2025-08-26 05:27:16'),
(40, 2025, 6, 2, 5, 390.00, 160.00, 120.00, 'Transaksi Daging Sapi Juni', '2025-08-26 05:27:16'),
(41, 2025, 6, 3, 6, 250.00, 120.00, 80.00, 'Transaksi Daging Ayam Juni', '2025-08-26 05:27:16'),
(42, 2025, 6, 4, 7, 170.00, 80.00, 50.00, 'Transaksi Telur Ayam Juni', '2025-08-26 05:27:16'),
(43, 2025, 6, 5, 8, 120.00, 50.00, 30.00, 'Transaksi Cabai Merah Juni', '2025-08-26 05:27:16'),
(44, 2025, 7, 4, 1, 1800.00, 900.00, 700.00, 'Transaksi Beras Juli', '2025-08-26 05:27:16'),
(45, 2025, 7, 5, 2, 1090.00, 400.00, 300.00, 'Transaksi Gula Pasir Juli', '2025-08-26 05:27:16'),
(46, 2025, 7, 1, 3, 1000.00, 500.00, 400.00, 'Transaksi Minyak Goreng Juli', '2025-08-26 05:27:16'),
(47, 2025, 7, 2, 4, 630.00, 250.00, 180.00, 'Transaksi Tepung Terigu Juli', '2025-08-26 05:27:16'),
(48, 2025, 7, 3, 5, 430.00, 180.00, 140.00, 'Transaksi Daging Sapi Juli', '2025-08-26 05:27:16'),
(49, 2025, 7, 4, 6, 290.00, 140.00, 100.00, 'Transaksi Daging Ayam Juli', '2025-08-26 05:27:16'),
(50, 2025, 7, 5, 7, 200.00, 100.00, 60.00, 'Transaksi Telur Ayam Juli', '2025-08-26 05:27:16'),
(51, 2025, 7, 1, 8, 140.00, 60.00, 40.00, 'Transaksi Cabai Merah Juli', '2025-08-26 05:27:16'),
(52, 2025, 7, 2, 9, 100.00, 40.00, 25.00, 'Transaksi Bawang Merah Juli', '2025-08-26 05:27:16'),
(53, 2025, 8, 5, 1, 2000.00, 1000.00, 800.00, 'Transaksi Beras Agustus', '2025-08-26 05:27:16'),
(54, 2025, 8, 1, 2, 1190.00, 450.00, 350.00, 'Transaksi Gula Pasir Agustus', '2025-08-26 05:27:16'),
(55, 2025, 8, 2, 3, 1100.00, 550.00, 450.00, 'Transaksi Minyak Goreng Agustus', '2025-08-26 05:27:16'),
(56, 2025, 8, 3, 4, 700.00, 280.00, 200.00, 'Transaksi Tepung Terigu Agustus', '2025-08-26 05:27:16'),
(57, 2025, 8, 4, 5, 470.00, 200.00, 160.00, 'Transaksi Daging Sapi Agustus', '2025-08-26 05:27:16'),
(58, 2025, 8, 5, 6, 330.00, 160.00, 120.00, 'Transaksi Daging Ayam Agustus', '2025-08-26 05:27:16'),
(59, 2025, 8, 1, 7, 240.00, 120.00, 80.00, 'Transaksi Telur Ayam Agustus', '2025-08-26 05:27:16'),
(60, 2025, 8, 2, 8, 160.00, 80.00, 50.00, 'Transaksi Cabai Merah Agustus', '2025-08-26 05:27:16'),
(61, 2025, 8, 3, 9, 115.00, 50.00, 30.00, 'Transaksi Bawang Merah Agustus', '2025-08-26 05:27:16'),
(62, 2025, 8, 4, 10, 80.00, 30.00, 20.00, 'Transaksi Bawang Putih Agustus', '2025-08-26 05:27:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','operator') NOT NULL DEFAULT 'operator',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', '123@gmail.com', '$2b$10$QkTKSqPU4R9yzNnZjFGayOZNFqDOjGjIg/d9iId394XOBMZxfEZ8m', 'admin', '2025-08-14 22:44:17.802994', '2025-08-14 22:44:17.813160');

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_perubahan_harga`
-- (See below for the actual view)
--
CREATE TABLE `view_perubahan_harga` (
`id_barang_pasar` int(11)
,`id_pasar` int(11)
,`nama_pasar` varchar(100)
,`nama_barang` varchar(100)
,`harga_terbaru` decimal(15,2)
,`harga_h_1` decimal(15,2)
,`persen_perubahan` decimal(22,2)
);

-- --------------------------------------------------------

--
-- Structure for view `view_perubahan_harga`
--
DROP TABLE IF EXISTS `view_perubahan_harga`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_perubahan_harga`  AS SELECT `h1`.`id_barang_pasar` AS `id_barang_pasar`, `bpg`.`id_pasar` AS `id_pasar`, `np`.`nama_pasar` AS `nama_pasar`, `nb`.`nama_barang` AS `nama_barang`, `h1`.`harga` AS `harga_terbaru`, `h2`.`harga` AS `harga_h_1`, round((`h1`.`harga` - `h2`.`harga`) / `h2`.`harga` * 100,2) AS `persen_perubahan` FROM ((((`harga_barang_pasar` `h1` join `harga_barang_pasar` `h2` on(`h1`.`id_barang_pasar` = `h2`.`id_barang_pasar` and cast(`h2`.`time_stamp` as date) = cast(`h1`.`time_stamp` as date) - interval 1 day)) join `barang_pasar_grid` `bpg` on(`h1`.`id_barang_pasar` = `bpg`.`id_barang_pasar`)) join `nama_pasar` `np` on(`bpg`.`id_pasar` = `np`.`id_pasar`)) join `nama_barang` `nb` on(`bpg`.`id_barang` = `nb`.`id_barang`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agen`
--
ALTER TABLE `agen`
  ADD PRIMARY KEY (`id_agen`),
  ADD KEY `FK_d5fa47b12233371ac27c4a63198` (`id_kecamatan`),
  ADD KEY `FK_d08bd88383f7df77ed8fd58b185` (`id_kelurahan`);

--
-- Indexes for table `barang_pasar_grid`
--
ALTER TABLE `barang_pasar_grid`
  ADD PRIMARY KEY (`id_barang_pasar`),
  ADD KEY `FK_4e31c1c65a0a7fdfe0dd0abddca` (`id_pasar`),
  ADD KEY `FK_3c0efc6e1014f020a3bb933854e` (`id_barang`);

--
-- Indexes for table `distributor`
--
ALTER TABLE `distributor`
  ADD PRIMARY KEY (`id_distributor`),
  ADD KEY `fk_distributor_kecamatan` (`id_kecamatan`),
  ADD KEY `fk_distributor_kelurahan` (`id_kelurahan`);

--
-- Indexes for table `dokumen_spbu`
--
ALTER TABLE `dokumen_spbu`
  ADD PRIMARY KEY (`id_dokumenSPBU`),
  ADD KEY `FK_c670b15f87368eb80898b2f8aed` (`id_spbu`),
  ADD KEY `FK_f1da36080f57a5cf10f2f79ff32` (`id_ref_dSPBU`);

--
-- Indexes for table `harga_barang_pasar`
--
ALTER TABLE `harga_barang_pasar`
  ADD PRIMARY KEY (`id_harga`),
  ADD KEY `FK_9b1d5300ac308a85fa809d5a6b9` (`id_barang_pasar`);

--
-- Indexes for table `jenis_bbm`
--
ALTER TABLE `jenis_bbm`
  ADD PRIMARY KEY (`id_jenis_bbm`);

--
-- Indexes for table `kecamatan`
--
ALTER TABLE `kecamatan`
  ADD PRIMARY KEY (`id_kecamatan`);

--
-- Indexes for table `kelurahan`
--
ALTER TABLE `kelurahan`
  ADD PRIMARY KEY (`id_kelurahan`),
  ADD KEY `FK_fac0104342ae561641cfdecee9c` (`id_kecamatan`);

--
-- Indexes for table `komoditas_stock_pangan`
--
ALTER TABLE `komoditas_stock_pangan`
  ADD PRIMARY KEY (`id_komoditas`);

--
-- Indexes for table `nama_barang`
--
ALTER TABLE `nama_barang`
  ADD PRIMARY KEY (`id_barang`),
  ADD KEY `FK_cab7dcf20fcd5bbe91a908dac36` (`id_satuan`);

--
-- Indexes for table `nama_pasar`
--
ALTER TABLE `nama_pasar`
  ADD PRIMARY KEY (`id_pasar`);

--
-- Indexes for table `pangkalan_lpg`
--
ALTER TABLE `pangkalan_lpg`
  ADD PRIMARY KEY (`id_pangkalan_lpg`),
  ADD KEY `FK_5e65a83a937d920f69f13fb05aa` (`id_kecamatan`),
  ADD KEY `FK_b4a30a6432c215a919195d68518` (`id_kelurahan`);

--
-- Indexes for table `realisasi_bulanan_bbm`
--
ALTER TABLE `realisasi_bulanan_bbm`
  ADD PRIMARY KEY (`id_realisasi_bbm`),
  ADD UNIQUE KEY `unique_spbu` (`id_spbu`),
  ADD KEY `idx_realisasi_bbm_spbu` (`id_spbu`);

--
-- Indexes for table `realisasi_bulanan_bbm_detail`
--
ALTER TABLE `realisasi_bulanan_bbm_detail`
  ADD PRIMARY KEY (`id_detail`),
  ADD UNIQUE KEY `unique_realisasi_bulan_tahun_jenis` (`id_realisasi_bbm`,`bulan`,`tahun`,`id_jenis_bbm`),
  ADD KEY `idx_realisasi_bbm_detail_realisasi` (`id_realisasi_bbm`),
  ADD KEY `idx_realisasi_bbm_detail_bulan_tahun` (`bulan`,`tahun`),
  ADD KEY `idx_realisasi_bbm_detail_jenis` (`id_jenis_bbm`);

--
-- Indexes for table `realisasi_bulanan_lpg`
--
ALTER TABLE `realisasi_bulanan_lpg`
  ADD PRIMARY KEY (`id_realisasi_lpg`),
  ADD KEY `FK_realisasi_lpg_agen` (`id_agen`);

--
-- Indexes for table `realisasi_bulanan_lpg_detail`
--
ALTER TABLE `realisasi_bulanan_lpg_detail`
  ADD PRIMARY KEY (`id_detail`),
  ADD UNIQUE KEY `unique_agen_bulan_tahun` (`id_realisasi_lpg`,`bulan`,`tahun`),
  ADD KEY `FK_detail_realisasi_lpg` (`id_realisasi_lpg`),
  ADD KEY `idx_detail_bulan_tahun` (`bulan`,`tahun`),
  ADD KEY `idx_detail_tahun_bulan` (`tahun`,`bulan`);

--
-- Indexes for table `satuan_barang`
--
ALTER TABLE `satuan_barang`
  ADD PRIMARY KEY (`id_satuan`);

--
-- Indexes for table `satuan_barang_stock_pangan`
--
ALTER TABLE `satuan_barang_stock_pangan`
  ADD PRIMARY KEY (`id_satuan`);

--
-- Indexes for table `spbe`
--
ALTER TABLE `spbe`
  ADD PRIMARY KEY (`id_spbe`),
  ADD KEY `FK_39433f75c4ca5c0a62bb261bf91` (`id_kecamatan`),
  ADD KEY `FK_353ae42b4756fe413de58f933d7` (`id_kelurahan`);

--
-- Indexes for table `spbu`
--
ALTER TABLE `spbu`
  ADD PRIMARY KEY (`id_spbu`),
  ADD KEY `FK_d21a1de8d17d352d4c891bf2fca` (`id_kecamatan`),
  ADD KEY `FK_651fc5444d4219a66bd8f25d359` (`id_kelurahan`);

--
-- Indexes for table `transaksi_stock_pangan`
--
ALTER TABLE `transaksi_stock_pangan`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `fk_transaksi_distributor` (`id_distributor`),
  ADD KEY `fk_transaksi_komoditas` (`id_komoditas`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agen`
--
ALTER TABLE `agen`
  MODIFY `id_agen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `barang_pasar_grid`
--
ALTER TABLE `barang_pasar_grid`
  MODIFY `id_barang_pasar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `distributor`
--
ALTER TABLE `distributor`
  MODIFY `id_distributor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `dokumen_spbu`
--
ALTER TABLE `dokumen_spbu`
  MODIFY `id_dokumenSPBU` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `harga_barang_pasar`
--
ALTER TABLE `harga_barang_pasar`
  MODIFY `id_harga` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `jenis_bbm`
--
ALTER TABLE `jenis_bbm`
  MODIFY `id_jenis_bbm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `kecamatan`
--
ALTER TABLE `kecamatan`
  MODIFY `id_kecamatan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `kelurahan`
--
ALTER TABLE `kelurahan`
  MODIFY `id_kelurahan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `komoditas_stock_pangan`
--
ALTER TABLE `komoditas_stock_pangan`
  MODIFY `id_komoditas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `nama_barang`
--
ALTER TABLE `nama_barang`
  MODIFY `id_barang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `nama_pasar`
--
ALTER TABLE `nama_pasar`
  MODIFY `id_pasar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pangkalan_lpg`
--
ALTER TABLE `pangkalan_lpg`
  MODIFY `id_pangkalan_lpg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `realisasi_bulanan_bbm`
--
ALTER TABLE `realisasi_bulanan_bbm`
  MODIFY `id_realisasi_bbm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `realisasi_bulanan_bbm_detail`
--
ALTER TABLE `realisasi_bulanan_bbm_detail`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `realisasi_bulanan_lpg`
--
ALTER TABLE `realisasi_bulanan_lpg`
  MODIFY `id_realisasi_lpg` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `realisasi_bulanan_lpg_detail`
--
ALTER TABLE `realisasi_bulanan_lpg_detail`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `satuan_barang`
--
ALTER TABLE `satuan_barang`
  MODIFY `id_satuan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `satuan_barang_stock_pangan`
--
ALTER TABLE `satuan_barang_stock_pangan`
  MODIFY `id_satuan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `spbe`
--
ALTER TABLE `spbe`
  MODIFY `id_spbe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `spbu`
--
ALTER TABLE `spbu`
  MODIFY `id_spbu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaksi_stock_pangan`
--
ALTER TABLE `transaksi_stock_pangan`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agen`
--
ALTER TABLE `agen`
  ADD CONSTRAINT `FK_d08bd88383f7df77ed8fd58b185` FOREIGN KEY (`id_kelurahan`) REFERENCES `kelurahan` (`id_kelurahan`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d5fa47b12233371ac27c4a63198` FOREIGN KEY (`id_kecamatan`) REFERENCES `kecamatan` (`id_kecamatan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `barang_pasar_grid`
--
ALTER TABLE `barang_pasar_grid`
  ADD CONSTRAINT `FK_3c0efc6e1014f020a3bb933854e` FOREIGN KEY (`id_barang`) REFERENCES `nama_barang` (`id_barang`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_4e31c1c65a0a7fdfe0dd0abddca` FOREIGN KEY (`id_pasar`) REFERENCES `nama_pasar` (`id_pasar`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `distributor`
--
ALTER TABLE `distributor`
  ADD CONSTRAINT `fk_distributor_kecamatan` FOREIGN KEY (`id_kecamatan`) REFERENCES `kecamatan` (`id_kecamatan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_distributor_kelurahan` FOREIGN KEY (`id_kelurahan`) REFERENCES `kelurahan` (`id_kelurahan`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dokumen_spbu`
--
ALTER TABLE `dokumen_spbu`
  ADD CONSTRAINT `FK_c670b15f87368eb80898b2f8aed` FOREIGN KEY (`id_spbu`) REFERENCES `spbu` (`id_spbu`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f1da36080f57a5cf10f2f79ff32` FOREIGN KEY (`id_ref_dSPBU`) REFERENCES `ref_doku_spbu` (`id_ref_dSPBU`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `harga_barang_pasar`
--
ALTER TABLE `harga_barang_pasar`
  ADD CONSTRAINT `FK_9b1d5300ac308a85fa809d5a6b9` FOREIGN KEY (`id_barang_pasar`) REFERENCES `barang_pasar_grid` (`id_barang_pasar`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kelurahan`
--
ALTER TABLE `kelurahan`
  ADD CONSTRAINT `FK_fac0104342ae561641cfdecee9c` FOREIGN KEY (`id_kecamatan`) REFERENCES `kecamatan` (`id_kecamatan`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `nama_barang`
--
ALTER TABLE `nama_barang`
  ADD CONSTRAINT `FK_cab7dcf20fcd5bbe91a908dac36` FOREIGN KEY (`id_satuan`) REFERENCES `satuan_barang` (`id_satuan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `pangkalan_lpg`
--
ALTER TABLE `pangkalan_lpg`
  ADD CONSTRAINT `FK_5e65a83a937d920f69f13fb05aa` FOREIGN KEY (`id_kecamatan`) REFERENCES `kecamatan` (`id_kecamatan`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b4a30a6432c215a919195d68518` FOREIGN KEY (`id_kelurahan`) REFERENCES `kelurahan` (`id_kelurahan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `realisasi_bulanan_bbm`
--
ALTER TABLE `realisasi_bulanan_bbm`
  ADD CONSTRAINT `realisasi_bulanan_bbm_ibfk_1` FOREIGN KEY (`id_spbu`) REFERENCES `spbu` (`id_spbu`) ON DELETE CASCADE;

--
-- Constraints for table `realisasi_bulanan_bbm_detail`
--
ALTER TABLE `realisasi_bulanan_bbm_detail`
  ADD CONSTRAINT `realisasi_bulanan_bbm_detail_ibfk_1` FOREIGN KEY (`id_realisasi_bbm`) REFERENCES `realisasi_bulanan_bbm` (`id_realisasi_bbm`) ON DELETE CASCADE,
  ADD CONSTRAINT `realisasi_bulanan_bbm_detail_ibfk_2` FOREIGN KEY (`id_jenis_bbm`) REFERENCES `jenis_bbm` (`id_jenis_bbm`) ON DELETE CASCADE;

--
-- Constraints for table `realisasi_bulanan_lpg`
--
ALTER TABLE `realisasi_bulanan_lpg`
  ADD CONSTRAINT `FK_realisasi_lpg_agen` FOREIGN KEY (`id_agen`) REFERENCES `agen` (`id_agen`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `realisasi_bulanan_lpg_detail`
--
ALTER TABLE `realisasi_bulanan_lpg_detail`
  ADD CONSTRAINT `FK_detail_realisasi_lpg` FOREIGN KEY (`id_realisasi_lpg`) REFERENCES `realisasi_bulanan_lpg` (`id_realisasi_lpg`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `spbe`
--
ALTER TABLE `spbe`
  ADD CONSTRAINT `FK_353ae42b4756fe413de58f933d7` FOREIGN KEY (`id_kelurahan`) REFERENCES `kelurahan` (`id_kelurahan`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_39433f75c4ca5c0a62bb261bf91` FOREIGN KEY (`id_kecamatan`) REFERENCES `kecamatan` (`id_kecamatan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `spbu`
--
ALTER TABLE `spbu`
  ADD CONSTRAINT `FK_651fc5444d4219a66bd8f25d359` FOREIGN KEY (`id_kelurahan`) REFERENCES `kelurahan` (`id_kelurahan`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d21a1de8d17d352d4c891bf2fca` FOREIGN KEY (`id_kecamatan`) REFERENCES `kecamatan` (`id_kecamatan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `transaksi_stock_pangan`
--
ALTER TABLE `transaksi_stock_pangan`
  ADD CONSTRAINT `fk_transaksi_distributor` FOREIGN KEY (`id_distributor`) REFERENCES `distributor` (`id_distributor`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transaksi_komoditas` FOREIGN KEY (`id_komoditas`) REFERENCES `komoditas_stock_pangan` (`id_komoditas`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
