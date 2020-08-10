const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
const { Socket } = require('dgram');
const io = require('socket.io')(server);

//tells the app to use public directory to render
app.use(express.static('public'));

//setting the view engine for rendering
app.set('view engine', 'ejs');

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
	socket.on('join-room', () => {
		console.log('Joined the room');
	});
});

//server listening at the port 3030
server.listen(3030);
