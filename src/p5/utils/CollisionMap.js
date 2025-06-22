function CollisionMap(p5, image){
    let collisionMap = image;
    
  function preload() {
    collisionMap = p5.loadImage(image);
  }

  function canMove(x, y) {
    // Verifica se as coordenadas estão dentro dos limites da imagem
    if (x < 0 || y < 0 || x >= collisionMap.width || y >= collisionMap.height) {
      return false;
    }
    
    let c = collisionMap.get(p5.int(x), p5.int(y));
    // Verifica se é branco (RGB próximo de 255,255,255)
    // c é um array [R, G, B, A]
    return c[0] > 150 && c[1] > 150 && c[2] > 150;
  }

  return {
    preload,
    canMove
  };
}

export default CollisionMap;