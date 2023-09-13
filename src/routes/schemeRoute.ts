import WebSocket from 'ws';

import { ISchemePayload } from '../common/interfaces';
import { Game } from '../database/models/game';
import { sendErrorMessage, sendGameResponse } from './utils';
import { isFieldCorrect } from '../common/utils/field/check';

export const schemeRoute = async (payload: ISchemePayload, ws: WebSocket) => {
	try {
		const game = await Game.findOne({ where: { id: payload.gameId.toUpperCase() } });
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}
		
		if (!isFieldCorrect(payload.field)) {
			sendErrorMessage(ws, 'Некорректное поле');
			return;
		}

		if (game.player1 === payload.player) {
			if (game.isReady1) {
				sendErrorMessage(ws, 'Вы не можете поменять поле, когда готовы');
				return;
			}

			game.field1 = payload.field;
		} else if (game.player2 === payload.player) {
			if (game.isReady2) {
				sendErrorMessage(ws, 'Вы не можете поменять поле, когда готовы');
				return;
			}

			game.field2 = payload.field;
		} else {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		await game.save();

		sendGameResponse(game);
	} catch(e) {
		console.log(e);
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
