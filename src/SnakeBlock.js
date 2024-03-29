// creates a constructor function - research ES6 classes
class SnakeBlock {

  // this is what's called when you use the "new" keyword
  /**
   * 
   * @param {$} $el  
   * @param {{top, left}} pos 
   * @param {string} dir 
   */
  constructor(pos = { top: 0, left: 0 }, dir = 'right', myColor = 'transparent') {
    this.node = $('<div></div>');
    this.currentDirection = dir;
    $('#board').append(this.node); // where we add the head to
    this.node.css(pos);
    this.myColor = myColor;
    this.node.css('background-color', this.myColor);
    this.node.addClass('snakeblock');
    this.node.css({height: settings.BLOCK_SIZE, width: settings.BLOCK_SIZE});
  }

  getPosition() {
    return this.node.position();
  }
  getDir(){
    return this.currentDirection;
  }

  setDir(dir){
    this.currentDirection = dir;
  }

  // same as Head.prototype.move = function() {...}
  move() {
    let direction = this.currentDirection;
    let position = this.node.position();
    switch (direction) {
      case 'right':
        position.left += settings.BLOCK_SIZE;
        break;
      case 'left':
        position.left -= settings.BLOCK_SIZE;
        break;
      case 'up':
        position.top -= settings.BLOCK_SIZE;
        break;
      case 'down':
        position.top += settings.BLOCK_SIZE;
        break;
    }
    if(position.left > settings.BOARD_SIZE - settings.BLOCK_SIZE){
      position.left = 0;
    } else if(position.left < 0){
      position.left = settings.BOARD_SIZE - settings.BLOCK_SIZE;
    } else if(position.top < 0) {
      position.top = settings.BOARD_SIZE - settings.BLOCK_SIZE;
    } else if(position.top > settings.BOARD_SIZE - settings.BLOCK_SIZE) {
      position.top = 0;
    }

    this.node.css({top: Math.ceil(position.top), left: Math.ceil(position.left)});
  }

}
