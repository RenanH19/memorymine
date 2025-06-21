import SpriteLoader from "./utils/SpriteLoader";
import CollisionMap from "./utils/CollisionMap";
class Player{
  constructor(p5, x, y, mapSize){
    this.p5 = p5;
    this.position = this.p5.createVector(x,y);
    this.targetPosition = this.p5.createVector(x,y); // Nova posição alvo
    this.direction = this.p5.createVector(x,y);
    this.size = 36;
    this.stepSize = 3;
    this.isMoving = false;
    this.mapSize = mapSize;
    this.frontPlayer = null;
    this.moveSpeed = 0.6; // Velocidade de interpolação (0.1 a 0.3 funciona bem)

    this.imageSprites = 36;
    this.spriteLoader = SpriteLoader(this.p5, '/assets/sprites/player/runSprites.png', 768, 192, this.imageSprites);
    this.spriteSelected = 0;
    this.playerSprites = null;
    this.frameCount = 0;
    this.frameDelay = 6; // Aumentei o delay para animação mais suave
    this.collisionMap = CollisionMap(this.p5); // Inicializa a variável collisionMap
  }

  loadPlayer(){
    this.spriteLoader.loadSprites();
    this.collisionMap.preload(); // Carrega o mapa de colisão
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

    // Interpolação suave da posição
    this.position.x = this.p5.lerp(this.position.x, this.targetPosition.x, this.moveSpeed);
    this.position.y = this.p5.lerp(this.position.y, this.targetPosition.y, this.moveSpeed);

    // Verifica se chegou próximo ao destino
    let distance = this.p5.dist(this.position.x, this.position.y, this.targetPosition.x, this.targetPosition.y);
    if (distance < 0.5) {
      this.position.x = this.targetPosition.x;
      this.position.y = this.targetPosition.y;
      this.isMoving = false;
    }

    // Input handling
   if (!this.isMoving) {
      if (this.p5.keyIsDown(this.p5.LEFT_ARROW)){
        let newX = Math.max(0, this.targetPosition.x - this.stepSize);
        if (this.collisionMap.canMove(newX, this.targetPosition.y)) {
          this.targetPosition.x = newX;
          this.isMoving = true;
          if(this.spriteSelected < 9 || this.spriteSelected > 16){
            this.spriteSelected = 9;
          }
        }
      }
      else if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)){
        let newX = Math.min(this.mapSize - this.size, this.targetPosition.x + this.stepSize);
        if (this.collisionMap.canMove(newX, this.targetPosition.y)) {
          this.targetPosition.x = newX;
          this.isMoving = true;
          if(this.spriteSelected > 7){
            this.spriteSelected = 0;
          }
        }
      }
      else if (this.p5.keyIsDown(this.p5.UP_ARROW)){
        let newY = Math.max(0, this.targetPosition.y - this.stepSize);
        if (this.collisionMap.canMove(this.targetPosition.x, newY)) {
          this.targetPosition.y = newY;
          this.isMoving = true;
          if(this.spriteSelected < 18 || this.spriteSelected > 25){
            this.spriteSelected = 18;
          }
        }
      }
      else if (this.p5.keyIsDown(this.p5.DOWN_ARROW)){
        let newY = Math.min(this.mapSize - this.size, this.targetPosition.y + this.stepSize);
        if (this.collisionMap.canMove(this.targetPosition.x, newY)) {
          this.targetPosition.y = newY;
          this.isMoving = true;
          if(this.spriteSelected < 27 || this.spriteSelected > 34){
            this.spriteSelected = 27;
          }
        }
      }
    }

    // Anima apenas quando está se movendo
    if (this.isMoving) {
      AnimationDelay();
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