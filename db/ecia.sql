-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 03 Jun 2022 pada 11.46
-- Versi server: 10.4.21-MariaDB
-- Versi PHP: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecia`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `daftar_client`
--

CREATE TABLE `daftar_client` (
  `id_client` int(11) NOT NULL,
  `nama_client` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `nomor_wallet` varchar(32) NOT NULL,
  `saldo` bigint(20) NOT NULL,
  `role` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `daftar_client`
--

INSERT INTO `daftar_client` (`id_client`, `nama_client`, `email`, `password`, `nomor_wallet`, `saldo`, `role`) VALUES
(1, 'Manura', 'manura@manura.com', '1234', '54ac17782fe813a6fe21a0d5133cc744', 6500, 1),
(2, 'Alda', 'alda@alda.com', '1234', '20c7dd637bcdeef433589d1321f52363', 33001, 1),
(3, 'Ira', 'ira@ira.com', '1234', '87823d8de907cd4a582dee291d146f92', 20500, 1),
(4, 'halo', 'halo@halo.com', '1234', '142a52c5e20510265959a4731f6f37d8', 0, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `history`
--

CREATE TABLE `history` (
  `id_history` int(11) NOT NULL,
  `jenis_transaksi` varchar(10) NOT NULL,
  `nomor_wallet` varchar(32) NOT NULL,
  `id_pengirim` int(11) NOT NULL,
  `id_penerima` int(11) NOT NULL,
  `tanggal` date NOT NULL DEFAULT current_timestamp(),
  `waktu` time NOT NULL DEFAULT current_timestamp(),
  `nominal` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `history`
--

INSERT INTO `history` (`id_history`, `jenis_transaksi`, `nomor_wallet`, `id_pengirim`, `id_penerima`, `tanggal`, `waktu`, `nominal`) VALUES
(1, 'topup', '20c7dd637bcdeef433589d1321f52363', 2, 2, '2022-06-03', '15:18:36', 1),
(2, 'topup', '20c7dd637bcdeef433589d1321f52363', 2, 2, '2022-06-03', '15:25:04', 15000),
(3, 'bayar', '20c7dd637bcdeef433589d1321f52363', 2, 0, '2022-06-03', '15:25:08', 15000),
(4, 'top up', '20c7dd637bcdeef433589d1321f52363', 2, 2, '2022-06-03', '15:26:07', 30000),
(5, 'top up', '87823d8de907cd4a582dee291d146f92', 3, 2, '2022-06-03', '15:34:12', 30000),
(6, 'top up', '87823d8de907cd4a582dee291d146f92', 3, 3, '2022-06-03', '15:35:00', 30000),
(7, 'bayar', '87823d8de907cd4a582dee291d146f92', 3, 0, '2022-06-03', '15:35:22', 15000),
(8, 'topup', '87823d8de907cd4a582dee291d146f92', 3, 3, '2022-06-03', '15:36:27', 30000),
(9, 'transfer', '87823d8de907cd4a582dee291d146f92', 3, 1, '2022-06-03', '15:36:32', 15000),
(10, 'bayar', '54ac17782fe813a6fe21a0d5133cc744', 1, 0, '2022-06-03', '15:43:20', 15000),
(11, 'transfer', '54ac17782fe813a6fe21a0d5133cc744', 1, 2, '2022-06-03', '15:44:29', 3000),
(12, 'transfer', '54ac17782fe813a6fe21a0d5133cc744', 1, 3, '2022-06-03', '15:44:40', 5500);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `daftar_client`
--
ALTER TABLE `daftar_client`
  ADD PRIMARY KEY (`id_client`);

--
-- Indeks untuk tabel `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id_history`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `daftar_client`
--
ALTER TABLE `daftar_client`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `history`
--
ALTER TABLE `history`
  MODIFY `id_history` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
