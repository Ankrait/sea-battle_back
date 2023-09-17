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
exports.jsonRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const dataPath = 'src/database/jsonDB/game.json';
const saveGames = (data) => {
    console.log('---SAVE-TO-JSON--', data);
    const stringifyData = JSON.stringify(data);
    fs_1.default.writeFileSync(dataPath, stringifyData);
};
const getGames = () => {
    const jsonData = fs_1.default.readFileSync(dataPath);
    return JSON.parse(jsonData.toString());
};
exports.jsonRepository = {
    findByPK(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return getGames().find((el) => el.id === id) || null;
        });
    },
    create(game) {
        return __awaiter(this, void 0, void 0, function* () {
            const games = getGames();
            games.push(game);
            saveGames(games);
            return game;
        });
    },
    put(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const games = getGames();
            const gameIndex = games.findIndex((el) => el.id === payload.id);
            if (gameIndex === -1)
                return null;
            let game = games.splice(gameIndex, 1)[0];
            game = Object.assign(Object.assign({}, game), payload);
            games.push(game);
            saveGames(games);
            return game;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const games = getGames();
            const gameIndex = games.findIndex((el) => el.id === id);
            if (gameIndex === -1)
                return false;
            games.splice(gameIndex, 1);
            saveGames(games);
            return true;
        });
    },
};
