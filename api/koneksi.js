var mysql = require('mysql');

// Create a connection
var conn = 
  mysql.createConnection({
    host: "sql6.freesqldatabase.com", 
    port: "3306",
    user: "sql6497442", 
    password: "msfajvSDQ2",
    database: "sql6497442"
  });

conn.connect(function(err, conn){
    if(err) {
        console.log("MySQL tidak terkoneksi");
    }
    if(conn) console.log("MySQL terkoneksi");
})

module.exports = conn;