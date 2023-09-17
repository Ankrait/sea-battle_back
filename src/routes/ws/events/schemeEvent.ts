import Socket from 'socket.io';

import { repository } from 'repositories';
import { ISchemePayload } from 'common/interfaces';
import { isFieldCorrect } from 'common/utils/field/check';

import { sendErrorMessage, sendGameResponse, getGameResponse } from './utils';

export const schemeEvent = async (payload: ISchemePayload, ws: Socket.Socket) => {
	try {
		const game = await repository.findByPK(payload.gameId.toUpperCase());
		if (!game) {
			sendErrorMessage(ws, 'Игры по данному ключу нет');
			return;
		}

		if (!isFieldCorrect(payload.field)) {
			sendErrorMessage(ws, 'Некорректное поле');
			return;
		}

		const playerData = getGameResponse(payload.player, game);
		if (!playerData) {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}
		if (playerData.isReady) {
			sendErrorMessage(ws, 'Вы не можете поменять поле, когда готовы');
			return;
		}

		const updated = await repository.put({
			id: game.id,
			[`field${playerData.userNumber}`]: payload.field,
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
