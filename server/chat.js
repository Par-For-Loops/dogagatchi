const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { IS_DEPLOYED, DEPLOYED_URL } = process.env;

const httpServer = createServer();

const origin = IS_DEPLOYED === 'true' ? DEPLOYED_URL : 'http://localhost:4000';
const io = new Server(httpServer, {
  path: "/chat/",
  cors: {
    origin,
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (msg) => {
    console.log('message: ', msg);
    io.emit('message', msg);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

console.log('chat socket open: ', origin);
io.listen(4001);
