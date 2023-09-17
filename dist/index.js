"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("app");
const config_1 = require("config/config");
const connectDB_1 = require("database/connectDB");
const PORT = (0, config_1.getConfig)('PORT');
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB_1.sequelize.authenticate();
        yield connectDB_1.sequelize.sync();
        app_1.server.listen(PORT, () => console.log('Server started'));
    }
    catch (e) {
        console.log(e);
    }
});
start();