import Sketch from 'react-p5';
import 'p5/lib/addons/p5.sound';
import level1 from '../p5/levels/levels/level1';
import level2 from '../p5/levels/levels/level2'; // Adiciona o import do level2
import Player from '../p5/Player';
import worldMapClass from '../p5/maps/worldMapClass';
import mist from '../p5/maps/mist';
import Menu from '../p5/menu';

function GameCanvas() {
  let level;
  let level2Instance; // Nova instância do level2
  let flagWorld = false;
  let flagLevel1 = false;
  let flagLevel2 = false; // Nova flag para level2
  let player;
  let worldMap;
  let mistInstance;
  let menu;
  let gameStarted = false;
  
  // Variáveis para transição
  let isTransitioning = false;
  let transitionAlpha = 0;
  let transitionSpeed = 0.02;
  let transitionBlur = 0;
  let maxBlur = 15;
  let worldMusicVolume = 0;
  let targetVolume = 0.3; // Volume alvo da música do mundo

  // Variáveis para controlar entrada nos levels
  let xKeyPressed = false;
  let xKeyPressedLevel2 = false; // Nova variável para level2

  const preload = (p5) => {
    menu = new Menu(p5);
    menu.loadMenuAssets();
    
    player = new Player(p5, 300, 400, 1024);
    mistInstance = new mist(p5, 1024, 1024);
    worldMap = new worldMapClass(p5, player, mistInstance);
    worldMap.loadWorldMap();
    level = level1(p5);
    level.loadLevel();
    level2Instance = level2(p5); // Carrega o level2
    level2Instance.loadLevel();
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas(800, 640).parent(parentRef);
    p5.frameRate(60);
  }

  const draw = (p5) => {
    // Se o menu está visível, desenha apenas o menu
    if (menu.isMenuVisible() && !isTransitioning) {
      const startGame = menu.drawMenu();
      if (startGame) {
        gameStarted = true;
        isTransitioning = true;
        // Inicia a transição para o mundo
        console.log('Iniciando transição para o mundo...');
      }
      return;
    }

    // Durante a transição
    if (isTransitioning) {
      handleTransition(p5);
      return;
    }

    // Resto do jogo
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
      
      // Verifica se o player está na posição específica e pressiona 'x'
      checkLevel1Entry(p5);
      checkLevel2Entry(p5); // Adiciona verificação do level2
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
    
    if (flagLevel2) { // Adiciona execução do level2
      level2Instance.runLevel();
    }
  }

  const checkLevel1Entry = (p5) => {
    // Verifica se o player está na área específica
    const isInArea = player.position.x > 460 && 
                     player.position.x < 510 && 
                     player.position.y > 520 && 
                     player.position.y < 560;
    
    // Verifica se a tecla 'x' foi pressionada (keyCode 88)
    if (p5.keyIsDown(88) && isInArea) { // 88 é o código da tecla 'x'
      if (!xKeyPressed) { // Evita múltiplas ativações
        xKeyPressed = true;
        flagLevel1 = true;
        flagWorld = false;
        console.log('Entrando no Level 1...');
        
        // Para a música do mundo se necessário
        if (worldMap && worldMap.music) {
          worldMap.music.stopMusic();
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressed = false; // Reset quando solta a tecla
    }
    
    // Opcional: Desenha um indicador visual quando o player estiver na área
    if (isInArea) {
      drawEntryIndicator(p5, "Pressione 'X' para entrar no domo em ruínas");
    }
  }

  const checkLevel2Entry = (p5) => {
    // Verifica se o player está na área específica do level2
    const isInArea = player.position.x > 710 && 
                     player.position.x < 770 && 
                     player.position.y > 650 && 
                     player.position.y < 700;
    
    // Verifica se a tecla 'x' foi pressionada (keyCode 88)
    if (p5.keyIsDown(88) && isInArea) { // 88 é o código da tecla 'x'
      if (!xKeyPressedLevel2) { // Evita múltiplas ativações
        xKeyPressedLevel2 = true;
        flagLevel2 = true;
        flagWorld = false;
        console.log('Entrando no Level 2...');
        
        // Para a música do mundo se necessário
        if (worldMap && worldMap.music) {
          worldMap.music.stopMusic();
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressedLevel2 = false; // Reset quando solta a tecla
    }
    
    // Opcional: Desenha um indicador visual quando o player estiver na área
    if (isInArea) {
      drawEntryIndicator(p5, "Pressione 'X' para entrar no Jardim em Ruínas");
    }
  }

  const drawEntryIndicator = (p5, message) => {
    // Salva a matriz atual
    p5.push();
    
    // Reset da transformação para desenhar na tela
    p5.resetMatrix();
    
    // Desenha indicador no centro da tela
    p5.fill(255, 255, 0, 150); // Amarelo com transparência
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(20);
    p5.textStyle(p5.BOLD);
    p5.text(message, p5.width / 2, p5.height - 50);
    
    // Restaura a matriz
    p5.pop();
  }

  const handleTransition = (p5) => {
    // Aumenta gradualmente o blur e alpha
    transitionAlpha = p5.lerp(transitionAlpha, 255, transitionSpeed);
    transitionBlur = p5.lerp(transitionBlur, maxBlur, transitionSpeed);
    
    // Desenha o menu com blur
    if (transitionAlpha < 200) {
      // Aplica filtro blur ao menu
      p5.drawingContext.filter = `blur(${transitionBlur}px)`;
      menu.drawMenu();
      p5.drawingContext.filter = 'none'; // Remove o filtro
    }
    
    // Overlay de transição
    p5.fill(0, transitionAlpha);
    p5.rect(0, 0, p5.width, p5.height);
    
    // Quando a transição estiver quase completa
    if (transitionAlpha > 200) {
      // Inicia o fade in do mundo
      if (worldMap && !flagWorld) {
        worldMap.startFadeIn(); // Reinicia o fade in
        flagWorld = true;
      }
      
      if (worldMap) {
        worldMap.runWorld();
      }
    }
    
    // Termina a transição
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