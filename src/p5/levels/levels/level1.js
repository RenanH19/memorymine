import MusicManager from "../../audio/MusicManager";
import mist from "../../maps/mist";

function level1(p5, sharedPlayer) {
  let player = sharedPlayer; // USA O PLAYER COMPARTILHADO
  let musicFile = '/assets/music/deepSound.mp3';
  let music = MusicManager(p5, musicFile);
  let mistInstance = new mist(p5, 800, 640);
  
  // Variáveis para o mapa
  let levelImage = null;
  let levelImageLight = null; // Mapa claro (se necessário)
  let labFront = null; // Opcional: layer de objetos em cima
  let levelWidth = 800;
  let levelHeight = 640;
  let cameraX = 0;
  let cameraY = 0;
  let darkness = 255;
  let darknessLight = 0;
  let isSystemActive = false;
  
  // Variáveis para fade in
  let fadeInAlpha = 255;
  let fadeInSpeed = 2;
  let isFadingIn = true;
  let musicVolume = 2;
  let targetMusicVolume = 0.1;
  let musicFadeSpeed = 0.005;

  // Variáveis para controle de saída
  let exitArea = { x: 390, y: 600, radius: 50 }; // Área de saída próxima ao spawn
  let zKeyPressed = false;
  let shouldExit = false;
  let textBoxImage = null;
  let itemBoxImage = null;

  // Variáveis para item coletável
  let itemArea = { x: 400, y: 500, radius: 30 }; // Posição do item no mapa
  let itemImage = null;
  let itemSound = null;
  let itemCollected = false;
  let xKeyPressedForItem = false;

  // Variáveis para o sistema de ativação
  let systemArea = { x: 400, y: 435, radius: 40 }; // Área do sistema
  let xKeyPressedForSystem = false;
  let showSystemMessage = false;
  let showKeyMessage = false;
  let systemMessageStep = 0; // 0: primeira mensagem, 1: segunda mensagem, 2: sistema ativo

  function loadLevel() {
    // Carrega a imagem do level1 (escuro)
    levelImage = p5.loadImage('/assets/level/LabDark.png', () => {
      console.log('Level1 dark map loaded successfully');
    }, (error) => {
      console.error('Failed to load level1 dark map:', error);
    });

    // Carrega a imagem do level1 (claro)
    levelImageLight = p5.loadImage('/assets/level/LabLight.png', () => {
      console.log('Level1 light map loaded successfully');
    }, (error) => {
      console.error('Failed to load level1 light map:', error);
    });

    // Opcional: layer de árvores/objetos por cima
    labFront = p5.loadImage('/assets/level/LabDarkFront.png', () => {
      console.log('Level1 trees loaded successfully');
    }, (error) => {
      console.log('Level1 trees not found or not needed');
    });

    // Carrega a textBox
    textBoxImage = p5.loadImage('/assets/fonts/textBox.png', () => {
      console.log('TextBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load textBox image:', error);
    });

     // Carrega a imagem do itemBox
    itemBoxImage = p5.loadImage('/assets/sprites/player/itemBox.png', () => {
      console.log('ItemBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load itemBox image:', error);
    });

    // Carrega a imagem do item
    itemImage = p5.loadImage('/assets/sprites/player/book.png', () => {
      console.log('Item image loaded successfully');
    }, (error) => {
      console.error('Failed to load item image:', error);
    });

    // Carrega o som do item
    itemSound = p5.loadSound('/assets/sounds/keySound.mp3', () => {
      console.log('Item sound loaded successfully');
    }, (error) => {
      console.error('Failed to load item sound:', error);
    });
    
    music.loadMusic();
    mistInstance.loadMist();
  }

  function startFadeIn() {
    fadeInAlpha = 255;
    isFadingIn = true;
    musicVolume = 0;
    shouldExit = false;
    zKeyPressed = false;
    xKeyPressedForItem = false;
    xKeyPressedForSystem = false;
    showSystemMessage = false;
    showKeyMessage = false;
  }

  // Método para definir se o item foi coletado (usado na persistência)
  function setItemCollected(collected) {
    itemCollected = collected;
  }

  // Getter para verificar se o item foi coletado
  function isItemCollected() {
    return itemCollected;
  }

  // Método para definir se o sistema está ativo (usado na persistência)
  function setSystemActive(active) {
    isSystemActive = active;
    if (active) {
      darknessLight = 0; // Se o sistema já está ativo, clarear imediatamente
      systemMessageStep = 3; // Marca como completamente ativo
      if (mistInstance && mistInstance.updateDarkness) {
        mistInstance.updateDarkness(darknessLight);
      }
    }
  }

  function getSystemActive() {
    return isSystemActive;
  }

  function checkSystemInteraction() {
    const distance = p5.dist(player.position.x, player.position.y, systemArea.x, systemArea.y);
    const isInSystemArea = distance < systemArea.radius;

    if (isInSystemArea && !isSystemActive) {
      if (p5.keyIsDown(88)) { // Tecla X
        if (!xKeyPressedForSystem) {
          xKeyPressedForSystem = true;
          
          if (systemMessageStep === 0) {
            // Primeira mensagem: "Sistema fora de operação"
            showSystemMessage = true;
            showKeyMessage = false;
            systemMessageStep = 1;
            console.log('Primeira mensagem mostrada');
          } else if (systemMessageStep === 1) {
            // Segunda mensagem: verifica se tem a chave
            showSystemMessage = false;

            // Verifica se tem chave no inventário
            const hasKey = player.hasItem('key')
            
            if (hasKey) {
              // Tem a chave, ativa o sistema
              isSystemActive = true;
              systemMessageStep = 3;
              showKeyMessage = false;
              
              console.log('Sistema ativado! Laboratório iluminando...');
              
              // Inicia a transição suave de escuridão
              darknessLight = 255; // Começa escuro
            } else {
              // Não tem a chave
              showKeyMessage = true;
              systemMessageStep = 2;
            }
          } else if (systemMessageStep === 2) {
            // Reset para voltar ao início se não tem chave
            showKeyMessage = false;
            systemMessageStep = 0;
          }
        }
      } else {
        xKeyPressedForSystem = false;
      }
    } else if (!isInSystemArea) {
      // Fora da área, esconde mensagens mas mantém o progresso
      showSystemMessage = false;
      showKeyMessage = false;
    }

    return isInSystemArea;
  }

   function updateSystemTransition() {
    if (isSystemActive && darknessLight > 0) {
      // Transição suave para clarear
      darknessLight = p5.lerp(darknessLight, 0, 0.02);
      
      if (darknessLight < 1) {
        darknessLight = 0;
      }
      
      // Atualiza a escuridão na névoa
      if (mistInstance && mistInstance.updateDarkness) {
        mistInstance.updateDarkness(darknessLight);
      }
    }
  }

  function checkItemCollection() {
    if (itemCollected) return false;

    const distance = p5.dist(player.position.x, player.position.y, itemArea.x, itemArea.y);
    const isInItemArea = distance < itemArea.radius;

    if (p5.keyIsDown(88) && isInItemArea) { // Tecla X
      if (!xKeyPressedForItem) {
        xKeyPressedForItem = true;
        itemCollected = true;
        
        // Cria o item para adicionar ao inventário
        const collectibleItem = {
          name: "Livro Antigo",
          image: itemImage,
          type: "book"
        };
        
        const added = player.addItem(collectibleItem);
        if (added) {
          console.log('Item coletado no Level1!');
          
          if (itemSound) {
            itemSound.play();
          }
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressedForItem = false;
    }

    return isInItemArea;
  }

  function drawItem() {
    if (itemCollected || !itemImage) return;

    p5.push();
    
    // Efeito de pulsação
    const pulseScale = 1 + Math.sin(p5.millis() * 0.005) * 0.1;
    
    p5.translate(itemArea.x, itemArea.y);
    p5.scale(pulseScale);
    
    // Brilho atrás do item
    p5.fill(255, 255, 100, 100); // Amarelo brilhante
    p5.noStroke();
    p5.ellipse(0, 0, 40, 40);
    
    // Desenha o item
    p5.imageMode(p5.CENTER);
    p5.image(itemImage, 0, 0, 30, 30);
    p5.imageMode(p5.CORNER);
    
    p5.pop();
  }

  function drawSystemIndicator() {
    if (!showSystemMessage && !showKeyMessage) return;

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
    
    if (showSystemMessage) {
      p5.text("Sistema fora de operação", p5.width / 2, textBoxY + textBoxHeight / 2);
    } else if (showKeyMessage) {
      p5.text("Necessário chaves", p5.width / 2, textBoxY + textBoxHeight / 2);
    }
    
    p5.pop();
  }

  function drawSystemArea() {
    if (isSystemActive) return; // Não desenha se já estiver ativo

    p5.push();
    
    // Efeito de pulsação para indicar área interativa
    const pulseScale = 1 + Math.sin(p5.millis() * 0.003) * 0.1;
    
    p5.translate(systemArea.x, systemArea.y);
    p5.scale(pulseScale);
    
    // Círculo indicativo
    p5.fill(100, 100, 255, 80); // Azul translúcido
    p5.stroke(100, 100, 255, 150);
    p5.strokeWeight(2);
    p5.ellipse(0, 0, systemArea.radius * 2, systemArea.radius * 2);
    
    // Ícone do sistema (opcional)
    p5.fill(255, 255, 255, 200);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(16);
    p5.text("⚡", 0, 0);
    
    p5.pop();
  }

  function drawItemIndicator() {
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
    p5.text("Pressione 'X' para coletar o item", p5.width / 2, textBoxY + textBoxHeight / 2);
    
    p5.pop();
  }

  // Nova função para desenhar o itemBox no canto da tela
  function drawItemBoxIndicator(isNearSystem) {
    if (!itemBoxImage || !isNearSystem || isSystemActive) return;

    p5.push();
    p5.resetMatrix();
    
    // Posiciona no canto superior direito
    const itemBoxX = p5.width - 80;
    const itemBoxY = 20;
    const itemBoxSize = 60;
    
    // Desenha o itemBox
    p5.image(itemBoxImage, itemBoxX, itemBoxY, itemBoxSize, itemBoxSize);
    
    // Adiciona texto "X"
    p5.fill(255, 255, 255);
    p5.stroke(0, 0, 0);
    p5.strokeWeight(2);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(20);
    p5.textStyle(p5.BOLD);
    p5.text("X", itemBoxX + itemBoxSize / 2, itemBoxY + itemBoxSize / 2);
    
    p5.pop();
  }

  function checkExitArea() {
    const distance = p5.dist(player.position.x, player.position.y, exitArea.x, exitArea.y);
    const isInExitArea = distance < exitArea.radius;

    if (p5.keyIsDown(90) && isInExitArea) { // Tecla Z
      if (!zKeyPressed) {
        zKeyPressed = true;
        shouldExit = true;
        console.log('Saindo do Level 1...');
        
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
    p5.text("Pressione 'Z' para voltar ao mundo", p5.width / 2, textBoxY + textBoxHeight / 2);
    
    p5.pop();
  }

  function runLevel() {
    // Verifica saída
    const exitData = checkExitArea();
    if (exitData.shouldExit) {
      return { exit: true };
    }

    // Verifica coleta do item
    const isNearItem = checkItemCollection();

    // Verifica interação com o sistema
    const isNearSystem = checkSystemInteraction();

    // Atualiza transição do sistema
    updateSystemTransition();
    // Controle da câmera
    cameraX = p5.constrain(player.position.x - p5.width/2, 0, Math.max(0, levelWidth - p5.width));
    cameraY = p5.constrain(player.position.y - p5.height/2, 0, Math.max(0, levelHeight - p5.height));

    // Aplica transformação da câmera
    p5.translate(-cameraX, -cameraY);

    // Desenha o mapa de fundo (escolhe entre escuro e claro)
    const currentLevelImage = isSystemActive ? levelImageLight : levelImage;
    if (currentLevelImage) {
      p5.image(currentLevelImage, 0, 0, levelWidth, levelHeight);
    } else {
      p5.background(40, 40, 60);
    }

    // Desenha a área do sistema (se não estiver ativo)
    drawSystemArea();

    // Desenha o item (antes do player)
    drawItem();

    // Desenha o mapa de fundo
    if (levelImage) {
      p5.image(levelImage, 0, 0, levelWidth, levelHeight);
    } else {
      p5.background(40, 40, 60);
    }

    // Desenha o item (antes do player)
    drawItem();

    // Atualiza e desenha o player
    player.getPlayerSprites();
    player.update();
    player.display();

    // Desenha objetos por cima (se existir)
    if (labFront) {
      p5.image(labFront, 0, 0, levelWidth, levelHeight);
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
      mistInstance.lightEffectNoBox(player.position);
    }

    // Reset da transformação para UI
    p5.resetMatrix();

    // Desenha indicadores
    if (exitData.isInExitArea) {
      drawExitIndicator();
    } else if (isNearSystem) {
      drawSystemIndicator();
    } else if (isNearItem && !itemCollected) {
      drawItemIndicator();
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

  // Nova função para definir o progresso do sistema (para persistência)
  function setSystemProgress(step) {
    systemMessageStep = step;
  }

  function getSystemProgress() {
    return systemMessageStep;
  }

  return {
    loadLevel,
    runLevel,
    stopLevel,
    startFadeIn,
    setItemCollected,
    isItemCollected,
    setSystemActive,
    getSystemActive,
    setSystemProgress,
    getSystemProgress,
    isFadeComplete,
    setFadeSpeed,
    setMusicFadeSpeed,
    getPlayerPosition,
    getCameraPosition,
    getLevelDimensions
  };
}

export default level1;