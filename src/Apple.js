class Apple {

  constructor($el) {
    this.node = $('<img id="apple"></img>');
    this.node.attr('src', 'src/assets/apple.jpg');
    $el.append(this.node);
    this.node.css({ top: 0, left: 0 });
  }

  getPosition() {
    const {top, left} = this.node.position();
    return [top, left];
  }
}
