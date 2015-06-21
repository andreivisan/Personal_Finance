"use strict"

module.exports = function(sequelize, DataTypes) {
    var Transaction = sequelize.define("Transaction", {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Transaction.hasOne(models.TransactionType);
                Transaction.belongsTo(models.Account);
                Transaction.belongsTo(models.Budget);
            }
        }
    });

    return Transaction;
}