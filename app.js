require("dotenv").config();

const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http'); 
const path = require('path');
const PORT=process.env.PORT ||8000;

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Store user locations
const userLocations = {};

io.on('connection', (socket) => {
    socket.emit('all-locations', userLocations);

    socket.on('send-location', (data) => {
        userLocations[socket.id] = data;
      io.emit('location-received', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        delete userLocations[socket.id];
        
        io.emit('user-disconnected', socket.id);
    });

    console.log('someone connected!');
});

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(PORT, () => {
    console.log('server is started');
});
