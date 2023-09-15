import http from 'http';
import express from 'express';
import cors from 'cors';
import Socket, { Server } from 'socket.io';

import { dispatchEvent } from 'routes/ws/dispatchEvent';
import { gameRouter } from 'routes/gameRouter';
import { randomFieldRouter } from 'routes/randomFieldRouter';

const app = express();
export const server = http.createServer(app);
const socket = new Server(server, {
	cors: {
		origin: '*',
	},
});

socket.on('connection', (ws: Socket.Socket) => {
	ws.on('message', (m) => dispatchEvent(m, ws));
	ws.on('error', (e) => ws.emit('message', e));
});

const bodyParserMiddleware = express.json();
app.use(bodyParserMiddleware);
app.use(cors());

app.use('/game', gameRouter);
app.use('/random_field', randomFieldRouter);
