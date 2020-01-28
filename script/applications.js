// ------- Minesweeper -------
function minesweeperInit(app, states) {
  // const ctxScore = app.querySelector('.body .head-panel .counter.score canvas').getContext('2d');
  // const ctxTime = app.querySelector('.body .head-panel .counter.time canvas').getContext('2d');
  const canvas = app.querySelector('.body .game-panel canvas');
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  states.sweeper = {};
  states.sweeper.ctx = ctx;
  states.sweeper.bombAmount = 10;
  states.sweeper.tileCount = {
    x: rect.width / 16,
    y: rect.height / 16,
  };
  sweeperImgs['tile'].then(img => {
    ctx.fillStyle = ctx.createPattern(img, 'repeat');
    ctx.fillRect(0, 0, rect.width, rect.height);
  });
}

//Event functions
function sweeperMouseDown(e, app) {
  const states = appStates.get(app).sweeper;
  const tilePos = getSweeperTile(this, states, e);
  drawSweeperIcon('tile-empty', states, tilePos);
}
function sweeperMouseMove(e, app) {
  if (e.buttons == 1) {
    const states = appStates.get(app).sweeper;
    const tilePos = getSweeperTile(this, states, e);

    if (states.activeTile && tilePos.x === states.activeTile.x && tilePos.y === states.activeTile.y) return;
    else {
      drawSweeperIcon('tile', states, states.activeTile, null, true);
      drawSweeperIcon('tile-empty', states, tilePos);
    }
  }
}
function sweeperMouseUp(e, app) {
  const states = appStates.get(app).sweeper;
  const tilePos = getSweeperTile(this, states, e);
  drawSweeperIcon('tile', states, tilePos, true);
}

//Helper functions
function getSweeperTile(canvas, states, e) {
  const rect = canvas.getBoundingClientRect();
  const click = {
    x: Math.ceil(e.pageX - rect.left) || 1,
    y: Math.ceil(e.pageY - rect.top) || 1
  };
  return {
    x: Math.ceil(click.x / rect.width * states.tileCount.x),
    y: Math.ceil(click.y / rect.height * states.tileCount.y),
  };
}
function drawSweeperIcon(icon, states, tilePos, resetTile, ignore) {
  const ctx = states.ctx;
  sweeperImgs[icon].then(img => {
    if (!ignore) states.activeTile = resetTile ? null : tilePos;
    ctx.drawImage(img, (tilePos.x - 1) * 16, (tilePos.y - 1) * 16);
  });
}
