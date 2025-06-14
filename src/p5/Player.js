import SpriteLoader from "./utils/SpriteLoader";

class Player{
  constructor(p5, x, y, mapSize){
    this.p5 = p5;
    this.position = this.p5.createVector(x,y);
    this.direction = this.p5.createVector(0,0);
    this.size = 32;
    this.speed = 2;
    this.stepSize = 4;
    this.isMoving = false;
    this.mapSize = mapSize;
    this.frontPlayer = null;

    this.imageSprites = 36;
    this.spriteLoader = SpriteLoader(this.p5, '/assets/sprites/player/runSprites.png', 768, 192, this.imageSprites);
    this.spriteSelected = 0;
    this.animationDelay = 4;
    this.animationFrame = 0;
    this.playerSprites = null;
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

    if(this.isMoving){
      let dx = this.direction.x - this.position.x;
      let dy = this.direction.y - this.position.y;

      if (Math.abs(dx) < this.speed && Math.abs(dy) < this.speed){
        this.position.x = this.direction.x;
        this.position.y = this.direction.y;
        this.isMoving = false;
      } else {
        if (dx !== 0){
          this.position.x += Math.sign(dx) * this.speed; // sign dá a direção do movimento, retorna -1, +1 ou 0
        }
        if (dy !== 0){
          this.position.y += Math.sign(dy) * this.speed;
        }
      }
    } else {

      if (this.p5.keyIsDown(this.p5.LEFT_ARROW)){
        this.direction.x = Math.max(0, this.position.x - this.stepSize);
        this.isMoving = true;
        if(this.spriteSelected < 9 || this.spriteSelected > 16){ //verifica se o sprite corresponde ao sprite do movimento esquerdo, caso nao for, ele troca para o sprite correspondente
          this.spriteSelected = 9;
        } 
        if (this.animationFrame >= this.animationDelay){
          this.animationFrame = 0;
          this.spriteSelected++;
        }
        this.animationFrame++;
      }
      else if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)){
        this.direction.x = Math.min(this.mapSize - this.size, this.position.x + this.stepSize);
        this.isMoving = true;

        if(this.spriteSelected > 7){ //verifica se o sprite corresponde ao sprite do movimento direito
          this.spriteSelected = 0;
        } 
        if (this.animationFrame >= this.animationDelay){
          this.animationFrame = 0;
          this.spriteSelected++;
        }
        this.animationFrame++;
      }
      else if (this.p5.keyIsDown(this.p5.UP_ARROW)){
        this.direction.y = Math.max(0, this.position.y - this.stepSize);
        this.isMoving = true;

        if(this.spriteSelected < 18  || this.spriteSelected > 25){ //verifica se o sprite corresponde ao sprite do movimento para frente
          this.spriteSelected = 18;
        } 
        if (this.animationFrame >= this.animationDelay){
          this.animationFrame = 0;
          this.spriteSelected++;
        }
        this.animationFrame++;
      }
      else if (this.p5.keyIsDown(this.p5.DOWN_ARROW)){
        this.direction.y = Math.min(this.mapSize - this.size, this.position.y + this.stepSize);
        this.isMoving = true;

        
        if(this.spriteSelected < 27  || this.spriteSelected > 34){ //verifica se o sprite corresponde ao sprite do movimento para frente
          this.spriteSelected = 27;
        } 
        if (this.animationFrame >= this.animationDelay){
          this.animationFrame = 0;
          this.spriteSelected++;
        }
        this.animationFrame++;
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