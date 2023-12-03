import servers from "./server";
import dotenv from "dotenv";
const { io } = servers;

dotenv.config();

io.on('error', (error) => {
  console.log('Server: ' + error);
});

io.on('connection', (socket) => {
  
  socket.on('guest', (secret) => {
    console.log('Server: Guest has connected');
    socket.broadcast.emit('guest');
  });

  socket.on('owner', () => {
    console.log('Server: Owner has connected');
    socket.broadcast.emit('owner', socket.id);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('userDisconnected', socket.id);
  });

  socket.on('offer', (_, message) => {
    socket.broadcast.emit('offer', socket.id, message);
    console.log('Server: Sending offer to other user');
  });

  socket.on('answer', (_, message) => {
    socket.broadcast.emit('answer', socket.id, message);
    console.log('Server: Sending answer to other user');
  });

  socket.on('candidate', (_, message) => {
    socket.broadcast.emit('candidate', socket.id, message);
    console.log('Server: Sending candidate to other user');
  });
});
