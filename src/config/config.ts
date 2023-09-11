import { config } from 'dotenv';

export const getConfig = (key: string): string => {
	const { error, parsed } = config();
	if (error) throw new Error('Не найден файл .env');
	if (!parsed) throw new Error('Пустой файл .env');

	const res = parsed[key];
	if (!res) throw new Error('Нет такого ключа');
	return res;
};