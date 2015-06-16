var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'heroku_e56800c88b7a6b4',
    debug: false
});


module.exports.createTransaction = function(request, callback) {
    var transaction = {
        description: request.body.description,
        amount: parseInt(request.body.amount),
        budget_id: parseInt(request.body.budget),
        date: new Date(request.body.date).toISOString().slice(0, 19).replace('T', ' '),
        account_id: parseInt(request.body.account_type),
        transaction_type_id: parseInt(request.body.transaction_type)
    };

    console.log("TRANSACTION: Tx to insert: " + JSON.stringify(transaction));

    pool.getConnection(function(err, connection) {
//        if(err) {
//            connection.release();
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        }

        console.log("TRANSACTION: connected as id " + connection.threadId);

        connection.query("INSERT INTO transaction SET ?", transaction, function(err, result) {
            connection.release();
            callback(err, result);
        });

//        connection.on("error", function(err) {
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        });
    });
}

module.exports.getTransactions = function(callback) {
    pool.getConnection(function(err, connection) {
//        if(err) {
//            connection.release();
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        }

        console.log("TRANSACTIONS: connected as id " + connection.threadId);

        connection.query("SELECT * FROM transaction", function(err, results) {
            connection.release();
            callback(err, results);
        });

//        connection.on("error", function(err) {
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        });
    });
}

module.exports.getTransactionsByAccountId = function(accountId, callback) {
    pool.getConnection(function(err, connection) {
//        if(err) {
//            connection.release();
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        }

        console.log("TRANSACTION: connected as id " + connection.threadId);

        connection.query("SELECT * FROM transaction WHERE account_id = ?", [parseInt(accountId)], function(err, results) {
            connection.release();
            callback(err, results);
        });

//        connection.on("error", function(err) {
//            callback({"code" : 100, "status": "Error in connection database"}, null);
//        });
    });
}