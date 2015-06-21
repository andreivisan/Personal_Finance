"use strict"

module.exports = function(sequelize, DataTypes) {
    var TransactionType = sequelize.define("TransactionType", {
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                TransactionType.belongsTo(models.Transaction);
            }
        }
    });

    return TransactionType;
}