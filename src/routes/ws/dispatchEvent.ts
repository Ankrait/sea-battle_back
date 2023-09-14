import WebSocket, { RawData } from 'ws';

import { GameRequestType } from 'common/interfaces';
import { sendErrorMessage } from 'routes/ws/events/utils';

import { connectionEvent } from './events/connectionEvent';
import { schemeEvent } from './events/schemeEvent';
import { readyEvent } from './events/readyEvent';
import { hitEvent } from './events/hitEvent';
import { surrenderEvent } from './events/surrenderEvent';

export const dispatchEvent = async (message: RawData, ws: WebSocket) => {
	const { event, payload } = JSON.parse(message.toString()) as GameRequestType;
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
