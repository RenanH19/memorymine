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
    this.music = MusicManager(p5, '/assets/music/worldMap.mp3')
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

  runWorld(){
    
  
    this.cameraX = this.p5.constrain(this.player.position.x - this.p5.width/2, 0, this.worldwidth - this.p5.width) // Assim, mantem a camera com o player no meio da tela, mas limitando ela ao 0 < x < worldwidth - width
    this.cameraY = this.p5.constrain(this.player.position.y - this.p5.height/2, 0, this.worldHeight - this.p5.height)

    this.p5.translate(-this.cameraX, -this.cameraY) // desloca o eixo 0 das coordenadas para carregando o vem depois da imagem
    this.p5.image(this.worldMapImage, 0, 0, this.worldwidth, this.worldHeight); // Desenha o mapa do mundo

    
    this.player.getPlayerSprites();
    this.player.update();
    this.player.display();
    this.music.playMusic();
    this.music.setVolume(0.1);

    if (this.mist) {
      this.mist.buildMist(); // Constrói a névoa, se estiver definida
      this.mist.drawMist();
      this.mist.lightEffect(this.player.position); // Aplica o efeito de luz, se estiver definida
    }
    
  }
  
}

export default worldMap;