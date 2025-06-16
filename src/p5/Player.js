import SpriteLoader from "./utils/SpriteLoader";

class Player{
  constructor(p5, x, y, mapSize){
    this.p5 = p5;
    this.position = this.p5.createVector(x,y);
    this.direction = this.p5.createVector(x,y);
    this.size = 36;
    this.stepSize = 3;
    this.isMoving = false;
    this.mapSize = mapSize;
    this.frontPlayer = null;

    this.imageSprites = 36;
    this.spriteLoader = SpriteLoader(this.p5, '/assets/sprites/player/runSprites.png', 768, 192, this.imageSprites);
    this.spriteSelected = 0;
    this.playerSprites = null;
    this.frameCount = 0;
    this.frameDelay = 4;
  }

  loadPlayer(){
    this.spriteLoader.loadSprites();
  }

  getPlayerSprites(){
    if (this.playerSprites === null){
      this.playerSprites = this.spriteLoader.getSprites();
    }
  }

  update(){

    let AnimationDelay = () => {
      if (this.frameCount > this.frameDelay){
        this.frameCount = 0;
        this.spriteSelected++;
      }
      this.frameCount++;
    }

    if(this.isMoving){
      this.position.x = this.direction.x;
      this.position.y = this.direction.y;
      this.isMoving = false;

      
    } else {

      if (this.p5.keyIsDown(this.p5.LEFT_ARROW)){
        this.direction.x = Math.max(0, this.position.x - this.stepSize);
        this.isMoving = true;
        if(this.spriteSelected < 9 || this.spriteSelected > 16){ //verifica se o sprite corresponde ao sprite do movimento esquerdo, caso nao for, ele troca para o sprite correspondente
          this.spriteSelected = 9;
        }
        AnimationDelay();
        
      }
      else if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)){
        this.direction.x = Math.min(this.mapSize - this.size, this.position.x + this.stepSize);
        this.isMoving = true;

        if(this.spriteSelected > 7){ //verifica se o sprite corresponde ao sprite do movimento direito
          this.spriteSelected = 0;
        } 
        AnimationDelay();
    
      }
      else if (this.p5.keyIsDown(this.p5.UP_ARROW)){
        this.direction.y = Math.max(0, this.position.y - this.stepSize);
        this.isMoving = true;

        if(this.spriteSelected < 18  || this.spriteSelected > 25){ //verifica se o sprite corresponde ao sprite do movimento para frente
          this.spriteSelected = 18;
        } 
        AnimationDelay();

      }
      else if (this.p5.keyIsDown(this.p5.DOWN_ARROW)){
        this.direction.y = Math.min(this.mapSize - this.size, this.position.y + this.stepSize);
        this.isMoving = true;

        
        if(this.spriteSelected < 27  || this.spriteSelected > 34){ //verifica se o sprite corresponde ao sprite do movimento para frente
          this.spriteSelected = 27;
        } 
        AnimationDelay();

      }
    }
  }

  display(){
   
    this.p5.fill(255,0,0);
    this.p5.image(this.playerSprites[this.spriteSelected], this.position.x, this.position.y, this.size, this.size);
    
    
  }

  positionPlayer(){
    return this.position;
  }
}

export default Player;