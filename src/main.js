$(document).ready(function() {
  const board = new Board();

  $('body').on('keydown', board.checkKeyInput);
});
