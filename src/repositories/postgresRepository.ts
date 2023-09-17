import { Game } from 'database/models/game';

import { IRepository } from './repository.interface';

export const postgresRepository: IRepository = {
	async findByPK(id) {
		const result = await Game.findByPk(id);
		return result?.dataValues || null;
	},
	async create(game) {
		const created = await Game.create(game);
		return created.dataValues;
	},
	async put(payload) {
		const game = await Game.findByPk(payload.id);
		if (!game) return null;

		const updated = await game.update(payload);
		return updated.dataValues;
	},
	async delete(id) {
		const game = await Game.findByPk(id);
		if (!game) return false;

		await game.destroy();
		return true;
	},
};
