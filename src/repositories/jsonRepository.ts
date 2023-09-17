import fs from 'fs';
import { InferAttributes } from 'sequelize';

import { Game } from 'database/models/game';
import { IRepository } from './repository.interface';

import data from '../database/jsonDB/game.json';

const dataPath = 'src/database/jsonDB/game.json';

const saveGames = (data: InferAttributes<Game>[]) => {
	console.log('---SAVE-TO-JSON--', data);

	const stringifyData = JSON.stringify(data);
	fs.writeFileSync(dataPath, stringifyData);
};
const getGames = (): InferAttributes<Game>[] => {
	const jsonData = fs.readFileSync(dataPath);
	return JSON.parse(jsonData.toString());
};

export const jsonRepository: IRepository = {
	async findByPK(id) {
		return getGames().find((el) => el.id === id) || null;
	},
	async create(game) {
		const games = getGames();
		games.push(game);
		saveGames(games);

		return game;
	},
	async put(payload) {
		const games = getGames();
		const gameIndex = games.findIndex((el) => el.id === payload.id);
		if (gameIndex === -1) return null;

		let game = games.splice(gameIndex, 1)[0];
		game = { ...game, ...payload };
		games.push(game);

		saveGames(games);

		return game;
	},
	async delete(id) {
		const games = getGames();
		const gameIndex = games.findIndex((el) => el.id === id);
		if (gameIndex === -1) return false;

		games.splice(gameIndex, 1);
		saveGames(games);

		return true;
	},
};
