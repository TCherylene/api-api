var express = require('express');
var auth = require('./auth');
var router = express.Router();
var verifikasi = require('./verifikasi')
var jsonku = require('./logged_in');

// Registrasi
router.post('/profile', auth.registrasi);

// Login
router.post('/login', auth.login);

// GET profile - Sebelumnya: saldo
router.get('/profile', verifikasi(), jsonku.tampilSaldo);

// PUT profile - Sebelumnya: top up
router.put('/profile/:id_user', verifikasi(), jsonku.topUp);

// POST pembelian - Sebelumnya: bayar
router.post('/pembelian', verifikasi(), jsonku.bayar);

// GET pembelian - melihat history pembayaran
router.get('/pembelian/:id_user', verifikasi(), jsonku.cekPembayaran);
router.get('/pembelian/:id_user/:id_pembelian', verifikasi(), jsonku.cekIDPembayaran);

// POST transaksi - untuk melakukan pembayaran
router.post('/transaksi', jsonku.transaksi)

// POST Transfer
router.post('/transfer', verifikasi(), jsonku.transfer);

// GET History
router.get('/riwayat', verifikasi(), jsonku.history);

module.exports = router;