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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRouter = void 0;
const express_1 = __importDefault(require("express"));
const repositories_1 = require("repositories");
const base_1 = require("common/utils/base");
const create_1 = require("common/utils/field/create");
exports.gameRouter = express_1.default.Router();
exports.gameRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.player;
        if (!name) {
            res.status(403).send({ message: 'Введите имя' });
            return;
        }
        if (name.length > 10) {
            res.status(400).send({ message: 'Максимальная длинна имени 10' });
            return;
        }
        const game = yield repositories_1.repository.create({
            id: (0, base_1.createToken)(),
            player1: name,
            player2: null,
            isReady1: false,
            isReady2: false,
            status: 'INIT',
            field1: (0, create_1.createField)(),
            field2: (0, create_1.createField)(),
        });
        const response = {
            gameId: game.id,
            user: game.player1,
        };
        res.status(200).send(response);
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ message: 'Ошибка создании игры' });
    }
}));
exports.gameRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.player;
        if (!name) {
            res.status(403).send({ message: 'Введите имя' });
            return;
        }
        if (name.length > 10) {
            res.status(400).send({ message: 'Максимальная длинна имени 10' });
            return;
        }
        const id = req.params.id.toUpperCase();
        const game = yield repositories_1.repository.findByPK(id);
        if (!game) {
            res.status(400).send({ message: 'Игры по данному ключу нет' });
            return;
        }
        if (game.player2) {
            res.status(400).send({ message: 'Игрок уже присоеденился' });
            return;
        }
        if (game.player1 === name) {
            res.status(400).send({ message: 'Имя занято' });
            return;
        }
        const updated = yield repositories_1.repository.put({
            id: game.id,
            player2: name,
        });
        if (!updated) {
            res.status(400).send({ message: 'Ошибка сервера' });
            return;
        }
        const response = {
            gameId: updated.id,
            user: updated.player2,
        };
        res.status(200).send(response);
    }
    catch (_a) {
        res.status(400).send({ message: 'Ошибка сервера' });
    }
}));
