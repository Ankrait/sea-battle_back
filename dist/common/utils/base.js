"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randNum = exports.createToken = void 0;
const createToken = (len = 5) => {
    const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    const token = [];
    for (let i = 0; i < len; i++) {
        const symbol = +(Math.random() * (symbols.length - 1)).toFixed(0);
        token.push(symbols[symbol]);
    }
    return token.join('');
};
exports.createToken = createToken;
const randNum = (min = 0, max = 9) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.randNum = randNum;
