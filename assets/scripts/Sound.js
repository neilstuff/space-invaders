class Sound {

    constructor() {

        this.sounds = {};
        this.sounds['explosion'] = new Audio('assets/sounds/explosion.wav');
        this.sounds['fastinvader1'] = new Audio('assets/sounds/fastinvader1.wav');
        this.sounds['fastinvader2'] = new Audio('assets/sounds/fastinvader2.wav');
        this.sounds['fastinvader3'] = new Audio('assets/sounds/fastinvader3.wav');
        this.sounds['fastinvader4'] = new Audio('assets/sounds/fastinvader4.wav');
        this.sounds['invaderkilled'] = new Audio('assets/sounds/invaderkilled.wav');
        this.sounds['shoot'] = new Audio('assets/sounds/shoot.wav');
        this.sounds['ufo_highpitch'] = new Audio('assets/sounds/ufo_highpitch.wav');
        this.sounds['ufo_lowpitch'] = new Audio('assets/sounds/ufo_lowpitch.wav');

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

    get SOUNDS() {
        return this.sounds;
    }

}

module.exports = Sound;