import WebSocket from 'ws';

import { IHitPayload } from 'common/interfaces';
import { Game } from 'database/models/game';
import { checkShipIsDead } from 'common/utils/field/check';
import { isPosValid } from 'common/utils/field/base';

import { getGameResponse, sendErrorMessage, sendGameResponse } from './utils';

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

		const playerData = getGameResponse(payload.player, game);

		if (!playerData) {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		if (!playerData.status.includes('HIT')) {
			sendErrorMessage(ws, 'Еще не время хода');
			return;
		}

		if (playerData.status !== `HIT${playerData.userNumber}`) {
			sendErrorMessage(ws, 'Не ваш ход');
			return;
		}

		const hitPlace = playerData.enemyField[y][x];
		if (hitPlace !== 'EMPTY' && hitPlace !== 'SHIP') {
			sendErrorMessage(ws, 'Вы уже выстрелели в эту позицию');
			return;
		}

		if (hitPlace === 'SHIP') {
			const deadShip = checkShipIsDead(playerData.enemyField, { y, x });

			if (!deadShip) {
				playerData.enemyField[y][x] = 'DEAD';
			} else {
				for (const { y: ty, x: tx } of deadShip) {
					playerData.enemyField[ty][tx] = 'DEAD_SHIP';
				}
			}
		} else {
			playerData.enemyField[y][x] = 'MISS';

			game.status = `HIT${playerData.userNumber === 1 ? 2 : 1}`;
		}

		if (payload.player === game.player1) {
			game.changed('field2', true);
		} else {
			game.changed('field1', true);
		}

		if (!game.field1.some((el) => el.includes('SHIP'))) {
			game.status = 'WIN2';
		} else if (!game.field2.some((el) => el.includes('SHIP'))) {
			game.status = 'WIN1';
		}

		await game.save();

		sendGameResponse(game);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
