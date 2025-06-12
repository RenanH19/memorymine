import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';
import level1 from '../p5/levels/levels/level1';

function GameCanvas() {
  let level;


  const preload = (p5) => {
    level = level1(p5);
    level.loadLevel();
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas(960, 640).parent(parentRef);
  }

  const draw = (p5) => {
    p5.background(200);
    level.runLevel();
  }

  

  return (
    <div>
      <Sketch preload={preload} setup={setup} draw={draw}  />
    </div>
    
  );

}

export default GameCanvas;
//ideia de mensagens no nivel 1 - parece um pouco estranho aqui, mas é apenas você