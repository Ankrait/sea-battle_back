import WebSocket, { RawData } from 'ws';

import { GameRequestType } from 'common/interfaces';
import { sendErrorMessage } from 'routes/ws/events/utils';

import { connectionRoute } from './events/connectionRoute';
import { schemeRoute } from './events/schemeRoute';
import { readyRoute } from './events/readyRoute';
import { hitRoute } from './events/hitRoute';

export const dispatchEvent = async (message: RawData, ws: WebSocket) => {
	const { event, payload } = JSON.parse(message.toString()) as GameRequestType;
	switch (event) {
		case 'CONNECTION':
			connectionRoute(payload, ws);
			break;

		case 'SCHEME':
			schemeRoute(payload, ws);
			break;

		case 'READY':
			readyRoute(payload, ws);
			break;

		case 'HIT':
			hitRoute(payload, ws);
			break;

		default:
			sendErrorMessage(ws, 'Неверный запрос');
			break;
	}
};
