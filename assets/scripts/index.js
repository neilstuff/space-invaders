var Game = require('./Game.js');

document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());

(new Game()).start();