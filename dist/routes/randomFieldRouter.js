"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFieldRouter = void 0;
const express_1 = __importDefault(require("express"));
const check_1 = require("common/utils/field/check");
const create_1 = require("common/utils/field/create");
exports.randomFieldRouter = express_1.default.Router();
exports.randomFieldRouter.get('/', (_, res) => {
    try {
        let field = (0, create_1.randomField)();
        let retryCount = 0;
        while (!(0, check_1.isFieldCorrect)(field) && retryCount < 15) {
            field = (0, create_1.randomField)();
            retryCount++;
        }
        res.status(200).send({ field });
    }
    catch (e) {
        res.status(400).send({ message: 'Ошибка сервера' });
    }
});
