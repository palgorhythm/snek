class Board {
  constructor(){
    this.boardElem = $('#board');
    this.boardElem.addClass('gameBoard');
    this.boardElem.hide();
    this.boardElem.css({ height: `${settings.BOARD_SIZE}px`,
      width: `${settings.BOARD_SIZE}px`})
    $('body').on('keydown', this.checkKeyInput.bind(this));
    this.setGameState(GameState.MENU);
    document.getElementById("sneksong").play(); 
    document.getElementById("sandstorm").play(); 
    // set up the game loop to run by running a setTimeout that is also
    // called at the end of updateGameState. bind to this bc the E. context
    // of setTimeout is outside of the scope of the Board's this.
  }

  updateGameState(){
    // save the tail position, bc if we're eating an apple in this frame,
    // we need to know where the tail was before we apply move() so we can
    // add a new one in the correct position and take it into account when spawning
    // a new apple.
    const tail = this.snake.blocks[this.snake.blocks.length - 1];
    const tailDir = tail.getDir();
    const tailPos = tail.getPosition();
    // move   
    for (let i = this.snake.blocks.length - 1; i > 0; i -= 1) {
      const curBlock = this.snake.blocks[i];
      const nextBlock = this.snake.blocks[i - 1];
      curBlock.move();
      curBlock.setDir(nextBlock.getDir());
      const curPos = curBlock.getPosition();
      this.occupiedSquares[`${curPos.top}|${curPos.left}`] = curBlock;
    }
    this.head.move();
    const headPos = this.head.getPosition();
    this.occupiedSquares[`${tailPos.top}|${tailPos.left}`] = false;
    if (this.occupiedSquares[`${headPos.top}|${headPos.left}`]) {
      this.triggerDeath();
    }
    this.occupiedSquares[`${headPos.top}|${headPos.left}`] = this.head;
    // console.log(settings.AI);
    if(settings.AI){
      // console.log(settings.AI);
      this.planNextMove(this.head.getPosition(), this.apple.getPosition());
    }
    // if we're on top of the apple, we need to USE our cached tail pos
    const applePos = this.apple.getPosition();
    
    if (Math.abs(headPos.top - applePos.top) < 50 && Math.abs(headPos.left-applePos.left) < 50){
      this.eatApple(tailPos, tailDir);
    } 
    // then, we place the new tail.
    // setTimeout(this.updateGameState.bind(this), settings.GAME_SPEED);
  }

  triggerDeath() {
    document.getElementById("snekDubstep").pause(); 
    document.getElementById("sadSong").play(); 
    $('#you-die').show();
    this.pause();
    this.setGameState(GameState.DEATH_SCREEN);
  }

  pause() {
    document.getElementById("snekDubstep").pause(); 
    clearInterval(this.gameLoop);
    this.setGameState(GameState.PAUSE);
  }

  goToMenu() {
    document.getElementById("sneksong").currentTime = 0; 
    document.getElementById("sandstorm").currentTime = 0; 
    document.getElementById("sneksong").play(); 
    document.getElementById("sandstorm").play(); 
    document.getElementById("snekDubstep").pause(); 
    document.getElementById("snekDubstep").currentTime = 0; 
    document.getElementById("sadSong").pause(); 
    document.getElementById("sadSong").currentTime = 0;
    $('#you-die').hide();
    $('#start-screen').show();
    this.boardElem.hide();
    this.setGameState(GameState.MENU);
  }

  start() {
    document.getElementById("sneksong").pause(); 
    document.getElementById("sandstorm").pause(); 
    document.getElementById("snekDubstep").play(); 
    $('#start-screen').hide();
    this.resetBoard();
    this.resume();
    this.boardElem.show();
  }

  setGameState(GameState) {
    this.gameState = GameState;
  }

  resume() {
    document.getElementById("snekDubstep").play(); 
    this.gameLoop = setInterval(this.updateGameState.bind(this), settings.GAME_SPEED);
    this.setGameState(GameState.INGAME);
  }

  resetBoard() {
    this.boardElem.empty();
    this.head = new SnakeBlock();
    this.head.node.attr('id','head');
    this.head.node.append('<img id="will" src=src/assets/will.png \>');
    this.snake = new Body(this.head);
    this.apple = new Apple();
    this.score = 0;
    // build the board of falses for unoccupied spots and 
    // objs for each thing that occupies a spot
    this.occupiedSquares = {}; 
    for(let i = 0; i < settings.BOARD_SIZE; i += settings.BLOCK_SIZE) {
      for(let j = 0; j < settings.BOARD_SIZE; j += settings.BLOCK_SIZE) {
        this.occupiedSquares[`${i}|${j}`] = false; 
      }
    }
    this.occupiedSquares[`0|0`] = this.head;
  };

  eatApple(tailPos, tailDir){
    const randRGB = [255*Math.random(), 255*Math.random(), 255*Math.random()];
    this.snake.addBlock(tailPos, tailDir,`rgb(${randRGB[0]},${randRGB[1]},${randRGB[2]})`);
    this.score += 1;
    $('#score').html(`score: ${this.score}`);
    // create a random location that none of the snake blocks are at.
    let randLoc = this.getRandomPos();
    while (this.occupiedSquares[`${randLoc.top}|${randLoc.left}`]) {
      randLoc = this.getRandomPos();
    }
    this.apple.respawn(randLoc);
  }

  increaseSpeed() {
    if (this.gameState !== GameState.INGAME) return;
    settings.GAME_SPEED = Math.max(25, settings.GAME_SPEED - 25);
    console.log('speed', settings.GAME_SPEED);
    this.pause();
    this.resume();
  }
  decreaseSpeed() {
    if (this.gameState !== GameState.INGAME) return;
    settings.GAME_SPEED = Math.min(1000, settings.GAME_SPEED + 25); 
    console.log('speed', settings.GAME_SPEED);
    this.pause();
    this.resume();
  }

  checkKeyInput(e) {
    switch (e.keyCode) {
      case 39:
        if (this.head.currentDirection === 'left') return;
        this.head.currentDirection = 'right';
        break;
      case 37:
          if (this.head.currentDirection === 'right') return;
        this.head.currentDirection = 'left';
        break;
      case 38:
          if (this.head.currentDirection === 'down') return;
        this.head.currentDirection = 'up';
        break;
      case 40:
          if (this.head.currentDirection === 'up') return;
        this.head.currentDirection = 'down';
        break;
      case 65:
        settings.AI = !settings.AI;
        break;
      case 13:
        switch (this.gameState) {
          case GameState.DEATH_SCREEN:
            this.goToMenu();
            break;
          case GameState.MENU:
            this.start();
            break;
          default:
            break;
        }
        break;
      case 80:
        switch (this.gameState) {
          case GameState.INGAME:
            this.pause();
            break;
          case GameState.PAUSE:
            this.resume();
            break;
          default:
            break;
        }
        break;
      case 77: // m
        this.increaseSpeed();
        break;
      case 78: // n
        this.decreaseSpeed();
        break;
    }
  }

  getRandomPos() {
    return {top: settings.BLOCK_SIZE*Math.floor((settings.BOARD_SIZE/settings.BLOCK_SIZE - 1)*Math.random()),
      left: settings.BLOCK_SIZE*Math.floor((settings.BOARD_SIZE/settings.BLOCK_SIZE - 1)*Math.random())}
  }

  planNextMove(curPos, applePos){
    const rightMovePos = [{top: curPos.top, left: this.mod((curPos.left + settings.BLOCK_SIZE), settings.BOARD_SIZE)},'right'];
    const leftMovePos = [{top: curPos.top, left: this.mod((curPos.left - settings.BLOCK_SIZE), settings.BOARD_SIZE)},'left'];
    const upMovePos = [{top: this.mod((curPos.top - settings.BLOCK_SIZE), settings.BOARD_SIZE), left: curPos.left},'up'];
    const downMovePos = [{top: this.mod((curPos.top + settings.BLOCK_SIZE), settings.BOARD_SIZE), left: curPos.left},'down'];
    
    const possMoves = [rightMovePos, leftMovePos, upMovePos, downMovePos];
    // find valid moves NEED TO CHECK BEFORE MOVE!!
    const validMoves = possMoves.filter(move => {
      return !this.occupiedSquares[`${move[0].top}|${move[0].left}`];
    });
    let theMoveDir;
    let minDist = Infinity;
    let curDist;
    for (let i = 0; i < validMoves.length; i += 1) {
      curDist = this.distance(applePos.top,applePos.left, validMoves[i][0].top,validMoves[i][0].left);
      if(curDist <= minDist) {
        theMoveDir = validMoves[i][1];
        minDist = curDist;
      }
    }

    this.head.setDir(theMoveDir);
  }

  mod(x, n) {
    return ((x%n)+n)%n;  
  };
  distance(x1,y1,x2,y2){
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt( a*a + b*b );
  }
}