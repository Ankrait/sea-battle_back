import { FieldType, IPosition } from '../interfaces';

export const createToken = (len = 5): string => {
	const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
	const token = [];

	for (let i = 0; i < len; i++) {
		const symbol = +(Math.random() * (symbols.length - 1)).toFixed(0);
		token.push(symbols[symbol]);
	}

	return token.join('');
};

export type WithOptional<T, K extends keyof T> = Partial<Omit<T, K>> &
	Required<Pick<T, K>>;

