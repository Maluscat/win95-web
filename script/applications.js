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

// ------- Event functions -------
function sweeperMouseDown(e, app) {
  const {states, tilePos} = getSweeperMeta(this, app, e);
  drawSweeperIcon('tile-empty', states, tilePos, true);
}
function sweeperMouseMove(e, app) {
  if (e.buttons == 1) {
    const {states, tilePos} = getSweeperMeta(this, app, e);
    if (states.activeTile && tilePos.x === states.activeTile.x && tilePos.y === states.activeTile.y) return;
    else {
      drawSweeperIcon('tile', states, states.activeTile);
      drawSweeperIcon('tile-empty', states, tilePos, true);
    }
  }
}
function sweeperMouseUp(e, app) {
  const {states, tilePos} = getSweeperMeta(this, app, e);

  if (!states.pattern) {
    states.uncovered = mapSweeperField(states, Uint8Array);
    states.pattern = createSweeperPattern(states, tilePos);
  }
  const tilePattern = states.pattern[tilePos.y][tilePos.x];

  let icon;
  switch (tilePattern) {
    case true:
      icon = 'bomb';
      break;
    case 0:
      icon = 'tile-empty';
      break;
    default:
      icon = 'number/' + tilePattern;
  }
  drawSweeperIcon(icon, states, tilePos, false);
  states.uncovered[tilePos.y][tilePos.x] = 1;
}

// ------- Helper functions -------
function getSweeperMeta(canvas, app, e) {
  const states = appStates.get(app).sweeper

  const rect = canvas.getBoundingClientRect();
  const click = {
    x: Math.floor(e.pageX - rect.left),
    y: Math.floor(e.pageY - rect.top)
  };
  const tilePos = {
    x: Math.floor(click.x / rect.width * states.tileCount.x),
    y: Math.floor(click.y / rect.height * states.tileCount.y),
  };

  return {states, tilePos};
}
function drawSweeperIcon(icon, states, tilePos, keepActive) {
  if (tilePos && (!states.uncovered || states.uncovered[tilePos.y][tilePos.x] === 0)) {
    const ctx = states.ctx;
    sweeperImgs[icon].then(img => {
      states.activeTile = keepActive ? tilePos : null;
      ctx.drawImage(img, tilePos.x * 16, tilePos.y * 16);
    });
  }
}

function createSweeperPattern(states, tilePos) {
  const pattern = mapSweeperField(states);

  //This loop only moves on if the bomb position is unique and if it isn't at the click position
  for (let i = 0; i < states.bombAmount;) {
    const bombPos = [
      Math.floor(Math.random() * states.tileCount.x),
      Math.floor(Math.random() * states.tileCount.y)
    ];
    if (pattern[bombPos[0]][bombPos[1]] === true || bombPos[0] == tilePos.x && bombPos[1] == tilePos.y) continue;
    pattern[bombPos[0]][bombPos[1]] = true;
    i++;
  }

  for (let n = 0; n < pattern.length; n++) {
    for (let i = 0; i < pattern[n].length; i++) {
      if (pattern[n][i] !== true) {
        let bombCount = 0;
        if (n !== 0) {
          bombCount += getBombCount(pattern, n, i, -1);
        }
        if (n !== states.tileCount.y - 1) {
          bombCount += getBombCount(pattern, n, i, +1);
        }
        bombCount += getBombCount(pattern, n, i, 0, true);
        pattern[n][i] = bombCount;
      }
    }
  }

  return pattern;

  function getBombCount(arr, n, i, mod, ignoreCenter) {
    let count = 0;
    if (i !== 0 && arr[n + mod][i - 1] === true) count++;
    if (!ignoreCenter && arr[n + mod][i] === true) count++;
    if (i !== states.tileCount.x - 1 && arr[n + mod][i + 1] === true) count++;
    return count;
  }
}

function mapSweeperField(states, method) {
  let pattern = new Array(states.tileCount.y);
  for (let i = 0; i < states.tileCount.y; i++) {
    pattern[i] = new (method || Array)(states.tileCount.x);
  }
  return pattern;
}
