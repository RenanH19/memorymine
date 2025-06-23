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
  let labLightFront = null; // Opcional: layer de objetos em cima (claro)
  let levelWidth = 800;
  let levelHeight = 640;
  let cameraX = 0;
  let cameraY = 0;
  let darkness = 255;
  mistInstance.updateDarkness(darkness);
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
  let itemArea = { x: 280, y: 400, radius: 30 }; // Posição do item no mapa
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

  // Variáveis para acesso ao level3
  let level3Area = { x: 540, y: 350, radius: 40 }; // Área de acesso ao level3
  let xKeyPressedForLevel3 = false;
  let shouldEnterLevel3 = false;
  let onSystemActivated = null; // Callback para quando o sistema for ativado

  // Variáveis para ativação do sistema com delay
  let isActivatingSystem = false; // Flag para indicar que está ativando
  let activationStartTime = 0; // Tempo de início da ativação
  let activationDuration = 1500; // 1.5 segundos em milissegundos
  let blinkSpeed = 200; // Velocidade da piscada em milissegundos
  let activationSound = null; // Som de ativação do sistema

  // Variáveis para música e alarme de emergência
  let warnMusic = null; // Música de alerta
  let sirenSound = null; // Som de sirene
  let isEmergencyMode = false; // Flag para modo de emergência

  let redAlarmAlpha = 10; // Transparência do alarme vermelho
  let redAlarmDirection = 1; // Direção da pulsação (1 = aumentando, -1 = diminuindo)
  let redAlarmSpeed = 0.5; // Velocidade da pulsação
  let maxRedAlarmAlpha = 30; // Máxima intensidade do alarme (0-255)

  // Adicione essas variáveis após as outras variáveis:
  let robots = []; // Array de robôs
  let maxRobots = 2; // Número máximo de robôs

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

    // Opcional: layer de árvores/objetos por cima
    labLightFront = p5.loadImage('/assets/level/LabLightFront.png', () => {
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

    // ADICIONAR ESTAS LINHAS - Carrega o som de ativação do sistema:
    activationSound = p5.loadSound('/assets/sounds/typing.mp3', () => {
      console.log('System activation sound loaded successfully');
    }, (error) => {
      console.error('Failed to load system activation sound:', error);
    });

      // ADICIONAR ESTAS LINHAS - Carrega a música de alerta:
    warnMusic = p5.loadSound('/assets/music/warn.mp3', () => {
      console.log('Warning music loaded successfully');
    }, (error) => {
      console.error('Failed to load warning music:', error);
    });

    // ADICIONAR ESTAS LINHAS - Carrega o som de sirene:
    sirenSound = p5.loadSound('/assets/sounds/siren.mp3', () => {
      console.log('Siren sound loaded successfully');
    }, (error) => {
      console.error('Failed to load siren sound:', error);
    });
      
    
    music.loadMusic();
    mistInstance.loadMist();
  }

  function startFadeIn() {
    fadeInAlpha = 255;
    isFadingIn = true;
    musicVolume = 0;
    shouldExit = false;
    shouldEnterLevel3 = false;
    zKeyPressed = false;
    xKeyPressedForLevel3 = false;
    xKeyPressedForItem = false;
    xKeyPressedForSystem = false;
    showSystemMessage = false;
    showKeyMessage = false;
    isActivatingSystem = false;
    redAlarmAlpha = 0;
    redAlarmDirection = 1;
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
    isActivatingSystem = false; // Reset do estado de ativação
    
    if (active) {
      darknessLight = 0; // Se o sistema já está ativo, clarear imediatamente
      systemMessageStep = 3; // Marca como completamente ativo
      if (mistInstance && mistInstance.updateDarkness) {
        mistInstance.updateDarkness(darknessLight);
        mistInstance.updateFadeMist(0);
      }
    }
  }

  function checkSystemBarrier() {
    if (!isSystemActive && !isActivatingSystem && player.position.y < 370) {
      // Força o player a voltar para y = 370
      player.position.y = 370;
      player.targetPosition.y = 370;
      console.log('Área bloqueada - Sistema não ativado');
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
            // Segunda mensagem: abre o inventário para usar a chave
            showSystemMessage = false;
            showKeyMessage = false;
            
            // Abre o inventário do player
            if (!player.isInventoryOpen() && !player.isLifeInventoryOpen()) {
              player.inventoryVisible = true;
              console.log('Inventário aberto para usar a chave no sistema');
              
              // Toca o som de abrir inventário se disponível
              if (player.navInventorySound) {
                player.navInventorySound.play();
              }
            }
            
            systemMessageStep = 2; // Marca que mostrou a segunda parte
          } else if (systemMessageStep === 2) {
            // Reset para voltar ao início se ainda não ativou o sistema
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

    // Nova função para verificar se o sistema deve ser ativado quando usa um item
    function checkSystemActivation() {
      // Verifica se o player está na área do sistema e se tem uma chave sendo usada
      const distance = p5.dist(player.position.x, player.position.y, systemArea.x, systemArea.y);
      const isInSystemArea = distance < systemArea.radius;
      
      if (isInSystemArea && systemMessageStep >= 1 && !isSystemActive && !isActivatingSystem) {
        // Verifica se o player tem e está usando uma chave
        const hasKey = player.hasItem('key');
        
        if (hasKey) {
          // Ativa o sistema
          isActivatingSystem = true;
          activationStartTime = p5.millis();
          systemMessageStep = 3;
          showKeyMessage = false;
          showSystemMessage = false;
          
          console.log('Ativando o sistema do laboratório...');

          // ADICIONAR ESTA LINHA - Notifica que o sistema foi ativado
          if (activationSound) {
          activationSound.play();
          }
          
          // Fecha o inventário automaticamente
          player.inventoryVisible = false;
          player.lifeInventoryVisible = false;
          
          return true;
        }
      }
      
      return false;
    }

    // ADICIONAR ESTA NOVA FUNÇÃO - Controla o processo de ativação:
  // Versão alternativa com transição ainda mais suave:
function updateSystemActivation() {
  if (!isActivatingSystem) return;

  const currentTime = p5.millis();
  const elapsedTime = currentTime - activationStartTime;
  
  if (elapsedTime < activationDuration) {
    // Cria uma oscilação suave baseada em múltiplas ondas
    const progress = elapsedTime / activationDuration; // 0 a 1
    
    // Combina diferentes frequências de noise para efeito mais natural
    const time = currentTime * 0.005;
    const mainWave = p5.noise(time) * 0.6;
    const detailWave = p5.noise(time * 2.5) * 0.3;
    const flickerWave = p5.noise(time * 8) * 0.1;
    
    const combinedWave = mainWave + detailWave + flickerWave;
    
    // Mapeia para valores de escuridão (mais suave)
    darknessLight = p5.map(combinedWave, 0, 1, 120, 60);
    
    // Adiciona uma progressão gradual - sistema fica mais estável com o tempo
    const stabilityFactor = 1 - progress; // Mais instável no início
    const instability = p5.map(stabilityFactor, 0, 1, 10, 100);
    darknessLight += p5.random(-instability, instability);
    
    // Limita os valores
    darknessLight = p5.constrain(darknessLight, 0, 255);
    
    // Atualiza a névoa com o valor atual
    if (mistInstance && mistInstance.updateDarkness) {
      mistInstance.updateDarkness(darknessLight);
    }
    
  } else {
    // Ativação completa: sistema definitivamente ativo
    isActivatingSystem = false;
    isSystemActive = true;
    isEmergencyMode = true; // ATIVAR MODO DE EMERGÊNCIA
    darknessLight = 0; // Força para totalmente claro
    
    console.log('Sistema ativado! Laboratório iluminado.');

    // ADICIONAR ESTAS LINHAS - Muda para música de alerta e toca sirene:
    if (music) {
      music.stopMusic(); // Para a música anterior
    }
    
    if (warnMusic) {
      warnMusic.loop(); // Toca a música de alerta em loop
      warnMusic.setVolume(0.1);
      console.log('Música de alerta iniciada');
    }
    
    if (sirenSound) {
      sirenSound.play(); // Toca a sirene em loop
      sirenSound.setVolume(0.3);
      console.log('Sirene de emergência ativada');
    }

    // Notifica que o sistema foi ativado
    if (onSystemActivated) {
      onSystemActivated();
    }
    
    // Atualiza a névoa final
    if (mistInstance && mistInstance.updateDarkness) {
      mistInstance.updateDarkness(darknessLight);
      mistInstance.updateFadeMist(0);
    }
  }
}

    function getEmergencyMode() {
      return isEmergencyMode;
  }

  function setEmergencyMode(active) {
    isEmergencyMode = active;
    
    if (active) {
      // Ativa modo de emergência
      if (music) {
        music.stopMusic();
      }
      
      if (warnMusic && !warnMusic.isPlaying()) {
        warnMusic.loop();
        warnMusic.setVolume(0.1);
      }
      
      if (sirenSound && !sirenSound.isPlaying()) {
        sirenSound.play();
        sirenSound.setVolume(0.3);
      }
    }
  }

    // Modifique a função updateSystemTransition para não interferir durante a ativação:
  function updateSystemTransition() {
    // Só faz a transição suave se NÃO estiver no processo de ativação
    if (isSystemActive && !isActivatingSystem && darknessLight > 0) {
      // Transição suave para clarear (só para casos onde o sistema já estava ativo)
      darknessLight = p5.lerp(darknessLight, 0, 0.02);
      
      if (darknessLight < 1) {
        darknessLight = 0;
      }
      
      // Atualiza a escuridão na névoa
      if (mistInstance && mistInstance.updateDarkness) {
        mistInstance.updateDarkness(darknessLight);
        mistInstance.updateFadeMist(0);
      }
    }
  }

  // ADICIONAR ESTA NOVA FUNÇÃO - Verifica acesso ao level3:
  function checkLevel3Access() {
    const distance = p5.dist(player.position.x, player.position.y, level3Area.x, level3Area.y);
    const isInLevel3Area = distance < level3Area.radius;

    if (p5.keyIsDown(88) && isInLevel3Area) { // Tecla X
      if (!xKeyPressedForLevel3) {
        xKeyPressedForLevel3 = true;

        if (isSystemActive) {
          shouldEnterLevel3 = true;
          console.log('Entrando no Level 3...');
          
          if (music) {
            music.stopMusic();
          }
        } else {
          console.log('Área bloqueada. Sistema do laboratório não foi ativado.');
        }
      }
    } else if (!p5.keyIsDown(88)) {
      xKeyPressedForLevel3 = false;
    }

    return { 
      shouldEnterLevel3, 
      isInLevel3Area, 
      hasAccess: isSystemActive 
    };
  }

  // ADICIONAR ESTA NOVA FUNÇÃO - Desenha indicador do level3:
  function drawLevel3AccessIndicator(hasAccess) {
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
    
    if (hasAccess) {
      p5.text("Pressione 'X' para entrar", p5.width / 2, textBoxY + textBoxHeight / 2);
    } else {
      p5.text("Área bloqueada - sem energia", p5.width / 2, textBoxY + textBoxHeight / 2);
    }
    
    p5.pop();
  }

  // ADICIONAR ESTA NOVA FUNÇÃO - Desenha indicador visual da área level3:
  function drawLevel3AreaIndicator() {
    if (!isSystemActive) return; // Só mostra se o sistema foi ativado

    p5.push();
    
    // Efeito de pulsação mais sutil
    const pulseScale = 0.8 + Math.sin(p5.millis() * 0.008) * 0.3;
    const pulseAlpha = 150 + Math.sin(p5.millis() * 0.006) * 100;
    
    p5.translate(level3Area.x, level3Area.y);
    p5.scale(pulseScale);
    
    // Estrela pequena brilhante - ponto central
    p5.fill(255, 255, 255, pulseAlpha);
    p5.noStroke();
    p5.ellipse(0, 0, 4, 4);
    
    // Raios da estrela
    p5.stroke(0, 255, 255, pulseAlpha * 0.8);
    p5.strokeWeight(1);
    
    // 4 raios principais (cruz)
    p5.line(-6, 0, 6, 0);   // horizontal
    p5.line(0, -6, 0, 6);   // vertical
    p5.line(-4, -4, 4, 4);  // diagonal \
    p5.line(-4, 4, 4, -4);  // diagonal /
    
    // Brilho sutil ao redor
    p5.noStroke();
    p5.fill(0, 255, 255, pulseAlpha * 0.3);
    p5.ellipse(0, 0, 12, 12);
    
    p5.pop();
  }

  // ADICIONAR ESTA NOVA FUNÇÃO - Para registrar callback:
  function setSystemActivatedCallback(callback) {
    onSystemActivated = callback;
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

  // Modifica a função drawSystemIndicator para mostrar uma mensagem diferente
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
    
    if (isActivatingSystem) {
      // ADICIONAR ESTA MENSAGEM durante a ativação:
      p5.text("Ativando sistema...", p5.width / 2, textBoxY + textBoxHeight / 2);
    } else if (showSystemMessage) {
      p5.text("Sistema fora de operação", p5.width / 2, textBoxY + textBoxHeight / 2);
    } else if (showKeyMessage) {
      p5.text("Use uma chave do inventário para ativar", p5.width / 2, textBoxY + textBoxHeight / 2);
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
    
    // Ícone do sistema (opcional)
    p5.fill(255, 255, 255, 200);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(16);
    p5.text("⚡", 0, 10);
    
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
        
        if (isEmergencyMode) {
            console.log('SAÍDA BLOQUEADA - Modo de emergência ativo!');
            return { shouldExit: false, isInExitArea, isBlocked: true };
          } else {
            shouldExit = true;
            console.log('Saindo do Level 1...');
            
            if (music) {
              music.stopMusic();
            }
          }
        }
      } else if (!p5.keyIsDown(90)) {
        zKeyPressed = false;
      }

    return { shouldExit, isInExitArea, isBlocked: isEmergencyMode };
  }

  function drawExitIndicator(isBlocked = false) {
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
    
    if (isBlocked) {
      // NOVA MENSAGEM para modo de emergência:
      p5.fill(255, 100, 100, 200); // Vermelho para indicar bloqueio
      p5.text("SAÍDA BLOQUEADA - EMERGÊNCIA ATIVA", p5.width / 2, textBoxY + textBoxHeight / 2);
    } else {
      p5.text("Pressione 'Z' para voltar ao mundo", p5.width / 2, textBoxY + textBoxHeight / 2);
    }
    
    p5.pop();
  }

  function runLevel() {
  // Verifica saída
    const exitData = checkExitArea();
    if (exitData.shouldExit) {
      return { exit: true, destination: 'world' }; // ESPECIFICAR DESTINO EXPLÍCITO
    }

      // MODIFICAR ESTA PARTE - Verifica acesso ao level3:
    const level3Data = checkLevel3Access();
      if (level3Data.shouldEnterLevel3) {
      return { exit: true, destination: 'level3' }; // MANTER O DESTINATION
    }

    // Verifica coleta do item
    const isNearItem = checkItemCollection();

    // Verifica interação com o sistema
    const isNearSystem = checkSystemInteraction();

    // ADICIONAR ESTA LINHA - Atualiza o processo de ativação:
    updateSystemActivation();

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

    // ADICIONAR ESTA LINHA - Desenha o indicador da área do level3:
    drawLevel3AreaIndicator();

    // Atualiza e desenha o player
    player.getPlayerSprites();
    player.update();
    player.display();

    checkSystemBarrier();
    // Desenha objetos por cima (se existir)
    if (isSystemActive) {
      if (labLightFront) {
        p5.image(labLightFront, 0, 0, levelWidth, levelHeight);
      }
    } else {
      if (labFront) {
        p5.image(labFront, 0, 0, levelWidth, levelHeight);
      }
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

    // Desenha indicadores (AGORA level3Data JÁ FOI DECLARADO)
    if (exitData.isInExitArea) {
      drawExitIndicator(exitData.isBlocked);
    } else if (level3Data.isInLevel3Area) {
      drawLevel3AccessIndicator(level3Data.hasAccess);
    } else if (isActivatingSystem) {
      drawSystemIndicator();
    } else if (isNearSystem && (showSystemMessage || (systemMessageStep === 2 && !isSystemActive))) {
      if (systemMessageStep === 2) {
        showKeyMessage = true;
        drawSystemIndicator();
      } else {
        drawSystemIndicator();
      }
    } else if (isNearItem && !itemCollected) {
      drawItemIndicator();
    }

    // Desenha o itemBox no canto da tela quando perto do sistema
    drawItemBoxIndicator(isNearSystem);

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

  function initializePlayer() {
    // Registra o callback para quando uma chave for usada
    player.setKeyUsedCallback((item) => {
      console.log('Player usou um item:', item);
      
      // Verifica se é uma chave/livro e se está na área do sistema
      if ((item.type === 'key' || item.type === 'book') && systemMessageStep >= 2) {
        const distance = p5.dist(player.position.x, player.position.y, systemArea.x, systemArea.y);
        const isInSystemArea = distance < systemArea.radius;
        
        if (isInSystemArea) {
          console.log('Chave usada na área do sistema! Ativando...');
          checkSystemActivation();
        } else {
          console.log('Chave usada fora da área do sistema');
        }
      }
    });
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
    initializePlayer,
    setItemCollected,
    isItemCollected,
    setSystemActive,
    getSystemActive,
    setSystemProgress,
    getSystemProgress,
    setSystemActivatedCallback,
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

export default level1;