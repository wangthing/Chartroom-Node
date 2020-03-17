var socketio = require('socket.io');
var io;
var guestName = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};