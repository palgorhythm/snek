$(document).ready(function() {
  const head = new Head($('#board'));
  const apple = new Apple($('#board'));

  $('body').on('keydown', function(e) {
    if (e.keyCode === 37) {
      console.log('pressed left');
      head.currentDirection = 'left';
    }
    switch (e.keyCode) {
      case 39:
        head.currentDirection = 'right';
        break;
      case 37:
        head.currentDirection = 'left';
        break;
      case 38:
        head.currentDirection = 'up';
        break;
      case 40:
        head.currentDirection = 'down';
        break;
    }
  });
});
