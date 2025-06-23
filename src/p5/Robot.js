// Substitua TODO o conteúdo do Robot.js:

class Robot {
  constructor(p5, x, y, mapSize = 1200) {
    this.p5 = p5;
    this.position = { x: x, y: y };
    this.targetPosition = { x: x, y: y };
    this.mapSize = mapSize;
    this.speed = 2;
    
    this.currentDirection = 'down';
    this.isMoving = false;
    this.isActive = true;
    this.health = 100;
    
    // Sistema de seguimento
    this.followRange = 300;
    this.attackRange = 25;
    this.lastAttackTime = 0;
    this.attackCooldown = 1000;
    
    // SIMPLES: Apenas uma imagem
    this.robotImage = null;
    this.imageLoaded = false;
    
    // Carregar imagem diretamente
    this.loadRobotImage();
    
    console.log('🤖 Robot criado na posição:', x, y);
  }

  loadRobotImage() {
    this.robotImage = this.p5.loadImage('/assets/sprites/player/roboAnimation.png', 
      () => {
        this.imageLoaded = true;
        console.log('🤖 Robot imagem carregada com sucesso!');
      }, 
      (error) => {
        console.error('🤖 Erro ao carregar imagem do robot:', error);
      }
    );
  }

  followPlayer(playerPosition) {
    if (!this.isActive) return;
    
    const distance = this.p5.dist(
      this.position.x, this.position.y,
      playerPosition.x, playerPosition.y
    );
    
    if (distance > this.followRange) {
      this.isMoving = false;
      return;
    }
    
    const dx = playerPosition.x - this.position.x;
    const dy = playerPosition.y - this.position.y;
    
    let newX = this.position.x;
    let newY = this.position.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        newX += this.speed;
        this.currentDirection = 'right';
      } else {
        newX -= this.speed;
        this.currentDirection = 'left';
      }
    } else {
      if (dy > 0) {
        newY += this.speed;
        this.currentDirection = 'down';
      } else {
        newY -= this.speed;
        this.currentDirection = 'up';
      }
    }
    
    this.targetPosition.x = newX;
    this.targetPosition.y = newY;
    this.isMoving = true;
  }

  update() {
    if (!this.isActive) return;
    
    // Movimento suave
    this.position.x = this.p5.lerp(this.position.x, this.targetPosition.x, 0.3);
    this.position.y = this.p5.lerp(this.position.y, this.targetPosition.y, 0.3);
  }

  display() {
    if (!this.isActive) return;
    
    this.p5.push();
    
    if (this.imageLoaded && this.robotImage) {
      // DESENHA A IMAGEM DIRETAMENTE - pega apenas o primeiro sprite (64x64)
      this.p5.image(this.robotImage, this.position.x, this.position.y, 64, 64, 0, 0, 64, 64);
      console.log('🤖 Robot imagem desenhada na posição:', this.position.x, this.position.y);
    }
    
    this.p5.pop();
  }

  checkPlayerCollision(playerPosition) {
    if (!this.isActive) return false;
    
    const distance = this.p5.dist(
      this.position.x, this.position.y,
      playerPosition.x, playerPosition.y
    );
    
    if (distance < this.attackRange) {
      const currentTime = this.p5.millis();
      if (currentTime - this.lastAttackTime > this.attackCooldown) {
        this.lastAttackTime = currentTime;
        console.log('🤖 Robot causou dano ao player!');
        return true;
      }
    }
    
    return false;
  }

  // Métodos obrigatórios mas vazios
  loadSprites() { 
    console.log('🤖 loadSprites chamado (usando método direto)'); 
  }
  
  setCollisionMap() { 
    console.log('🤖 setCollisionMap chamado'); 
  }
  
  setSpeed(speed) { this.speed = speed; }
  setFollowRange(range) { this.followRange = range; }
  setAttackRange(range) { this.attackRange = range; }
  
  isAlive() { return this.isActive && this.health > 0; }
  
  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) this.destroy();
  }
  
  destroy() {
    this.isActive = false;
    console.log('🤖 Robot destruído!');
  }
}

export default Robot;