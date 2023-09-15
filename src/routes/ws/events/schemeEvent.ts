import Socket from 'socket.io';

import { ISchemePayload } from 'common/interfaces';
import { Game } from 'database/models/game';
import { isFieldCorrect } from 'common/utils/field/check';

import { sendErrorMessage, sendGameResponse, getGameResponse } from './utils';

export const schemeEvent = async (payload: ISchemePayload, ws: Socket.Socket) => {
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

		const playerData = getGameResponse(payload.player, game);

		if (!playerData) {
			sendErrorMessage(ws, 'Вы не подключены к этой игре');
			return;
		}

		if (playerData.isReady) {
			sendErrorMessage(ws, 'Вы не можете поменять поле, когда готовы');
			return;
		}

		game[`field${playerData.userNumber}`] = payload.field;

		await game.save();

		sendGameResponse(game);
	} catch (e) {
		console.log(e);
		sendErrorMessage(ws, 'Ошибка сервера');
	}
};
