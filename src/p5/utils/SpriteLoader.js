// Substitua TODO o conteúdo do SpriteLoader.js:

function SpriteLoader(p5, spriteSheetPath, height, width, frameCount) {
  let spriteSheet;
  let frame;
  let spriteFrames = [];
  let y;
  let x;
  
  function loadSprites(){
    spriteSheet = p5.loadImage(spriteSheetPath, () => {
      console.log('Sprite sheet loaded successfully from:', spriteSheetPath);
    }, (err) => {
      console.error('Error loading sprite sheet:', err);
    });
  };

  function getSprites(){
    if (!spriteSheet) {
      console.log('SpriteLoader: Sprite sheet not loaded yet');
      return [];
    }
    
    // Limpa array anterior
    spriteFrames = [];
    
    let i = 0; // MUDANÇA: Iniciar com 0
    console.log('SpriteLoader: Processando sprites. Tamanho da imagem:', spriteSheet.width, 'x', spriteSheet.height);
    
    for(y = 0; y < height && i < frameCount; y += 64){
      for(x = 0; x < width && i < frameCount; x += 64){
        frame = spriteSheet.get(x, y, 64, 64);
        spriteFrames.push(frame);
        i++;
        console.log(`SpriteLoader: Sprite ${i} processada de (${x}, ${y})`);
      }
    }
    
    console.log('SpriteLoader: Total de sprites processadas:', spriteFrames.length);
    return spriteFrames;
  };

  return {
    loadSprites,
    getSprites
  }
}

export default SpriteLoader;