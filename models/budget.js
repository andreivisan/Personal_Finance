"use strict"

module.exports = function(sequelize, DataTypes) {
    var Budget = sequelize.define("Budget", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        limit: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        period: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rollover: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        rolloverData: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Budget.hasMany(models.Transaction);
            }
        }
    });

    return Budget;
}