import { useEffect, useState } from "react";
import p5, { SoundFile } from "p5";
import 'p5/lib/addons/p5.sound';

function MusicManager({src}) {
    const [sound, setSound] = useState();

    useEffect(() => {
        const music = new p5.SoundFile({src}, () => {
            music.setloop(true);
            music.play()
            setSound(music)
        });
            
        return () => {
        if (music && music.isPlaying()) music.stop();
        };
    }, [src]);

    return null
}

export default MusicManager;

    