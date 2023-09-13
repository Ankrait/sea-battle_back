import http from 'http';
import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';

import { dispatchEvent } from 'routes/ws/dispatchEvent';
import { gameRouter } from 'routes/gameRouter';
import { randomFieldRouter } from 'routes/randomFieldRouter';

const app = express();
export const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
	ws.on('message', (m) => dispatchEvent(m, ws));
	ws.on('error', (e: any) => ws.send(e));
});

const bodyParserMiddleware = express.json();
app.use(bodyParserMiddleware);
app.use(cors());

app.use('/game', gameRouter);
app.use('/random_field', randomFieldRouter);
