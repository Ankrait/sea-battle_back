import express from 'express';

import { isFieldCorrect } from 'common/utils/field/check';
import { randomField } from 'common/utils/field/create';

export const randomFieldRouter = express.Router();

randomFieldRouter.get('/', (_, res) => {
	try {
		let field = randomField();

		while (!isFieldCorrect(field)) {
			field = randomField();
		}

		res.status(200).send({ field });
	} catch (e) {
		res.status(400).send({ message: 'Ошибка сервера' });
	}
});
