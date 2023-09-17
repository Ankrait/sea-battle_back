"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomField = exports.createField = void 0;
const base_1 = require("common/utils/base");
const base_2 = require("./base");
const createField = (N = 10) => {
    const field = [];
    for (let i = 0; i < N; i++) {
        field.push([]);
        for (let j = 0; j < N; j++) {
            field[i].push('EMPTY');
        }
    }
    return field;
};
exports.createField = createField;
const isDeckNearPos = (pos, field) => {
    return base_2.aroundDirections.some(([dx, dy]) => {
        const currentPos = { x: pos.x + dx, y: pos.y + dy };
        return ((0, base_2.isPosValid)(currentPos, field.length) && field[currentPos.y][currentPos.x] === 'SHIP');
    });
};
class UncheckedPos {
    constructor(field) {
        this.positions = [];
        this.field = [];
        this.field = field;
        for (let y = 0; y < this.field.length; y++) {
            for (let x = 0; x < this.field.length; x++) {
                this.positions.push({ y, x });
            }
        }
        this.setCheckedPosByField();
    }
    setCheckedPosByField() {
        this.field.forEach((array, y) => array.forEach((el, x) => {
            if (el === 'SHIP') {
                this.setCheckedAroundPos({ x, y });
            }
        }));
    }
    setCheckedAroundPos(pos) {
        if (!(0, base_2.isPosValid)(pos, this.field.length) || this.field[pos.y][pos.x] !== 'SHIP') {
            return;
        }
        base_2.aroundDirections.forEach(([dx, dy]) => {
            this.setCheckedPos({ x: pos.x + dx, y: pos.y + dy });
        });
    }
    setCheckedPos(pos) {
        const indexToDelete = this.positions.findIndex((el) => el.x === pos.x && el.y === pos.y);
        if (indexToDelete !== -1)
            this.positions.splice(indexToDelete, 1);
    }
    getRandomPos() {
        return this.positions[(0, base_1.randNum)(0, this.positions.length - 1)];
    }
    length() {
        return this.positions.length;
    }
    include(pos) {
        return this.positions.findIndex((p) => p.x === pos.x && p.y === pos.y) !== -1;
    }
}
const generateShipPos = (count, field) => {
    let shipPos = [];
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
const randomField = () => {
    const field = (0, exports.createField)();
    const ships = [4, 3, 2, 1];
    for (let i = 0; i < ships.length; i++) {
        const deckCount = i + 1;
        const count = ships[i];
        for (let k = 0; k < count; k++) {
            const pos = generateShipPos(deckCount, field);
            if (!pos) {
                return (0, exports.randomField)();
            }
            for (const { x, y } of pos) {
                field[y][x] = 'SHIP';
            }
        }
    }
    return field;
};
exports.randomField = randomField;
// TODO - переписать на N масштаб поля
