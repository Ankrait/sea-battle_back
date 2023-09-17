import express from 'express';

import { repository } from 'repositories';
import { createToken } from 'common/utils/base';
import { createField } from 'common/utils/field/create';
import { IGameIdResponse } from 'common/interfaces';

export const gameRouter = express.Router();

gameRouter.post('/', async (req, res) => {
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

		const game = await repository.create({
			id: createToken(),
			player1: name,
			player2: null,
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
	} catch(e) {
		console.log(e);
		
		res.status(400).send({ message: 'Ошибка создании игры' });
	}
});

gameRouter.put('/:id', async (req, res) => {
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
		const game = await repository.findByPK(id);
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

		const updated = await repository.put({
			id: game.id,
			player2: name,
		});

		if (!updated) {
			res.status(400).send({ message: 'Ошибка сервера' });
			return;
		}

		const response: IGameIdResponse = {
			gameId: updated.id,
			user: updated.player2!,
		};

		res.status(200).send(response);
	} catch {
		res.status(400).send({ message: 'Ошибка сервера' });
	}
});
