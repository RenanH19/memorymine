import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';
import level1 from '../p5/levels/levels/level1';
import level2 from '../p5/levels/levels/level2';
import Player from '../p5/Player';
import worldMapClass from '../p5/maps/worldMapClass';
import mist from '../p5/maps/mist';
import Menu from '../p5/menu';

function GameCanvas() {
  let level;
  let level2Instance;
  let flagWorld = false;
  let flagLevel1 = false;
  let flagLevel2 = false;
  let player;
  let worldMap;
  let mistInstance;
  let menu;
  let gameStarted = false;
  let textBoxImage;
  
  // Variáveis para transição
  let isTransitioning = false;
  let transitionAlpha = 0;
  let transitionSpeed = 0.02;
  let transitionBlur = 0;
  let maxBlur = 15;
  let worldMusicVolume = 0;
  let targetVolume = 0.3;

  // Variáveis para controlar entrada nos levels
  let xKeyPressed = false;
  let xKeyPressedLevel2 = false;

  // Armazena posição do player no mundo
  let worldPlayerPosition = { x: 0, y: 0 };
  
  // NOVA VARIÁVEL: Armazena se a chave foi coletada (similar à posição do player)
  let level2KeyCollected = false;
  
  const preload = (p5) => {
    menu = new Menu(p5);
    menu.loadMenuAssets();
    
    textBoxImage = p5.loadImage('/assets/fonts/textBox.png', () => {
      console.log('TextBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load textBox image:', error);
    });
    
    player = new Player(p5, 300, 400, 1024, '/assets/worldMapColision.png');
    mistInstance = new mist(p5, 1024, 1024);
    worldMap = new worldMapClass(p5, player, mistInstance);
    worldMap.loadWorldMap();
    level = level1(p5);
    level.loadLevel();
    level2Instance = level2(p5);
    level2Instance.loadLevel();
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas(800, 640).parent(parentRef);
    p5.frameRate(60);
  }

  const draw = (p5) => {
    if (menu.isMenuVisible() && !isTransitioning) {
      const startGame = menu.drawMenu();
      if (startGame) {
        gameStarted = true;
        isTransitioning = true;
        console.log('Iniciando transição para o mundo...');
      }
      return;
    }

    if (isTransitioning) {
      handleTransition(p5);
      return;
    }

    p5.background(200);

    if (p5.keyIsDown(p5.LEFT_ARROW) && !flagLevel1 && !flagLevel2) {
      try {
        if (worldMap) {
          flagWorld = true;
        }
      } catch (error) {
        console.error("Erro ao executar o nível:", error);
      }
    }
    
    if (flagWorld && !flagLevel1 && !flagLevel2) {
      worldMap.runWorld();
      checkLevel1Entry(p5);
      checkLevel2Entry(p5);
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
    
    if (flagLevel2) {
      const levelResult = level2Instance.runLevel();
      
      if (levelResult && levelResult.exit) {
        // SALVA o estado da chave antes de sair (similar à posição do player)
        level2KeyCollected = level2Instance.isKeyCollected();
        console.log('Chave salva:', level2KeyCollected);
        
        flagLevel2 = false;
        flagWorld = true;
        
        // Restaura a posição do player no mundo
        player.position.x = worldPlayerPosition.x;
        player.position.y = worldPlayerPosition.y;
        player.targetPosition.x = worldPlayerPosition.x;
        player.targetPosition.y = worldPlayerPosition.y;
        
        if (worldMap) {
          worldMap.startFadeIn();
        }
      }
    }
  }

  const checkLevel1Entry = (p5) => {
    const isInArea = player.position.x > 460 && 
                     player.position.x < 510 && 
                     player.position.y > 520 && 
                     player.position.y < 560;
    
    if (p5.keyIsDown(88) && isInArea) {
      if (!xKeyPressed) {
        xKeyPressed = true;
        flagLevel1 = true;
        flagWorld = false;
        console.log('Entrando no Level 1...');
        
        if (worldMap && worldMap.music) {
          worldMap.music.stopMusic();
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressed = false;
    }
    
    if (isInArea) {
      drawEntryIndicator(p5, "Pressione 'X' para entrar no domo em ruínas");
    }
  }

  const checkLevel2Entry = (p5) => {
    const isInArea = player.position.x > 710 && 
                     player.position.x < 770 && 
                     player.position.y > 650 && 
                     player.position.y < 700;
    
    if (p5.keyIsDown(88) && isInArea) {
      if (!xKeyPressedLevel2) {
        xKeyPressedLevel2 = true;
        
        // Salva a posição atual do player no mundo
        worldPlayerPosition.x = player.position.x;
        worldPlayerPosition.y = player.position.y;
        
        flagLevel2 = true;
        flagWorld = false;
        
        // RESTAURA o estado da chave ao entrar no level (similar à posição do player)
        level2Instance.startFadeIn();
        level2Instance.setKeyCollected(level2KeyCollected);
        console.log('Chave restaurada:', level2KeyCollected);
        
        console.log('Entrando no Level 2...');
        
        if (worldMap && worldMap.music) {
          worldMap.music.stopMusic();
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressedLevel2 = false;
    }
    
    if (isInArea) {
      drawEntryIndicator(p5, "Pressione 'X' para entrar no Jardim em Ruínas");
    }
  }

  const drawEntryIndicator = (p5, message) => {
    p5.push();
    p5.resetMatrix();
    
    const textBoxWidth = 600;
    const textBoxHeight = 70;
    const textBoxX = (p5.width - textBoxWidth) / 2;
    const textBoxY = p5.height - textBoxHeight - 20;
    
    if (textBoxImage) {
      p5.image(textBoxImage, textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    }
    
    p5.fill(255, 255, 255);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(18);
    p5.textStyle(p5.BOLD);
    p5.text(message, p5.width / 2, textBoxY + textBoxHeight / 2);
    
    p5.pop();
  }

  const handleTransition = (p5) => {
    transitionAlpha = p5.lerp(transitionAlpha, 255, transitionSpeed);
    transitionBlur = p5.lerp(transitionBlur, maxBlur, transitionSpeed);
    
    if (transitionAlpha < 200) {
      p5.drawingContext.filter = `blur(${transitionBlur}px)`;
      menu.drawMenu();
      p5.drawingContext.filter = 'none';
    }
    
    p5.fill(0, transitionAlpha);
    p5.rect(0, 0, p5.width, p5.height);
    
    if (transitionAlpha > 200) {
      if (worldMap && !flagWorld) {
        worldMap.startFadeIn();
        flagWorld = true;
      }
      
      if (worldMap) {
        worldMap.runWorld();
      }
    }
    
    if (transitionAlpha >= 254) {
      isTransitioning = false;
      menu.hideMenu();
      console.log('Transição completa!');
    }
  }

  return (
    <div>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}

export default GameCanvas;