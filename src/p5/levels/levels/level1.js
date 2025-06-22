import Player from "../../Player";
import MusicManager from "../../audio/MusicManager";
import mist from "../../maps/mist";

function level1(p5) {
  let player = new Player(p5, 100, 100, 800, '/assets/noColision.png'); // Posição inicial do player
  let musicFile = '/assets/music/moongate.mp3';
  let music = MusicManager(p5, musicFile);
  let mistInstance = new mist(p5, 800, 640);
  
  // Variáveis para o mapa
  let levelImage = null;
  let levelWidth = 800;
  let levelHeight = 640;
  let cameraX = 0;
  let cameraY = 0;
  
  // Variáveis para fade in
  let fadeInAlpha = 255; // Começa totalmente preto
  let fadeInSpeed = 2; // Velocidade do fade in
  let isFadingIn = true;
  let musicVolume = 0; // Volume inicial da música
  let targetMusicVolume = 0.1; // Volume alvo
  let musicFadeSpeed = 0.005; // Velocidade do fade in da música

  function loadLevel() {
    // Carrega a imagem do level1
    levelImage = p5.loadImage('/assets/maps/level1.png', () => {
      console.log('Level1 map loaded successfully');
    }, (error) => {
      console.error('Failed to load level1 map:', error);
    });

    player.loadPlayer();
    music.loadMusic();
    mistInstance.loadMist();
  }

  function startFadeIn() {
    // Método para reiniciar o fade in
    fadeInAlpha = 255;
    isFadingIn = true;
    musicVolume = 0;
  }

  function runLevel() {
    // Controle da câmera (se o mapa for maior que a tela)
    cameraX = p5.constrain(player.position.x - p5.width/2, 0, Math.max(0, levelWidth - p5.width));
    cameraY = p5.constrain(player.position.y - p5.height/2, 0, Math.max(0, levelHeight - p5.height));

    // Aplica transformação da câmera
    p5.translate(-cameraX, -cameraY);

    // Desenha o mapa de fundo
    if (levelImage) {
      p5.image(levelImage, 0, 0, levelWidth, levelHeight);
    } else {
      // Fallback caso a imagem não carregue
      p5.background(40, 40, 60);
    }

    // Atualiza e desenha o player
    player.getPlayerSprites();
    player.update();
    player.display();

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
      mistInstance.lightEffect(player.position);
    }

    // Reset da transformação para elementos da UI
    p5.resetMatrix();

    // Desenha o inventário APÓS resetar a matriz
    player.displayInventory();

    // Fade in visual
    if (isFadingIn) {
      fadeInAlpha -= fadeInSpeed;
      
      if (fadeInAlpha <= 0) {
        fadeInAlpha = 0;
        isFadingIn = false;
      }
      
      // Desenha overlay preto com transparência decrescente
      p5.fill(0, fadeInAlpha);
      p5.rect(0, 0, p5.width, p5.height);
    }
  }

  function stopLevel() {
    // Para a música quando sair do level
    if (music) {
      music.stopMusic();
    }
  }

  // Métodos para controle do fade
  function isFadeComplete() {
    return !isFadingIn;
  }

  function setFadeSpeed(speed) {
    fadeInSpeed = speed;
  }

  function setMusicFadeSpeed(speed) {
    musicFadeSpeed = speed;
  }

  // Getters para informações do level
  function getPlayerPosition() {
    return player.position;
  }

  function getCameraPosition() {
    return { x: cameraX, y: cameraY };
  }

  return {
    loadLevel,
    runLevel,
    stopLevel,
    startFadeIn,
    isFadeComplete,
    setFadeSpeed,
    setMusicFadeSpeed,
    getPlayerPosition,
    getCameraPosition
  };
}

export default level1;