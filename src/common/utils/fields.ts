import { FieldType, IPosition } from '../interfaces';

export const createField = (N = 10) => {
	const array: FieldType[][] = [];

	for (let i = 0; i < N; i++) {
		array.push([]);
		for (let j = 0; j < N; j++) {
			array[i].push('EMPTY');
		}
	}

	return array;
};

const isPosValid = (pos: IPosition[], field: FieldType[][]) => {
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
		[1, 1],
		[0, 0],
	];

	for (const p of pos) {
		const isValid = directions.every(
			([dx, dy]) =>
				p.y + dy > 9 ||
				p.y + dy < 0 ||
				p.x + dx > 9 ||
				p.x + dx < 0 ||
				field[p.y + dy][p.x + dx] !== 'SHIP'
		);

		if (!isValid) return false;
	}

	return true;
};

export const randomField = (): FieldType[][] => {
	const result: FieldType[][] = createField();
	const ships = [4, 3, 2, 1];

	const randNum = (min = 0, max = 9) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const generatePosition = (count: number): IPosition[] => {
		let position: IPosition[] = [];
		const pos = { x: randNum(), y: randNum() };

		const directions = [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		].sort(() => Math.random() - 0.5);

		for (const [dy, dx] of directions) {
			for (let k = 0; k < count; k++) {
				position.push({ x: pos.x + k * dx, y: pos.y + k * dy });
			}
			if (
				position.length === count &&
				position[count - 1].x >= 0 &&
				position[count - 1].x <= 9 &&
				position[count - 1].y >= 0 &&
				position[count - 1].y <= 9 &&
				isPosValid(position, result)
			) {
				break;
			}
			position = [];
		}

		if (position.length === count) {
			return position;
		} else {
			return generatePosition(count);
		}
	};

	ships.forEach((count, i) => {
		for (let k = 0; k < count; k++) {
			const pos = generatePosition(i + 1);
			for (const { x, y } of pos) {
				result[y][x] = 'SHIP';
			}
		}
	});

	return result;
};

export const isCorrectField = (field: FieldType[][]) => {
	if (field.length !== 10) return false;
	for (let i = 0; i < 10; i++) {
		if (field[i].length !== 10) return false;
	}

	const ships: { [key: number]: IPosition[][] } = {
		1: [],
		2: [],
		3: [],
		4: [],
	};

	let currentSize = 0;

	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			if (field[y][x] === 'SHIP') {
				currentSize++;
			} else {
				if (currentSize > 4) return false;
				if (currentSize === 1) {
					if (y >= 9 || field[y + 1][x - 1] !== 'SHIP') {
						ships[1].push([{ x: x - 1, y }]);
					}
				} else if (currentSize > 1) {
					const tmp: IPosition[] = [];
					for (let k = 0; k < currentSize; k++) {
						tmp.push({ y, x: x - 1 - k });
					}
					ships[currentSize].push(tmp);
				}
				currentSize = 0;
			}
		}

		if (currentSize === 1) {
			if (y >= 9 || field[y + 1][9] !== 'SHIP') {
				ships[1].push([{ x: 9, y }]);
			}
		} else if (currentSize > 1) {
			const tmp: IPosition[] = [];
			for (let k = 0; k < currentSize; k++) {
				tmp.push({ y, x: 9 - k });
			}
			ships[currentSize].push(tmp);
		}
		currentSize = 0;
	}

	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			if (field[y][x] === 'SHIP') {
				currentSize++;
			} else {
				if (currentSize > 4) return false;
				if (currentSize > 1) {
					const tmp: IPosition[] = [];
					for (let k = 0; k < currentSize; k++) {
						tmp.push({ y: y - 1 - k, x });
					}
					ships[currentSize].push(tmp);

					currentSize = 0;
				}
			}
		}

		if (currentSize > 1) {
			const tmp: IPosition[] = [];
			for (let k = 0; k < currentSize; k++) {
				tmp.push({ y: 9 - k, x });
			}
			ships[currentSize].push(tmp);
			currentSize = 0;
		}
	}

	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
		[1, 1],
	];

	if (
		ships[1].length !== 4 ||
		ships[2].length !== 3 ||
		ships[3].length !== 2 ||
		ships[4].length !== 1
	) {
		return false;
	}

	for (const key of Object.keys(ships)) {
		const count = +key;

		for (const ship of ships[count]) {
			let oneNearbyCount = 0;

			for (const pos of ship) {
				let nearbyCount = 0;
				for (const [dx, dy] of directions) {
					if (field[pos.y + dy][pos.x + dx] === 'SHIP') {
						nearbyCount++;
					}
				}

				if (count === 1 && nearbyCount !== 0) {
					return false;
				}

				if (nearbyCount === 1) {
					oneNearbyCount++;
				} else if (nearbyCount > 2) {
					return false;
				}
			}

			if (count !== 1 && oneNearbyCount > 2) {
				return false;
			}
		}
	}

	return true;
};

export const isCorrectShipCount = (field: FieldType[][]) => {
	let result = 0;

	for (const array of field)
		for (const el of array)
			if (el === 'SHIP') {
				result++;
			}

	return result === 20;
};
