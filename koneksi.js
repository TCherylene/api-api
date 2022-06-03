var mysql = require('mysql');

// Create a connection
var conn = 
  mysql.createConnection({
    host: "localhost", 
    port: "3306",
    user: "root", 
    password: "",
    database: "ecia"
  });

conn.connect(function(err, conn){
    if(err) {
        console.log("MySQL tidak terkoneksi");
    }
    if(conn) console.log("MySQL terkoneksi");
})

module.exports = conn;