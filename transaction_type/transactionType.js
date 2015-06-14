var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'heroku_e56800c88b7a6b4',
    debug: false
});

module.exports.getAllTransactionTypes = function(callback) {
    pool.getConnection(function(err, connection) {
//        if(err) {
//            connection.release();
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        }

        console.log("TRANSACTION TYPE: connected as id " + connection.threadId);

        connection.query("SELECT * FROM transaction_type", function(err, results) {
            connection.release();
            callback(err, results);
        });

//        connection.on("error", function(err) {
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        });
    });
}