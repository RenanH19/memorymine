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
        if (!music.isPlaying()) {
      try {
        music.loop(); // Use loop() em vez de play() para música de fundo
      } catch (error) {
        console.error("Erro ao tocar música:", error);
      }
    }
    };

    function stopMusic() {
        if (music.isPlaying()) {
            music.stop();
        }
    };

    function setVolume(volume) {
        if (music) {
            music.setVolume(volume);
        } else {
            console.warn("Music not loaded yet. Cannot set volume.");
        }
    }

    return {
        loadMusic,
        playMusic,
        stopMusic,
        setVolume
    };
    
}

export default MusicManager;

    