"use strict"

module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define("Account", {
        financialInstitution: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Account.hasMany(models.Transaction);
            }
        }
    });

    return Account;
}

