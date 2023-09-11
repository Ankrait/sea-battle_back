import WebSocket from 'ws';

import { IReadyPayload } from '../common/interfaces';
import { isCorrectShipCount } from '../common/utils/fields';
import { Game } from '../database/models/game';
import { sendErrorMessage, sendGameResponse } from './utils';

export const readyRoute = async (payload: IReadyPayload, ws: WebSocket) => {
	try {
		const game = await Game.findOne({ where: { id: payload.gameId.toUpperCase() } });
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		if (game.player1 === payload.player) {
			if (payload.isReady && !isCorrectShipCount(game.field1)) {
				sendErrorMessage(ws, 'Некорректное количество кораблей');
				return;
			}
			game.isReady1 = payload.isReady;
		} else if (game.player2 === payload.player) {
			if (payload.isReady && !isCorrectShipCount(game.field2)) {
				sendErrorMessage(ws, 'Некорректное количество кораблей');
				return;
			}
			game.isReady2 = payload.isReady;
		} else {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		if (game.isReady1 && game.isReady2) game.status = 'HIT1';

		await game.save();

		sendGameResponse(game);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
