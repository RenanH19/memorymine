import React, { useState } from 'react';
import Sketch from 'react-p5';
import Player from '../p5/Player';
import 'p5/lib/addons/p5.sound';
import MusicManager from '../p5/audio/MusicManager';

function GameCanvas() {
  
  let player;
  let music;
  

  const preload = (p5) => {
    music = p5.loadSound('/assets/music/moongate.mp3')
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas(960, 640).parent(parentRef);
    player = new Player(p5, 100, 100, 800);
    music.play();
  }

  const draw = (p5) => {
    p5.background(200);
    
    player.display();
    player.update();

  }

  return (
    <div>
      <Sketch preload={preload} setup={setup} draw={draw}  />

    </div>
    
  );

}

export default GameCanvas;
//ideia de mensagens no nivel 1 - parece um pouco estranho aqui, mas é apenas você