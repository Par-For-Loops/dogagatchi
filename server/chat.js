const { createServer } = require('http');
const { Server } = require('socket.io');
const { IS_DEPLOYED, DEPLOYED_URL } = require('dotenv').config();

const httpServer = createServer();

const origin = IS_DEPLOYED ? DEPLOYED_URL : 'http://localhost:4000';
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

io.listen(4001);