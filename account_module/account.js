/**
 * Created by andreivisan on 6/7/15.
 */
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'heroku_e56800c88b7a6b4',
    debug: false
});


module.exports.createAccount = function(request, callback) {
    var account = {
        financial_institution: request.body.financial_institution,
        name: request.body.name,
        currency: request.body.currency,
        type: request.body.type,
        amount: parseInt(request.body.amount)
    };

    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            callback({"code" : 100, "status": "Error in connection database"}, null);
            return;
        }

        console.log("ACCOUNT: connected as id " + connection.threadId);

        connection.query("INSERT INTO account SET ?", account, function(err, result) {
            connection.release();
            callback(err, result);
        });

        connection.on("error", function(err) {
            callback({"code" : 100, "status": "Error in connection database"}, null);
            return;
        });
    });
}

module.exports.getAllAccounts = function(callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            connection.release();
            callback({"code" : 100, "status": "Error in connection database"}, null);
            return;
        }

        console.log("ACCOUNT: connected as id " + connection.threadId);

        connection.query("SELECT * FROM account", function(err, results) {
            connection.release();
            callback(err, results);
        });

        connection.on("error", function(err) {
            callback({"code" : 100, "status": "Error in connection database"}, null);
            return;
        });
    });
}