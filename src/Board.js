class Board {
  constructor(){
    this.head = new SnakeBlock();
    this.head.node.attr('id','head');
    this.snake = new Body(this.head);
    this.apple = new Apple($('#board'));
    $('#board').css({ height: `${settings.BOARD_SIZE}px`,
      width: `${settings.BOARD_SIZE}px`,
      border: "1px black solid",
      position: "relative"})

    // build the board of falses for unoccupied spots and 
    // objs for each thing that occupies a spot
    this.occupiedSquares = {}; 
    for(let i = 0; i < settings.BOARD_SIZE; i += settings.BLOCK_SIZE) {
      for(let j = 0; j < settings.BOARD_SIZE; j += settings.BLOCK_SIZE) {
        this.occupiedSquares[`${i}|${j}`] = false; 
      }
    }
    this.occupiedSquares[`0|0`] = this.head;
    
    // set up the game loop to run by running a setTimeout that is also
    // called at the end of updateGameState. bind to this bc the E. context
    // of setTimeout is outside of the scope of the Board's this.
    setTimeout(this.updateGameState.bind(this), settings.GAME_SPEED);
    $('body').on('keydown', this.checkKeyInput.bind(this));
  }

  updateGameState(){
    // save the tail position, bc if we're eating an apple in this frame,
    // we need to know where the tail was before we apply move() so we can
    // add a new one in the correct position and take it into account when spawning
    // a new apple.
    const tail = this.snake.blocks[this.snake.blocks.length - 1];
    const tailDir = tail.getDir();
    const tailPos = tail.getPosition();
    this.occupiedSquares[`${tailPos.top}|${tailPos.top}`] = false;

    // move   
    for (let i = this.snake.blocks.length - 1; i > 0; i -= 1) {
      const curBlock = this.snake.blocks[i];
      const nextBlock = this.snake.blocks[i - 1];
      curBlock.move();
      curBlock.setDir(nextBlock.getDir());
    }
    this.head.move();
    const headPos = this.head.getPosition();
    this.occupiedSquares[`${headPos.top}|${headPos.top}`] = this.head;

    // if we're on top of the apple, we need to USE our cached tail pos
    const applePos = this.apple.getPosition();
    if ( headPos.top === applePos.top && headPos.left === applePos.left){
      this.eatApple(tailPos, tailDir);
    } 
    // then, we place the new tail.
    setTimeout(this.updateGameState.bind(this), settings.GAME_SPEED);
  }

  eatApple(tailPos, tailDir){
    console.log(tailPos);
    this.snake.addBlock(tailPos, tailDir);
    // console.log(this.snake.blocks);
    // this.apple.respawn();
  }

  checkKeyInput(e) {
    // console.log(this.head);
    if (e.keyCode === 37) {
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