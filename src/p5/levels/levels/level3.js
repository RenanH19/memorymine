import MusicManager from "../../audio/MusicManager";
import Robot from "../../Robot";
import GameOverSequence from "../../GameOverSequence";

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

  // Variáveis para música e alarme de emergência
  let warnMusic = null; // Música de alerta
  let sirenSound = null; // Som de sirene
  let isEmergencyMode = false; // Flag para modo de emergência

  let redAlarmAlpha = 10; // Transparência do alarme vermelho
  let redAlarmDirection = 1; // Direção da pulsação (1 = aumentando, -1 = diminuindo)
  let redAlarmSpeed = 0.5; // Velocidade da pulsação
  let maxRedAlarmAlpha = 30; // Máxima intensidade do alarme (0-255)

  // Variáveis para robôs
  let robots = []; // Array de robôs
  let robotSpawnTimer = 0; // Timer para spawn das hordas
  let firstHordeSpawned = false; // Flag para primeira horda
  let secondHordeSpawned = false; // Flag para segunda horda

  // Posições das hordas
  const hordePositions = {
    first: [
      { x: 700, y: 780 }, // Horda 1 - posição 1
      { x: 700, y: 780 }, // Horda 1 - posição 2
      { x: 70, y: 780 },  // Horda 2 - posição 1
      { x: 70, y: 780 }   // Horda 2 - posição 2
    ],
    second: [
      { x: 70, y: 430 },  // Horda 3 - posição 1
      { x: 70, y: 430 },  // Horda 3 - posição 2
      { x: 700, y: 430 }, // Horda 4 - posição 1
      { x: 700, y: 430 }  // Horda 4 - posição 2
    ]
  };

  // ADICIONAR ESTAS VARIÁVEIS:
  let gameOverSequence = null;
  let terminalArea = { x: 420, y: 170, radius: 30 }; // Área do terminal
  let xKeyPressedForTerminal = false;
  let isGameOverActive = false;

  function loadLevel() {

    // ADICIONAR ESTAS LINHAS - Carrega a música de alerta:
    warnMusic = p5.loadSound('/assets/music/warn.mp3', () => {
      console.log('Warning music loaded successfully in Level3');
    }, (error) => {
      console.error('Failed to load warning music in Level3:', error);
    });

    // ADICIONAR ESTAS LINHAS - Carrega o som de sirene:
    sirenSound = p5.loadSound('/assets/sounds/siren.mp3', () => {
      console.log('Siren sound loaded successfully in Level3');
    }, (error) => {
      console.error('Failed to load siren sound in Level3:', error);
    });
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
    
    initializeRobotSystem();

    gameOverSequence = GameOverSequence(p5);
    gameOverSequence.loadAssets();

    music.loadMusic();

  }

  function checkTerminalInteraction() {
    const distance = p5.dist(player.position.x, player.position.y, terminalArea.x, terminalArea.y);
    const isInTerminalArea = distance < terminalArea.radius;

    if (p5.keyIsDown(88) && isInTerminalArea) { // Tecla X
      if (!xKeyPressedForTerminal) {
        xKeyPressedForTerminal = true;
        
        console.log('🔇 PARANDO TODOS OS SONS DO LEVEL3...');
        
        // Para música normal
        if (music) {
          music.stopMusic();
          console.log('🔇 Música normal parada');
        }
        
        // Para música de emergência
        if (warnMusic && warnMusic.isPlaying()) {
          warnMusic.stop();
          console.log('🔇 Música de alerta parada');
        }
        
        // Para sirene
        if (sirenSound && sirenSound.isPlaying()) {
          sirenSound.stop();
          console.log('🔇 Sirene parada');
        }
        
        // FORÇAR parada - tentar múltiplas vezes
        setTimeout(() => {
          if (warnMusic && warnMusic.isPlaying()) {
            warnMusic.stop();
            console.log('🔇 Música de alerta parada (segunda tentativa)');
          }
          
          if (sirenSound && sirenSound.isPlaying()) {
            sirenSound.stop();
            console.log('🔇 Sirene parada (segunda tentativa)');
          }
        }, 100);
        
        // Inicia a sequência de Game Over
        isGameOverActive = true;
        gameOverSequence.start(); // Isso vai iniciar a música de ending
        
        console.log('Terminal ativado! Iniciando sequência de Game Over...');
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressedForTerminal = false;
    }

    return isInTerminalArea;
  }

  function drawTerminalIndicator() {
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
    p5.text("Pressione 'X' para acessar terminal", p5.width / 2, textBoxY + textBoxHeight / 2);
    
    p5.pop();
  }

    // ADICIONAR ESTA NOVA FUNÇÃO - Inicializar sistema de robôs:
  function initializeRobotSystem() {
    robots = []; // Limpa array existente
    robotSpawnTimer = 0;
    firstHordeSpawned = false;
    secondHordeSpawned = false;
    
    console.log('Sistema de robôs inicializado no Level3');
  }

    // ADICIONAR ESTA NOVA FUNÇÃO - Criar uma horda de robôs:
  function createRobotHorde(positions) {
    positions.forEach((pos, index) => {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      
      const robot = new Robot(p5, pos.x + offsetX, pos.y + offsetY, levelWidth);
      
      // FORÇAR carregamento
      robot.loadSprites();
      
      // AGUARDAR um pouco e tentar novamente
      setTimeout(() => {
        robot.loadSprites();
        console.log('🤖 Segundo carregamento forçado para robô', index);
      }, 200);
      
      robot.setCollisionMap('/assets/sprites/player/secretRoomRoboCollision.png');
      robot.setSpeed(7);
      robot.setFollowRange(700);
      robot.setAttackRange(35);
      
      robots.push(robot);
      console.log(`Robô ${robots.length} criado na posição (${pos.x + offsetX}, ${pos.y + offsetY})`);
    });
  }

    // ADICIONAR ESTA NOVA FUNÇÃO - Atualizar sistema de spawn:
  function updateRobotSpawning() {
    robotSpawnTimer += 1/60; // Incrementa em segundos (assumindo 60 FPS)
    
    // Primeira horda após entrar no level3
    if (!firstHordeSpawned && robotSpawnTimer >= 1) { // 1 segundo após entrar
      console.log('Spawning primeira horda de robôs...');
      createRobotHorde(hordePositions.first);
      firstHordeSpawned = true;
    }
    
    // Segunda horda após 10 segundos
    if (!secondHordeSpawned && robotSpawnTimer >= 10) { // 10 segundos
      console.log('Spawning segunda horda de robôs...');
      createRobotHorde(hordePositions.second);
      secondHordeSpawned = true;
    }
  }

    // ADICIONAR ESTA NOVA FUNÇÃO - Atualizar robôs:
  function updateRobots() {
    robots.forEach(robot => {
      if (robot.isAlive()) {
        // Robô segue o player
        robot.followPlayer(player.position);
        robot.update();
        
        // Verifica colisão com player
        if (robot.checkPlayerCollision(player.position)) {
          // Player recebe dano
          if (player.takeDamage) {
            player.takeDamage(15); // 15 de dano no level3
          } else {
            console.log('Player recebeu dano do robô no Level3!');
          }
        }
      }
    });
  }

    // ADICIONAR ESTA NOVA FUNÇÃO - Desenhar robôs:
  function drawRobots() {
    robots.forEach(robot => {
      if (robot.isAlive()) {
        robot.display();
      }
    });
  }

    // ADICIONAR ESTA NOVA FUNÇÃO - Limpar robôs mortos:
  function cleanupRobots() {
    const aliveBefore = robots.length;
    robots = robots.filter(robot => robot.isAlive());
    const aliveAfter = robots.length;
    
    if (aliveBefore !== aliveAfter) {
      console.log(`${aliveBefore - aliveAfter} robôs removidos. Restam: ${aliveAfter}`);
    }
  }

    // ADICIONAR ESTA NOVA FUNÇÃO - Verificar se todos os robôs foram destruídos:
  function areAllRobotsDestroyed() {
    return robots.every(robot => !robot.isAlive());
  }

  function getEmergencyMode() {
    return isEmergencyMode;
  }

  function setEmergencyMode(active) {
    isEmergencyMode = active;
    
    if (active) {
      console.log('Modo de emergência ativado no Level3');
      
      // Para a música normal e ativa a música de emergência
      if (music) {
        music.stopMusic();
      }
      
      if (warnMusic && !warnMusic.isPlaying()) {
        warnMusic.loop();
        warnMusic.setVolume(0.1);
        console.log('Música de alerta iniciada no Level3');
      }
      
      if (sirenSound && !sirenSound.isPlaying()) {
        sirenSound.play();
        sirenSound.setVolume(0.3);
        console.log('Sirene ativada no Level3');
      }
    } else {
      // Para os sons de emergência se necessário
      if (warnMusic && warnMusic.isPlaying()) {
        warnMusic.stop();
      }
      
      if (sirenSound && sirenSound.isPlaying()) {
        sirenSound.stop();
      }
    }
  }

  function startFadeIn() {
    fadeInAlpha = 255;
    isFadingIn = true;
    musicVolume = 0;
    shouldExit = false;
    zKeyPressed = false;
    xKeyPressedForSecret = false;
    redAlarmAlpha = 0;
    redAlarmDirection = 1;
    // Mantém o estado dos itens coletados

    // ADICIONAR ESTA LINHA - Reset do sistema de robôs:
    initializeRobotSystem();
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
  // VERIFICAR GAME OVER SEQUENCE PRIMEIRO:
  if (isGameOverActive) {
    const sequenceComplete = gameOverSequence.update();
    gameOverSequence.display();
    
    if (sequenceComplete) {
      // Sequência terminou - retorna game over
      return { 
        exit: true, 
        gameOver: true,
        reason: 'megalus_day'
      };
    }
    
    // Enquanto sequência roda, não processa mais nada
    return { exit: false, gameOver: false };
  }

  // Verifica saída normal
  const exitData = checkExitArea();
  if (exitData.shouldExit) {
    return { exit: true, gameOver: false };
  }

  // Sistema de robôs:
  updateRobotSpawning();
  updateRobots();
  cleanupRobots();

  // Verificar interação com terminal:
  const isNearTerminal = checkTerminalInteraction();

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
    p5.background(20, 20, 40);
  }

  // Desenha o item secreto (antes do player)
  drawSecretItem();

  // Atualiza e desenha o player
  player.getPlayerSprites();
  player.update();
  player.display();

  // Desenhar robôs após o player:
  drawRobots();

  // Desenha objetos por cima (se existir)
  if (frontImage) {
    p5.image(frontImage, 0, 0, levelWidth, levelHeight);
  }

  // Fade in da música
  if (isEmergencyMode) {
    // Garante que os sons de emergência continuem tocando
    if (warnMusic && !warnMusic.isPlaying()) {
      warnMusic.loop();
      warnMusic.setVolume(0.1);
    }
    
    if (sirenSound && !sirenSound.isPlaying()) {
      sirenSound.play();
      sirenSound.setVolume(0.3);
    }
  } else {
    // Só toca música normal se NÃO estiver em modo de emergência
    if (musicVolume < targetMusicVolume) {
      musicVolume = p5.lerp(musicVolume, targetMusicVolume, musicFadeSpeed);
    }
    
    music.playMusic();
    music.setVolume(musicVolume);
  }

  // Reset da transformação para UI
  p5.resetMatrix();

  // Efeito de alarme vermelho:
  if (isEmergencyMode) {
    // Atualiza a pulsação do alarme vermelho
    redAlarmAlpha += redAlarmSpeed * redAlarmDirection;
    
    // Inverte a direção quando atinge os limites
    if (redAlarmAlpha >= maxRedAlarmAlpha) {
      redAlarmAlpha = maxRedAlarmAlpha;
      redAlarmDirection = -1;
    } else if (redAlarmAlpha <= 10) {
      redAlarmAlpha = 10;
      redAlarmDirection = 1;
    }
    
    // Desenha overlay vermelho pulsante
    p5.fill(255, 0, 0, redAlarmAlpha);
    p5.rect(0, 0, p5.width, p5.height);
  } else {
    // Reset do alarme quando não está em emergência
    redAlarmAlpha = 0;
    redAlarmDirection = 1;
  }

  // Desenha indicadores (prioridade: terminal > saída > item secreto):
  if (isNearTerminal && !isGameOverActive) {
    drawTerminalIndicator();
  } else if (exitData.isInExitArea) {
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

  return { exit: false, gameOver: false };
}

  function stopLevel() {
    if (music) {
      music.stopMusic();
    }
    
    // ADICIONAR ESTAS LINHAS - Para todos os sons de emergência:
    if (warnMusic && warnMusic.isPlaying()) {
      warnMusic.stop();
    }
    
    if (sirenSound && sirenSound.isPlaying()) {
      sirenSound.stop();
    }

      // ADICIONAR ESTA LINHA - Para a sequência de Game Over se estiver ativa:
    if (gameOverSequence && gameOverSequence.isSequenceActive()) {
      gameOverSequence.stop();
    }
    // ADICIONAR ESTA LINHA - Limpar robôs:
    robots = [];
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
    getEmergencyMode,    
    setEmergencyMode,
    isFadeComplete,
    setFadeSpeed,
    setMusicFadeSpeed,
    getPlayerPosition,
    getCameraPosition,
    getLevelDimensions
  };
}

export default level3;