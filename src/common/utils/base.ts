export const createToken = (len = 5): string => {
	const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
	const token = [];

	for (let i = 0; i < len; i++) {
		const symbol = +(Math.random() * (symbols.length - 1)).toFixed(0);
		token.push(symbols[symbol]);
	}

	return token.join('');
};

export const randNum = (min = 0, max = 9) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
