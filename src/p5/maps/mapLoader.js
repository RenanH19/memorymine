function mapLoader(p5, map) {
  // Essa funcao vai carregar os tiles e construir o mapa a partir da matriz fornecida
  let tile1;
  let tile2;
  let tile3;

  function loadMap() {
    tile1 = p5.loadImage('/assets/tiles/grass.png');
    tile2 = p5.loadImage('/assets/tiles/tile2.png');
    tile3 = p5.loadImage('/assets/tiles/tile3.png');
  };

  function buildMap() {
    for (let i=0; i < 20; i++){
      for(let j=0; j < 25; j++){
        if(map[i][j] === 1){
          p5.image(tile1, j * 32, i * 32, 32, 32);
        }
        else if(map[i][j] === 2){
          
        }
      }
    }
  }
  return {
    loadMap,
    buildMap
  };

}

export default mapLoader;