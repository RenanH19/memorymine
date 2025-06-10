import React from 'react';
import Sketch from 'react-p5';
import Player from '../p5/Player';

function GameCanvas() {
  let player;

  const setup = (p5, parentRef) => {
    p5.createCanvas(768, 640).parent(parentRef);
    player = new Player(p5, 100, 100, 640);
  };

  const draw = (p5) => {
    p5.background(200);
    
    player.display();
    player.update();

  }

  return (
    <Sketch setup={setup} draw={draw} />
  );

}

export default GameCanvas;