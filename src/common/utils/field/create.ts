import { FieldType, IPosition } from 'common/interfaces';
import { randNum } from 'common/utils/base';

import { aroundDirections, isPosValid } from './base';

export const createField = (N = 10) => {
	const field: FieldType[][] = [];

	for (let i = 0; i < N; i++) {
		field.push([]);
		for (let j = 0; j < N; j++) {
			field[i].push('EMPTY');
		}
	}

	return field;
};

const isDeckNearPos = (pos: IPosition, field: FieldType[][]) => {
	return aroundDirections.some(([dx, dy]) => {
		const currentPos = { x: pos.x + dx, y: pos.y + dy };
		return (
			isPosValid(currentPos, field.length) && field[currentPos.y][currentPos.x] === 'SHIP'
		);
	});
};

class UncheckedPos {
	private positions: IPosition[] = [];
	private field: FieldType[][] = [];

	constructor(field: FieldType[][]) {
		this.field = field;
		for (let y = 0; y < this.field.length; y++) {
			for (let x = 0; x < this.field.length; x++) {
				this.positions.push({ y, x });
			}
		}
		this.setCheckedPosByField();
	}

	private setCheckedPosByField() {
		this.field.forEach((array, y) =>
			array.forEach((el, x) => {
				if (el === 'SHIP') {
					this.setCheckedAroundPos({ x, y });
				}
			})
		);
	}

	setCheckedAroundPos(pos: IPosition) {
		if (!isPosValid(pos, this.field.length) || this.field[pos.y][pos.x] !== 'SHIP') {
			return;
		}

		aroundDirections.forEach(([dx, dy]) => {
			this.setCheckedPos({ x: pos.x + dx, y: pos.y + dy });
		});
	}

	setCheckedPos(pos: IPosition) {
		const indexToDelete = this.positions.findIndex(
			(el) => el.x === pos.x && el.y === pos.y
		);

		if (indexToDelete !== -1) this.positions.splice(indexToDelete, 1);
	}

	getRandomPos() {
		return this.positions[randNum(0, this.positions.length - 1)];
	}

	length() {
		return this.positions.length;
	}

	include(pos: IPosition) {
		return this.positions.findIndex((p) => p.x === pos.x && p.y === pos.y) !== -1;
	}
}

const generateShipPos = (count: number, field: FieldType[][]) => {
	let shipPos: IPosition[] = [];
	const uncheckedPos = new UncheckedPos(field);

	const directions = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0],
	].sort(() => Math.random() - 0.5);

	while (uncheckedPos.length() !== 0) {
		const pos = uncheckedPos.getRandomPos();

		for (const [dy, dx] of directions) {
			for (let k = 0; k < count; k++) {
				const newPos = { x: pos.x + k * dx, y: pos.y + k * dy };

				if (!uncheckedPos.include(newPos) || isDeckNearPos(newPos, field)) {
					uncheckedPos.setCheckedPos(newPos);
					shipPos = [];
					break;
				}

				shipPos.push(newPos);
			}

			if (shipPos.length === count) {
				return shipPos;
			}
		}

		uncheckedPos.setCheckedPos(pos);
	}

	return null;
};

export const randomField = (): FieldType[][] => {
	const field: FieldType[][] = createField();
	const ships = [4, 3, 2, 1];

	for (let i = 0; i < ships.length; i++) {
		const deckCount = i + 1;
		const count = ships[i];

		for (let k = 0; k < count; k++) {
			const pos = generateShipPos(deckCount, field);
			if (!pos) {
				return randomField();
			}
			for (const { x, y } of pos) {
				field[y][x] = 'SHIP';
			}
		}
	}

	return field;
};

// TODO - переписать на N масштаб поля
