import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';
import level1 from '../p5/levels/levels/level1';
import Player from '../p5/Player';
import worldMapClass from '../p5/maps/worldMapClass';
import mist from '../p5/maps/mist';

function GameCanvas() {
  let level;
  let flag = false;
  let player;
  let worldMap;
  let mistInstance;

  const preload = (p5) => {
    player = new Player(p5, 100, 100, 2000);
    mistInstance = new mist(p5, 2000, 2000);
    worldMap = new worldMapClass(p5, player, mistInstance);
    worldMap.loadWorldMap();
    // level = level1(p5);
    // level.loadLevel();
    
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas(800, 640).parent(parentRef);
    p5.frameRate(60);
  }

  const draw = (p5) => {
    p5.background(200);
    if (p5.mouseIsPressed) {
      try {
        if (worldMap) {
          flag = true;
        }
      } catch (error) {
        console.error("Erro ao executar o nível:", error);
      }}
    if (flag) {
      worldMap.runWorld();
    }
    
  }
  //   if (p5.mouseIsPressed) {
  //     try {
  //       if (level) {
  //         flag = true;
  //       }
  //     } catch (error) {
  //       console.error("Erro ao executar o nível:", error);
        
  //     }
  //   }
  //   if (flag) {
  //     level.runLevel();
  //   }
    
  // }

  

  return (
    <div>
      <Sketch preload={preload} setup={setup} draw={draw}  />
    </div>
    
  );

}

export default GameCanvas;
//ideia de mensagens no nivel 1 - parece um pouco estranho aqui, mas é apenas você