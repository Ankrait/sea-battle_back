"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchEvent = void 0;
const utils_1 = require("routes/ws/events/utils");
const connectionEvent_1 = require("./events/connectionEvent");
const schemeEvent_1 = require("./events/schemeEvent");
const readyEvent_1 = require("./events/readyEvent");
const hitEvent_1 = require("./events/hitEvent");
const surrenderEvent_1 = require("./events/surrenderEvent");
const dispatchEvent = (message, ws) => __awaiter(void 0, void 0, void 0, function* () {
    const { event, payload } = message;
    switch (event) {
        case 'CONNECTION':
            (0, connectionEvent_1.connectionEvent)(payload, ws);
            break;
        case 'SCHEME':
            (0, schemeEvent_1.schemeEvent)(payload, ws);
            break;
        case 'READY':
            (0, readyEvent_1.readyEvent)(payload, ws);
            break;
        case 'HIT':
            (0, hitEvent_1.hitEvent)(payload, ws);
            break;
        case 'SURRENDER':
            (0, surrenderEvent_1.surrenderEvent)(payload, ws);
            break;
        default:
            (0, utils_1.sendErrorMessage)(ws, 'Неверный запрос');
            break;
    }
});
exports.dispatchEvent = dispatchEvent;
