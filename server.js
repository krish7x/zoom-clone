const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
	debug: true
});

const { v4: uuidv4 } = require('uuid');

//tells peerJs to use this server
app.use('/peerjs', peerServer);

//setting the view engine for rendering
app.set('view engine', 'ejs');

//tells the app to use public directory to render
app.use(express.static('public'));

//redirecting to unique room ID
app.get('/', (req, res) => {
	res.redirect(`/${uuidv4()}`);
});

//passing the room ID to the html
app.get('/:room', (req, res) => {
	res.render('room', { roomId: req.params.room });
});

//establishing the connection
io.on('connection', (socket) => {
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId);
		socket.to(roomId).broadcast.emit('user-connected', userId);
		console.log('Joined the room');
		socket.on('message', (msg) => {
			io.to(roomId).emit('createmessage', msg);
		});
	});
});

//server listening at the port 3030
server.listen(3030);
