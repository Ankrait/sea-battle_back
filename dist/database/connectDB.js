"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("config/config");
exports.sequelize = new sequelize_1.Sequelize((0, config_1.getConfig)('DB_NAME'), (0, config_1.getConfig)('DB_USER'), (0, config_1.getConfig)('DB_PASSWORD'), {
    dialect: 'postgres',
    host: (0, config_1.getConfig)('DB_HOST'),
    port: +(0, config_1.getConfig)('DB_PORT'),
});
