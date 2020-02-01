// ------- Minesweeper -------
function minesweeperInit(app, states) {
  // const ctxScore = app.querySelector('.body .head-panel .counter.score canvas').getContext('2d');
  // const ctxTime = app.querySelector('.body .head-panel .counter.time canvas').getContext('2d');
  const canvas = app.querySelector('.body .game-panel canvas');
  const face = app.querySelector('.body .head-panel .btn.face .image');
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  states.sweeper = {};
  states.sweeper.face = face;
  states.sweeper.canvas = canvas;
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
function newSweeperGame(e, app) {
  const states = appStates.get(app).sweeper;

  if (states.pattern) {
    states.pattern.loopSweeperMap(function(x, y) {
      const tilePos = {
        x: x,
        y: y
      };
      drawSweeperIcon('tile', states, tilePos, false, true);
    });
    states.pattern = null;
    states.uncovered = null;
    states.surprised = false;
    states.canvas.classList.remove('static');
    switchSweeperFace(states, 'smile');
  }
}

function sweeperMouseDown(e, app) {
  if (!this.classList.contains('static')) {
    const {states, tilePos} = getSweeperMeta(this, app, e);
    drawSweeperIcon('tile-empty', states, tilePos, true);
    states.face.classList.toggle('surprised');
    states.surprised = true;
  }
}
function sweeperMouseMove(e, app) {
  if (e.buttons == 1 && !this.classList.contains('static')) {
    const {states, tilePos} = getSweeperMeta(this, app, e);
    if (states.activeTile && tilePos.x === states.activeTile.x && tilePos.y === states.activeTile.y) return;
    else {
      drawSweeperIcon('tile', states, states.activeTile);
      drawSweeperIcon('tile-empty', states, tilePos, true);
    }
  }
}
function sweeperMouseUp(e, app) {
  if (!this.classList.contains('static')) {
    const {states, tilePos} = getSweeperMeta(this, app, e);

    if (!states.pattern) {
      states.uncovered = mapSweeperField(states, Uint8Array);
      states.pattern = createSweeperPattern(states, tilePos);
    }

    if (states.uncovered[tilePos.y][tilePos.x] === 0) uncoverSweeperIcon(states, tilePos);
  }
}

// ------- General Minesweeper functions -------
function uncoverSweeperIcon(states, tilePos, checkArea = true) {
  const tile = states.pattern[tilePos.y][tilePos.x];
  let icon;
  if (tile === true) {
    endSweeperGame(states, tilePos);
    return;
  } else if (tile === 0) {
    icon = 'tile-empty';
    if (checkArea) {
      const tiles = findEmptySweeperArea(states, tilePos);
      for (const pos of tiles) {
        drawSweeperIcon(icon, states, pos);
        uncoverSweeperIcon(states, pos, false);
      }
      return;
    }
  } else {
    icon = 'number/' + tile;
  }
  drawSweeperIcon(icon, states, tilePos);
  states.uncovered[tilePos.y][tilePos.x] = 1;
}

function endSweeperGame(states, clickedPos) {
  states.ctx.fillStyle = 'red';
  states.ctx.fillRect(clickedPos.x * 16, clickedPos.y * 16, 15, 15);
  states.pattern.loopSweeperMap(function(x, y) {
    if (states.pattern[y][x] === true) {
      const tilePos = {
        x: x,
        y: y
      };
      if (!(tilePos.x == clickedPos.x && tilePos.y == clickedPos.y)) drawSweeperIcon('tile-empty', states, tilePos);
      drawSweeperIcon('bomb', states, tilePos);
      states.canvas.classList.add('static');
    }
  });
  switchSweeperFace(states, 'devastated');
}

function createSweeperPattern(states, tilePos) {
  const pattern = mapSweeperField(states);

  //This loop only moves on if the bomb position is unique and if it isn't at the click position
  for (let i = 0; i < states.bombAmount;) {
    const bombPos = {
      x: Math.floor(Math.random() * states.tileCount.x),
      y: Math.floor(Math.random() * states.tileCount.y)
    };
    if (pattern[bombPos.y][bombPos.x] === true || bombPos.x == tilePos.x && bombPos.y == tilePos.y) continue;
    pattern[bombPos.y][bombPos.x] = true;
    i++;
  }

  pattern.loopSweeperMap(function(x, y) {
    if (pattern[y][x] !== true) {
      let bombCount = 0;
      if (y !== 0) {
        bombCount += getBombCount(pattern, y, x, -1);
      }
      if (y !== states.tileCount.y - 1) {
        bombCount += getBombCount(pattern, y, x, +1);
      }
      bombCount += getBombCount(pattern, y, x, 0, true);
      pattern[y][x] = bombCount;
    }
  });

  return pattern;

  function getBombCount(arr, n, i, mod, ignoreCenter) {
    let count = 0;
    if (i !== 0 && arr[n + mod][i - 1] === true) count++;
    if (!ignoreCenter && arr[n + mod][i] === true) count++;
    if (i !== states.tileCount.x - 1 && arr[n + mod][i + 1] === true) count++;
    return count;
  }
}

function findEmptySweeperArea(states, tilePos, dirMod, visited, positions = new Array()) {
  if (!visited) visited = mapSweeperField(states, Uint8Array);
  const mods = [
    [0, -1],
    [0, +1],
    [+1, 0],
    [-1, 0],
    [-1, -1],
    [+1, +1],
    [+1, -1],
    [-1, +1]
  ];
  for (const mod of mods) {
    const path = {
      x: tilePos.x + mod[0],
      y: tilePos.y + mod[1]
    };
    if (
      path.x < 0 || path.y < 0 ||
      path.x > states.tileCount.x - 1 ||
      path.y > states.tileCount.y - 1 ||
      visited[path.y][path.x] == 1
    ) continue;
    visited[path.y][path.x] = 1;
    positions.push(path);
    if (states.pattern[path.y][path.x] === 0) {
      findEmptySweeperArea(states, path, mod, visited, positions);
    }
  }
  return positions;
}

// ------- Helper functions -------
function getSweeperMeta(canvas, app, e) {
  const states = appStates.get(app).sweeper;

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
function drawSweeperIcon(icon, states, tilePos, keepActive, force) {
  if (force || tilePos && (!states.uncovered || states.uncovered[tilePos.y][tilePos.x] === 0)) {
    const ctx = states.ctx;
    sweeperImgs[icon].then(img => {
      states.activeTile = keepActive ? tilePos : null;
      ctx.drawImage(img, tilePos.x * 16, tilePos.y * 16);
    });
  }
}
function mapSweeperField(states, method) {
  let pattern = new Array(states.tileCount.y);
  for (let i = 0; i < states.tileCount.y; i++) {
    pattern[i] = new (method || Array)(states.tileCount.x);
  }
  return pattern;
}
function switchSweeperFace(states, face) {
  const node = states.face;
  if (!node.classList.contains(face)) {
    ['smile', 'surprised', 'devastated']
    .forEach(function(variant) {
      node.classList.remove(variant);
    });
    node.classList.add(face);
  }
}

Array.prototype.loopSweeperMap = function(callback) {
  for (let y = 0; y < this.length; y++) {
    for (let x = 0; x < this[y].length; x++) {
      (callback)(x, y);
    }
  }
};
