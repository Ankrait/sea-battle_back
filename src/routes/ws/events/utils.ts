import Socket from 'socket.io';

import { IGameResponse } from 'common/interfaces';
import { Game } from 'database/models/game';
import { users } from 'connectedUsers';

export const sendErrorMessage = (ws: Socket.Socket, message: string) => {
	ws.emit('message', { message });
};

export const getGameResponse = (player: string, game: Game) => {
	let result: IGameResponse | null = null;

	if (player === game.player1) {
		result = {
			gameId: game.id,
			userNumber: 1,
			user: game.player1,
			userField: game.field1,
			isReady: game.isReady1,
			enemy: game.player2,
			enemyField: game.field2,
			enemyIsReady: game.isReady2,
			status: game.status,
		};
	} else if (player === game.player2) {
		result = {
			gameId: game.id,
			userNumber: 2,
			user: game.player2,
			userField: game.field2,
			isReady: game.isReady2,
			enemy: game.player1,
			enemyField: game.field1,
			enemyIsReady: game.isReady1,
			status: game.status,
		};
	}

	return result;
};

export const sendGameResponse = (game: Game) => {
	const response1 = getGameResponse(game.player1, game)!;
	users.get(`${game.id}+${game.player1}`)?.emit('message', response1);

	if (game.player2) {
		const response2 = getGameResponse(game.player2, game)!;
		users.get(`${game.id}+${game.player2}`)?.emit('message', response2);
	}
};
