// Substitua TODO o GameOverSequence.js:

function GameOverSequence(p5) {
  let earthEndImage = null;
  let currentPhase = 'messages';
  let messageIndex = 0;
  let phaseTimer = 0;
  let isActive = false;
  let fadeAlpha = 0;
  let endingMusic = null;
  
  // Efeitos visuais melhorados
  let textFadeAlpha = 0;
  let textScale = 0.8;
  let glitchOffset = 0;
  let pulseIntensity = 0;
  
  // Sistema de círculos múltiplos para alerta
  let circleRadius = 0;
  let maxCircleRadius = 600;
  let circleSpeed = 4;
  let alertPulse = 0;
  let alertTextScale = 1;
  let alertGlow = 0;
  
  // Partículas de fundo para drama
  let particles = [];
  
  const messages = [
    "Ligando...",
    "Guerra Nuclear",
    "Dia de Megalus"
  ];
  
  // Inicializa partículas
  function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * p5.width,
        y: Math.random() * p5.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        alpha: Math.random() * 100 + 50,
        color: [255, Math.random() * 100, 0] // Tons de vermelho/laranja
      });
    }
  }
  
  function loadAssets() {
    earthEndImage = p5.loadImage('/assets/earthEnd.png', () => {
      console.log('Earth End image loaded successfully');
    }, (error) => {
      console.error('Failed to load Earth End image:', error);
    });
    
    endingMusic = p5.loadSound('/assets/music/ending.mp3', () => {
      console.log('Ending music loaded successfully');
      endingMusic.setVolume(0.4);
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
    textFadeAlpha = 0;
    textScale = 0.8;
    circleRadius = 0;
    alertPulse = 0;
    
    initParticles();
    
    if (endingMusic && !endingMusic.isPlaying()) {
      endingMusic.loop();
      console.log('🎵 Música de ending iniciada');
    }
    
    console.log('Game Over Sequence iniciada');
  }
  
  function update() {
    if (!isActive) return false;
    
    phaseTimer += 1/60;
    
    // Atualiza partículas
    updateParticles();
    
    switch(currentPhase) {
      case 'messages':
        updateMessagePhase();
        break;
        
      case 'earth':
        updateEarthPhase();
        break;
        
      case 'alert':
        updateAlertPhase();
        break;
        
      case 'megalus':
        updateMegalusPhase();
        break;
        
      case 'end':
        return true;
    }
    
    return false;
  }
  
  function updateMessagePhase() {
    // Fade in suave do texto
    if (textFadeAlpha < 255) {
      textFadeAlpha += 8;
    }
    
    // Escala do texto com efeito de "respiração"
    textScale = 0.9 + Math.sin(phaseTimer * 3) * 0.1;
    
    // Efeito de glitch sutil
    glitchOffset = Math.sin(phaseTimer * 20) * 2;
    
    // Pulso de intensidade
    pulseIntensity = Math.abs(Math.sin(phaseTimer * 2)) * 50;
    
    if (phaseTimer >= 3) {
      messageIndex++;
      phaseTimer = 0;
      textFadeAlpha = 0;
      
      if (messageIndex >= messages.length) {
        currentPhase = 'earth';
        phaseTimer = 0;
        fadeAlpha = 0;
        console.log('Transição para fase da Terra');
      }
    }
  }
  
  function updateEarthPhase() {
    if (fadeAlpha < 255) {
      fadeAlpha += 6;
    }
    
    if (phaseTimer >= 3) {
      currentPhase = 'alert';
      phaseTimer = 0;
      circleRadius = 0;
      console.log('Transição para fase de alerta');
    }
  }
  
  function updateAlertPhase() {
    // Círculos se expandindo
    circleRadius += circleSpeed;
    if (circleRadius > maxCircleRadius) {
      circleRadius = maxCircleRadius;
    }
    
    // Pulso do alerta
    alertPulse = Math.sin(phaseTimer * 8) * 30 + 30;
    alertTextScale = 1 + Math.sin(phaseTimer * 6) * 0.3;
    alertGlow = Math.abs(Math.sin(phaseTimer * 4)) * 100;
    
    if (phaseTimer >= 3) {
      currentPhase = 'megalus';
      phaseTimer = 0;
      console.log('Transição para fase Megalus');
    }
  }
  
  function updateMegalusPhase() {
    if (phaseTimer >= 5) {
      currentPhase = 'end';
      console.log('Game Over Sequence concluída');
      return true;
    }
  }
  
  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = p5.width;
      if (particle.x > p5.width) particle.x = 0;
      if (particle.y < 0) particle.y = p5.height;
      if (particle.y > p5.height) particle.y = 0;
      
      // Variação de alpha para brilho
      particle.alpha = 50 + Math.sin(phaseTimer * 3 + particle.x * 0.01) * 30;
    });
  }
  
  function display() {
    if (!isActive) return;
    
    p5.push();
    p5.resetMatrix();
    
    // Fundo preto com gradiente sutil
    drawBackground();
    
    // Desenha partículas de fundo
    drawParticles();
    
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
    }
    
    p5.pop();
  }
  
  function drawBackground() {
    // Gradiente radial escuro
    for (let r = p5.width; r > 0; r -= 10) {
      const alpha = p5.map(r, 0, p5.width, 255, 0);
      p5.fill(0, alpha * 0.1);
      p5.noStroke();
      p5.ellipse(p5.width/2, p5.height/2, r, r);
    }
    
    // Fundo base
    p5.fill(0);
    p5.rect(0, 0, p5.width, p5.height);
  }
  
  function drawParticles() {
    particles.forEach(particle => {
      p5.fill(particle.color[0], particle.color[1], particle.color[2], particle.alpha);
      p5.noStroke();
      p5.ellipse(particle.x, particle.y, particle.size, particle.size);
      
      // Glow effect
      p5.fill(particle.color[0], particle.color[1], particle.color[2], particle.alpha * 0.3);
      p5.ellipse(particle.x, particle.y, particle.size * 3, particle.size * 3);
    });
  }
  
  function displayMessage() {
    if (messageIndex < messages.length) {
      p5.push();
      
      // Sombra do texto
      p5.fill(0, 0, 0, textFadeAlpha * 0.8);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(52 * textScale);
      p5.textStyle(p5.BOLD);
      p5.text(messages[messageIndex], p5.width/2 + 4 + glitchOffset, p5.height/2 + 4);
      
      // Glow effect
      p5.fill(255, 255, 255, pulseIntensity);
      p5.textSize(56 * textScale);
      p5.text(messages[messageIndex], p5.width/2 + glitchOffset, p5.height/2);
      
      // Texto principal
      p5.fill(255, 255, 255, textFadeAlpha);
      p5.textSize(48 * textScale);
      p5.text(messages[messageIndex], p5.width/2 + glitchOffset, p5.height/2);
      
      // Efeito de digitação para "Ligando..."
      if (messageIndex === 0) {
        const dots = Math.floor(phaseTimer * 2) % 4;
        p5.fill(255, 255, 255, textFadeAlpha * 0.7);
        p5.textSize(36);
        p5.text('.'.repeat(dots), p5.width/2 + 80, p5.height/2 + 40);
      }
      
      p5.pop();
    }
  }
  
  function displayEarthImage() {
    p5.push();
    
    if (earthEndImage) {
      // Efeito de rotação lenta
      p5.translate(p5.width/2, p5.height/2);
      p5.rotate(phaseTimer * 0.1);
      
      // Glow da Terra
      p5.tint(255, 255, 255, fadeAlpha * 0.3);
      p5.image(earthEndImage, -350, -350, 700, 700);
      
      // Terra principal
      p5.tint(255, fadeAlpha);
      p5.image(earthEndImage, -300, -300, 600, 600);
      p5.noTint();
      
    } else {
      // Fallback melhorado
      p5.translate(p5.width/2, p5.height/2);
      
      // Glow azul
      p5.fill(0, 150, 255, fadeAlpha * 0.3);
      p5.noStroke();
      p5.ellipse(0, 0, 400, 400);
      
      // Terra
      p5.fill(0, 100, 200, fadeAlpha);
      p5.ellipse(0, 0, 300, 300);
      
      // Continentes simulados
      p5.fill(0, 200, 100, fadeAlpha * 0.8);
      p5.ellipse(-50, -30, 80, 60);
      p5.ellipse(40, 50, 100, 40);
    }
    
    p5.pop();
  }
  
  function displayAlertEffect() {
    p5.push();
    p5.translate(p5.width/2, p5.height/2);
    
    // Múltiplos círculos de alerta com diferentes velocidades
    for (let i = 0; i < 5; i++) {
      const radius = circleRadius - (i * 80);
      if (radius > 0) {
        const alpha = 255 - (i * 40);
        const strokeW = 12 - (i * 2);
        
        // Círculo principal
        p5.noFill();
        p5.stroke(255, 0, 0, alpha);
        p5.strokeWeight(strokeW);
        p5.ellipse(0, 0, radius, radius);
        
        // Círculo de glow
        p5.stroke(255, 100, 100, alpha * 0.5);
        p5.strokeWeight(strokeW * 2);
        p5.ellipse(0, 0, radius, radius);
      }
    }
    
    // Texto "ALERT" com efeitos dramáticos
    p5.resetMatrix();
    p5.translate(p5.width/2, p5.height/2 - 200);
    p5.scale(alertTextScale);
    
    // Sombra múltipla do ALERT
    for (let i = 5; i > 0; i--) {
      p5.fill(0, 0, 0, 50);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(84);
      p5.textStyle(p5.BOLD);
      p5.text("ALERT", i * 2, i * 2);
    }
    
    // Glow do ALERT
    p5.fill(255, 0, 0, alertGlow);
    p5.textSize(92);
    p5.text("ALERT", 0, 0);
    
    // Texto principal ALERT
    p5.fill(255, 0, 0, 255);
    p5.textSize(80);
    p5.text("ALERT", 0, 0);
    
    // Efeito de scan lines
    p5.resetMatrix();
    for (let y = 0; y < p5.height; y += 4) {
      p5.stroke(255, 0, 0, 30);
      p5.strokeWeight(1);
      p5.line(0, y, p5.width, y);
    }
    
    p5.pop();
  }
  
  function displayMegalusText() {
    p5.push();
    
    // Efeito de tremor da tela
    const shake = Math.sin(phaseTimer * 20) * 3;
    p5.translate(shake, shake);
    
    // Texto com múltiplas sombras para profundidade
    for (let i = 8; i > 0; i--) {
      p5.fill(0, 0, 0, 100 - (i * 10));
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(72);
      p5.textStyle(p5.BOLD);
      p5.text("DIA DE MEGALUS", p5.width/2 + i, p5.height/2 + 200 + i);
    }
    
    // Glow vermelho intenso
    p5.fill(255, 0, 0, 150);
    p5.textSize(76);
    p5.text("DIA DE MEGALUS", p5.width/2, p5.height/2 + 200);
    
    // Texto principal
    p5.fill(255, 255, 255, 255);
    p5.textSize(68);
    p5.text("DIA DE MEGALUS", p5.width/2, p5.height/2 + 200);
    
    // Efeito de distorção na tela
    p5.noFill();
    p5.stroke(255, 0, 0, 100);
    p5.strokeWeight(2);
    for (let i = 0; i < 20; i++) {
      const y = Math.random() * p5.height;
      const offset = Math.sin(phaseTimer * 10 + i) * 10;
      p5.line(0, y, p5.width, y + offset);
    }
    
    p5.pop();
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
    particles = [];
    
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