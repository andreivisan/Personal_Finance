"use strict"

module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define("Account", {
        financialInstitution: DataTypes.STRING,
        name: DataTypes.STRING,
        currency: DataTypes.STRING,
        type: DataTypes.STRING,
        amount: DataTypes.DOUBLE
    }, {
        classMethods: {
            associate: function(models) {
                Account.hasMany(models.Transaction);
            }
        }
    });
}

