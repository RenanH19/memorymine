// Crie um novo arquivo: src/p5/sprites/Robot.js

class Robot {
  constructor(p5, x, y, mapSize = 1200) {
    this.p5 = p5;
    this.position = { x: x, y: y };
    this.targetPosition = { x: x, y: y };
    this.mapSize = mapSize;
    this.speed = 1.5; // Velocidade do robô (um pouco mais lenta que o player)
    
    // Sprites e animação
    this.sprites = {};
    this.currentDirection = 'down';
    this.isMoving = false;
    this.animationFrame = 0;
    this.animationSpeed = 8; // Frames por segundo da animação
    this.frameCount = 0;
    
    // Mapa de colisão
    this.collisionMap = null;
    this.collisionData = null;
    
    // Sistema de seguimento
    this.followRange = 300; // Distância máxima para seguir o player
    this.attackRange = 25; // Distância para causar dano
    this.lastAttackTime = 0;
    this.attackCooldown = 1000; // 1 segundo entre ataques
    
    // Estados do robô
    this.isActive = true;
    this.health = 100;
    
    // Cores para debug (opcional)
    this.debugMode = false;
  }

  loadSprites() {
    // Carrega a sprite sheet do robô
    this.spriteSheet = this.p5.loadImage('/assets/sprites/player/roboAnimation.png', () => {
      console.log('Robot sprite sheet loaded successfully');
      this.processSprites();
    }, (error) => {
      console.error('Failed to load robot sprite sheet:', error);
    });
  }

  processSprites() {
    if (!this.spriteSheet) return;
    
    const spriteWidth = 64;
    const spriteHeight = 64;
    const directions = ['down', 'left', 'right', 'up'];
    
    // Processa cada direção (4 linhas de 3 sprites cada)
    for (let row = 0; row < 4; row++) {
      const direction = directions[row];
      this.sprites[direction] = [];
      
      for (let col = 0; col < 3; col++) {
        const sprite = this.p5.createGraphics(spriteWidth, spriteHeight);
        sprite.copy(
          this.spriteSheet,
          col * spriteWidth, row * spriteHeight, // origem
          spriteWidth, spriteHeight, // tamanho origem
          0, 0, // destino
          spriteWidth, spriteHeight // tamanho destino
        );
        this.sprites[direction].push(sprite);
      }
    }
    
    console.log('Robot sprites processed:', this.sprites);
  }

  setCollisionMap(imagePath) {
    this.collisionMap = this.p5.loadImage(imagePath, () => {
      console.log('Robot collision map loaded');
      this.collisionMap.loadPixels();
      this.collisionData = this.collisionMap.pixels;
    }, (error) => {
      console.error('Failed to load robot collision map:', error);
    });
  }

  canMoveTo(x, y) {
    if (!this.collisionData) return true;
    
    // Verifica limites do mapa
    if (x < 32 || x > this.mapSize - 32 || y < 32 || y > this.mapSize - 32) {
      return false;
    }
    
    // Verifica colisão usando o mapa
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);
    
    if (mapX >= 0 && mapX < this.collisionMap.width && 
        mapY >= 0 && mapY < this.collisionMap.height) {
      
      const index = (mapY * this.collisionMap.width + mapX) * 4;
      const red = this.collisionData[index];
      
      // Se vermelho > 100, é uma área de colisão
      return red < 100;
    }
    
    return true;
  }

  followPlayer(playerPosition) {
    if (!this.isActive) return;
    
    const distance = this.p5.dist(
      this.position.x, this.position.y,
      playerPosition.x, playerPosition.y
    );
    
    // Só segue se estiver dentro do alcance
    if (distance > this.followRange) return;
    
    // Calcula direção para o player
    const dx = playerPosition.x - this.position.x;
    const dy = playerPosition.y - this.position.y;
    
    // Movimento sem diagonal - prioriza o eixo com maior diferença
    let newX = this.position.x;
    let newY = this.position.y;
    let direction = this.currentDirection;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Move horizontalmente
      if (dx > 0) {
        newX += this.speed;
        direction = 'right';
      } else {
        newX -= this.speed;
        direction = 'left';
      }
    } else {
      // Move verticalmente
      if (dy > 0) {
        newY += this.speed;
        direction = 'down';
      } else {
        newY -= this.speed;
        direction = 'up';
      }
    }
    
    // Verifica se pode mover para a nova posição
    if (this.canMoveTo(newX, newY)) {
      this.targetPosition.x = newX;
      this.targetPosition.y = newY;
      this.currentDirection = direction;
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }
  }

  checkPlayerCollision(playerPosition) {
    if (!this.isActive) return false;
    
    const distance = this.p5.dist(
      this.position.x, this.position.y,
      playerPosition.x, playerPosition.y
    );
    
    const currentTime = this.p5.millis();
    
    // Se está próximo e passou o cooldown, causa dano
    if (distance < this.attackRange && 
        currentTime - this.lastAttackTime > this.attackCooldown) {
      this.lastAttackTime = currentTime;
      console.log('Robô causou dano ao player!');
      return true; // Retorna true para indicar que causou dano
    }
    
    return false;
  }

  update() {
    if (!this.isActive) return;
    
    // Suaviza o movimento
    this.position.x = this.p5.lerp(this.position.x, this.targetPosition.x, 0.3);
    this.position.y = this.p5.lerp(this.position.y, this.targetPosition.y, 0.3);
    
    // Atualiza animação
    if (this.isMoving) {
      this.frameCount++;
      if (this.frameCount >= 60 / this.animationSpeed) {
        this.animationFrame = (this.animationFrame + 1) % 3;
        this.frameCount = 0;
      }
    } else {
      this.animationFrame = 1; // Frame parado (meio)
    }
  }

  display() {
    if (!this.isActive || !this.sprites[this.currentDirection]) return;
    
    this.p5.push();
    
    // Desenha o robô
    const currentSprite = this.sprites[this.currentDirection][this.animationFrame];
    if (currentSprite) {
      this.p5.imageMode(this.p5.CENTER);
      this.p5.image(currentSprite, this.position.x, this.position.y);
    }
    
    // Debug - mostra alcances (opcional)
    if (this.debugMode) {
      this.p5.noFill();
      this.p5.stroke(255, 0, 0, 100);
      this.p5.ellipse(this.position.x, this.position.y, this.attackRange * 2);
      this.p5.stroke(255, 255, 0, 100);
      this.p5.ellipse(this.position.x, this.position.y, this.followRange * 2);
    }
    
    this.p5.pop();
  }

  takeDamage(damage) {
    this.health -= damage;
    console.log(`Robô recebeu ${damage} de dano. Vida: ${this.health}`);
    
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.isActive = false;
    console.log('Robô destruído!');
  }

  // Métodos de utilidade
  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.targetPosition.x = x;
    this.targetPosition.y = y;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setFollowRange(range) {
    this.followRange = range;
  }

  setAttackRange(range) {
    this.attackRange = range;
  }

  setActive(active) {
    this.isActive = active;
  }

  isAlive() {
    return this.isActive && this.health > 0;
  }

  getPosition() {
    return { x: this.position.x, y: this.position.y };
  }

  enableDebug() {
    this.debugMode = true;
  }

  disableDebug() {
    this.debugMode = false;
  }
}

export default Robot;