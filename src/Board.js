class Board {
  constructor(){
    this.head = new Head($('#board'));
    this.apple = new Apple($('#board'));
    this.gameSpeed = 100;
    setTimeout(this.updateGameState.bind(this), this.gameSpeed);
  }

  updateGameState(){
    if (this.head.getPosition() === this.apple.getPosition()){
      this.eatApple();
    }
    this.head.move();
    setTimeout(this.updateGameState.bind(this), this.gameSpeed);
  }

  eatApple(){

  }

  checkKeyInput(e) {
    if (e.keyCode === 37) {
      console.log('pressed left');
      this.head.currentDirection = 'left';
    }
    switch (e.keyCode) {
      case 39:
        this.head.currentDirection = 'right';
        break;
      case 37:
        this.head.currentDirection = 'left';
        break;
      case 38:
        this.head.currentDirection = 'up';
        break;
      case 40:
        this.head.currentDirection = 'down';
        break;
    }
  }
}