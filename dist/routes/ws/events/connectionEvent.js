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
exports.connectionEvent = void 0;
const repositories_1 = require("repositories");
const connectedUsers_1 = require("connectedUsers");
const utils_1 = require("./utils");
const connectionEvent = (payload, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield repositories_1.repository.findByPK(payload.gameId.toUpperCase());
        if (!game) {
            (0, utils_1.sendErrorMessage)(ws, 'Игры по данному ключу нет');
            return;
        }
        if (payload.player !== game.player1 && payload.player !== game.player2) {
            (0, utils_1.sendErrorMessage)(ws, 'Вы не подключены к этой игре');
            return;
        }
        connectedUsers_1.users.set(`${game.id}+${payload.player}`, ws);
        ws.on('disconnect', () => {
            connectedUsers_1.users.delete(`${game.id}+${payload.player}`);
        });
        (0, utils_1.sendGameResponse)(game);
    }
    catch (_a) {
        (0, utils_1.sendErrorMessage)(ws, 'Ошибка сервера');
    }
});
exports.connectionEvent = connectionEvent;
