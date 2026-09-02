%%writefile server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', socket.id);

        socket.on('offer', (data) => {
            io.to(data.target).emit('offer', { offer: data.offer, sender: socket.id });
        });

        socket.on('answer', (data) => {
            io.to(data.target).emit('answer', { answer: data.answer, sender: socket.id });
        });

        socket.on('ice-candidate', (data) => {
            io.to(data.target).emit('ice-candidate', { candidate: data.candidate, sender: socket.id });
        });
    });
});

server.listen(3000, () => {
    console.log('Signaling server running on port 3000');
});
