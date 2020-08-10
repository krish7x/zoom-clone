const socket = io('/'); //using the socket io on the homepage

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true; //creating a video element

let myVideoStream; //creating a variable to get the stream data

navigator.mediaDevices //navigator which brings the media devices and chaines the promise
	.getUserMedia({
		video: true,
		audio: true
	})
	.then((stream) => {
		myVideoStream = stream; //passing the stream to myVideoStream
		addVideoStream(myVideo, stream); //passing the video element and the actual stream to the function
	});

socket.emit('join-room'); //'emitting on join-room'

const addVideoStream = (video, stream) => {
	video.srcObject = stream; //the source of the video ele is stream which is our media devices
	video.addEventListener('loadedmetadata', () => {
		video.play(); //loading all the meta-deta and playing the video
	});
	videoGrid.append(video);
};
