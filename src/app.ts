import http from 'http';
import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';

import { sequelize } from 'database/db';
import { IGameIdResponse } from 'common/interfaces';
import { createToken } from 'common/utils/base';
import { Game } from 'database/models/game';
import { createField, randomField } from 'common/utils/field/create';
import { isFieldCorrect } from 'common/utils/field/check';
import { dispatchEvent } from 'routes/ws/dispatchEvent';

const PORT = 8080;

const app = express();
const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
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

app.get('/random_field', (_, res) => {
	try {
		let field = randomField();

		while (!isFieldCorrect(field)) {
			field = randomField();
		}

		res.status(200).send({ field });
	} catch (e) {
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
