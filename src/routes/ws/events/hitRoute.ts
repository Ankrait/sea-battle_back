import WebSocket from 'ws';

import { IHitPayload } from 'common/interfaces';
import { Game } from 'database/models/game';
import { checkShipIsDead } from 'common/utils/field/check';
import { isPosValid } from 'common/utils/field/base';

import { sendErrorMessage, sendGameResponse } from './utils';

export const hitRoute = async (payload: IHitPayload, ws: WebSocket) => {
	try {
		const game = await Game.findOne({ where: { id: payload.gameId.toUpperCase() } });

		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		const { x, y } = payload.hit;

		if (!isPosValid({ x, y }, 10)) {
			sendErrorMessage(ws, 'Ошибка данных');
			return;
		}

		if (game.player1 === payload.player) {
			if (game.status !== 'HIT1') {
				sendErrorMessage(ws, 'Ошибка: не ваш ход');
				return;
			}

			if (game.field2[y][x] !== 'EMPTY' && game.field2[y][x] !== 'SHIP') {
				sendErrorMessage(ws, 'Ошибка: повторный выстрел');
				return;
			}

			if (game.field2[y][x] === 'SHIP') {
				const shipDead = checkShipIsDead(game.field2, { y, x });

				if (!shipDead) {
					game.field2[y][x] = 'DEAD';
				} else {
					for (const { x: tx, y: ty } of shipDead) {
						game.field2[ty][tx] = 'DEAD_SHIP';
					}
				}
			} else {
				game.field2[y][x] = 'MISS';
				game.status = 'HIT2';
			}

			game.changed('field2', true);
		} else if (game.player2 === payload.player) {
			if (game.status !== 'HIT2') {
				sendErrorMessage(ws, 'Ошибка: не ваш ход');
				return;
			}

			if (game.field1[y][x] !== 'EMPTY' && game.field1[y][x] !== 'SHIP') {
				sendErrorMessage(ws, 'Ошибка: повторный выстрел');
				return;
			}

			if (game.field1[y][x] === 'SHIP') {
				const shipDead = checkShipIsDead(game.field1, { y, x });

				if (!shipDead) {
					game.field1[y][x] = 'DEAD';
				} else {
					for (const { x: tx, y: ty } of shipDead) {
						game.field1[ty][tx] = 'DEAD_SHIP';
					}
				}
			} else {
				game.field1[y][x] = 'MISS';
				game.status = 'HIT1';
			}

			game.changed('field1', true);
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
