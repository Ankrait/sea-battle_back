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
exports.hitEvent = void 0;
const check_1 = require("common/utils/field/check");
const base_1 = require("common/utils/field/base");
const utils_1 = require("./utils");
const repositories_1 = require("../../../repositories");
const hitEvent = (payload, ws) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield repositories_1.repository.findByPK(payload.gameId.toUpperCase());
        if (!game) {
            (0, utils_1.sendErrorMessage)(ws, 'Игры по данному ключу нет');
            return;
        }
        const { x, y } = payload.hit;
        if (!(0, base_1.isPosValid)({ x, y }, 10)) {
            (0, utils_1.sendErrorMessage)(ws, 'Ошибка данных');
            return;
        }
        const playerData = (0, utils_1.getGameResponse)(payload.player, game);
        if (!playerData) {
            (0, utils_1.sendErrorMessage)(ws, 'Вы не подключены к этой игре');
            return;
        }
        if (!playerData.status.includes('HIT')) {
            (0, utils_1.sendErrorMessage)(ws, 'Еще не время хода');
            return;
        }
        if (playerData.status !== `HIT${playerData.userNumber}`) {
            (0, utils_1.sendErrorMessage)(ws, 'Не ваш ход');
            return;
        }
        const hitPlace = playerData.enemyField[y][x];
        if (hitPlace !== 'EMPTY' && hitPlace !== 'SHIP') {
            (0, utils_1.sendErrorMessage)(ws, 'Вы уже выстрелели в эту позицию');
            return;
        }
        if (hitPlace === 'SHIP') {
            const deadShip = (0, check_1.checkShipIsDead)(playerData.enemyField, { y, x });
            if (!deadShip) {
                playerData.enemyField[y][x] = 'DEAD';
            }
            else {
                for (const { y: ty, x: tx } of deadShip) {
                    playerData.enemyField[ty][tx] = 'DEAD_SHIP';
                }
            }
        }
        else {
            playerData.enemyField[y][x] = 'MISS';
            game.status = `HIT${playerData.userNumber === 1 ? 2 : 1}`;
        }
        let isToDelete = true;
        if (!game.field1.some((el) => el.includes('SHIP'))) {
            game.status = 'WIN2';
        }
        else if (!game.field2.some((el) => el.includes('SHIP'))) {
            game.status = 'WIN1';
        }
        else {
            isToDelete = false;
        }
        const updated = yield repositories_1.repository.put(game);
        if (!updated) {
            (0, utils_1.sendErrorMessage)(ws, 'Ошибка сервера');
            return;
        }
        (0, utils_1.sendGameResponse)(updated);
        if (isToDelete) {
            yield repositories_1.repository.delete(game.id);
        }
    }
    catch (_a) {
        (0, utils_1.sendErrorMessage)(ws, 'Ошибка сервера');
    }
});
exports.hitEvent = hitEvent;
