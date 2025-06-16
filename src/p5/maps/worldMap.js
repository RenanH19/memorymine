function worldMap(p5, player){
  let worldMapImage ='/assets/maps/worldMap.png'; // Caminho para a imagem do mapa do mundo
  let worldwidth = 2000;
  let worldHeight = 2000;
  let cameraX = 0;
  let cameraY = 0;

  function loadWorldMap(){
    worldMapImage = p5.loadImage(worldMapImage, () => {
      console.log('World map loaded successfully');
    }, (err) => {
      console.error('Error loading world map:', err);
    });
  }

  function runWorld(){

    cameraX = p5.constrain(player.position.x - p5.width/2, 0, worldwidth - p5.width) // Assim, mantem a camera com o player no meio da tela, mas limitando ela ao 0 < x < worldwidth - width
    cameraY = p5.constrain(player.position.y - p5.height/2, 0, worldHeight - p5.height)
    p5.translate(-cameraX, -cameraY) // desloca o eixo 0 das coordenadas para carregando o vem depois da imagem
    p5.fill('red')
    p5.rect(0, 0, 2000, 2000)
  }
  
  return {
    loadWorldMap,
    runWorld
  }
}

export default worldMap;