var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.get('/bower_components/**', function(req, res){	
	res.sendfile(req.url.substring(1, req.url.length));
});

app.get('/assets/**', function(req, res){	
	res.sendfile(req.url.substring(1, req.url.length));
});

var userData = {
	userCount : 0,
	maxScore: 0
};

// socket.io
io.on('connection', function(socket){
	userData.userCount = userData.userCount + 1;
	console.log('new user connect. user count : ' + userData.userCount);

	socket.on('disconnect', function(){
		userData.userCount = userData.userCount - 1;
		console.log('user disconnected. user count : ' + userData.userCount);

		io.emit('update user data', userData);
	});

	socket.on('receive score', function(scoreData){
		if(userData.maxScore < scoreData.score){
			userData.maxScore = scoreData.score;
			console.log('max score update! ' + userData.maxScore);
			io.emit('update user data', userData);
		}
	});
	
	io.emit('update user data', userData);
});

http.listen(3333, function(){
	console.log('game server start.');
});

