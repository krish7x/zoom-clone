const socket = io('/'); //using the socket io on the homepage

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true; //creating a video element

var myPeer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',
	port: '3030'
});

let myVideoStream; //creating a variable to get the stream data

navigator.mediaDevices //navigator which brings the media devices and chaines the promise
	.getUserMedia({
		video: true,
		audio: true
	})
	.then((stream) => {
		myVideoStream = stream; //passing the stream to myVideoStream
		addVideoStream(myVideo, stream); //passing the video element and the actual stream to the function

		myPeer.on('call', (call) => {
			call.answer(stream);
			const video = document.createElement('video');
			call.on('stream', (userVideoStream) => {
				addVideoStream(video, userVideoStream);
			});
		});

		socket.on('user-connected', (userId) => {
			connectToNewUser(userId, stream);
		});
	});

myPeer.on('open', (id) => {
	socket.emit('join-room', ROOM_ID, id); //'emitting on join-room'
});

const connectToNewUser = (userId, stream) => {
	const call = myPeer.call(userId, stream);
	const video = document.createElement('video');
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream);
	});
};

const addVideoStream = (video, stream) => {
	video.srcObject = stream; //the source of the video ele is stream which is our media devices
	video.addEventListener('loadedmetadata', () => {
		video.play(); //loading all the meta-deta and playing the video
	});
	videoGrid.append(video);
};

let message = $('input');
$('html').keydown((event) => {
	if (event.which == 13 && message.val().length !== 0) {
		socket.emit('message', message.val());
		message.val('');
	}
});

socket.on('createmessage', (msg) => {
	$('ul').append(`<li class = "message"><b>user :</b><span class = "message__text"><br />${msg}</span></li>`);
	scrollDown();
});

const scrollDown = () => {
	let d = $('.main__chat__windows');
	d.scrollTop(d.prop('scrollHeight'));
};

const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false;
		setUnmuteButton();
	} else {
		setMuteButton();
		myVideoStream.getAudioTracks()[0].enabled = true;
	}
};

const setMuteButton = () => {
	const html = `
	  <i class="fas fa-microphone"></i>
	  <span>Mute</span>
	`;
	document.querySelector('.main__mute__button').innerHTML = html;
};

const setUnmuteButton = () => {
	const html = `
	  <i class="unmute fas fa-microphone-slash"></i>
	  <span>Unmute</span>
	`;
	document.querySelector('.main__mute__button').innerHTML = html;
};

const playStop = () => {
	const enabled = myVideoStream.getVideoTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false;
		setPlayVideo();
	} else {
		setStopVideo();
		myVideoStream.getVideoTracks()[0].enabled = true;
	}
};

const setStopVideo = () => {
	const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
	document.querySelector('#main__video__button').innerHTML = html;
};

const setPlayVideo = () => {
	const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
	document.querySelector('#main__video__button').innerHTML = html;
};
