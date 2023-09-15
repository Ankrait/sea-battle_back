import Socket from 'socket.io';

export const users: Map<string, Socket.Socket> = new Map();
