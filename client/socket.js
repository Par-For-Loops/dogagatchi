import { io } from 'socket.io-client';

export const socket = io("http://localhost:4001", {
  path: '/chat/',
  autoConnect: false,
});