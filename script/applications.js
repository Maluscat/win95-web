// ------- Minesweeper -------
function minesweeperInit(app, states) {
  const ctx = app.querySelector('.body .game-panel canvas').getContext('2d');
  // const ctxScore = app.querySelector('.body .head-panel .counter.score canvas').getContext('2d');
  // const ctxTime = app.querySelector('.body .head-panel .counter.time canvas').getContext('2d');
  states.ctx = ctx;
  sweeperImgs['tile'].then(img => {
    ctx.fillStyle = ctx.createPattern(img, 'repeat');
    ctx.fillRect(0, 0, 128, 128);
  });
}

//Event functions
function sweeperMouseDown(e, app) {
  const rect = this.getBoundingClientRect();
  const tileSize = 16;
  const tileCount = rect.width / 16;
  const click = {
    x: Math.ceil(e.pageX - rect.left) || 1,
    y: Math.ceil(e.pageY - rect.top) || 1
  };
  const tileNum = {
    x: Math.ceil(click.x / rect.width * tileCount),
    y: Math.ceil(click.y / rect.height * tileCount),
  };

  const ctx = appStates.get(app).ctx;
  sweeperImgs['tile-empty'].then(img => {
    ctx.drawImage(img, (tileNum.x - 1) * tileSize, (tileNum.y - 1) * tileSize);
  });
}
function sweeperMouseMove(e, app) {
  console.log(e);
}
function sweeperMouseUp(e, app) {

}
