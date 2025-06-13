class Player{
  constructor(p5, x, y, mapSize){
    this.p5 = p5;
    this.position = this.p5.createVector(x,y);
    this.direction = this.p5.createVector(0,0);
    this.size = 32;
    this.speed = 4;
    this.stepSize = 8;
    this.isMoving = false;
    this.mapSize = mapSize;
    this.frontPlayer = null;
  }

  loadPlayer(){
    this.frontPlayer = this.p5.loadImage('/assets/sprites/player/run.png', () => {
        console.log('Player sprite loaded sucessfully');
        }, (err) => {
        console.error('Error loading player sprite:', err);
        })
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
      }
      else if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)){
        this.direction.x = Math.min(this.mapSize - this.size, this.position.x + this.stepSize);
        this.isMoving = true;
      }
      else if (this.p5.keyIsDown(this.p5.UP_ARROW)){
        this.direction.y = Math.max(0, this.position.y - this.stepSize);
        this.isMoving = true;
      }
      else if (this.p5.keyIsDown(this.p5.DOWN_ARROW)){
        this.direction.y = Math.min(this.mapSize - this.size, this.position.y + this.stepSize);
        this.isMoving = true;
      }
    }
  }

  display(){
    this.p5.fill(255,0,0);
    this.p5.image(this.frontPlayer, this.position.x, this.position.y, this.size, this.size);
  }
}

export default Player;