var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    config = {
        paddle: 100,
        move: 15,
        init: 120,
        width: 360
    },
    game = {
        player: { x: config.init, y: 50 },
//        players: {},
        ball: { x: 50, y: 50 }
    },
    sockets = [];

app.use('/', express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    if (sockets.length === 2) {
        console.log('Room is full...');
        return;
    }

//    sockets.push(socket);
    socket.join('pong');
    console.log('A user joined the room');

//    console.log(sockets.length);

//    if (sockets.length > 1) {
//        game.players[socket.id] = { x: config.init, id: sockets.length };
//    }

//    console.log(game.players);

    socket.on('disconnect', function () {
//        sockets.forEach(function (item, index) {
//            console.log(item, index);
//            if (item.id === socket.id) {
//                sockets.splice(index, 1);
//            }
//        });
//        delete game.players[socket.id];
        socket.leave('pong');
        console.log('User disconnected', socket.id);
    });

//    console.log(socket.id);
    socket.on('move', function (msg) {
        if (Math.abs(msg.intensity) < 0.5) return;
        var gamer = game.player;
        if (!gamer) return;
        if (msg.direction === 'left' && (gamer.x - (config.paddle / 2) - config.move < 0)) {
            gamer.x = config.paddle / 2;
        } else if (msg.direction === 'right' && (gamer.x + (config.paddle / 2) + config.move) > config.width) {
            gamer.x = config.width - (config.paddle / 2);
        } else {
            gamer.x += (msg.direction === 'right' ? config.move : (-1 * config.move));
        }
        socket.to('pong').emit('move', game);
        console.log('move: ', game);
    });

});

var server = http.listen(3002, function () {
    console.log('Listening on port %d', server.address().port);
});
