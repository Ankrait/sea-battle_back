import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import { FieldType, GameStatusType } from 'common/interfaces';

import { sequelize } from '../connectDB';

export class Game extends Model<IGameAttributes, IGameCreation> {
	declare id: string;

	declare player1: string;
	declare player2: string | null;

	declare field1: FieldType[][];
	declare field2: FieldType[][];

	declare status: GameStatusType;

	declare isReady1: boolean;
	declare isReady2: boolean;
}

export interface IGameAttributes extends InferAttributes<Game> {}
export interface IGameCreation extends InferCreationAttributes<Game> {}

Game.init(
	{
		id: {
			type: DataTypes.STRING(5),
			primaryKey: true,
		},
		player1: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		player2: {
			type: DataTypes.STRING(10),
		},
		field1: {
			type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
			allowNull: false,
		},
		field2: {
			type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		isReady1: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		isReady2: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: 'games',
	}
);
