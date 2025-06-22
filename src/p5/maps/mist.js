class mist {
  constructor(p5, width, height, darkness) {
    this.p5 = p5;
    this.mist = null;
    this.shadow = null;
    this.light = null;
    this.t = 0;
    this.mistFrame = null;
    this.animationDelay = 4;
    this.animationFrame = 0;
    this.radius = 100;  // Raio da luz
    this.width = width;
    this.height = height;
    this.darkness = darkness;
  }

  loadMist(){
    this.shadow = this.p5.createGraphics(this.width, this.height);
    this.light = this.p5.createGraphics(this.width, this.height);
  }

  buildMist() {
    // Gera névoa em resolução menor
  let mistSize = 300;
  
  if (!this.mistTexture) {
    this.mistTexture = this.p5.createGraphics(mistSize, mistSize);
  }
  
  this.mistTexture.loadPixels();
  
  let inc = 0.1;
  let yoff = 0;
  
  for (let y = 0; y < mistSize; y++) {
    let xoff = 0;
    for (let x = 0; x < mistSize; x++) {
      let index = (y * mistSize + x) * 4;
      let pixelColor = this.p5.noise(xoff, yoff + this.t) * 255;
      
      this.mistTexture.pixels[index] = pixelColor * 0.2;
      this.mistTexture.pixels[index + 1] = pixelColor * 0.2;
      this.mistTexture.pixels[index + 2] = pixelColor * 0.2;
      this.mistTexture.pixels[index + 3] = 180;
      
      xoff += inc;
    }
    yoff += inc;
  }
  
  this.mistTexture.updatePixels();
  this.t += 0.02;
  }

  drawMist() {
  if (this.mistTexture) {
    // Escala de 200x200 para o tamanho real
    this.p5.push()
    this.p5.tint(200, 200, 200, 200)
    this.p5.image(this.mistTexture, 0, 0, this.width + 8000, this.height + 4000);
    this.p5.pop()
    }
  }

  shadowEffect() {

    this.p5.push();

    this.shadow.clear();
    this.shadow.fill(10, this.darkness); // Leve sombra no mapa
    this.shadow.noStroke();
    this.shadow.rect(0, 0, this.width, this.height);
    this.p5.image(this.shadow, 0, 0);

    this.p5.pop();
  }
  
  lightEffect(position) {
    this.p5.push();
    this.p5.tint(100, 100, 100, 200); // controla a opacidade
    this.light.clear();
    this.light.erase();
    this.light.fill(200, 200, 200, 150); // cor da luz
    this.light.circle(position.x + 16, position.y + 16, this.radius * 2);
    this.light.noErase();
    this.p5.image(this.light, 0, 0);

    this.t += 0.01;

    this.p5.pop();

    this.p5.push();

    this.shadow.clear();
    this.shadow.fill(0, this.darkness); // Leve sombra no mapa
    this.shadow.noStroke();
    this.shadow.rect(0, 0, this.width, this.height);

    for (let r = this.radius; r > 0; r -= 8) {
    let alpha = this.p5.map(r, 0, this.radius, 0, 120);
    this.shadow.erase();
    this.shadow.fill(0, 200 - alpha);
    this.shadow.circle(position.x + 16, position.y + 16, r * 2);
    this.shadow.noErase();
    }
    this.shadow.erase();
    this.shadow.fill(255, 255, 200, 120); // Luz amarelada
    
    let RectX = position.x + 250;
    let RectY = position.y + 260;
    RectX = this.p5.constrain(RectX, this.p5.width - 150, this.width - 150);
    RectY = this.p5.constrain(RectY, this.p5.height - 60, this.height - 60);

    this.shadow.rect(RectX, RectY, 150, 60);
    this.shadow.noErase();
  

    this.p5.image(this.shadow, 0, 0);

    this.p5.pop();
    
  }

  lightEffectNoBox(position) {
    this.p5.push();
    this.p5.tint(100, 100, 100, 200); // controla a opacidade
    this.light.clear();
    this.light.erase();
    this.light.fill(200, 200, 200, 150); // cor da luz
    this.light.circle(position.x + 16, position.y + 16, this.radius * 2);
    this.light.noErase();
    this.p5.image(this.light, 0, 0);

    this.t += 0.01;

    this.p5.pop();

    this.p5.push();

    this.shadow.clear();
    this.shadow.fill(0, this.darkness); // Leve sombra no mapa
    this.shadow.noStroke();
    this.shadow.rect(0, 0, this.width, this.height);

    for (let r = this.radius; r > 0; r -= 8) {
    let alpha = this.p5.map(r, 0, this.radius, 0, 120);
    this.shadow.erase();
    this.shadow.fill(0, 200 - alpha);
    this.shadow.circle(position.x + 16, position.y + 16, r * 2);
    this.shadow.noErase();
    }

    this.p5.image(this.shadow, 0, 0);

    this.p5.pop();
    
  }

  updateDarkness(newDarkness) {
    this.darkness = newDarkness;
    console.log('Darkness atualizado para:', this.darkness);
  }
  
}

export default mist;