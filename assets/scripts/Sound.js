class Sound {

    constructor() {

        this.sounds = {};
        this.sounds['newBeat'] = new Audio('assets/sounds/newBeat.wav');
        this.sounds['fire1'] = new Audio('assets/sounds/fire1.wav');
        this.sounds['spider'] = new Audio('assets/sounds/spider.wav');
        this.sounds['newBeat'] = new Audio('assets/sounds/newBeat.wav');
        this.sounds['flea'] = new Audio('assets/sounds/flea.wav');
        this.sounds['death'] = new Audio('assets/sounds/death.wav');
        this.sounds['1up'] = new Audio('assets/sounds/1up.wav');
        this.sounds['kill'] = new Audio('assets/sounds/kill.wav');
        this.playing = false;

    }

    play(sound) {

        this.sounds[sound].loop = false;
        this.sounds[sound].play();
        this.playing = true;

    }

    loop(sound) {

        if (!this.playing) {
            this.sounds[sound].loop = true;
            this.sounds[sound].play();
            this.playing = true;
        }

    }

    pause(sound) {

        if (this.playing) {
            this.sounds[sound].loop = false;
            this.sounds[sound].pause();
            this.sounds[sound].currentTime = 0;
            this.playing = false;
        }

    }

}

module.exports = Sound;