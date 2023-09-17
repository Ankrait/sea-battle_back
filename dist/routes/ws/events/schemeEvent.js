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
exports.schemeEvent = void 0;
const repositories_1 = require("repositories");
const check_1 = require("common/utils/field/check");
const utils_1 = require("./utils");
const schemeEvent = (payload, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield repositories_1.repository.findByPK(payload.gameId.toUpperCase());
        if (!game) {
            (0, utils_1.sendErrorMessage)(ws, 'Игры по данному ключу нет');
            return;
        }
        if (!(0, check_1.isFieldCorrect)(payload.field)) {
            (0, utils_1.sendErrorMessage)(ws, 'Некорректное поле');
            return;
        }
        const playerData = (0, utils_1.getGameResponse)(payload.player, game);
        if (!playerData) {
            (0, utils_1.sendErrorMessage)(ws, 'Вы не подключены к этой игре');
            return;
        }
        if (playerData.isReady) {
            (0, utils_1.sendErrorMessage)(ws, 'Вы не можете поменять поле, когда готовы');
            return;
        }
        const updated = yield repositories_1.repository.put({
            id: game.id,
            [`field${playerData.userNumber}`]: payload.field,
        });
        if (!updated) {
            (0, utils_1.sendErrorMessage)(ws, 'Ошибка сервера');
            return;
        }
        (0, utils_1.sendGameResponse)(updated);
    }
    catch (_a) {
        (0, utils_1.sendErrorMessage)(ws, 'Ошибка сервера');
    }
});
exports.schemeEvent = schemeEvent;
