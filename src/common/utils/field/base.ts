import { IPosition } from '../../interfaces';
export const aroundDirections = [
	[0, 0],
	[0, 1],
	[0, -1],
	[-1, 0],
	[1, 0],
	[-1, 1],
	[1, -1],
	[-1, -1],
	[1, 1],
];

export const isPosValid = (pos: IPosition, filedSize: number) => {
	if (pos.x >= filedSize || pos.x < 0 || pos.y >= filedSize || pos.y < 0) {
		return false;
	}

	return true;
};
