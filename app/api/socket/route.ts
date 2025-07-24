/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as IOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as NetServer } from 'http';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) {
    res.status(500).end('No socket found on response');
    return;
  }

  // Type assertion: tell TS that res.socket has a 'server' property of type NetServer
  const server = (res.socket as any).server as NetServer | undefined;

  if (!server) {
    res.status(500).end('No server found on socket');
    return;
  }

  if (!(res.socket as any).server.io) {
    console.log('Setting up Socket.IO server...');

    const io = new IOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('send-message', (message) => {
        io.emit('receive-message', message);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // Attach io instance to server for reuse
    (res.socket as any).server.io = io;
  } else {
    console.log('Socket.IO server already running');
  }

  res.end();
}
