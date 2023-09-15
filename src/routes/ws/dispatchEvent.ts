import Socket from 'socket.io';

import { GameRequestType } from 'common/interfaces';
import { sendErrorMessage } from 'routes/ws/events/utils';

import { connectionEvent } from './events/connectionEvent';
import { schemeEvent } from './events/schemeEvent';
import { readyEvent } from './events/readyEvent';
import { hitEvent } from './events/hitEvent';
import { surrenderEvent } from './events/surrenderEvent';

export const dispatchEvent = async (message: any, ws: Socket.Socket) => {
	console.log(message);
	
	const { event, payload } = message as GameRequestType;
	switch (event) {
		case 'CONNECTION':
			connectionEvent(payload, ws);
			break;

		case 'SCHEME':
			schemeEvent(payload, ws);
			break;

		case 'READY':
			readyEvent(payload, ws);
			break;

		case 'HIT':
			hitEvent(payload, ws);
			break;

		case 'SURRENDER':
			surrenderEvent(payload, ws);
			break;

		default:
			sendErrorMessage(ws, 'Неверный запрос');
			break;
	}
};
