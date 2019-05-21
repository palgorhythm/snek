class Apple {
  /**
   * Spawns an apple in the board
   * @param {{top, left}}} pos 
   */
  constructor(pos = {top: 200, left: 200}) {
    this.node = $('<img id="apple"></img>');
    this.node.attr('src', 'src/assets/apple.jpg');
    $('#board').append(this.node);
    this.node.css({ top: pos.top, left: pos.left });
  }

  getPosition() {
    return this.node.position();
  }
}
