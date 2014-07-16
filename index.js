var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    config = {
        paddle: 100,
        move: 5,
        init: 120,
        width: 360
    },
    game = {
        player1: { x: config.init, y: 50 },
        player2: { x: config.init, y: 50 },
        ball: { x: 50, y: 50 }
    },
    sockets = [],
    players = {};

app.use('/', express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    socket.on('player1', function(){
        if(players.player1) {
            return;
        }
        socket.emit('accepted', 1);
        players.player1 = socket.id;

        joinPlayer(socket, 'player1');
    });

    socket.on('player2', function(){
        if(players.player2) {
            return;
        }
        socket.emit('accepted', 2);
        players.player2 = socket.id;
        joinPlayer(socket, 'player2');
    });

    socket.join('pong');
});

var server = http.listen(3002, function () {
    console.log('Listening on port %d', server.address().port);
});

function joinPlayer(socket, player){
    console.log('A user joined the room');
    socket.on('disconnect', function () {
        socket.leave('pong');
        console.log('User disconnected', socket.id);
    });

    socket.on('move', function (msg) {
        console.log(game);
        var gamer = game[player];
        if (!gamer) return;
        if (msg.direction === 'left' && (gamer.x - (config.paddle / 2) - config.move < 0)) {
            gamer.x = config.paddle / 2;
        } else if (msg.direction === 'right' && (gamer.x + (config.paddle / 2) + config.move) > config.width) {
            gamer.x = config.width - (config.paddle / 2);
        } else {
            if(msg.direction === 'right') {
                gamer.x += config.move * Math.floor(Math.abs(msg.intensity));
            } else {
                gamer.x -= config.move * Math.floor(Math.abs(msg.intensity));
            }
        }

        socket.to('pong').emit('move', game);
    });
}