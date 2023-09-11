import http from 'http';
import express from 'express';
import cors from 'cors';
import WebSocket, { RawData } from 'ws';

import { sequelize } from './database/db';
import { GameRequestType, IGameIdResponse } from './common/interfaces';
import { connectionRoute, hitRoute, readyRoute, schemeRoute } from './routes';
import { createToken } from './common/utils/base';
import { createField } from './common/utils/fields';
import { Game } from './database/models/game';
import { sendErrorMessage } from './routes/utils';

const PORT = 8080;

const app = express();
const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });
const dispatchEvent = async (message: RawData, ws: WebSocket) => {
	const { event, payload } = JSON.parse(message.toString()) as GameRequestType;
	switch (event) {
		case 'CONNECTION':
			connectionRoute(payload, ws);
			break;

		case 'SCHEME':
			schemeRoute(payload, ws);
			break;

		case 'READY':
			readyRoute(payload, ws);
			break;

		case 'HIT':
			hitRoute(payload, ws);
			break;

		default:
			sendErrorMessage(ws, 'Неверный запрос');
			break;
	}
};

wss.on('connection', (ws, req) => {
	ws.on('message', (m) => dispatchEvent(m, ws));
	ws.on('error', (e: any) => ws.send(e));
});

const bodyParserMiddleware = express.json();
app.use(bodyParserMiddleware);
app.use(cors());

app.post('/game', async (req, res) => {
	try {
		const name = req.body.player as string;

		if (!name) {
			res.status(403).send({ message: 'Введите имя' });
			return;
		}
		if (name.length > 10) {
			res.status(400).send({ message: 'Максимальная длинна имени 10' });
			return;
		}

		const game = await Game.create({
			id: createToken(),
			player1: name,
			isReady1: false,
			isReady2: false,
			status: 'INIT',
			field1: createField(),
			field2: createField(),
		});

		const response: IGameIdResponse = {
			gameId: game.id,
			user: game.player1,
		};

		res.status(200).send(response);
	} catch {
		res.status(400).send({ message: 'Ошибка создании игры' });
	}
});

// app.get('/game/:id', async (req, res) => {
// 	try {
// 		const game = await Game.findByPk(req.params.id);

// 		if (game) {
// 			res.status(200).send(game);
// 		} else {
// 			res.status(400).send({ message: 'Игры по данному ключу нет' });
// 		}
// 	} catch {
// 		res.status(400).send({ message: 'Ошибка сервера' });
// 	}
// });

app.put('/game/:id', async (req, res) => {
	try {
		const name = req.body.player as string;

		if (!name) {
			res.status(403).send({ message: 'Введите имя' });
			return;
		}
		if (name.length > 10) {
			res.status(400).send({ message: 'Максимальная длинна имени 10' });
			return;
		}

		const id = req.params.id.toUpperCase();
		const game = await Game.findByPk(id);
		if (!game) {
			res.status(400).send({ message: 'Игры по данному ключу нет' });
			return;
		}

		if (game.player2) {
			res.status(400).send({ message: 'Игрок уже присоеденился' });
			return;
		}

		game.player2 = name;
		await game.save();

		const response: IGameIdResponse = {
			gameId: game.id,
			user: game.player2,
		};

		res.status(200).send(response);
	} catch {
		res.status(400).send({ message: 'Ошибка сервера' });
	}
});

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		server.listen(PORT, () => console.log('Server started'));
	} catch (e) {
		console.log(e);
	}
};

start();
