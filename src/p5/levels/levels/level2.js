import Player from "../../Player";
import MusicManager from "../../audio/MusicManager";
import mist from "../../maps/mist";

function level2(p5) {
  let player = new Player(p5, 412, 1150, 1200, '/assets/level/lostForest2Collision.png');
  let musicFile = '/assets/music/moongate.mp3';
  let music = MusicManager(p5, musicFile);
  let mistInstance = new mist(p5, 1024, 1201);
  
  // Variáveis para o mapa
  let levelImage = null;
  let treesImage = null;
  let levelWidth = 1024;
  let levelHeight = 1201;
  let cameraX = 0;
  let cameraY = 0;
  
  // Variáveis para fade in
  let fadeInAlpha = 255;
  let fadeInSpeed = 2;
  let isFadingIn = true;
  let musicVolume = 0;
  let targetMusicVolume = 0.1;
  let musicFadeSpeed = 0.005;

  // Variáveis para controle de saída
  let exitArea = { x: 412, y: 1150, radius: 50 }; // Área de saída
  let xKeyPressed = false;
  let shouldExit = false;
  let textBoxImage = null; // Nova variável para a textBox

  // Variáveis para a chave
  let keyArea = { x: 390, y: 240, radius: 30 }; // Área da chave
  let keyImage = null; // Imagem da chave
  let keySound = null; // Som da chave
  let keyCollected = false; // Flag para verificar se a chave foi coletada
  let xKeyPressedForKey = false; // Controle separado para coleta da chave

  function loadLevel() {
    levelImage = p5.loadImage('/assets/level/lostForest2.png', () => {
      console.log('Level2 map loaded successfully');
    }, (error) => {
      console.error('Failed to load level2 map:', error);
    });

    treesImage = p5.loadImage('/assets/level/lostForest2trees.png', () => {
      console.log('Level2 trees loaded successfully');
    }, (error) => {
      console.error('Failed to load level2 trees:', error);
    });

    textBoxImage = p5.loadImage('/assets/fonts/textBox.png', () => {
      console.log('TextBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load textBox image:', error);
    });

    // Carrega a imagem da chave
    keyImage = p5.loadImage('/assets/sprites/player/keys.png', () => {
      console.log('Key image loaded successfully');
    }, (error) => {
      console.error('Failed to load key image:', error);
    });

    // Carrega o som da chave
    keySound = p5.loadSound('/assets/sounds/keySound.mp3', () => {
      console.log('Key sound loaded successfully');
    }, (error) => {
      console.error('Failed to load key sound:', error);
    });

    player.loadPlayer();
    music.loadMusic();
    mistInstance.loadMist();
  }

  function startFadeIn() {
    fadeInAlpha = 255;
    isFadingIn = true;
    musicVolume = 0;
    shouldExit = false; // Reset do flag de saída
    xKeyPressed = false; // Reset da tecla também
    xKeyPressedForKey = false; // Reset da tecla para chave
    // NÃO reseta keyCollected aqui para manter o estado
  }

  // Novo método para definir se a chave foi coletada
  function setKeyCollected(collected) {
    keyCollected = collected;
  }

  function checkKeyCollection() {
    if (keyCollected) return false; // Se já foi coletada, não verifica mais

    // Verifica se o player está próximo da área da chave
    const distance = p5.dist(player.position.x, player.position.y, keyArea.x, keyArea.y);
    const isInKeyArea = distance < keyArea.radius;

    // Verifica se a tecla 'X' foi pressionada
    if (p5.keyIsDown(88) && isInKeyArea) { // 88 é o código da tecla 'X'
      if (!xKeyPressedForKey) {
        xKeyPressedForKey = true;
        keyCollected = true;
        
        // Adiciona a chave ao inventário
        const keyItem = {
          name: "chave",
          image: keyImage,
          type: "key"
        };
        
        const added = player.addItem(keyItem);
        if (added) {
          console.log('Chave coletada!');
          
          // Toca o som da chave
          if (keySound) {
            keySound.play();
          }
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressedForKey = false;
    }

    return isInKeyArea;
  }

  function drawKeyIndicator() {
    // Salva a matriz atual
    p5.push();
    
    // Reset da transformação para desenhar na tela
    p5.resetMatrix();
    
    // Posição da textBox (centralizada na parte inferior)
    const textBoxWidth = 600;
    const textBoxHeight = 70;
    const textBoxX = (p5.width - textBoxWidth) / 2;
    const textBoxY = p5.height - textBoxHeight - 20;
    
    // Desenha a textBox como fundo se carregada
    if (textBoxImage) {
      p5.image(textBoxImage, textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    } else {
      // Fallback: fundo simples
      p5.fill(0, 0, 0, 150);
      p5.stroke(200, 200, 200);
      p5.strokeWeight(2);
      p5.rect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 10);
    }
    
    // Desenha o texto branco por cima da textBox
    p5.fill(255, 255, 255);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(18);
    p5.textStyle(p5.BOLD);
    p5.text("Pressione 'X' para coletar a chave", p5.width / 2, textBoxY + textBoxHeight / 2);
    
    // Restaura a matriz
    p5.pop();
  }

  function drawKey() {
    if (keyCollected || !keyImage) return; // Não desenha se foi coletada ou imagem não carregou

    // Desenha a chave no mundo (com transformação da câmera aplicada)
    p5.push();
    
    // Efeito de brilho/pulsação
    const pulseScale = 1 + Math.sin(p5.millis() * 0.005) * 0.1;
    
    p5.translate(keyArea.x, keyArea.y);
    p5.scale(pulseScale);
    
    // Desenha um brilho atrás da chave
    p5.fill(255, 255, 0, 100); // Amarelo com transparência
    p5.noStroke();
    p5.ellipse(0, 0, 40, 40);
    
    // Desenha a chave
    p5.imageMode(p5.CENTER);
    p5.image(keyImage, 0, 0, 30, 30);
    p5.imageMode(p5.CORNER); // Restaura o modo padrão
    
    p5.pop();
  }

  function checkExitArea() {
    // Verifica se o player está próximo da área de saída
    const distance = p5.dist(player.position.x, player.position.y, exitArea.x, exitArea.y);
    const isInExitArea = distance < exitArea.radius;

    // Verifica se a tecla 'Z' foi pressionada
    if (p5.keyIsDown(90) && isInExitArea) { // 90 é o código da tecla 'Z'
      if (!xKeyPressed) {
        xKeyPressed = true;
        shouldExit = true;
        console.log('Saindo do Level 2...');
        
        // Para a música
        if (music) {
          music.stopMusic();
        }
      }
    } else if (!p5.keyIsDown(90)) {
      xKeyPressed = false;
    }

    // Retorna ambos os valores
    return { shouldExit, isInExitArea };
  }

  function drawExitIndicator() {
    // Salva a matriz atual
    p5.push();
    
    // Reset da transformação para desenhar na tela
    p5.resetMatrix();
    
    // Posição da textBox (centralizada na parte inferior)
    const textBoxWidth = 600;
    const textBoxHeight = 70;
    const textBoxX = (p5.width - textBoxWidth) / 2;
    const textBoxY = p5.height - textBoxHeight - 20;
    
    // Desenha a textBox como fundo se carregada
    if (textBoxImage) {
      p5.image(textBoxImage, textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    } else {
      // Fallback: fundo simples
      p5.fill(0, 0, 0, 150);
      p5.stroke(200, 200, 200);
      p5.strokeWeight(2);
      p5.rect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 10);
    }
    
    // Desenha o texto branco por cima da textBox
    p5.fill(255, 255, 255);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(18);
    p5.textStyle(p5.BOLD);
    p5.text("Pressione 'Z' para voltar ao mundo", p5.width / 2, textBoxY + textBoxHeight / 2);
    
    // Restaura a matriz
    p5.pop();
  }

  function runLevel() {
    // Verifica se deve sair do level
    const exitData = checkExitArea();
    if (exitData.shouldExit) {
      return { exit: true }; // Sinaliza que deve sair
    }

    // Verifica a coleta da chave
    const isNearKey = checkKeyCollection();

    // Controle da câmera limitado pelas dimensões do level
    cameraX = p5.constrain(player.position.x - p5.width/2, 0, levelWidth - p5.width);
    cameraY = p5.constrain(player.position.y - p5.height/2, 0, levelHeight - p5.height);

    // Aplica transformação da câmera
    p5.translate(-cameraX, -cameraY);

    // Desenha o mapa de fundo
    if (levelImage) {
      p5.image(levelImage, 0, 0, levelWidth, levelHeight);
    } else {
      p5.background(40, 40, 60);
    }

    // Desenha a chave (antes do player para que fique atrás)
    drawKey();

    // Atualiza e desenha o player
    player.getPlayerSprites();
    player.update();
    player.display();

    // Desenha as árvores por cima do player
    if (treesImage) {
      p5.image(treesImage, 0, 0, levelWidth, levelHeight);
    }

    // Fade in da música
    if (musicVolume < targetMusicVolume) {
      musicVolume = p5.lerp(musicVolume, targetMusicVolume, musicFadeSpeed);
    }
    
    music.playMusic();
    music.setVolume(musicVolume);

    // Sistema de névoa
    if (mistInstance) {
      mistInstance.buildMist();
      mistInstance.drawMist();
      mistInstance.lightEffect(player.position);
    }

    // Reset da transformação para elementos da UI
    p5.resetMatrix();

    // Desenha indicadores na tela
    if (exitData.isInExitArea) {
      drawExitIndicator();
    } else if (isNearKey && !keyCollected) {
      drawKeyIndicator();
    }

    // Desenha o inventário por último
    player.displayInventory();

    // Fade in visual
    if (isFadingIn) {
      fadeInAlpha -= fadeInSpeed;
      
      if (fadeInAlpha <= 0) {
        fadeInAlpha = 0;
        isFadingIn = false;
      }
      
      p5.fill(0, fadeInAlpha);
      p5.rect(0, 0, p5.width, p5.height);
    }

    return { exit: false }; // Continua no level
  }

  function stopLevel() {
    if (music) {
      music.stopMusic();
    }
  }

  function isFadeComplete() {
    return !isFadingIn;
  }

  function setFadeSpeed(speed) {
    fadeInSpeed = speed;
  }

  function setMusicFadeSpeed(speed) {
    musicFadeSpeed = speed;
  }

  function getPlayerPosition() {
    return player.position;
  }

  function getCameraPosition() {
    return { x: cameraX, y: cameraY };
  }

  function getLevelDimensions() {
    return { width: levelWidth, height: levelHeight };
  }

  // Getter para verificar se a chave foi coletada
  function isKeyCollected() {
    return keyCollected;
  }

  return {
    loadLevel,
    runLevel,
    stopLevel,
    startFadeIn,
    setKeyCollected, // Novo método
    isFadeComplete,
    setFadeSpeed,
    setMusicFadeSpeed,
    getPlayerPosition,
    getCameraPosition,
    getLevelDimensions,
    isKeyCollected
  };
}

export default level2;