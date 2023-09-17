"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const dotenv_1 = require("dotenv");
const getConfig = (key) => {
    const { error, parsed } = (0, dotenv_1.config)();
    if (error)
        throw new Error('Не найден файл .env');
    if (!parsed)
        throw new Error('Пустой файл .env');
    const res = parsed[key];
    if (!res)
        throw new Error('Нет такого ключа');
    return res;
};
exports.getConfig = getConfig;
