// lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket() {
  if (!socket) {
    socket = io({
      path: '/api/socket',
      addTrailingSlash: false,
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}
