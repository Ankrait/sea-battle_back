"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repository = void 0;
const postgresRepository_1 = require("./postgresRepository");
const jsonRepository_1 = require("./jsonRepository");
exports.repository = false ? postgresRepository_1.postgresRepository : jsonRepository_1.jsonRepository;
