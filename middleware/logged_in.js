'use strict';

var response = require('../res');
var parsetoken = require('./parseJWT');
const conn = require('../koneksi');
var mysql = require('mysql');
var updateSaldo = require('./update_saldo');
var insertHistory = require('./insertHistory');

function serverErrorResponse(error) {
    throw error;
}

function successResponse(message, res){
    return response.success(message, res)
}

function userErrorResponse(message, res){
    return response.failed(message, res)
}

// menampilkan saldo user
exports.tampilSaldo = function (req, res){
    var token = req.headers.authorization;
    var data = parsetoken(token)

    conn.query('SELECT * FROM daftar_client WHERE id_client = ?', [data.id_client], function(error, rows, fields){
        if(error){
            return serverErrorResponse(error);
        } else {
            res.json({
                id_user: rows[0].id_client,
                name: rows[0].nama_client,
                pass: rows[0].password,
                email: rows[0].email,
                jumlah: rows[0].saldo,
                nomor_wallet: rows[0].nomor_wallet
            })
        }
    });
};

// TOP UP - JUMLAH
exports.topUp = function(req,res){
    var token = req.headers.authorization;
    var data = parsetoken(token);

    var saldo = req.body.saldo;

    var idTopUp = req.params.id;
    var idPengirim = data.id_client;

    // Diri sendiri / admin yang top up
    if (idTopUp == data.id_client || data.role == 1){
        // Mencegah user top up negatif (tetapi bisa untuk admin)
        if(saldo <= 0 && data.role == 0){
            return userErrorResponse("Saldo top up harus lebih dari 0", res)
        }
        
        // User tidak ada
        conn.query("SELECT * FROM daftar_client WHERE id_client = ?", [idTopUp], function(error, rows, fields){
            if (error) return serverErrorResponse(error);
    
            if(rows.length == 0){
                return userErrorResponse("User tidak ditemukan", res)
            }
        })
    
        updateSaldo(idTopUp, saldo)
        
        insertHistory("topup", data.nomor_wallet, idPengirim, idTopUp, saldo)

        return successResponse("Top Up berhasil", res)
    } else {
        return userErrorResponse("Anda tidak dapat mengakses halaman ini", res)
    }
}

// TRANSFER - penerima, jumlah
exports.transfer = function(req, res){
    var token = req.headers.authorization;
    var dataToken = parsetoken(token);

    var dataPostman = {
        email: req.body.email,
        jumlah: parseInt(req.body.jumlah),
    };

    // Penerima kosong
    if(dataPostman.email == null){
        return userErrorResponse("Penerima tidak boleh kosong", res)
    }

    // Jumlah gaada
    if(dataPostman.jumlah <= 0){
        return userErrorResponse("Jumlah yang ditransfer harus lebih dari 0", res)
    }

    // Query untuk mencari receiver
    var selectReceiver = ("SELECT id_client, email FROM daftar_client WHERE email = ?");
    var dataSelectReceiver = [dataPostman.email];
    
    selectReceiver = mysql.format(selectReceiver, dataSelectReceiver);
    

    conn.query(selectReceiver, function(error, result, fields){
        if (error) return serverErrorResponse(error)
        
        // Penerima tidak ditemukan
        if(result.length != 1){
            return userErrorResponse("Penerima tidak ditemukan", res)
        }

        var idPengirim = dataToken.id_client;
        var idPenerima = result[0].id_client;

        // Cari id_client & saldo pengirim
        conn.query("SELECT id_client, saldo FROM daftar_client WHERE id_client = ?", [idPengirim], function(error, rows, fields){
            if (error) return serverErrorResponse(error);
            
            // Penerimanya diri sendiri
            if(idPenerima == idPengirim){
                return userErrorResponse("Tidak dapat transfer ke diri sendiri", res);
            }

            // Uangnya kurang
            if (rows[0].saldo < dataPostman.jumlah){
                return userErrorResponse("Saldo anda tidak mencukupi", res)
            }
            
            // Uangnya cukup
            else if (rows[0].saldo >= dataPostman.jumlah){
                // Mengurangi saldo pengirim
                updateSaldo(idPengirim, dataPostman.jumlah * (-1));

                // Menambah saldo penerima
                updateSaldo(idPenerima, dataPostman.jumlah);
                insertHistory("transfer", dataToken.nomor_wallet, idPengirim, idPenerima, dataPostman.jumlah)
                return successResponse("Transfer berhasil", res);
            }
        })
    }
)}

// POST BAYAR 
exports.bayar = function(req, res){
    var token = req.headers.authorization;
    var dataToken = parsetoken(token);

    var id_user = req.body.id_user

    // Ambil id user
    if (req.body.id_user == null){
        id_user = dataToken.id_client;
    }

    var dataPostman = {
        id_user: id_user,
        nama_barang: req.body.nama_barang,
        harga: parseInt(req.body.harga),
        wallet: req.body.wallet,
        nomor_wallet: req.body.nomor_wallet
    };
    // nama_barang -> layanan
    // wallet: memilih e wallet yang mana
    // nomor wallet: dari get profile
    
    // Barang & harga nya kosong
    if(dataPostman.nama_barang == null || dataPostman.harga == null){
        return userErrorResponse("Nama_barang dan harga tidak boleh kosong", res)
    }

    // Ngecek Nomor Wallet (kalau tidak ada nomor wallet)
    if(dataPostman.nomor_wallet == null){
        return userErrorResponse("Masukkan nomor_wallet", res)
    }

    // Query untuk ngecek nomor wallet
    var queryWallet = "SELECT id_client, nomor_wallet FROM daftar_client WHERE id_client = ? AND nomor_wallet = ?"
    var dataWallet = [id_user, dataPostman.nomor_wallet]

    var queryWallet = mysql.format(queryWallet, dataWallet);

    conn.query(queryWallet, function(error, rows, next){
        if (error) serverErrorResponse(error);
        // nomor wallet salah
        if (rows.length == 0){
            return userErrorResponse("Nomor wallet salah", res)
        } 

        // nomor wallet benar
        else { 
            // Cari id_client & saldo pengirim
            conn.query("SELECT id_client, saldo FROM daftar_client WHERE id_client = ?", [id_user], function(error, rows, fields){
                // Duit ga cukup
                if(rows[0].saldo < dataPostman.harga){
                    return userErrorResponse("Saldo tidak cukup", res)
                }
                
                // Duitnya cukup
                updateSaldo(id_user, (-1) * dataPostman.harga)
                insertHistory("bayar", dataPostman.nomor_wallet, id_user, 0, dataPostman.harga)
                return successResponse("Pembayaran berhasil", res)
             })
        }
    })
}

// GET HISTORY
exports.history = function(req, res){
    var token = req.headers.authorization;
    var dataToken = parsetoken(token);

    var idClient = dataToken.id_client

    var queryHistoryTopUp = "SELECT id_history, nomor_wallet, id_pengirim, id_penerima, tanggal, waktu, nominal FROM history WHERE (id_pengirim = ? OR id_penerima = ?) AND jenis_transaksi = 'topup'"
    var tableHistoryTopUp = [idClient, idClient]
    
    var queryHistoryBayar = "SELECT id_history, nomor_wallet, tanggal, waktu, nominal FROM history WHERE (id_pengirim = ? OR id_penerima = ?) AND jenis_transaksi = 'bayar'"
    var tableHistoryBayar = [idClient, idClient]

    var queryHistoryTransfer = "SELECT id_history, nomor_wallet, id_pengirim, id_penerima, tanggal, waktu, nominal FROM history WHERE (id_pengirim = ? OR id_penerima = ?) AND jenis_transaksi = 'transfer'"
    var tableHistoryTransfer = [idClient, idClient] 
    
    var queryHistoryTopUp = mysql.format(queryHistoryTopUp, tableHistoryTopUp)
    var queryHistoryBayar = mysql.format(queryHistoryBayar, tableHistoryBayar)
    var queryHistoryTransfer = mysql.format(queryHistoryTransfer, tableHistoryTransfer)

    conn.query(queryHistoryTopUp, function(error, rows, fields){
        if (error) serverErrorResponse(error);

        var topup = []
        rows.forEach(element => {
            topup.push(element)
        });
        
        conn.query(queryHistoryBayar, function(error, rows, fields){
            if(error) serverErrorResponse(error);
        
            var bayar = []
            rows.forEach(element => {
                bayar.push(element)
            })
            
            conn.query(queryHistoryTransfer,function(error, rows, fields){
                if(error) serverErrorResponse(error);
            
                var transfer = []
                rows.forEach(element =>{
                    if(element.id_pengirim == idClient){
                        element.nominal *= -1
                    }
                    transfer.push(element)
                })

                res.status(200).json({
                    "topup": topup,
                    "bayar": bayar,
                    "transfer": transfer 
                })
            })
        })
        
    })

}