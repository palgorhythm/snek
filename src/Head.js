// creates a constructor function - research ES6 classes
class SnakeBlock {

  // this is what's called when you use the "new" keyword
  /**
   * 
   * @param {$} $el  
   * @param {{top, left}} pos 
   * @param {string} dir 
   */
  constructor(pos = { top: 0, left: 0 }, dir = 'right') {
    this.node = $('<div></div>');
    this.currentDirection = dir;
    this.stepSize = 50;
    $('#board').append(this.node); // where we add the head to
    this.node.css(pos);
    this.node.addClass('snakeblock');
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
        position.left += this.stepSize;
        break;
      case 'left':
        position.left -= this.stepSize;
        break;
      case 'up':
        position.top -= this.stepSize;
        break;
      case 'down':
        position.top += this.stepSize;
        break;
    }
    if(position.left > 650){
      position.left = 0;
    } else if(position.left < 0){
      position.left = 650;
    } else if(position.top < 0) {
      position.top = 650;
    } else if(position.top > 650) {
      position.top = 0;
    }

    this.node.css(position);
    // setTimeout(this.move.bind(this), this.SPEED); 
    // why do we need to bind to this?
  }

}
