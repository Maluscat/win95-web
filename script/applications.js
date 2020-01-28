// ------- Minesweeper -------
function minesweeperInit(app, states) {
  const ctx = app.querySelector('.body .game-panel canvas').getContext('2d');
  // const ctxScore = app.querySelector('.body .head-panel .counter.score canvas').getContext('2d');
  // const ctxTime = app.querySelector('.body .head-panel .counter.time canvas').getContext('2d');
  states.sweeper = {};
  states.sweeper.ctx = ctx;
  sweeperImgs['tile'].then(img => {
    ctx.fillStyle = ctx.createPattern(img, 'repeat');
    ctx.fillRect(0, 0, 128, 128);
  });
}

//Event functions
function sweeperMouseDown(e, app) {
  const states = appStates.get(app).sweeper;
  const tilePos = getSweeperTile(this, e);
  drawSweeperIcon('tile-empty', states, tilePos);
}
function sweeperMouseMove(e, app) {
  if (e.buttons == 1) {
    const states = appStates.get(app).sweeper;
    const tilePos = getSweeperTile(this, e);

    if (states.activeTile && tilePos.x === states.activeTile.x && tilePos.y === states.activeTile.y) return;
    else {
      drawSweeperIcon('tile', states, states.activeTile, null, true);
      drawSweeperIcon('tile-empty', states, tilePos);
    }
  }
}
function sweeperMouseUp(e, app) {
  const states = appStates.get(app).sweeper;
  const tilePos = getSweeperTile(this, e);
  drawSweeperIcon('tile', states, tilePos, true);
}

//Helper functions
function getSweeperTile(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const tileCount = rect.width / sweepTileSize;
  const click = {
    x: Math.ceil(e.pageX - rect.left) || 1,
    y: Math.ceil(e.pageY - rect.top) || 1
  };
  return {
    x: Math.ceil(click.x / rect.width * tileCount),
    y: Math.ceil(click.y / rect.height * tileCount),
  };
}
function drawSweeperIcon(icon, states, tilePos, resetTile, ignore) {
  const ctx = states.ctx;
  sweeperImgs[icon].then(img => {
    if (!ignore) states.activeTile = resetTile ? null : tilePos;
    ctx.drawImage(img, (tilePos.x - 1) * sweepTileSize, (tilePos.y - 1) * sweepTileSize);
  });
}
