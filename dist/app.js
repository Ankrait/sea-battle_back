"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dispatchEvent_1 = require("routes/ws/dispatchEvent");
const gameRouter_1 = require("routes/gameRouter");
const randomFieldRouter_1 = require("routes/randomFieldRouter");
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
const socket = new socket_io_1.Server(exports.server, {
    cors: {
        origin: '*',
    },
});
socket.on('connection', (ws) => {
    ws.on('message', (m) => (0, dispatchEvent_1.dispatchEvent)(m, ws));
    ws.on('error', (e) => ws.emit('message', e));
});
const bodyParserMiddleware = express_1.default.json();
app.use(bodyParserMiddleware);
app.use((0, cors_1.default)());
app.use('/game', gameRouter_1.gameRouter);
app.use('/random_field', randomFieldRouter_1.randomFieldRouter);
