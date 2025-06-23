// Crie este arquivo: src/p5/GameOverSequence.js

function GameOverSequence(p5) {
  let earthEndImage = null;
  let currentPhase = 'messages'; // 'messages', 'earth', 'alert', 'megalus', 'end'
  let messageIndex = 0;
  let phaseTimer = 0;
  let isActive = false;
  let fadeAlpha = 0;

  let endingMusic = null;
  
  // Efeito circular vermelho
  let circleRadius = 0;
  let maxCircleRadius = 500;
  let circleSpeed = 3;
  
  const messages = [
    "Ligando...",
    "GUERRA NUCLEAR TOTAL",
    "Dia de Megalus"
  ];
  
  function loadAssets() {
    earthEndImage = p5.loadImage('/assets/earthEnd.png', () => {
      console.log('Earth End image loaded successfully');
    }, (error) => {
      console.error('Failed to load Earth End image:', error);
    });

    endingMusic = p5.loadSound('/assets/music/ending.mp3', () => {
      console.log('Ending music loaded successfully');
      endingMusic.setVolume(0.3); // Volume da música de ending
    }, (error) => {
      console.error('Failed to load ending music:', error);
    });
  }
  
  function start() {
    isActive = true;
    currentPhase = 'messages';
    messageIndex = 0;
    phaseTimer = 0;
    fadeAlpha = 0;
    circleRadius = 0;
    console.log('Game Over Sequence iniciada');

    // ADICIONAR ESTAS LINHAS - Toca a música de ending:
    if (endingMusic && !endingMusic.isPlaying()) {
      endingMusic.loop(); // Toca em loop durante toda a sequência
      console.log('🎵 Música de ending iniciada');
    }
    
    console.log('Game Over Sequence iniciada');
  }
  
  function update() {
    if (!isActive) return false;
    
    phaseTimer += 1/60; // Incrementa em segundos
    
    switch(currentPhase) {
      case 'messages':
        // Fade in da mensagem
        if (fadeAlpha < 255) {
          fadeAlpha += 5;
        }
        
        // Avança para próxima mensagem após 3 segundos
        if (phaseTimer >= 3) {
          messageIndex++;
          phaseTimer = 0;
          fadeAlpha = 0;
          
          // Se acabaram as mensagens, vai para a imagem da Terra
          if (messageIndex >= messages.length) {
            currentPhase = 'earth';
            phaseTimer = 0;
            console.log('Transição para fase da Terra');
          }
        }
        break;
        
      case 'earth':
        // Fade in da imagem da Terra
        if (fadeAlpha < 255) {
          fadeAlpha += 5;
        }
        
        // Após 3 segundos, inicia o efeito de alerta
        if (phaseTimer >= 3) {
          currentPhase = 'alert';
          phaseTimer = 0;
          circleRadius = 0;
          console.log('Transição para fase de alerta');
        }
        break;
        
      case 'alert':
        // Efeito circular se expandindo
        circleRadius += circleSpeed;
        if (circleRadius > maxCircleRadius) {
          circleRadius = maxCircleRadius;
        }
        
        // Após 3 segundos, mostra "Dia de Megalus"
        if (phaseTimer >= 3) {
          currentPhase = 'megalus';
          phaseTimer = 0;
          console.log('Transição para fase Megalus');
        }
        break;
        
      case 'megalus':
        // Após 5 segundos, termina o jogo
        if (phaseTimer >= 5) {
          currentPhase = 'end';
          console.log('Game Over Sequence concluída');
          return true; // Retorna true quando acabou
        }
        break;
        
      case 'end':
        return true;
    }
    
    return false;
  }
  
  function display() {
    if (!isActive) return;
    
    // Fundo preto
    p5.push();
    p5.resetMatrix();
    p5.background(0);
    
    switch(currentPhase) {
      case 'messages':
        displayMessage();
        break;
        
      case 'earth':
        displayEarthImage();
        break;
        
      case 'alert':
        displayEarthImage();
        displayAlertEffect();
        break;
        
      case 'megalus':
        displayEarthImage();
        displayMegalusText();
        break;
        
      case 'end':
        // Tela preta final
        break;
    }
    
    p5.pop();
  }
  
  function displayMessage() {
    if (messageIndex < messages.length) {
      p5.fill(255, 255, 255, fadeAlpha);
      p5.noStroke();
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(48);
      p5.textStyle(p5.BOLD);
      p5.text(messages[messageIndex], p5.width / 2, p5.height / 2);
    }
  }
  
  function displayEarthImage() {
    if (earthEndImage) {
      p5.tint(255, fadeAlpha);
      p5.imageMode(p5.CENTER);
      p5.image(earthEndImage, p5.width / 2, p5.height / 2, 600, 600);
      p5.noTint();
      p5.imageMode(p5.CORNER);
    } else {
      // Fallback: círculo azul representando a Terra
      p5.fill(0, 100, 200, fadeAlpha);
      p5.noStroke();
      p5.ellipse(p5.width / 2, p5.height / 2, 300, 300);
    }
  }
  
  function displayAlertEffect() {
    // Efeito circular vermelho se expandindo
    p5.noFill();
    p5.stroke(255, 0, 0, 200);
    p5.strokeWeight(8);
    
    // Múltiplos círculos para efeito mais dramático
    for (let i = 0; i < 3; i++) {
      const radius = circleRadius - (i * 50);
      if (radius > 0) {
        const alpha = 200 - (i * 50);
        p5.stroke(255, 0, 0, alpha);
        p5.ellipse(p5.width / 2, p5.height / 2, radius, radius);
      }
    }
    
    // Texto "ALERT" piscando
    const alertAlpha = Math.abs(Math.sin(p5.millis() * 0.01)) * 255;
    p5.fill(255, 0, 0, alertAlpha);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(72);
    p5.textStyle(p5.BOLD);
    p5.text("ALERT", p5.width / 2, p5.height / 2 - 200);
  }
  
  function displayMegalusText() {
    // Texto "Dia de Megalus" com efeito dramático
    p5.fill(255, 0, 0, 255);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(64);
    p5.textStyle(p5.BOLD);
    
    // Efeito de sombra
    p5.fill(0, 0, 0, 200);
    p5.text("DIA DE MEGALUS", p5.width / 2 + 3, p5.height / 2 + 200 + 3);
    
    // Texto principal
    p5.fill(255, 0, 0, 255);
    p5.text("DIA DE MEGALUS", p5.width / 2, p5.height / 2 + 200);
  }
  
  function isSequenceActive() {
    return isActive;
  }
  
  function isSequenceComplete() {
    return currentPhase === 'end';
  }
  
  function stop() {
    isActive = false;
    currentPhase = 'messages';
    messageIndex = 0;
    phaseTimer = 0;
    // ADICIONAR ESTAS LINHAS - Para a música de ending:
    if (endingMusic && endingMusic.isPlaying()) {
      endingMusic.stop();
      console.log('🎵 Música de ending parada');
    }
    
    console.log('Game Over Sequence parada');
  }
  
  return {
    loadAssets,
    start,
    update,
    display,
    isSequenceActive,
    isSequenceComplete,
    stop
  };
}

export default GameOverSequence;