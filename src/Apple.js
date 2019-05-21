class Apple {
  /**
   * Spawns an apple in the board
   * @param {{top, left}}} pos 
   */
  constructor(pos = {top: 200, left: 200}) {
    this.node = $('<img id="apple"></img>');
    const picList = ['apple','baby','dog','pizza','seal']
    const randIndex = Math.floor((picList.length-1)*Math.random());
    console.log(randIndex);
    this.node.attr('src', `src/assets/${picList[randIndex]}.png`);
    this.node.css({ top: pos.top, left: pos.left });
    $('#board').append(this.node);
  }

  getPosition() {
    return this.node.position();
  }
}
