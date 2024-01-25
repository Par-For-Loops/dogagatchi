const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  path: "/chat/",
  cors: {
    origin: 'http://localhost:4000',
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