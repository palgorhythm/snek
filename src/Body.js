class Body {
  /**
   * Creates a new body with only a head
   * @param {SnakeBlock} head the head of the snake
   */
  constructor(head){
    this.blocks = [head];
  }

  addBlock(pos, dir, color){
    this.blocks.push(new SnakeBlock(pos, dir, color));
  }
}