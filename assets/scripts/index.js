var Game = require('./Game.js');
import '../css/styles.css';

document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());

(new Game()).start();