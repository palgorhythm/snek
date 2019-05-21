$(document).ready(function() {
  const board = new Board();
  console.log(board.snake);
  $('body').on('keydown', board.checkKeyInput);
});
