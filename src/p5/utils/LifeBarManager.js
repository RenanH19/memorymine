class LifeBarManager {
  constructor(p5) {
    this.p5 = p5;
    this.maxLife = 100;
    this.currentLife = 100;
    this.lifeBarFullImage = null;
    this.lifeBarEmptyImage = null;
    this.isLoaded = false;
  }

  loadLifeBar() {
    // Carrega a imagem da barra de vida cheia
    this.lifeBarFullImage = this.p5.loadImage('/assets/sprites/player/lifeBarFull.png', () => {
      console.log('LifeBar Full image loaded successfully');
      this.checkIfAllLoaded();
    }, (error) => {
      console.error('Failed to load lifeBarFull image:', error);
    });

    // Carrega a imagem da barra de vida vazia
    this.lifeBarEmptyImage = this.p5.loadImage('/assets/sprites/player/lifeBarEmpty.png', () => {
      console.log('LifeBar Empty image loaded successfully');
      this.checkIfAllLoaded();
    }, (error) => {
      console.error('Failed to load lifeBarEmpty image:', error);
    });
  }

  checkIfAllLoaded() {
    if (this.lifeBarFullImage && this.lifeBarEmptyImage) {
      this.isLoaded = true;
      console.log('LifeBar Manager fully loaded');
    }
  }

  // Define a vida atual (0-100)
  setLife(life) {
    this.currentLife = this.p5.constrain(life, 0, this.maxLife);
  }

  // Adiciona vida
  addLife(amount) {
    this.currentLife = this.p5.constrain(this.currentLife + amount, 0, this.maxLife);
  }

  // Remove vida
  removeLife(amount) {
    this.currentLife = this.p5.constrain(this.currentLife - amount, 0, this.maxLife);
  }

  // Getter para vida atual
  getCurrentLife() {
    return this.currentLife;
  }

  // Getter para vida máxima
  getMaxLife() {
    return this.maxLife;
  }

  // Getter para porcentagem de vida
  getLifePercentage() {
    return (this.currentLife / this.maxLife) * 100;
  }

  // Verifica se está com vida baixa (menos de 25%)
  isLowLife() {
    return this.getLifePercentage() < 25;
  }

  // Verifica se está morto
  isDead() {
    return this.currentLife <= 0;
  }

  // Desenha a barra de vida em uma posição específica
  drawLifeBar(x, y, width, height) {
    if (!this.isLoaded) return;

    this.p5.push();

    // Desenha a barra vazia (fundo)
    this.p5.image(this.lifeBarEmptyImage, x, y, width, height);

    // Calcula a largura da barra cheia baseado na vida atual
    const lifeWidth = (this.currentLife / this.maxLife) * width;

    if (lifeWidth > 0) {
      // Recorta a imagem da barra cheia para mostrar apenas a porção da vida atual
      const sx = 0; // Início do recorte na imagem fonte
      const sy = 0;
      const sw = (this.currentLife / this.maxLife) * this.lifeBarFullImage.width; // Largura do recorte
      const sh = this.lifeBarFullImage.height; // Altura do recorte

      // Desenha a parte cheia recortada
      this.p5.image(
        this.lifeBarFullImage,
        x, y, lifeWidth, height, // Destino
        sx, sy, sw, sh // Fonte (recortada)
      );
    }

    // Efeito de pulsação quando vida baixa
    if (this.isLowLife() && this.currentLife > 0) {
      const pulse = Math.sin(this.p5.millis() * 0.01) * 0.3 + 0.7;
      this.p5.fill(255, 0, 0, 100 * pulse);
      this.p5.rect(x, y, width, height);
    }

    this.p5.pop();
  }

  // Desenha texto com informações de vida (opcional)
  drawLifeText(x, y) {
    this.p5.push();
    this.p5.fill(255);
    this.p5.stroke(0);
    this.p5.strokeWeight(1);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(12);
    this.p5.textStyle(this.p5.BOLD);
    this.p5.text(`${Math.round(this.currentLife)}/${this.maxLife}`, x, y);
    this.p5.pop();
  }

  // Salva o estado da vida
  saveLifeState() {
    return {
      currentLife: this.currentLife,
      maxLife: this.maxLife
    };
  }

  // Restaura o estado da vida
  restoreLifeState(savedState) {
    this.currentLife = savedState.currentLife || this.maxLife;
    this.maxLife = savedState.maxLife || 100;
  }
}

export default LifeBarManager;