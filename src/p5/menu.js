import MusicManager from "./audio/MusicManager";

class Menu {
  constructor(p5) {
    this.p5 = p5;
    this.title = "Megálos";
    this.startButton = {
      x: 164,
      y: 259,
      width: 490, // 654 - 164
      height: 79, // 338 - 259
      text: "INICIAR JOGO"
    };
    this.titleFont = null;
    this.buttonFont = null;
    this.backgroundImage = null;
    this.hoverImage = null;
    this.menu2025Image = null; // Nova imagem
    this.showMenu = true;
    this.imageLoaded = false;
    this.hoverImageLoaded = false;
    this.menu2025ImageLoaded = false; // Flag para nova imagem
    this.hoverAlpha = 0; // Transparência para o efeito gradativo
    this.hoverSpeed = 0.08; // Velocidade da transição
    this.music = MusicManager(p5, '/assets/music/menuSong.mp3');
    
    // Easter egg 2025
    this.easterEgg = {
      x: this.p5.width - 80, // Canto inferior direito
      y: this.p5.height - 40,
      width: 60,
      height: 30,
      text: " Year: ????",
      revealed: false,
      clicked: false
    };
    this.menu2025Alpha = 0; // Transparência da imagem 2025
    this.menu2025Saturation = 0; // Saturação da imagem 2025
    this.menu2025Speed = 0.02; // Velocidade da transição
  }

  loadMenuAssets() {
    // Carrega a imagem do menu
    this.music.loadMusic();
    this.backgroundImage = this.p5.loadImage('/assets/menu.png', () => {
      this.imageLoaded = true;
      console.log('Menu image loaded successfully');
    }, (error) => {
      console.error('Failed to load menu image:', error);
    });

    // Carrega a imagem do hover
    this.hoverImage = this.p5.loadImage('/assets/menuClick.png', () => {
      this.hoverImageLoaded = true;
      console.log('Menu hover image loaded successfully');
    }, (error) => {
      console.error('Failed to load menu hover image:', error);
    });

    // Carrega a nova imagem 2025
    this.menu2025Image = this.p5.loadImage('/assets/menu2025.png', () => {
      this.menu2025ImageLoaded = true;
      console.log('Menu 2025 image loaded successfully');
    }, (error) => {
      console.error('Failed to load menu 2025 image:', error);
    });
  }

  drawMenu() {
    if (!this.showMenu) return false;
    if (this.p5.mouseIsPressed){
      this.music.setVolume(0.1); // Define o volume da música
      this.music.playMusic(); // Toca a música do menu
    }
    
    // Background principal
    if (this.imageLoaded && this.backgroundImage) {
      this.p5.image(this.backgroundImage, 0, 0, this.p5.width, this.p5.height);
    } else {
      this.p5.background(20, 25, 40);
    }

    // Verifica hover e atualiza alpha do botão principal
    const isHovering = this.isMouseOverButton();
    
    if (isHovering) {
      this.hoverAlpha = this.p5.lerp(this.hoverAlpha, 255, this.hoverSpeed);
    } else {
      this.hoverAlpha = this.p5.lerp(this.hoverAlpha, 0, this.hoverSpeed);
    }

    // Desenha a imagem de hover com transparência gradativa
    if (this.hoverImageLoaded && this.hoverImage && this.hoverAlpha > 1) {
      this.p5.tint(255, this.hoverAlpha);
      this.p5.image(this.hoverImage, 0, 0, this.p5.width, this.p5.height);
      this.p5.noTint(); // Remove o tint para próximos desenhos
    }

    // Desenha a imagem 2025 se foi clicada
    if (this.easterEgg.clicked && this.menu2025ImageLoaded && this.menu2025Image) {
      // Aumenta gradualmente a saturação e alpha
      this.menu2025Saturation = this.p5.lerp(this.menu2025Saturation, 100, this.menu2025Speed);
      this.menu2025Alpha = this.p5.lerp(this.menu2025Alpha, 255, this.menu2025Speed);
      
      // Aplica o efeito de saturação e transparência
      this.p5.tint(this.menu2025Saturation * 2.55, this.menu2025Alpha);
      this.p5.image(this.menu2025Image, 0, 0, this.p5.width, this.p5.height);
      this.p5.noTint();
    }

    // Desenha o easter egg no canto inferior direito
    this.drawEasterEgg();

    // Verifica cliques
    this.checkEasterEggClick();
    return this.checkButtonClick();
  }

  drawEasterEgg() {
    const egg = this.easterEgg;
    
    // Posiciona no canto inferior direito
    egg.x = this.p5.width - 80;
    egg.y = this.p5.height - 40;
    
    // Verifica hover no easter egg
    const isHoveringEgg = this.isMouseOverEasterEgg();
    
    // Cor do fundo do easter egg
    if (isHoveringEgg && !egg.clicked) {
      this.p5.fill(50, 50, 50, 100);
      this.p5.rect(egg.x - 5, egg.y - 5, egg.width + 10, egg.height + 10, 5);
    }
    
    // Texto do easter egg
    this.p5.fill(150, 150, 150);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(14);
    this.p5.textStyle(this.p5.NORMAL);
    
    const displayText = egg.revealed ? " Year: 2025" : egg.text;
    this.p5.text(displayText, egg.x + egg.width / 2, egg.y + egg.height / 2);
  }

  isMouseOverButton() {
    return this.p5.mouseX > 164 && 
           this.p5.mouseX < 654 &&
           this.p5.mouseY > 259 && 
           this.p5.mouseY < 338;
  }

  isMouseOverEasterEgg() {
    const egg = this.easterEgg;
    return this.p5.mouseX >= egg.x && 
           this.p5.mouseX <= egg.x + egg.width &&
           this.p5.mouseY >= egg.y && 
           this.p5.mouseY <= egg.y + egg.height;
  }

  checkEasterEggClick() {
    if (this.p5.mouseIsPressed && this.isMouseOverEasterEgg() && !this.easterEgg.clicked) {
      this.easterEgg.revealed = true;
      this.easterEgg.clicked = true;
      console.log('Easter egg ativado! Ano revelado: 2025');
    }
  }

  checkButtonClick() {
    if (this.p5.mouseIsPressed && this.isMouseOverButton()) {
      this.showMenu = false;
      this.music.stopMusic(); // Para a música do menu
      return true; // Indica que o jogo deve começar
    }
    return false;
  }

  hideMenu() {
    this.showMenu = false;
  }

  showMenuAgain() {
    this.showMenu = true;
    this.hoverAlpha = 0; // Reset do hover
    // Reset do easter egg se necessário
    // this.easterEgg.revealed = false;
    // this.easterEgg.clicked = false;
    // this.menu2025Alpha = 0;
    // this.menu2025Saturation = 0;
  }

  isMenuVisible() {
    return this.showMenu;
  }

  isImageLoaded() {
    return this.imageLoaded && this.hoverImageLoaded && this.menu2025ImageLoaded;
  }
}

export default Menu;