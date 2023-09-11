import { Sequelize } from 'sequelize';
import { getConfig } from '../config/config';

export const sequelize = new Sequelize(
	getConfig('DB_NAME'), // Название БД
	getConfig('DB_USER'), // Пользователь
	getConfig('DB_PASSWORD'), // ПАРОЛЬ
	{
		dialect: 'postgres',
		host: getConfig('DB_HOST'),
		port: +getConfig('DB_PORT'),
	}
);
