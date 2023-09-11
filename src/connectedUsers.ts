import WebSocket from 'ws';

export const users: Map<string, WebSocket> = new Map();
