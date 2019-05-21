const settings = {BOARD_SIZE: 700, BLOCK_SIZE: 20, GAME_SPEED: 50};
Object.freeze(settings);

$(document).ready(function() {
  const board = new Board();
  console.log(board.snake);
});
