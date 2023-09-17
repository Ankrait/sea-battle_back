import { IGameAttributes, IGameCreation } from 'database/models/game';

export interface IRepository {
	findByPK: (id: string) => Promise<IGameAttributes | null>;
	create: (game: IGameCreation) => Promise<IGameAttributes>;
	put: (
		payload: Partial<IGameAttributes> & Pick<IGameAttributes, 'id'>
	) => Promise<IGameAttributes | null>;
	delete: (id: string) => Promise<boolean>;
}
