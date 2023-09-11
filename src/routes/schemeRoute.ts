import WebSocket from 'ws';

import { ISchemePayload } from '../common/interfaces';
import { isCorrectField } from '../common/utils/fields';
import { Game } from '../database/models/game';
import { sendErrorMessage, sendGameResponse } from './utils';

export const schemeRoute = async (payload: ISchemePayload, ws: WebSocket) => {
	try {
		const game = await Game.findOne({ where: { id: payload.gameId.toUpperCase() } });
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		// if (!isCorrectField(payload.field)) {
		// 	sendErrorMessage(ws, 'Некорректное поле');
		// 	return;
		// }

		if (game.player1 === payload.player) {
			game.field1 = payload.field;
		} else if (game.player2 === payload.player) {
			game.field2 = payload.field;
		} else {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		await game.save();

		sendGameResponse(game);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
