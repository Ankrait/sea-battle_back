import WebSocket from 'ws';

import { IHitPayload } from '../common/interfaces';
import { Game } from '../database/models/game';
import { sendErrorMessage, sendGameResponse } from './utils';

export const hitRoute = async (payload: IHitPayload, ws: WebSocket) => {
	try {
		const game = await Game.findOne({ where: { id: payload.gameId.toUpperCase() } });

		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		if (
			payload.hit.x > 9 ||
			payload.hit.x < 0 ||
			payload.hit.y > 9 ||
			payload.hit.y < 0
		) {
			sendErrorMessage(ws, 'Ошибка данных');
			return;
		}

		const { x, y } = payload.hit;

		if (game.player1 === payload.player) {
			if (game.status !== 'HIT1') {
				sendErrorMessage(ws, 'Ошибка: не ваш ход');
				return;
			}

			if (game.field2[y][x] === 'MISS' || game.field2[y][x] === 'DEAD') {
				sendErrorMessage(ws, 'Ошибка: повторный выстрел');
				return;
			}

			game.field2[y][x] = game.field2[y][x] === 'SHIP' ? 'DEAD' : 'MISS';
			game.status = 'HIT2';
		} else if (game.player2 === payload.player) {
			if (game.status !== 'HIT2') {
				sendErrorMessage(ws, 'Ошибка: не ваш ход');
				return;
			}

			if (game.field1[y][x] === 'MISS' || game.field1[y][x] === 'DEAD') {
				sendErrorMessage(ws, 'Ошибка: повторный выстрел');
				return;
			}

			game.field1[y][x] = game.field1[y][x] === 'SHIP' ? 'DEAD' : 'MISS';
			game.status = 'HIT1';
		} else {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		if (
			!game.field1.some((el) => el.includes('SHIP')) ||
			!game.field2.some((el) => el.includes('SHIP'))
		) {
			game.status = 'END';
		}
		await game.save();

		sendGameResponse(game);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
