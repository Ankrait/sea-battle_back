import Socket from 'socket.io';

import { IConnectionPayload } from 'common/interfaces';
import { repository } from 'repositories';

import { getGameResponse, sendErrorMessage, sendGameResponse } from './utils';

export const surrenderEvent = async (payload: IConnectionPayload, ws: Socket.Socket) => {
	try {
		const game = await repository.findByPK(payload.gameId.toUpperCase());
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		const playerData = getGameResponse(payload.player, game);
		if (!playerData) {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		sendGameResponse({ ...game, status: `WIN${playerData.userNumber === 1 ? 2 : 1}` });

		await repository.delete(game.id);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
