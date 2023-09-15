import Socket from 'socket.io';

import { IConnectionPayload } from 'common/interfaces';
import { Game } from 'database/models/game';

import { getGameResponse, sendErrorMessage, sendGameResponse } from './utils';

export const surrenderEvent = async (payload: IConnectionPayload, ws: Socket.Socket) => {
	try {
		const game = await Game.findByPk(payload.gameId);
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		const playerData = getGameResponse(payload.player, game);

		if (!playerData) {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		game.status = `WIN${playerData.userNumber === 1 ? 2 : 1}`;
		game.save();

		sendGameResponse(game);

		await game.destroy();
		await game.save();
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
