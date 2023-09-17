import Socket from 'socket.io';

import { repository } from 'repositories';
import { IConnectionPayload } from 'common/interfaces';
import { users } from 'connectedUsers';

import { sendErrorMessage, sendGameResponse } from './utils';

export const connectionEvent = async (payload: IConnectionPayload, ws: Socket.Socket) => {
	try {
		const game = await repository.findByPK(payload.gameId.toUpperCase());
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		if (payload.player !== game.player1 && payload.player !== game.player2) {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		users.set(`${game.id}+${payload.player}`, ws);
		ws.on('disconnect', () => {
			users.delete(`${game.id}+${payload.player}`);
		});

		sendGameResponse(game);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
