import Socket from 'socket.io';

import { repository } from 'repositories';
import { IReadyPayload } from 'common/interfaces';
import { getDeckCount } from 'common/utils/field/check';

import { sendErrorMessage, sendGameResponse, getGameResponse } from './utils';

export const readyEvent = async (payload: IReadyPayload, ws: Socket.Socket) => {
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
		if (payload.isReady && getDeckCount(playerData.userField) !== 20) {
			sendErrorMessage(ws, 'Некорректное количество кораблей');
			return;
		}

		const updated = await repository.put({
			id: game.id,
			[`isReady${playerData.userNumber}`]: payload.isReady,
			status:
				game[`isReady${playerData.userNumber === 1 ? 2 : 1}`] && payload.isReady
					? 'HIT1'
					: game.status,
		});
		if (!updated) {
			sendErrorMessage(ws, 'Ошибка сервера');
			return;
		}

		sendGameResponse(updated);
	} catch {
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
