"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const sequelize_1 = require("sequelize");
const connectDB_1 = require("../connectDB");
class Game extends sequelize_1.Model {
}
exports.Game = Game;
Game.init({
    id: {
        type: sequelize_1.DataTypes.STRING(5),
        primaryKey: true,
    },
    player1: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    player2: {
        type: sequelize_1.DataTypes.STRING(10),
    },
    field1: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING)),
        allowNull: false,
    },
    field2: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING)),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    isReady1: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    isReady2: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize: connectDB_1.sequelize,
    tableName: 'games',
});
