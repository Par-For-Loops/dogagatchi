import { io } from 'socket.io-client';
const { isDeployed, DEPLOYED_URL } = require('./components/assets/clientId.js');

const url = isDeployed ? DEPLOYED_URL : 'http://localhost:4001';
export const socket = io(url, {
  path: '/chat/',
  autoConnect: false,
});