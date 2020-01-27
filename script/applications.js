// ------- Minesweeper -------
function minesweeperInit(app, states) {
  const ctx = app.querySelector('.body .game-panel canvas').getContext('2d');
  // const ctxScore = app.querySelector('.body .head-panel .counter.score canvas').getContext('2d');
  // const ctxTime = app.querySelector('.body .head-panel .counter.time canvas').getContext('2d');
  states.ctx = ctx;
  sweeperLoad.then(tile => {
    ctx.fillStyle = ctx.createPattern(tile, 'repeat');
    ctx.fillRect(0, 0, 128, 128);
  });
}

//Event functions
function sweeperMouseDown() {

}
function sweeperMouseMove() {

}
function sweeperMouseUp() {

}
