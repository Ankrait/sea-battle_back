"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPosValid = exports.aroundDirections = void 0;
exports.aroundDirections = [
    [0, 0],
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 1],
];
const isPosValid = (pos, filedSize) => {
    if (pos.x >= filedSize || pos.x < 0 || pos.y >= filedSize || pos.y < 0) {
        return false;
    }
    return true;
};
exports.isPosValid = isPosValid;
