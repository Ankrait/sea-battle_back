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
exports.postgresRepository = void 0;
const game_1 = require("database/models/game");
exports.postgresRepository = {
    findByPK(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield game_1.Game.findByPk(id);
            return (result === null || result === void 0 ? void 0 : result.dataValues) || null;
        });
    },
    create(game) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield game_1.Game.create(game);
            return created.dataValues;
        });
    },
    put(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield game_1.Game.findByPk(payload.id);
            if (!game)
                return null;
            const updated = yield game.update(payload);
            return updated.dataValues;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield game_1.Game.findByPk(id);
            if (!game)
                return false;
            yield game.destroy();
            return true;
        });
    },
};
