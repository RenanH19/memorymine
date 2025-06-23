import MusicManager from "../../audio/MusicManager";

function level3(p5, sharedPlayer) {
  let player = sharedPlayer; // USA O PLAYER COMPARTILHADO
  let musicFile = '/assets/music/deepSound.mp3'; // Música mais sombria para level3
  let music = MusicManager(p5, musicFile);
  
  // Variáveis para o mapa
  let levelImage = null;
  let frontImage = null; // Layer de objetos/detalhes por cima
  let levelWidth = 800;
  let levelHeight = 1280;
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
  let exitArea = { x: 0, y: 0, radius: 50 }; // Área de saída no level3
  let zKeyPressed = false;
  let shouldExit = false;
  let textBoxImage = null;

  // Variáveis para itens/interações específicas do level3
  let secretArea = { x: 200, y: 200, radius: 40 }; // Área secreta/especial
  let secretItem = null;
  let secretItemCollected = false;
  let xKeyPressedForSecret = false;

  function loadLevel() {
    // Carrega o mapa principal do level3
    levelImage = p5.loadImage('/assets/level/secretRoomFinal.png', () => {
      console.log('Level3 background loaded successfully');
    }, (error) => {
      console.error('Failed to load level3 background:', error);
    });

    // Carrega objetos/detalhes que ficam por cima
    frontImage = p5.loadImage('/assets/level/level3Front.png', () => {
      console.log('Level3 front layer loaded successfully');
    }, (error) => {
      console.log('Level3 front layer not found or not needed');
    });

    // Carrega a textBox para indicadores
    textBoxImage = p5.loadImage('/assets/fonts/textBox.png', () => {
      console.log('TextBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load textBox image:', error);
    });

    // Carrega item secreto (exemplo)
    secretItem = p5.loadImage('/assets/sprites/player/secretItem.png', () => {
      console.log('Secret item loaded successfully');
    }, (error) => {
      console.log('Secret item image not found');
    });
    
    music.loadMusic();
  }

  function startFadeIn() {
    fadeInAlpha = 255;
    isFadingIn = true;
    musicVolume = 0;
    shouldExit = false;
    zKeyPressed = false;
    xKeyPressedForSecret = false;
    // Mantém o estado dos itens coletados
  }

  // Métodos para persistência do item secreto
  function setSecretItemCollected(collected) {
    secretItemCollected = collected;
  }

  function isSecretItemCollected() {
    return secretItemCollected;
  }

  function checkSecretInteraction() {
    if (secretItemCollected) return false;

    const distance = p5.dist(player.position.x, player.position.y, secretArea.x, secretArea.y);
    const isInSecretArea = distance < secretArea.radius;

    if (p5.keyIsDown(88) && isInSecretArea) { // Tecla X
      if (!xKeyPressedForSecret) {
        xKeyPressedForSecret = true;
        secretItemCollected = true;
        
        // Cria o item para adicionar ao inventário
        const newItem = {
          name: "Item Misterioso",
          image: secretItem,
          type: "mysterious_item"
        };
        
        const added = player.addItem(newItem);
        if (added) {
          console.log('Item misterioso coletado no Level3!');
          
          // Toca som se disponível
          // if (secretSound) {
          //   secretSound.play();
          // }
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressedForSecret = false;
    }

    return isInSecretArea;
  }

  function drawSecretItem() {
    if (secretItemCollected || !secretItem) return;

    p5.push();
    
    // Efeito de pulsação
    const pulseScale = 1 + Math.sin(p5.millis() * 0.005) * 0.1;
    
    p5.translate(secretArea.x, secretArea.y);
    p5.scale(pulseScale);
    
    // Brilho misterioso
    p5.fill(150, 0, 255, 100); // Roxo brilhante
    p5.noStroke();
    p5.ellipse(0, 0, 40, 40);
    
    // Desenha o item
    p5.imageMode(p5.CENTER);
    p5.image(secretItem, 0, 0, 30, 30);
    p5.imageMode(p5.CORNER);
    
    p5.pop();
  }

  function drawSecretIndicator() {
    p5.push();
    p5.resetMatrix();
    
    const textBoxWidth = 600;
    const textBoxHeight = 70;
    const textBoxX = (p5.width - textBoxWidth) / 2;
    const textBoxY = p5.height - textBoxHeight - 20;
    
    if (textBoxImage) {
      p5.image(textBoxImage, textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    } else {
      p5.fill(0, 0, 0, 150);
      p5.stroke(200, 200, 200);
      p5.strokeWeight(2);
      p5.rect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 10);
    }
    
    p5.fill(255, 255, 255);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(18);
    p5.textStyle(p5.BOLD);
    p5.text("Pressione 'X' para investigar", p5.width / 2, textBoxY + textBoxHeight / 2);
    
    p5.pop();
  }

  function checkExitArea() {
    const distance = p5.dist(player.position.x, player.position.y, exitArea.x, exitArea.y);
    const isInExitArea = distance < exitArea.radius;

    if (p5.keyIsDown(90) && isInExitArea) { // Tecla Z
      if (!zKeyPressed) {
        zKeyPressed = true;
        shouldExit = true;
        console.log('Saindo do Level 3...');
        
        if (music) {
          music.stopMusic();
        }
      }
    } else if (!p5.keyIsDown(90)) {
      zKeyPressed = false;
    }

    return { shouldExit, isInExitArea };
  }

  function drawExitIndicator() {
    p5.push();
    p5.resetMatrix();
    
    const textBoxWidth = 600;
    const textBoxHeight = 70;
    const textBoxX = (p5.width - textBoxWidth) / 2;
    const textBoxY = p5.height - textBoxHeight - 20;
    
    if (textBoxImage) {
      p5.tint(255, 255, 255, 128);
      p5.image(textBoxImage, textBoxX, textBoxY, textBoxWidth, textBoxHeight);
      p5.noTint();
    } else {
      p5.fill(0, 0, 0, 150);
      p5.stroke(200, 200, 200);
      p5.strokeWeight(2);
      p5.rect(textBoxX, textBoxY, textBoxWidth, textBoxHeight, 10);
    }
    
    p5.fill(255, 255, 255, 128);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(18);
    p5.textStyle(p5.BOLD);
    p5.text("Pressione 'Z' para voltar", p5.width / 2, textBoxY + textBoxHeight / 2);
    
    p5.pop();
  }

  function runLevel() {
    // Verifica saída
    const exitData = checkExitArea();
    if (exitData.shouldExit) {
      return { exit: true };
    }

    // Verifica interação com item secreto
    const isNearSecret = checkSecretInteraction();

    // Controle da câmera
    cameraX = p5.constrain(player.position.x - p5.width/2, 0, Math.max(0, levelWidth - p5.width));
    cameraY = p5.constrain(player.position.y - p5.height/2, 0, Math.max(0, levelHeight - p5.height));

    // Aplica transformação da câmera
    p5.translate(-cameraX, -cameraY);

    // Desenha o mapa de fundo
    if (levelImage) {
      p5.image(levelImage, 0, 0, levelWidth, levelHeight);
    } else {
      p5.background(20, 20, 40); // Fundo escuro para level3
    }

    // Desenha o item secreto (antes do player)
    drawSecretItem();

    // Atualiza e desenha o player
    player.getPlayerSprites();
    player.update();
    player.display();

    // Desenha objetos por cima (se existir)
    if (frontImage) {
      p5.image(frontImage, 0, 0, levelWidth, levelHeight);
    }

    // Fade in da música
    if (musicVolume < targetMusicVolume) {
      musicVolume = p5.lerp(musicVolume, targetMusicVolume, musicFadeSpeed);
    }
    
    music.playMusic();
    music.setVolume(musicVolume);

    // Reset da transformação para UI
    p5.resetMatrix();

    // Desenha indicadores (prioridade: saída > item secreto)
    if (exitData.isInExitArea) {
      drawExitIndicator();
    } else if (isNearSecret && !secretItemCollected) {
      drawSecretIndicator();
    }

    // Desenha o inventário
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

    return { exit: false };
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

  return {
    loadLevel,
    runLevel,
    stopLevel,
    startFadeIn,
    setSecretItemCollected,
    isSecretItemCollected,
    isFadeComplete,
    setFadeSpeed,
    setMusicFadeSpeed,
    getPlayerPosition,
    getCameraPosition,
    getLevelDimensions
  };
}

export default level3;