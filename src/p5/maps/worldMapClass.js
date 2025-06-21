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

    if (this.mist) {
      this.mist.buildMist();
      this.mist.drawMist();
      this.mist.lightEffect(this.player.position);
    }

    // Reset da transformação para desenhar o overlay de fade
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