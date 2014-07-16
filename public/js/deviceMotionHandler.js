function init() {
    if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    }
}

function deviceMotionHandler(eventData) {
    var sensibility = 1.0,
        now = Date.now(),
        acceleration;

    if(now - last < 150) {
        return;
    } else {
        last = now;
    }

    acceleration = eventData.accelerationIncludingGravity;
    if (round(acceleration.y) < 0 && Math.abs(round(acceleration.y)) > sensibility) {
        socket.emit('move', {
            direction: 'left',
            intensity: round(acceleration.y)
        });
    }
    if (round(acceleration.y) > 0 && Math.abs(round(acceleration.y)) > sensibility) {
        socket.emit('move', {
            direction: 'right',
            intensity: round(acceleration.y)
        });
    }
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) / amt;
}

function handshake(){
    var accepted = false;
    socket.emit('player1');
    socket.on('accepted', function(number){
        accepted = true;
        drawPlayerNumber(number);
        init();
    });

    setTimeout(function(){
        if(accepted) {
            return;
        }
        socket.emit('player2');
    }, 1000);
}

function drawPlayerNumber(n){
    document.getElementById("playerNumber").innerHTML = n;
    document.getElementById("playerMessage").style.display = 'block';
}

var socket = io('192.168.1.248:3002'), last;
handshake();

