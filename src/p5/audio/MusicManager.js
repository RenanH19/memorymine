import p5 from "p5";
import 'p5/lib/addons/p5.sound';

function MusicManager(p5, musicFile) {
    let music;
    
    function loadMusic(){
        music = p5.loadSound(musicFile, () => {
            console.log('Music loaded successfully');
        }, (err) => {
            console.error('Error loading music:', err);
        });
    };

    function playMusic(){
        if (music && music.isPlaying()) {
            music.loop();
        }
    };

    function stopMusic() {
        if (music && music.isPlaying()) {
            music.stop();
        }
    };

    return {
        loadMusic,
        playMusic,
        stopMusic
    };
    
}

export default MusicManager;

    