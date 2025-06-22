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
  let player; // PLAYER ÚNICO COMPARTILHADO
  let worldMap;
  let mistInstance;
  let menu;
  let gameStarted = false;
  let textBoxImage;
  let darkness = 235;
  
  // SISTEMA DE SOM E CLARÃO
  let weirdSound = null;
  let soundTimer = 0;
  let nextSoundTime = 0;
  let isSoundPlaying = false;
  let soundStartTime = 0;
  let soundDuration = 6000; // 6 segundos em milissegundos
  let originalDarkness = 235;
  let targetDarkness = 30;
  let isFlashEffect = false;
  let flashPhase = 0; // 0: descendo, 1: oscilando, 2: subindo
  let oscillationTime = 0;
  
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
  
  // Estados persistentes dos levels
  let level2KeyCollected = false;
  let level1ItemCollected = false;
  
  const preload = (p5) => {
    menu = new Menu(p5);
    menu.loadMenuAssets();
    
    textBoxImage = p5.loadImage('/assets/fonts/textBox.png', () => {
      console.log('TextBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load textBox image:', error);
    });
    
    // CARREGA O SOM ESTRANHO
    weirdSound = p5.loadSound('/assets/sounds/weird.mp3', () => {
      console.log('Weird sound loaded successfully');
      weirdSound.setVolume(0.5); // Volume do som
    }, (error) => {
      console.error('Failed to load weird sound:', error);
    });
    
    // CRIA PLAYER ÚNICO COM MAPA DE COLISÃO INICIAL DO MUNDO
    player = new Player(p5, 300, 400, 1024, '/assets/worldMapColision.png');
    
    mistInstance = new mist(p5, 1024, 1024, darkness);
    worldMap = new worldMapClass(p5, player, mistInstance);
    worldMap.loadWorldMap();
    
    // PASSA O MESMO PLAYER PARA AMBOS OS LEVELS
    level = level1(p5, player);
    level.loadLevel();
    level2Instance = level2(p5, player);
    level2Instance.loadLevel();
    
    // INICIA O TIMER DO SOM
    initializeSoundTimer();
  }

  // FUNÇÃO PARA INICIALIZAR O TIMER DO SOM
  const initializeSoundTimer = () => {
    // Tempo aleatório entre 25-35 segundos (em milissegundos)
    const randomDelay = Math.random() * (35000 - 25000) + 15000;
    nextSoundTime = Date.now() + randomDelay;
    console.log(`Próximo som em ${randomDelay / 1000} segundos`);
  }

  // FUNÇÃO PARA CONTROLAR O EFEITO DE CLARÃO
  const updateFlashEffect = (p5) => {
    if (!isFlashEffect) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - soundStartTime;

    if (flashPhase === 0) {
      // FASE 1: Descendo para 30 (primeiros 1.5 segundos)
      const progress = Math.min(elapsedTime / 1500, 1);
      darkness = p5.lerp(originalDarkness, targetDarkness, progress);
      
      if (progress >= 1) {
        flashPhase = 1;
        oscillationTime = currentTime;
      }
    } 
    else if (flashPhase === 1) {
      // FASE 2: Oscilando entre 20-40 (3 segundos do meio)
      const oscillationDuration = currentTime - oscillationTime;
      if (oscillationDuration < 3000) {
        const oscillation = Math.sin((oscillationDuration / 1000) * Math.PI * 4) * 50; // Oscila 4 vezes em 3 segundos
        darkness = targetDarkness + oscillation;
      } else {
        flashPhase = 2;
      }
    }
    else if (flashPhase === 2) {
      // FASE 3: Subindo de volta para 235 (últimos 1.5 segundos)
      const returnStartTime = soundStartTime + 4500; // 1.5s + 3s = 4.5s
      const returnProgress = Math.min((currentTime - returnStartTime) / 1500, 1);
      darkness = p5.lerp(targetDarkness, originalDarkness, returnProgress);
      
      if (returnProgress >= 1) {
        // Finaliza o efeito
        darkness = originalDarkness;
        isFlashEffect = false;
        flashPhase = 0;
        isSoundPlaying = false;
        console.log('Efeito de clarão finalizado');
        
        // Programa o próximo som
        initializeSoundTimer();
      }
    }

    // Atualiza a névoa com o novo valor de darkness
    if (mistInstance) {
      mistInstance.updateDarkness(darkness);
    }
  }

  // FUNÇÃO PARA VERIFICAR E TOCAR O SOM
  const checkWeirdSound = (p5) => {
    if (!flagWorld || flagLevel1 || flagLevel2) return; // Só toca no mundo
    if (isSoundPlaying) return; // Já está tocando

    const currentTime = Date.now();
    
    if (currentTime >= nextSoundTime) {
      if (weirdSound) {
        console.log('Tocando som estranho e iniciando efeito de clarão');
        weirdSound.play();
        
        // Inicia o efeito de clarão
        isSoundPlaying = true;
        soundStartTime = currentTime;
        isFlashEffect = true;
        flashPhase = 0;
      } else {
        // Se o som não carregou, programa o próximo
        initializeSoundTimer();
      }
    }
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
      // VERIFICA O SOM ESTRANHO E ATUALIZA O EFEITO
      checkWeirdSound(p5);
      updateFlashEffect(p5);
      
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
      const levelResult = level.runLevel();
      
      if (levelResult && levelResult.exit) {
        // SALVA o estado do item antes de sair
        level1ItemCollected = level.isItemCollected();
        console.log('Saindo do Level 1 - Item salvo:', level1ItemCollected);
        
        flagLevel1 = false;
        flagWorld = true;
        
        // RESTAURA CONFIGURAÇÕES DO MUNDO
        player.position.x = worldPlayerPosition.x;
        player.position.y = worldPlayerPosition.y;
        player.targetPosition.x = worldPlayerPosition.x;
        player.targetPosition.y = worldPlayerPosition.y;
        player.mapSize = 1024;
        player.setCollisionMap('/assets/worldMapColision.png'); // VOLTA PARA MAPA DO MUNDO
        
        // RESTAURA O DARKNESS ORIGINAL
        darkness = originalDarkness;
        if (mistInstance) {
          mistInstance.updateDarkness(darkness);
        }
        
        if (worldMap) {
          worldMap.startFadeIn();
        }
      }
    }
    
    if (flagLevel2) {
      const levelResult = level2Instance.runLevel();
      
      if (levelResult && levelResult.exit) {
        // SALVA o estado da chave antes de sair
        level2KeyCollected = level2Instance.isKeyCollected();
        console.log('Saindo do Level 2 - Chave salva:', level2KeyCollected);
        
        flagLevel2 = false;
        flagWorld = true;
        
        // RESTAURA CONFIGURAÇÕES DO MUNDO
        player.position.x = worldPlayerPosition.x;
        player.position.y = worldPlayerPosition.y;
        player.targetPosition.x = worldPlayerPosition.x;
        player.targetPosition.y = worldPlayerPosition.y;
        player.mapSize = 1024;
        player.setCollisionMap('/assets/worldMapColision.png'); // VOLTA PARA MAPA DO MUNDO
        
        // RESTAURA O DARKNESS ORIGINAL
        darkness = originalDarkness;
        if (mistInstance) {
          mistInstance.updateDarkness(darkness);
        }
        
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
        
        // SALVA POSIÇÃO ATUAL NO MUNDO
        worldPlayerPosition.x = player.position.x;
        worldPlayerPosition.y = player.position.y;
        
        // CONFIGURA PLAYER PARA O LEVEL1
        player.position.x = 390;
        player.position.y = 600;
        player.targetPosition.x = 390;
        player.targetPosition.y = 600;
        player.mapSize = 800;
        player.setCollisionMap('/assets/level/LabCollision.png'); // TROCA MAPA DE COLISÃO

        flagLevel1 = true;
        flagWorld = false;
        
        // RESTAURA o estado do item
        level.startFadeIn();
        level.setItemCollected(level1ItemCollected);
        console.log('Entrando no Level 1 - Item restaurado:', level1ItemCollected);
        
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
        
        // SALVA POSIÇÃO ATUAL NO MUNDO
        worldPlayerPosition.x = player.position.x;
        worldPlayerPosition.y = player.position.y;
        
        // CONFIGURA PLAYER PARA O LEVEL2
        player.position.x = 412;
        player.position.y = 1150;
        player.targetPosition.x = 412;
        player.targetPosition.y = 1150;
        player.mapSize = 1200;
        player.setCollisionMap('/assets/level/lostForest2Collision.png'); // TROCA MAPA DE COLISÃO
        
        flagLevel2 = true;
        flagWorld = false;
        
        // RESTAURA o estado da chave
        level2Instance.startFadeIn();
        level2Instance.setKeyCollected(level2KeyCollected);
        console.log('Entrando no Level 2 - Chave restaurada:', level2KeyCollected);
        
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
      p5.tint(255, 255, 255, 128);
      p5.image(textBoxImage, textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    }

    p5.fill(255, 255, 255, 128);
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