function mist(p5){
  let mist;
  let shadow;
  let light
  let t = 0;
  let mistFrame;
  let animationDelay = 4;
  let animationFrame = 0;
  let radius = 100;  // Raio da luz

  function loadMist(){
    mist = p5.loadImage('/assets/mist/mist.png', () => {
      console.log('Mist loaded successfully');
    }, (err) => {
      console.error('Error loading mist:', err);
    });
    mistFrame = mist;
    shadow = p5.createGraphics(800, 640);
    light = p5.createGraphics(800, 640);
  }

  function buildMist(position) {
    let dx = p5.noise(t) * (mist.width - 800);
    let dy = p5.noise(t + 100) * (mist.height - 640);
    if (animationFrame >= animationDelay) {
      animationFrame = 0;
      mistFrame = mist.get(dx, dy, 800, 640);
    }
    animationFrame++;
    p5.push();
    p5.tint(200, 100, 25, 200); // controla a opacidade
    light.clear();
    light.image(mistFrame, 0, 0, 800, 640);
    light.erase();
    light.fill(255, 150, 50, 120); // cor da luz
    light.circle(position.x + 16, position.y + 16, radius * 2);
    light.noErase();
    p5.image(light, 0, 0);
    
    t += 0.005;

    p5.pop();
    


    shadow.clear();
    shadow.fill(0, 254); // Leve sombra no mapa
    shadow.noStroke();
    shadow.rect(0, 0, p5.width, p5.height);
    
    for (let r = radius; r > 0; r -= 8) {
    let alpha = p5.map(r, 0, radius, 0, 120);
    shadow.erase();
    shadow.fill(0, 200 - alpha);
    shadow.circle(position.x + 16, position.y + 16, r * 2);
    shadow.noErase();
    }
    p5.image(shadow, 0, 0);

  }

  return {
    loadMist,
    buildMist
  
  }
}

export default mist;