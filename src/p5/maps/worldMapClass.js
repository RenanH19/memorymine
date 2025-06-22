import MusicManager from "../audio/MusicManager";

class worldMap{
  constructor(p5, player, mist){
    this.p5 = p5;
    this.player = player;
    this.worldMapImage = '/assets/worldMap.png'; // Caminho para a imagem do mapa do mundo
    this.worldwidth = 1024;
    this.worldHeight = 1024;
    this.cameraX = 0;
    this.cameraY = 0;
    this.mist = mist; // Inicializa a névoa
    this.music = MusicManager(p5, '/assets/music/worldMap.mp3');
    this.yearBoxImage = null; // Nova variável para a yearBox
    
    // Variáveis para fade in
    this.fadeInAlpha = 255; // Começa totalmente preto
    this.fadeInSpeed = 2; // Velocidade do fade in
    this.isFadingIn = true;
    this.musicVolume = 0; // Volume inicial da música
    this.targetMusicVolume = 0.1; // Volume alvo
    this.musicFadeSpeed = 0.005; // Velocidade do fade in da música
  }

  loadWorldMap(){
    this.worldMapImage = this.p5.loadImage(this.worldMapImage, () => {
      console.log('World map loaded successfully');
    }, (err) => {
      console.error('Error loading world map:', err);
    });

    // Carrega a imagem da yearBox
    this.yearBoxImage = this.p5.loadImage('/assets/fonts/yearBox.png', () => {
      console.log('YearBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load yearBox image:', error);
    });

    this.player.loadPlayer(); // Carrega o jogador

    if (this.mist) {
      this.mist.loadMist(); // Carrega a névoa, se estiver definida
    }
    this.music.loadMusic();
  }

  startFadeIn() {
    // Método para reiniciar o fade in (útil para transições)
    this.fadeInAlpha = 255;
    this.isFadingIn = true;
    this.musicVolume = 0;
  }

  drawYearBox() {
    // Salva a matriz atual
    this.p5.push();
    
    // Reset da transformação para desenhar na tela
    this.p5.resetMatrix();
    
    // Dimensões e posição da yearBox (canto inferior direito)
    const yearBoxWidth = 150;
    const yearBoxHeight = 60;
    const yearBoxX = this.p5.width - yearBoxWidth; // Colado na direita
    const yearBoxY = this.p5.height - yearBoxHeight; // Colado na parte inferior
    
    // Desenha a yearBox como fundo
    if (this.yearBoxImage) {
      this.p5.image(this.yearBoxImage, yearBoxX, yearBoxY, yearBoxWidth, yearBoxHeight);
    }
    
    // Configuração da fonte para aparência de ruína/destruição
    this.p5.fill(139, 69, 19); // Cor marrom terroso/ferrugem
    this.p5.stroke(101, 67, 33); // Contorno mais escuro
    this.p5.strokeWeight(1);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(14);
    this.p5.textStyle(this.p5.BOLD);
    
    // Efeito de texto deteriorado/irregular
    const text = "Ano: ????";
    const textX = yearBoxX + yearBoxWidth / 2;
    const textY = yearBoxY + yearBoxHeight / 2;
    
    // Desenha texto com efeito de sombra para aparência desgastada
    this.p5.fill(0, 0, 0, 100); // Sombra
    this.p5.noStroke();
    this.p5.text(text, textX + 1, textY + 1);
    
    // Texto principal
    this.p5.fill(139, 69, 19); // Cor ferrugem
    this.p5.stroke(101, 67, 33);
    this.p5.strokeWeight(0.5);
    this.p5.text(text, textX, textY);

    // Aplica efeito de névoa no texto se disponível
    if (this.mist) {
      // Cria uma versão simplificada da névoa para a área do texto
      this.p5.push();
      
      // Define área de clipping para a yearBox
      this.p5.drawingContext.save();
      this.p5.drawingContext.beginPath();
      this.p5.drawingContext.rect(yearBoxX, yearBoxY, yearBoxWidth, yearBoxHeight);
      this.p5.drawingContext.clip();
      
      this.p5.drawingContext.restore();
      this.p5.pop();
    }
    
    // Restaura a matriz
    this.p5.pop();
  }

  runWorld(){
    this.cameraX = this.p5.constrain(this.player.position.x - this.p5.width/2, 0, this.worldwidth - this.p5.width);
    this.cameraY = this.p5.constrain(this.player.position.y - this.p5.height/2, 0, this.worldHeight - this.p5.height);

    this.p5.translate(-this.cameraX, -this.cameraY);
    this.p5.image(this.worldMapImage, 0, 0, this.worldwidth, this.worldHeight);

    this.player.getPlayerSprites();
    this.player.update();
    this.player.display();

    // Fade in da música
    if (this.musicVolume < this.targetMusicVolume) {
      this.musicVolume = this.p5.lerp(this.musicVolume, this.targetMusicVolume, this.musicFadeSpeed);
    }
    
    this.music.playMusic();
    this.music.setVolume(this.musicVolume);

    // Desenha a caixa do ano
    this.drawYearBox();
    
    if (this.mist) {
      this.mist.buildMist();
      this.mist.drawMist();
      this.mist.lightEffect(this.player.position);
    }

    this.player.displayInventory();

    // Reset da transformação para desenhar elementos da UI
    this.p5.resetMatrix();

    

    // Fade in visual
    if (this.isFadingIn) {
      this.fadeInAlpha -= this.fadeInSpeed;
      
      if (this.fadeInAlpha <= 0) {
        this.fadeInAlpha = 0;
        this.isFadingIn = false;
      }
      
      // Desenha overlay preto com transparência decrescente
      this.p5.fill(0, this.fadeInAlpha);
      this.p5.rect(0, 0, this.p5.width, this.p5.height);
    }
  }

  // Método para verificar se o fade in terminou
  isFadeComplete() {
    return !this.isFadingIn;
  }

  // Método para definir velocidade do fade
  setFadeSpeed(speed) {
    this.fadeInSpeed = speed;
  }

  // Método para definir velocidade do fade da música
  setMusicFadeSpeed(speed) {
    this.musicFadeSpeed = speed;
  }
}

export default worldMap;