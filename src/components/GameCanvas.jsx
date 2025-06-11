import React, { useState } from 'react';
import Sketch from 'react-p5';
import Player from '../p5/Player';
import MusicManager from '../p5/audio/MusicManager';

function GameCanvas() {
  let player;
  let musicManager;
  const [musicStarted, setMusicStarted] = useState(false)

  const setup = (p5, parentRef) => {
    p5.createCanvas(960, 640).parent(parentRef);
    player = new Player(p5, 100, 100, 800);
    musicManager = new MusicManager(p5, '/assets/music/moongate.flac');
    musicManager.preload();
  };

  const draw = (p5) => {
    p5.background(200);
    
    player.display();
    player.update();

  }

  return (
    <div>
      <Sketch setup={setup} draw={draw} />
      {musicManager.play()}
    </div>
    
  );

}

export default GameCanvas;