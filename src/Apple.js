class Apple {
  /**
   * Spawns an apple in the board
   * @param {{top, left}}} pos 
   */
  constructor(pos = {top: 200, left: 200}) {
    this.node = $('<img id="apple"></img>');
    this.setPosition(pos);
    this.setImg();
    $('#board').append(this.node);
  }

  getPosition() {
    return this.node.position();
  }

  setPosition(pos = {top: 200, left: 200}) {
    this.node.css({ top: pos.top, left: pos.left });
  }

  setImg(){
    const picList = ['apple','baby','dog','pizza','seal']
    const randIndex = Math.floor((picList.length-1)*Math.random());
    this.node.attr('src', `src/assets/${picList[randIndex]}.png`);
  }

  respawn(pos = {top: 200, left: 200}){
    this.setImg();
    this.setPosition(pos);
  }
}
