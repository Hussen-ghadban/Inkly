// // socket.ts
// import { io, Socket } from 'socket.io-client';

// let socket: Socket | null = null;

// export function connectSocket(): Socket {
//   if (!socket) {
//     socket = io({
//       path: '/api/socket',
//     });

//     socket.on('connect', () => {
//       console.log('Socket connected with id:', socket?.id);
//     });

//     socket.on('disconnect', (reason) => {
//       console.log('Socket disconnected:', reason);
//     });

//     socket.on('connect_error', (err) => {
//       console.error('Connection error:', err.message);
//     });
//   }
//   return socket;
// }

// export function getSocket(): Socket | null {
//   return socket;
// }
