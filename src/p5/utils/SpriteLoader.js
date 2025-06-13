function SpriteLoader(p5, spriteSheetPath, height, width, frameCount) {
  let spriteSheet;
  let frame;
  let spriteFrames = [];
  let y;
  let x;
  function loadSprites(){
    spriteSheet = p5.loadImage(spriteSheetPath);
    
    
  };

  function getSprites(){
    let i = 1;
    for(y = 0; y < height; y += 64){
      for(x = 0; x < width; x += 64){
        frame = spriteSheet.get(x, y, 64, 64)
        spriteFrames.push(frame)
        i++
      }
      if (i === frameCount){
        break
      }
      
    }
    

    return spriteFrames;
  };

  return {
    loadSprites,
    getSprites
  }
}

export default SpriteLoader;
