"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkShipIsDead = exports.getDeckCount = exports.isFieldCorrect = void 0;
const base_1 = require("./base");
const getShipsPositions = (field) => {
    const ships = {
        1: [],
        2: [],
        3: [],
        4: [],
    };
    let currentShip = [];
    const checkedPos = [];
    const setShip = () => {
        ships[currentShip.length].push(currentShip);
        currentShip = [];
    };
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (checkedPos.findIndex((el) => el.x === x && el.y === y) !== -1) {
                continue;
            }
            if (field[y][x] === 'SHIP') {
                currentShip.push({ y, x });
                continue;
            }
            if (currentShip.length === 0) {
                continue;
            }
            if (currentShip.length === 1) {
                for (let k = y + 1; k < 10; k++) {
                    const tmpPos = { y: k, x: x - 1 };
                    checkedPos.push(tmpPos);
                    if (field[k][x - 1] !== 'SHIP') {
                        break;
                    }
                    currentShip.push(tmpPos);
                }
                setShip();
                continue;
            }
            setShip();
        }
        if (currentShip.length === 1) {
            for (let k = y + 1; k < 10; k++) {
                const tmpPos = { y: k, x: 9 };
                checkedPos.push(tmpPos);
                if (field[k][9] !== 'SHIP') {
                    break;
                }
                currentShip.push(tmpPos);
            }
        }
        if (currentShip.length >= 1) {
            setShip();
        }
    }
    return ships;
};
const isFieldCorrect = (field) => {
    const ships = getShipsPositions(field);
    let iterCount = 0;
    for (const i in ships) {
        iterCount++;
        const count = +i;
        if (ships[i].length !== 5 - count) {
            console.error(`${count}-палубных кораблей неверное количество`);
            return false;
        }
        for (const ship of ships[i]) {
            if (ship.length !== count) {
                console.error(`Ожидалось ${count} палуб, но ${ship.length}`);
                return false;
            }
            const countsAroundDeck = [];
            for (const deck of ship) {
                if (field[deck.y][deck.x] !== 'SHIP') {
                    console.error(`Ожидался палуба на ${deck.y} : ${deck.x}`);
                    return false;
                }
                let countAroundDeck = 0;
                for (const [dy, dx] of base_1.aroundDirections) {
                    const currentPos = { y: deck.y + dy, x: deck.x + dx };
                    if ((0, base_1.isPosValid)(currentPos, 10) &&
                        field[currentPos.y][currentPos.x] === 'SHIP') {
                        countAroundDeck++;
                    }
                }
                countsAroundDeck.push(countAroundDeck);
            }
            if ((count === 1 && countsAroundDeck[0] !== 1) ||
                (count !== 1 &&
                    (countsAroundDeck.filter((c) => c === 2).length !== 2 ||
                        countsAroundDeck.filter((c) => c === 3).length !== count - 2))) {
                console.error('Корабли не должны соприкасаться');
                return false;
            }
        }
    }
    if (iterCount !== 4) {
        console.error('Неверное количетсво палуб');
        return false;
    }
    return true;
};
exports.isFieldCorrect = isFieldCorrect;
const getDeckCount = (field) => {
    let deckCount = 0;
    for (const array of field)
        deckCount += array.reduce((count, el) => (count += (el === 'SHIP' && 1) || 0), 0);
    return deckCount;
};
exports.getDeckCount = getDeckCount;
const checkShipIsDead = (field, pos) => {
    if (field[pos.y][pos.x] !== 'SHIP') {
        return null;
    }
    const dirs = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];
    const checkedPos = {
        DEAD: [],
        SHIP: [],
    };
    for (const [dy, dx] of dirs) {
        for (let k = 1; k < 4; k++) {
            const currentPos = { y: pos.y + k * dy, x: pos.x + k * dx };
            if (!(0, base_1.isPosValid)(currentPos, field.length) ||
                field[currentPos.y][currentPos.x] === 'EMPTY' ||
                field[currentPos.y][currentPos.x] === 'MISS') {
                break;
            }
            checkedPos[field[currentPos.y][currentPos.x]].push(currentPos);
        }
    }
    if (checkedPos['SHIP'].length === 0) {
        if (checkedPos['DEAD'].length !== 0) {
            return [...checkedPos['DEAD'], pos];
        }
        else {
            return [pos];
        }
    }
    return null;
};
exports.checkShipIsDead = checkShipIsDead;
// TODO - переписать на N масштаб поля
