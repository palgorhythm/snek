class Board {
  constructor() {
    this.touchFunc = this.touchFunc.bind(this);
    document.addEventListener('touchstart',this.touchFunc,false);
    this.boardElem = $('#board');
    this.boardElem.addClass('gameBoard');
    this.boardElem.hide();
    this.boardElem.css({
      height: `${settings.BOARD_SIZE}px`,
      width: `${settings.BOARD_SIZE}px`
    });
    $('body').on('keydown', this.checkKeyInput.bind(this));
    this.setGameState(GameState.MENU);
    this.sneksong = document.getElementById('sneksong');
    this.sandstorm = document.getElementById('sandstorm');
    this.snekDubstep = document.getElementById('snekDubstep');
    this.sadSong = document.getElementById('sadSong');
    this.score = 0;
    // set up the game loop to run by running a setTimeout that is also
    // called at the end of updateGameState. bind to this bc the E. context
    // of setTimeout is outside of the scope of the Board's this.
  }

  muteAudio() {
    this.sneksong.muted = true;
    this.sandstorm.muted = true;
    this.snekDubstep.muted = true;
    this.sadSong.muted = true;
  }

  updateGameState() {
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
      let curPos = curBlock.getPosition();
      curPos = {top: Math.ceil(curPos.top), left: Math.ceil(curPos.left)};
      this.occupiedSquares[`${Math.ceil(curPos.top)}|${Math.ceil(curPos.left)}`] = true; // changed this from curBlock
    }
    this.head.move();
    const headPos = this.head.getPosition();
    this.occupiedSquares[`${Math.ceil(tailPos.top)}|${Math.ceil(tailPos.left)}`] = false;
    if (this.occupiedSquares[`${Math.ceil(headPos.top)}|${Math.ceil(headPos.left)}`]) {
      this.triggerDeath();
    }
    this.occupiedSquares[`${Math.ceil(headPos.top)}|${Math.ceil(headPos.left)}`] = true; //changed from this.head
    // if we're on top of the apple, we need to USE our cached tail pos
    const applePos = this.apple.getPosition();

    if (
      Math.abs(headPos.top - applePos.top) < 50 &&
      Math.abs(headPos.left - applePos.left) < 50
    ) {
      this.eatApple(tailPos, tailDir);
    }

    if (settings.AI === true) {
      this.planNextMove(this.head.getPosition(), this.apple.getPosition());
    } 
    
    if(settings.AI){
          document.querySelector('#ai-text').innerHTML = 'AI MODE ON' ;
    } else{
      document.querySelector('#ai-text').innerHTML = 'press a to toggle AI mode :3' ;
    }
  }

  triggerDeath() {
    this.snekDubstep.pause();
    const promise = this.sadSong.play();
    promise.then(() =>{
      $('#you-die').show();
      this.pause();
      this.setGameState(GameState.DEATH_SCREEN);
    })
  }

  pause() {
    this.snekDubstep.pause();
    clearInterval(this.gameLoop);
    this.setGameState(GameState.PAUSE);
  }

  goToMenu() {
    this.sneksong.currentTime = 0;
    this.sandstorm.currentTime = 0;
    const playPromises = [];
    playPromises.push(this.sneksong.play());
    playPromises.push(this.sandstorm.play());
    this.snekDubstep.pause();
    this.snekDubstep.currentTime = 0;
    this.sadSong.pause();
    this.sadSong.currentTime = 0;
    Promise.all(playPromises).then(() =>{
      $('#you-die').hide();
      $('#start-screen').show();
      this.boardElem.hide();
      this.setGameState(GameState.MENU);
    })
  }

  start() {
    document.getElementById('mobile-text').style.display = 'none';
    this.sneksong.pause();
    this.sandstorm.pause();
    const promise = this.snekDubstep.play();
    promise.then(() => {
      $('#start-screen').hide();
      this.resetBoard();
      this.resume();
      this.boardElem.show();
    })
  }

  setGameState(GameState) {
    this.gameState = GameState;
  }

  resume() {
    this.snekDubstep.play();
    this.gameLoop = setInterval(
      this.updateGameState.bind(this),
      settings.GAME_SPEED
    );
    this.setGameState(GameState.INGAME);
  }

  resetBoard() {
    this.boardElem.empty();
    this.head = new SnakeBlock();
    this.head.node.attr('id', 'head');
    this.head.node.append('<img id="will" src=src/assets/will.png >');
    this.snake = new Body(this.head);
    this.apple = new Apple();
    this.score = 0;

    // build the board of falses for unoccupied spots and
    // objs for each thing that occupies a spot
    this.occupiedSquares = {};
    for (let i = 0; i < settings.BOARD_SIZE; i += settings.BLOCK_SIZE) {
      for (let j = 0; j < settings.BOARD_SIZE; j += settings.BLOCK_SIZE) {
        this.occupiedSquares[`${i}|${j}`] = false;
      }
    }
    this.occupiedSquares[`0|0`] = this.head;
  }

  eatApple(tailPos, tailDir) {
    const randRGB = [
      255 * Math.random(),
      255 * Math.random(),
      255 * Math.random()
    ];
    this.snake.addBlock(
      tailPos,
      tailDir,
      `rgb(${randRGB[0]},${randRGB[1]},${randRGB[2]})`
    );
    this.score += 1;
    $('#score').html(`score: ${this.score}`);
    // create a random location that none of the snake blocks are at.
    let randLoc = this.getRandomPos();
    while (this.occupiedSquares[`${Math.ceil(randLoc.top)}|${Math.ceil(randLoc.left)}`]) {
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
  touchFunc(){
    // console.log(GameState);
    if(this.gameState === GameState.DEATH_SCREEN){
      this.goToMenu();
    } else if(this.gameState === GameState.MENU){
      this.start();
    } 
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
      case 65: // a
        settings.AI = !settings.AI;
        break;
      case 13: // enter
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
      case 80: // p
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
    return {
      top:
        settings.BLOCK_SIZE *
        Math.floor(
          (settings.BOARD_SIZE / settings.BLOCK_SIZE - 1) * Math.random()
        ),
      left:
        settings.BLOCK_SIZE *
        Math.floor(
          (settings.BOARD_SIZE / settings.BLOCK_SIZE - 1) * Math.random()
        )
    };
  }

  planNextMove(curPos, applePos) {
    const queue = [];
    queue.push([[curPos, 'null']]); // input a POSITION object {top: y, left: x}
    let numIters = 0;
    let maxDepth = 0;
    let foundPath = false;
    while (queue.length && numIters < 5000) {
      let curPath = queue.shift(); // get the first path from the queue
      let lastNode = curPath[curPath.length - 1]; // get the last node on the path
      // console.log(lastNode);
      if (
        Math.ceil(lastNode[0].top) === Math.ceil(applePos.top) &&
        Math.ceil(lastNode[0].left) === Math.ceil(applePos.left)
      ) {
        // console.log(curPath);
        this.head.setDir(curPath[1][1]);
        foundPath = true;
        // console.log('optimal');
        return;
      }
      const validMoves = this.validDirs(lastNode[0]); // find this node's children.
      for (let i = 0; i < validMoves.length; i += 1) {
        let newPath = [...curPath];
        newPath.push(validMoves[i]);
        queue.push(newPath);
        if (newPath.length >= maxDepth) {
          maxDepth = newPath.length;
        }
      }
      numIters += 1;
    }
    // console.log('max depth', maxDepth);
    // console.log('couldnt find optimal');
    if(!foundPath){
      this.planNextMoveOneStep(curPos, applePos);  
    }
    
  }

  planNextMoveOneStep(curPos, applePos) {
    const validMoves = this.validDirs(curPos);
    let theMoveDir;
    let minDist = Infinity;
    let curDist;
    for (let i = 0; i < validMoves.length; i += 1) {
      curDist = this.distance(
        Math.ceil(applePos.top),
        Math.ceil(applePos.left),
        Math.ceil(validMoves[i][0].top),
        Math.ceil(validMoves[i][0].left)
      );
      if (curDist <= minDist) {
        theMoveDir = validMoves[i][1];
        minDist = curDist;
      }
    }
    this.head.setDir(theMoveDir);
  }

  validDirs(curPos) {
    const rightMovePos = [
      {
        top: Math.ceil(curPos.top),
        left: this.mod(Math.ceil(curPos.left) + settings.BLOCK_SIZE, settings.BOARD_SIZE)
      },
      'right'
    ];
    const leftMovePos = [ 
      {
        top: Math.ceil(curPos.top),
        left: this.mod(Math.ceil(curPos.left) - settings.BLOCK_SIZE, settings.BOARD_SIZE)
      },
      'left'
    ];
    const upMovePos = [
      {
        top: this.mod(Math.ceil(curPos.top) - settings.BLOCK_SIZE, settings.BOARD_SIZE),
        left: Math.ceil(curPos.left)
      },
      'up'
    ];
    const downMovePos = [
      {
        top: this.mod(Math.ceil(curPos.top) + settings.BLOCK_SIZE, settings.BOARD_SIZE),
        left: Math.ceil(curPos.left)
      },
      'down'
    ];
    const possMoves = [rightMovePos, leftMovePos, upMovePos, downMovePos];
    // find valid moves NEED TO CHECK BEFORE MOVE!!
    return possMoves.filter(move => {
      return !this.occupiedSquares[`${Math.ceil(move[0].top)}|${Math.ceil(move[0].left)}`];
    });
  }

  validDirsNoWrap(curPos) {
    const rightMovePos = [
      { top: curPos.top, left: curPos.left + settings.BLOCK_SIZE },
      'right'
    ];
    const leftMovePos = [
      { top: curPos.top, left: curPos.left - settings.BLOCK_SIZE },
      'left'
    ];
    const upMovePos = [
      { top: curPos.top - settings.BLOCK_SIZE, left: curPos.left },
      'up'
    ];
    const downMovePos = [
      { top: curPos.top + settings.BLOCK_SIZE, left: curPos.left },
      'down'
    ];
    const possMoves = [rightMovePos, leftMovePos, upMovePos, downMovePos];
    // find valid moves NEED TO CHECK BEFORE MOVE!!
    return possMoves.filter(move => {
      return (
        !this.occupiedSquares[`${move[0].top}|${move[0].left}`] &&
        move[0].top < 650 &&
        move[0].top >= 0 &&
        move[0].left < 650 &&
        move[0].left >= 0
      );
    });
  }

  mod(x, n) {
    return ((x % n) + n) % n;
  }
  distance(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }
}
