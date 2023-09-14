import WebSocket from 'ws';

import { IReadyPayload } from 'common/interfaces';
import { Game } from 'database/models/game';
import { getDeckCount } from 'common/utils/field/check';

import { sendErrorMessage, sendGameResponse, getGameResponse } from './utils';

export const readyEvent = async (payload: IReadyPayload, ws: WebSocket) => {
	try {
		const game = await Game.findOne({ where: { id: payload.gameId.toUpperCase() } });
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		const playerData = getGameResponse(payload.player, game);

		if (!playerData) {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		if (payload.isReady && getDeckCount(playerData.userField) !== 20) {
			sendErrorMessage(ws, 'Некорректное количество кораблей');
			return;
		}

		game[`isReady${playerData.userNumber}`] = payload.isReady;

		if (game.isReady1 && game.isReady2) game.status = 'HIT1';

		await game.save();

		sendGameResponse(game);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
