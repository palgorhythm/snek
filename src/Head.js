// creates a constructor function - research ES6 classes
class Head {

  // this is what's called when you use the "new" keyword
  constructor($el) {
    this.node = $('<div id="head"></div>');
    this.currentDirection = 'right';
    this.stepSize = 50;
    $el.append(this.node); // where we add the head to
    this.node.css({ top: 0, left: 0 });
    // setTimeout(this.move.bind(this), this.SPEED);
  }

  getPosition() {
    const {top, left} = this.node.position();
    return [top, left];
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
