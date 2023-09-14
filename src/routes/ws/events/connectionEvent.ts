import WebSocket from 'ws';

import { IConnectionPayload } from 'common/interfaces';
import { Game } from 'database/models/game';
import { users } from 'connectedUsers';

import { sendErrorMessage, sendGameResponse } from './utils';

export const connectionEvent = async (payload: IConnectionPayload, ws: WebSocket) => {
	try {
		const game = await Game.findByPk(payload.gameId);
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		if (payload.player !== game.player1 && payload.player !== game.player2) {
			console.log(game);

			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		users.set(`${game.id}+${payload.player}`, ws);
		ws.onclose = () => {
			users.delete(`${game.id}+${payload.player}`);
		};

		sendGameResponse(game);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
