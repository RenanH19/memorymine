class MusicManager {
    constructor(p5, musicLink){
        this.p5 = p5;
        this.musicLink = musicLink;
        this.isPlaying = false;
    }

    preload(){
        this.music = this.p5.loadSound(this.musicLink, () => {
            console.log("Music loaded successfully");
        });
    }

    play(){
        if (!this.isPlaying){
            this.music.loop();
            this.isPlaying = true;
        }
    }
    stop(){
        if (this.isPlaying){
            this.music.stop();
            this.isPlaying = false;
        }
    }
    setVolume(level){
        if (this.music){
            this.music.setVolume(level);
        }
    }
}