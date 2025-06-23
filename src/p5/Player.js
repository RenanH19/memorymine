import LifeBarManager from "./utils/LifeBarManager";
import SpriteLoader from "./utils/SpriteLoader";
import CollisionMap from "./utils/CollisionMap";

class Player{
  constructor(p5, x, y, mapSize, image){
    this.p5 = p5;
    this.position = this.p5.createVector(x,y);
    this.targetPosition = this.p5.createVector(x,y); // Nova posição alvo
    this.direction = this.p5.createVector(x,y);
    this.size = 36;
    this.stepSize = 3;
    this.isMoving = false;
    this.mapSize = mapSize;
    this.frontPlayer = null;
    
    // SISTEMA DE VELOCIDADE E CORRIDA
    this.normalMoveSpeed = 0.6; // Velocidade normal
    this.runMoveSpeed = 1.0; // Velocidade correndo
    this.moveSpeed = this.normalMoveSpeed; // Velocidade atual
    this.isRunning = false; // Flag para verificar se está correndo

    this.imageSprites = 36;
    this.spriteLoader = SpriteLoader(this.p5, '/assets/sprites/player/runSprites.png', 768, 192, this.imageSprites);
    this.spriteSelected = 0;
    this.playerSprites = null;
    this.frameCount = 0;
    this.frameDelay = 6; // Delay normal para animação
    this.runFrameDelay = 3; // Delay mais rápido quando correndo
    this.collisionMap = CollisionMap(this.p5, image); // Inicializa a variável collisionMap

    // Sistema de inventário normal
    this.inventoryVisible = false;
    this.inventoryImage = null;
    this.inventory = [null, null, null]; // 3 slots vazios
    this.selectedSlot = 0; // Slot selecionado (0, 1, 2)
    this.inventorySlots = [
      { x: 33, y: 279, width: 91, height: 80 },   // Slot 1: x: 33-124, y: 279-369
      { x: 152, y: 279, width: 91, height: 80 },  // Slot 2: x: 152-243, y: 279-369
      { x: 276, y: 279, width: 91, height: 80 }   // Slot 3: x: 276-368, y: 279-369
    ];

    // Sistema de inventário de vida
    this.lifeInventoryVisible = false;
    this.lifeInventoryImage = null;
    this.itemBoxImage = null;
    this.lifeInventory = [null, null, null]; // 3 slots vazios para itens de vida
    this.selectedLifeSlot = 0; // Slot selecionado no inventário de vida
    this.lifeInventorySlots = [
      { x: 24, y: 24, width: 60, height: 60 },   // Slot 1: x: 24-84, y: 24-84
      { x: 95, y: 24, width: 60, height: 60 },   // Slot 2: x: 95-155, y: 24-84
      { x: 166, y: 24, width: 60, height: 60 }   // Slot 3: x: 166-226, y: 24-84
    ];

    // Sistema de vida
    this.lifeBarManager = new LifeBarManager(this.p5);

    // Sistema de confirmação de uso de item (ADICIONADO)
    this.showItemConfirmation = false;
    this.itemTextImage = null;
    this.confirmationSlot = -1;
    this.confirmationInventoryType = null; // 'normal' ou 'life'
    this.selectedUseOption = 0; // 0: Usar, 1: Cancelar
    this.useOptions = ['Usar', 'Cancelar'];

    // Controle de teclas para evitar múltiplas ativações
    this.eKeyPressed = false;
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.xKeyPressed = false;
    this.lKeyPressed = false;
    this.upKeyPressed = false;
    this.downKeyPressed = false;
  }

  loadPlayer(){
    this.spriteLoader.loadSprites();
    this.collisionMap.preload(); // Carrega o mapa de colisão

    this.useItemSound = this.p5.loadSound('/assets/sounds/useItem.mp3', () => {
    console.log('UseItem sound loaded successfully');
    }, (error) => {
    console.error('Failed to load useItem sound:', error);
    });

    this.navInventorySound = this.p5.loadSound('/assets/sounds/navInventory.mp3', () => {
    console.log('NavInventory sound loaded successfully');
    }, (error) => {
    console.error('Failed to load navInventory sound:', error);
    });

    this.leaveInventorySound = this.p5.loadSound('/assets/sounds/leaveInventory.mp3', () => {
    console.log('LeaveInventory sound loaded successfully');
    }, (error) => {
    console.error('Failed to load leaveInventory sound:', error);
    });
    
    // Carrega a imagem do inventário normal
    this.inventoryImage = this.p5.loadImage('/assets/sprites/player/inventory.png', () => {
      console.log('Inventory image loaded successfully');
    }, (error) => {
      console.error('Failed to load inventory image:', error);
    });

    // Carrega a imagem do inventário de vida
    this.lifeInventoryImage = this.p5.loadImage('/assets/sprites/player/lifeInventory.png', () => {
      console.log('Life inventory image loaded successfully');
    }, (error) => {
      console.error('Failed to load life inventory image:', error);
    });

    // Carrega a imagem do itemBox
    this.itemBoxImage = this.p5.loadImage('/assets/sprites/player/itemBox.png', () => {
      console.log('ItemBox image loaded successfully');
    }, (error) => {
      console.error('Failed to load itemBox image:', error);
    });

    // Carrega a imagem de confirmação de item
    this.itemTextImage = this.p5.loadImage('/assets/sprites/player/itemText.png', () => {
      console.log('ItemText image loaded successfully');
    }, (error) => {
      console.error('Failed to load itemText image:', error);
    });

    // Carrega o sistema de vida
    this.lifeBarManager.loadLifeBar();
  }

  getPlayerSprites(){
    if (this.playerSprites === null){
      this.playerSprites = this.spriteLoader.getSprites();
    }
    return this.playerSprites;
  }

  // NOVA FUNÇÃO: Verifica se está correndo
  checkRunning() {
    // Verifica se a tecla 'Z' está pressionada junto com alguma seta
    const zPressed = this.p5.keyIsDown(90); // Tecla Z (código 90)
    const anyArrowPressed = this.p5.keyIsDown(this.p5.LEFT_ARROW) || 
                           this.p5.keyIsDown(this.p5.RIGHT_ARROW) || 
                           this.p5.keyIsDown(this.p5.UP_ARROW) || 
                           this.p5.keyIsDown(this.p5.DOWN_ARROW);
    
    // Só está correndo se Z está pressionado E alguma seta está pressionada
    this.isRunning = zPressed && anyArrowPressed && !this.inventoryVisible && !this.lifeInventoryVisible;
    
    // Atualiza a velocidade baseado no estado
    if (this.isRunning) {
      this.moveSpeed = this.runMoveSpeed;
    } else {
      this.moveSpeed = this.normalMoveSpeed;
    }
  }

  handleInventoryInput() {
    // Se está mostrando confirmação de item, controla essa interface
    if (this.showItemConfirmation) {
      this.handleItemConfirmationInput();
      return;
    }

    // Toggle inventário com 'E'
    if (this.p5.keyIsDown(69)) { // Tecla 'E'
      if (!this.eKeyPressed) {
        this.eKeyPressed = true;
        if (!this.inventoryVisible && !this.lifeInventoryVisible) {
          this.inventoryVisible = true; // Abre inventário normal
        } else {
          this.inventoryVisible = false;
          this.lifeInventoryVisible = false; // Fecha ambos
        }
        if (this.leaveInventorySound) {
          this.leaveInventorySound.play();
        }
        console.log('Inventário normal', this.inventoryVisible ? 'aberto' : 'fechado');
      }
    } else {
      this.eKeyPressed = false;
    }

    // Toggle entre inventários com 'L'
    if (this.p5.keyIsDown(76)) { // Tecla 'L'
      if (!this.lKeyPressed) {
        this.lKeyPressed = true;
        if (this.inventoryVisible || this.lifeInventoryVisible) {
          // Alterna entre os inventários
          if (this.inventoryVisible) {
            this.inventoryVisible = false;
            this.lifeInventoryVisible = true;
            console.log('Mudou para inventário de vida');
          } else {
            this.lifeInventoryVisible = false;
            this.inventoryVisible = true;
            console.log('Mudou para inventário normal');
          }
          if (this.navInventorySound) {
          this.navInventorySound.play();
          }

        }
      }
    } else {
      this.lKeyPressed = false;
    }

    // Se algum inventário está visível, controla navegação
    if (this.inventoryVisible || this.lifeInventoryVisible) {
      // Navegar para esquerda
      if (this.p5.keyIsDown(this.p5.LEFT_ARROW)) {
        if (!this.leftKeyPressed) {
          this.leftKeyPressed = true;
          if (this.inventoryVisible) {
            this.selectedSlot = (this.selectedSlot - 1 + 3) % 3;
            console.log('Slot selecionado (normal):', this.selectedSlot);
          } else {
            this.selectedLifeSlot = (this.selectedLifeSlot - 1 + 3) % 3;
            console.log('Slot selecionado (vida):', this.selectedLifeSlot);
          }
          if (this.navInventorySound) {
          this.navInventorySound.play();
        }
        }
      } else {
        this.leftKeyPressed = false;
      }

      // Navegar para direita
      if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)) {
        if (!this.rightKeyPressed) {
          this.rightKeyPressed = true;
          if (this.inventoryVisible) {
            this.selectedSlot = (this.selectedSlot + 1) % 3;
            console.log('Slot selecionado (normal):', this.selectedSlot);
          } else {
            this.selectedLifeSlot = (this.selectedLifeSlot + 1) % 3;
            console.log('Slot selecionado (vida):', this.selectedLifeSlot);
          }
          if (this.navInventorySound) {
          this.navInventorySound.play();
        }
        }
      } else {
        this.rightKeyPressed = false;
      }

      // Usar item com 'X' - agora abre confirmação
      if (this.p5.keyIsDown(88)) { // Tecla 'X'
        if (!this.xKeyPressed) {
          this.xKeyPressed = true;
          if (this.inventoryVisible) {
            this.openItemConfirmation(this.selectedSlot, 'normal');
          } else {
            this.openItemConfirmation(this.selectedLifeSlot, 'life');
          }

           if (this.navInventorySound) {
          this.navInventorySound.play();
          }
        }
      } else {
        this.xKeyPressed = false;
      }
    }
  }

  handleItemConfirmationInput() {
    // Navegar para cima/baixo nas opções
    if (this.p5.keyIsDown(this.p5.UP_ARROW)) {
      if (!this.upKeyPressed) {
        this.upKeyPressed = true;
        this.selectedUseOption = (this.selectedUseOption - 1 + this.useOptions.length) % this.useOptions.length;
        console.log('Opção selecionada:', this.useOptions[this.selectedUseOption]);
      }
    } else {
      this.upKeyPressed = false;
    }

    if (this.p5.keyIsDown(this.p5.DOWN_ARROW)) {
      if (!this.downKeyPressed) {
        this.downKeyPressed = true;
        this.selectedUseOption = (this.selectedUseOption + 1) % this.useOptions.length;
        console.log('Opção selecionada:', this.useOptions[this.selectedUseOption]);
        if (this.navInventorySound) {
        this.navInventorySound.play();
      }
      }
      
    } else {
      this.downKeyPressed = false;
    }

    // Confirmar com 'X'
    if (this.p5.keyIsDown(88)) { // Tecla 'X'
      if (!this.xKeyPressed) {
        this.xKeyPressed = true;
        this.confirmItemUse();
      }
    } else {
      this.xKeyPressed = false;
    }

    // Cancelar com 'E'
    if (this.p5.keyIsDown(69)) { // Tecla 'E'
      if (!this.eKeyPressed) {
        this.eKeyPressed = true;
        this.closeItemConfirmation();
      }
    } else {
      this.eKeyPressed = false;
    }
  }

  openItemConfirmation(slotIndex, inventoryType) {
    const targetInventory = inventoryType === 'normal' ? this.inventory : this.lifeInventory;
    
    if (targetInventory[slotIndex] !== null) {
      this.showItemConfirmation = true;
      this.confirmationSlot = slotIndex;
      this.confirmationInventoryType = inventoryType;
      this.selectedUseOption = 0; // Reset para "Usar"
      console.log(`Abrindo confirmação para item do slot ${slotIndex} (${inventoryType})`);
    }
  }

  closeItemConfirmation() {
    this.showItemConfirmation = false;
    this.confirmationSlot = -1;
    this.confirmationInventoryType = null;
    this.selectedUseOption = 0;
    console.log('Confirmação de item fechada');
  }

  confirmItemUse() {
    if (this.selectedUseOption === 0) { // "Usar"
      if (this.confirmationInventoryType === 'normal') {
        this.useItem(this.confirmationSlot);
      } else {
        this.useLifeItem(this.confirmationSlot);
      }
      if (this.useItemSound) {
      this.useItemSound.play();
      }
    } else { // "Cancelar"
      console.log('Uso do item cancelado');
    }
    
    this.closeItemConfirmation();
  }

  useLifeItem(slotIndex) {
    if (this.lifeInventory[slotIndex] !== null) {
      const item = this.lifeInventory[slotIndex];
      console.log(`Usando item de vida do slot ${slotIndex}:`, item);
      
      // Aplica o efeito do item de vida
      if (item.type === 'health_potion') {
        this.lifeBarManager.addLife(item.healAmount || 25);
        console.log(`Vida restaurada! Vida atual: ${this.lifeBarManager.getCurrentLife()}`);
        
        // Remove o item após usar
        this.lifeInventory[slotIndex] = null;
      }
    } else {
      console.log(`Slot de vida ${slotIndex} está vazio`);
    }
  }

  addLifeItem(item) {
    // Adiciona um item de vida ao primeiro slot vazio
    for (let i = 0; i < this.lifeInventory.length; i++) {
      if (this.lifeInventory[i] === null) {
        this.lifeInventory[i] = item;
        console.log(`Item de vida adicionado ao slot ${i}:`, item);
        return true;
      }
    }
    console.log('Inventário de vida cheio!');
    return false;
  }

 // Modifique o método useItem para chamar o callback:
  useItem(slotIndex) {
    if (this.inventory[slotIndex] !== null) {
      const item = this.inventory[slotIndex];
      console.log(`Usando item do slot ${slotIndex}:`, item);
      
      // Lógica específica para cada tipo de item
      if (item.type === 'key' || item.type === 'book') {
        console.log(`Chave/Livro usado: ${item.name}`);
        
        // Notifica que uma chave foi usada (pode ser usado pelos levels)
        if (this.onKeyUsed) {
          this.onKeyUsed(item);
        }
        
        // Para chaves, normalmente não removemos do inventário
        // A menos que seja uma chave de uso único
        if (item.consumable) {
          this.inventory[slotIndex] = null;
        }
        return true;
      } else if (item.type === 'health_potion') {
        // Poção de vida no inventário normal
        this.lifeBarManager.addLife(item.healAmount || 25);
        console.log(`Vida restaurada! Vida atual: ${this.lifeBarManager.getCurrentLife()}`);
        this.inventory[slotIndex] = null;
        return true;
      }
      
      // Adicione mais tipos de itens aqui conforme necessário
      console.log(`Tipo de item não reconhecido: ${item.type}`);
      return false;
    } else {
      console.log(`Slot ${slotIndex} está vazio`);
      return false;
    }
  }

  addItem(item) {
    // Adiciona um item ao primeiro slot vazio
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i] === null) {
        this.inventory[i] = item;
        console.log(`Item adicionado ao slot ${i}:`, item);
        return true;
      }
    }
    console.log('Inventário cheio!');
    return false;
  }

  // Novo método para salvar o estado do inventário
  saveInventoryState() {
    return JSON.parse(JSON.stringify(this.inventory)); // Deep copy
  }

  // Novo método para restaurar o estado do inventário
  restoreInventoryState(savedInventory) {
    this.inventory = JSON.parse(JSON.stringify(savedInventory)); // Deep copy
  }

  // Método para verificar se tem um item específico
  hasItem(itemType) {
    return this.inventory.some(item => item && item.type === itemType);
  }

  // Métodos para o inventário de vida
  saveLifeInventoryState() {
    return JSON.parse(JSON.stringify(this.lifeInventory)); // Deep copy
  }

  restoreLifeInventoryState(savedLifeInventory) {
    this.lifeInventory = JSON.parse(JSON.stringify(savedLifeInventory)); // Deep copy
  }

  hasLifeItem(itemType) {
    return this.lifeInventory.some(item => item && item.type === itemType);
  }

  update(){
    let AnimationDelay = () => {
      // AJUSTA A VELOCIDADE DA ANIMAÇÃO BASEADO SE ESTÁ CORRENDO
      const currentFrameDelay = this.isRunning ? this.runFrameDelay : this.frameDelay;
      
      if (this.frameCount > currentFrameDelay){
        this.frameCount = 0;
        this.spriteSelected++;
      }
      this.frameCount++;
    }

    // VERIFICA SE ESTÁ CORRENDO ANTES DE QUALQUER COISA
    this.checkRunning();

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

    // Controla o inventário primeiro
    this.handleInventoryInput();

    // Input handling apenas se nenhum inventário estiver aberto E não estiver na confirmação
    if (!this.inventoryVisible && !this.lifeInventoryVisible && !this.isMoving && !this.showItemConfirmation) {
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

  displayInventory() {
    // Só mostra se algum inventário estiver visível
    if (!this.inventoryVisible && !this.lifeInventoryVisible) return;

    // Salva o estado atual
    this.p5.push();
    
    // Reset da transformação para desenhar na tela
    this.p5.resetMatrix();

    if (this.inventoryVisible && this.inventoryImage) {
      this.drawNormalInventory();
    } else if (this.lifeInventoryVisible && this.lifeInventoryImage) {
      this.drawLifeInventory();
    }

    // Desenha o itemBox à direita do inventário
    this.drawItemBox();

    // Desenha a confirmação de item se estiver ativa (ADICIONADO ESTA LINHA)
    if (this.showItemConfirmation) {
      this.drawItemConfirmation();
    }

    // Opcional: Indicador visual de corrida na tela
    if (this.isRunning && !this.inventoryVisible && !this.lifeInventoryVisible) {
      this.drawRunIndicator();
    }

    // Restaura o estado
    this.p5.pop();
  }

  drawItemConfirmation() {
    if (!this.showItemConfirmation || !this.itemTextImage) return;

    // Obtém o item atual
    const targetInventory = this.confirmationInventoryType === 'normal' ? this.inventory : this.lifeInventory;
    const currentItem = targetInventory[this.confirmationSlot];
    
    if (!currentItem) return;

    // Dimensões e posição da janela de confirmação
    const confirmationWidth = 300;
    const confirmationHeight = 200;
    const confirmationX = (this.p5.width - confirmationWidth) / 2;
    const confirmationY = (this.p5.height - confirmationHeight) / 2;

    // Desenha a imagem de fundo
    this.p5.image(this.itemTextImage, confirmationX, confirmationY, confirmationWidth, confirmationHeight);

    // Desenha o nome do item
    this.p5.push();
    this.p5.fill(255, 255, 255);
    this.p5.stroke(0, 0, 0);
    this.p5.strokeWeight(1);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(16);
    this.p5.textStyle(this.p5.BOLD);
    this.p5.text(currentItem.name, confirmationX + confirmationWidth / 2, confirmationY + 40);
    this.p5.pop();

    // Desenha a imagem do item se existir
    if (currentItem.image) {
      this.p5.push();
      this.p5.imageMode(this.p5.CENTER);
      this.p5.image(currentItem.image, confirmationX + confirmationWidth / 2, confirmationY + 80, 50, 50);
      this.p5.imageMode(this.p5.CORNER);
      this.p5.pop();
    }

    // Desenha as opções
    const optionStartY = confirmationY + 120;
    const optionSpacing = 25;

    for (let i = 0; i < this.useOptions.length; i++) {
      this.p5.push();
      
      // Destaca a opção selecionada
      if (i === this.selectedUseOption) {
        this.p5.fill(255, 255, 0); // Amarelo para selecionado
        this.p5.stroke(0, 0, 0);
        this.p5.strokeWeight(2);
      } else {
        this.p5.fill(255, 255, 255); // Branco para não selecionado
        this.p5.stroke(0, 0, 0);
        this.p5.strokeWeight(1);
      }
      
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.textSize(14);
      this.p5.textStyle(this.p5.BOLD);
      this.p5.text(this.useOptions[i], confirmationX + confirmationWidth / 2, optionStartY + (i * optionSpacing));
      
      this.p5.pop();
    }

    // Instruções
    this.p5.push();
    this.p5.fill(200, 200, 200);
    this.p5.noStroke();
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(10);
    this.p5.text("↑↓ para navegar, X para confirmar, E para cancelar", 
                confirmationX + confirmationWidth / 2, confirmationY + confirmationHeight - 15);
    this.p5.pop();
  }

  drawNormalInventory() {
    // Centraliza o inventário na tela
    const inventoryWidth = 400;
    const inventoryHeight = 493;
    const inventoryX = (this.p5.width - inventoryWidth) / 2;
    const inventoryY = (this.p5.height - inventoryHeight) / 2;

    // Desenha a imagem do inventário
    this.p5.image(this.inventoryImage, inventoryX, inventoryY, inventoryWidth, inventoryHeight);

    // Desenha os itens nos slots
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i] !== null) {
        const slotData = this.inventorySlots[i];
        const item = this.inventory[i];
        
        // Posição centralizada do item no slot
        const itemX = inventoryX + slotData.x + slotData.width / 2;
        const itemY = inventoryY + slotData.y + slotData.height / 2;
        
        // Desenha a imagem do item se existir
        if (item.image) {
          this.p5.push();
          this.p5.imageMode(this.p5.CENTER);
          
          // Ajusta o tamanho da imagem para caber no slot
          const itemSize = Math.min(slotData.width, slotData.height) * 0.7;
          this.p5.image(item.image, itemX, itemY, itemSize, itemSize);
          
          this.p5.imageMode(this.p5.CORNER); // Restaura o modo padrão
          this.p5.pop();
        }
        
        // Desenha o texto do nome do item abaixo da imagem
        this.p5.push();
        this.p5.fill(255, 255, 255); // Texto branco
        this.p5.stroke(0, 0, 0); // Contorno preto
        this.p5.strokeWeight(1);
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        this.p5.textSize(12);
        this.p5.textStyle(this.p5.BOLD);
        
        // Posiciona o texto na parte inferior do slot
        const textY = itemY + slotData.height / 4;
        this.p5.text(item.name, itemX, textY);
        this.p5.pop();
      }
    }

    // Desenha contorno no slot selecionado (apenas se não estiver na confirmação)
    if (!this.showItemConfirmation) {
      const selectedSlotData = this.inventorySlots[this.selectedSlot];
      this.p5.stroke(255, 255, 0); // Contorno amarelo
      this.p5.strokeWeight(3);
      this.p5.noFill();
      this.p5.rect(
        inventoryX + selectedSlotData.x, 
        inventoryY + selectedSlotData.y, 
        selectedSlotData.width, 
        selectedSlotData.height
      );
    }
  }

  drawLifeInventory() {
    // Centraliza o inventário de vida na tela
    const lifeInventoryWidth = 400;
    const lifeInventoryHeight = 593;
    const lifeInventoryX = (this.p5.width - lifeInventoryWidth) / 2;
    const lifeInventoryY = (this.p5.height - lifeInventoryHeight) / 2;

    // Desenha a imagem do inventário de vida
    this.p5.image(this.lifeInventoryImage, lifeInventoryX, lifeInventoryY, lifeInventoryWidth, lifeInventoryHeight);

    // Desenha a barra de vida após 50px em X e 350px em Y
    const lifeBarX = lifeInventoryX + 50;
    const lifeBarY = lifeInventoryY + 350;
    const lifeBarWidth = 300;
    const lifeBarHeight = 20;
    
    // Desenha a barra de vida usando o LifeBarManager
    this.lifeBarManager.drawLifeBar(lifeBarX, lifeBarY, lifeBarWidth, lifeBarHeight);
    
    // Desenha o texto da vida
    this.lifeBarManager.drawLifeText(lifeBarX + lifeBarWidth / 2, lifeBarY + lifeBarHeight + 15);

    // Desenha os itens nos slots de vida
    for (let i = 0; i < this.lifeInventory.length; i++) {
      if (this.lifeInventory[i] !== null) {
        const slotData = this.lifeInventorySlots[i];
        const item = this.lifeInventory[i];
        
        // Posição centralizada do item no slot
        const itemX = lifeInventoryX + slotData.x + slotData.width / 2;
        const itemY = lifeInventoryY + slotData.y + slotData.height / 2;
        
        // Desenha a imagem do item se existir
        if (item.image) {
          this.p5.push();
          this.p5.imageMode(this.p5.CENTER);
          
          // Ajusta o tamanho da imagem para caber no slot
          const itemSize = Math.min(slotData.width, slotData.height) * 0.7;
          this.p5.image(item.image, itemX, itemY, itemSize, itemSize);
          
          this.p5.imageMode(this.p5.CORNER); // Restaura o modo padrão
          this.p5.pop();
        }
        
        // Desenha o texto do nome do item abaixo da imagem
        this.p5.push();
        this.p5.fill(255, 255, 255); // Texto branco
        this.p5.stroke(0, 0, 0); // Contorno preto
        this.p5.strokeWeight(1);
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        this.p5.textSize(10);
        this.p5.textStyle(this.p5.BOLD);
        
        // Posiciona o texto na parte inferior do slot
        const textY = itemY + slotData.height / 3;
        this.p5.text(item.name, itemX, textY);
        this.p5.pop();
      }
    }

    // Desenha contorno no slot selecionado (apenas se não estiver na confirmação)
    if (!this.showItemConfirmation) {
      const selectedSlotData = this.lifeInventorySlots[this.selectedLifeSlot];
      this.p5.stroke(255, 255, 0); // Contorno amarelo
      this.p5.strokeWeight(3);
      this.p5.noFill();
      this.p5.rect(
        lifeInventoryX + selectedSlotData.x, 
        lifeInventoryY + selectedSlotData.y, 
        selectedSlotData.width, 
        selectedSlotData.height
      );
    }
  }

  drawItemBox() {
    if (!this.itemBoxImage) return;
    
    // Posiciona o itemBox à direita do inventário
    const inventoryWidth = 400;
    const inventoryX = (this.p5.width - inventoryWidth) / 2;
    const itemBoxX = inventoryX + inventoryWidth + 20; // 20px de espaçamento
    const itemBoxY = (this.p5.height - 100) / 2; // Centralizado verticalmente, assumindo altura de 100px
    
    // Desenha o itemBox
    this.p5.image(this.itemBoxImage, itemBoxX, itemBoxY);
    
    // Adiciona texto indicativo
    this.p5.push();
    this.p5.fill(200, 30, 30);
    this.p5.stroke(0, 0, 0);
    this.p5.strokeWeight(1);
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(30);
    this.p5.textStyle(this.p5.BOLD);
    this.p5.text("L", itemBoxX + 30, itemBoxY + 30); // Assumindo largura de 100px
    this.p5.pop();
  }

  // NOVA FUNÇÃO: Indicador visual de corrida
  drawRunIndicator() {
    this.p5.push();
    this.p5.resetMatrix();
    
    // Posição no canto superior direito
    const indicatorX = this.p5.width - 100;
    const indicatorY = 20;
    
    // Fundo do indicador
    this.p5.fill(0, 0, 0, 150);
    this.p5.stroke(255, 255, 255);
    this.p5.strokeWeight(2);
    this.p5.rect(indicatorX, indicatorY, 80, 30, 5);
    
    // Texto "CORRENDO"
    this.p5.fill(255, 255, 100); // Amarelo brilhante
    this.p5.noStroke();
    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(12);
    this.p5.textStyle(this.p5.BOLD);
    this.p5.text("CORRENDO", indicatorX + 40, indicatorY + 15);
    
    this.p5.pop();
  }

  display(){
    this.p5.fill(255,0,0);
    const sprites = this.getPlayerSprites();
    if (sprites && sprites[this.spriteSelected]) {
      this.p5.image(sprites[this.spriteSelected], this.position.x, this.position.y, this.size, this.size);
    }
  }

  positionPlayer(){
    return this.position;
  }

  // Getters para o inventário e estado
  getInventory() {
    return this.inventory;
  }

  getLifeInventory() {
    return this.lifeInventory;
  }

  isInventoryOpen() {
    return this.inventoryVisible;
  }

  isLifeInventoryOpen() {
    return this.lifeInventoryVisible;
  }

  // NOVOS GETTERS: Para verificar o estado de corrida
  getIsRunning() {
    return this.isRunning;
  }

  getCurrentSpeed() {
    return this.moveSpeed;
  }

  setCollisionMap(imagePath) {
    console.log('Atualizando mapa de colisão para:', imagePath);
    this.collisionMap = CollisionMap(this.p5, imagePath);
    this.collisionMap.preload(); // Recarrega o mapa de colisão com a nova imagem
  }

  getLifeBarManager() {
    return this.lifeBarManager;
  }

  getCurrentLife() {
    return this.lifeBarManager.getCurrentLife();
  }

  getMaxLife() {
    return this.lifeBarManager.getMaxLife();
  }

  takeDamage(amount) {
    this.lifeBarManager.removeLife(amount);
    console.log(`Dano recebido: ${amount}. Vida atual: ${this.lifeBarManager.getCurrentLife()}`);
    
    if (this.lifeBarManager.isDead()) {
      console.log('Player morreu!');
      // Aqui você pode adicionar lógica de morte
    }
  }

  heal(amount) {
    this.lifeBarManager.addLife(amount);
    console.log(`Cura recebida: ${amount}. Vida atual: ${this.lifeBarManager.getCurrentLife()}`);
  }

  setKeyUsedCallback(callback) {
    this.onKeyUsed = callback;
  }

  // Adicione este método na classe Player se ainda não existir:
  setKeyUsedCallback(callback) {
    this.onKeyUsed = callback;
}
}

export default Player;