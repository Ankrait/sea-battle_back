import { Sequelize } from 'sequelize';

import { getConfig } from 'config/config';

export const sequelize = new Sequelize(
	getConfig('DB_NAME'),
	getConfig('DB_USER'),
	getConfig('DB_PASSWORD'),
	{
		dialect: 'postgres',
		host: getConfig('DB_HOST'),
		port: +getConfig('DB_PORT'),
	}
);
