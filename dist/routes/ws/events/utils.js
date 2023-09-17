"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGameResponse = exports.getGameResponse = exports.sendErrorMessage = void 0;
const connectedUsers_1 = require("connectedUsers");
const sendErrorMessage = (ws, message) => {
    ws.emit('message', { message });
};
exports.sendErrorMessage = sendErrorMessage;
const getGameResponse = (player, game) => {
    let result = null;
    if (player === game.player1) {
        result = {
            gameId: game.id,
            userNumber: 1,
            user: game.player1,
            userField: game.field1,
            isReady: game.isReady1,
            enemy: game.player2,
            enemyField: game.field2,
            enemyIsReady: game.isReady2,
            status: game.status,
        };
    }
    else if (player === game.player2) {
        result = {
            gameId: game.id,
            userNumber: 2,
            user: game.player2,
            userField: game.field2,
            isReady: game.isReady2,
            enemy: game.player1,
            enemyField: game.field1,
            enemyIsReady: game.isReady1,
            status: game.status,
        };
    }
    return result;
};
exports.getGameResponse = getGameResponse;
const sendGameResponse = (game) => {
    var _a, _b;
    const response1 = (0, exports.getGameResponse)(game.player1, game);
    (_a = connectedUsers_1.users.get(`${game.id}+${game.player1}`)) === null || _a === void 0 ? void 0 : _a.emit('message', response1);
    if (game.player2) {
        const response2 = (0, exports.getGameResponse)(game.player2, game);
        (_b = connectedUsers_1.users.get(`${game.id}+${game.player2}`)) === null || _b === void 0 ? void 0 : _b.emit('message', response2);
    }
};
exports.sendGameResponse = sendGameResponse;
