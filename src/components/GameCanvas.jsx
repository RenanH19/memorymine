import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';
import level1 from '../p5/levels/levels/level1';
import Player from '../p5/Player';
import worldMapClass from '../p5/maps/worldMapClass';
import mist from '../p5/maps/mist';
import Menu from '../p5/menu';

function GameCanvas() {
  let level;
  let flagWorld = false;
  let flagLevel1 = false;
  let player;
  let worldMap;
  let mistInstance;
  let menu;
  let gameStarted = false;

  const preload = (p5) => {
    menu = new Menu(p5);
    menu.loadMenuAssets();
    
    player = new Player(p5, 300, 400, 1024);
    mistInstance = new mist(p5, 1024, 1024);
    worldMap = new worldMapClass(p5, player, mistInstance);
    worldMap.loadWorldMap();
    level = level1(p5);
    level.loadLevel();
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas(800, 640).parent(parentRef);
    p5.frameRate(60);
  }

  const draw = (p5) => {
    // Se o menu está visível, desenha apenas o menu
    if (menu.isMenuVisible()) {
      const startGame = menu.drawMenu();
      if (startGame) {
        gameStarted = true;
        flagWorld = true;
      }
      return;
    }

    // Resto do jogo
    p5.background(200);

    if (p5.keyIsDown(p5.LEFT_ARROW) && !flagLevel1) {
      try {
        if (worldMap) {
          flagWorld = true;
        }
      } catch (error) {
        console.error("Erro ao executar o nível:", error);
      }
    }
    
    if (flagWorld) {
      worldMap.runWorld();
    }
    
    if (p5.mouseIsPressed && p5.mouseX > 0 && p5.mouseX < 100 && p5.mouseY > 0 && p5.mouseY < 100 && !flagWorld) {
      try {
        if (level) {
          flagLevel1 = true;
        }
      } catch (error) {
        console.error("Erro ao executar o nível:", error);
      }
    }
    
    if (flagLevel1) {
      level.runLevel();
    }
  }

  return (
    <div>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}

export default GameCanvas;