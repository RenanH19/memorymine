import MusicManager from "../../audio/MusicManager";
import mist from "../../maps/mist";

function level1(p5, sharedPlayer) {
  let player = sharedPlayer; // USA O PLAYER COMPARTILHADO
  let musicFile = '/assets/music/deepSound.mp3';
  let music = MusicManager(p5, musicFile);
  let mistInstance = new mist(p5, 800, 640);
  
  // Variáveis para o mapa
  let levelImage = null;
  let labFront = null; // Opcional: layer de objetos em cima
  let levelWidth = 800;
  let levelHeight = 640;
  let cameraX = 0;
  let cameraY = 0;
  
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

  // Variáveis para item coletável
  let itemArea = { x: 400, y: 300, radius: 30 }; // Posição do item no mapa
  let itemImage = null;
  let itemSound = null;
  let itemCollected = false;
  let xKeyPressedForItem = false;

  function loadLevel() {
    // Carrega a imagem do level1
    levelImage = p5.loadImage('/assets/level/LabDark.png', () => {
      console.log('Level1 map loaded successfully');
    }, (error) => {
      console.error('Failed to load level1 map:', error);
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
  }

  // Método para definir se o item foi coletado (usado na persistência)
  function setItemCollected(collected) {
    itemCollected = collected;
  }

  // Getter para verificar se o item foi coletado
  function isItemCollected() {
    return itemCollected;
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

    // Controle da câmera
    cameraX = p5.constrain(player.position.x - p5.width/2, 0, Math.max(0, levelWidth - p5.width));
    cameraY = p5.constrain(player.position.y - p5.height/2, 0, Math.max(0, levelHeight - p5.height));

    // Aplica transformação da câmera
    p5.translate(-cameraX, -cameraY);

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

  return {
    loadLevel,
    runLevel,
    stopLevel,
    startFadeIn,
    setItemCollected,
    isItemCollected,
    isFadeComplete,
    setFadeSpeed,
    setMusicFadeSpeed,
    getPlayerPosition,
    getCameraPosition,
    getLevelDimensions
  };
}

export default level1;