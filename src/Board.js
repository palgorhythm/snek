class Board {
  constructor(){
    this.head = new SnakeBlock();
    this.head.node.attr('id','head');
    this.snake = new Body(this.head);
    this.apple = new Apple($('#board'));
    this.gameSpeed = 100;
    setTimeout(this.updateGameState.bind(this), this.gameSpeed);
  }

  updateGameState(){
    // save the tail position.
    const tail = this.snake.blocks[this.snake.blocks.length - 1];
    const tailDir = tail.getDir();
    const tailPos = tail.getPosition();

    // move
    this.head.move();

    // if we're on top of the apple, we need to USE our cached tail pos
    const headPos = this.head.getPosition();
    const applePos = this.apple.getPosition();
    if ( headPos.top === applePos.top && headPos.left === applePos.left){
      this.eatApple(tailPos, tailDir);
    } 
    // then, we place the new tail.
    setTimeout(this.updateGameState.bind(this), this.gameSpeed);
  }

  eatApple(tailPos, tailDir){
    this.snake.addBlock(tailPos, tailDir);
    console.log(this.snake.blocks);
    // this.apple.respawn();
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