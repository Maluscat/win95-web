// ------- Minesweeper -------
function minesweeperInit(app, states) {
  states.sweeper = new Minesweeper(app);
}

function Minesweeper(app) {
  const that = this;

  (function() {
    const canvas = app.querySelector('.body .game-panel canvas');
    const faceBtn = app.querySelector('.body .head-panel .btn.face');
    const face = faceBtn.querySelector('.image');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    that.ctx = ctx;
    that.face = face;
    that.canvas = canvas;
    that.bombAmount = 10;
    that.tileCount = {
      x: rect.width / 16,
      y: rect.height / 16,
    };

    newGame();

    faceBtn.addEventListener('click', newGame);
    canvas.addEventListener('mousedown', mouseDown);
  }());


  function newGame(e) {
    if (!e || e && that.pattern) {
      const rect = that.canvas.getBoundingClientRect();
      sweeperImgs['tile'].then(img => {
        that.ctx.fillStyle = that.ctx.createPattern(img, 'repeat');
        that.ctx.fillRect(0, 0, rect.width, rect.height);
      });
      that.pattern = null;
      that.uncovered = null;
      that.surprised = false;
      that.canvas.classList.remove('static');
      switchSweeperFace('smile');
    }
  }

  function mouseDown(e) {
    if (!that.canvas.classList.contains('static')) {
      const tilePos = getTilePosition(e);
      drawSweeperIcon('tile-empty', tilePos, true);
      that.face.classList.toggle('surprised');
      that.surprised = true;

      toggleGlobalEvents();
    }
  }
  function mouseMove(e) {
    const tilePos = getTilePosition(e);
    if (!that.canvas.classList.contains('static') && e.buttons == 1) {
      if (that.activeTile && tilePos.x === that.activeTile.x && tilePos.y === that.activeTile.y) return;
      else {
        drawSweeperIcon('tile', that.activeTile);
        drawSweeperIcon('tile-empty', tilePos, true);
      }
    }
  }
  function mouseUp(e) {
    const tilePos = getTilePosition(e);
    if (!that.canvas.classList.contains('static')) {
      if (!that.pattern) {
        that.uncovered = mapSweeperField(Uint8Array);
        that.pattern = createSweeperPattern(tilePos);
      }

      if (that.uncovered[tilePos.y][tilePos.x] === 0) uncoverSweeperIcon(tilePos);

      that.face.classList.toggle('surprised');
      that.surprised = false;

      toggleGlobalEvents('remove');
    }
  }

  // ------- General Minesweeper functions -------
  function uncoverSweeperIcon(tilePos, checkArea = true) {
    const tile = that.pattern[tilePos.y][tilePos.x];
    let icon;
    if (tile === true) {
      endSweeperGame(tilePos);
      return;
    } else if (tile === 0) {
      icon = 'tile-empty';
      if (checkArea) {
        const tiles = findEmptySweeperArea(tilePos);
        for (const pos of tiles) {
          drawSweeperIcon(icon, pos);
          uncoverSweeperIcon(pos, false);
        }
        return;
      }
    } else {
      icon = 'number/' + tile;
    }
    drawSweeperIcon(icon, tilePos);
    that.uncovered[tilePos.y][tilePos.x] = 1;
  }

  function endSweeperGame(clickedPos) {
    that.ctx.fillStyle = 'red';
    that.ctx.fillRect(clickedPos.x * 16, clickedPos.y * 16, 15, 15);
    that.pattern.loopSweeperMap(function(x, y) {
      if (that.pattern[y][x] === true) {
        const tilePos = {
          x: x,
          y: y
        };
        if (!(tilePos.x == clickedPos.x && tilePos.y == clickedPos.y)) drawSweeperIcon('tile-empty', tilePos);
        drawSweeperIcon('bomb', tilePos);
        that.canvas.classList.add('static');
      }
    });
    switchSweeperFace('devastated');
  }

  function createSweeperPattern(tilePos) {
    const pattern = mapSweeperField();

    //This loop only moves on if the bomb position is unique and if it isn't at the click position
    for (let i = 0; i < that.bombAmount;) {
      const bombPos = {
        x: Math.floor(Math.random() * that.tileCount.x),
        y: Math.floor(Math.random() * that.tileCount.y)
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
        if (y !== that.tileCount.y - 1) {
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
      if (i !== that.tileCount.x - 1 && arr[n + mod][i + 1] === true) count++;
      return count;
    }
  }

  function findEmptySweeperArea(tilePos, dirMod, visited, positions = new Array()) {
    if (!visited) visited = mapSweeperField(Uint8Array);
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
        path.x > that.tileCount.x - 1 ||
        path.y > that.tileCount.y - 1 ||
        visited[path.y][path.x] == 1
      ) continue;
      visited[path.y][path.x] = 1;
      positions.push(path);
      if (that.pattern[path.y][path.x] === 0) {
        findEmptySweeperArea(path, mod, visited, positions);
      }
    }
    return positions;
  }

  // ------- Helper functions -------
  function getTilePosition(e) {
    const rect = that.canvas.getBoundingClientRect();
    const click = {
      x: Math.floor(e.pageX - rect.left),
      y: Math.floor(e.pageY - rect.top)
    };
    return {
      x: Math.floor(click.x / rect.width * that.tileCount.x),
      y: Math.floor(click.y / rect.height * that.tileCount.y),
    };
  }
  function drawSweeperIcon(icon, tilePos, keepActive) {
    if (tilePos && (!that.uncovered || that.uncovered[tilePos.y][tilePos.x] === 0)) {
      sweeperImgs[icon].then(img => {
        that.activeTile = keepActive ? tilePos : null;
        that.ctx.drawImage(img, tilePos.x * 16, tilePos.y * 16);
      });
    }
  }
  function mapSweeperField(method) {
    let pattern = new Array(that.tileCount.y);
    for (let i = 0; i < that.tileCount.y; i++) {
      pattern[i] = new (method || Array)(that.tileCount.x);
    }
    return pattern;
  }
  function switchSweeperFace(face) {
    const node = that.face;
    if (!node.classList.contains(face)) {
      ['smile', 'surprised', 'devastated']
      .forEach(function(variant) {
        node.classList.remove(variant);
      });
      node.classList.add(face);
    }
  }
  function toggleGlobalEvents(method = 'add') {
    window[method + 'EventListener']('mousemove', mouseMove);
    window[method + 'EventListener']('mouseup', mouseUp);
  }
}

// ------- Unspecific helper functions -------
Array.prototype.loopSweeperMap = function(callback) {
  for (let y = 0; y < this.length; y++) {
    for (let x = 0; x < this[y].length; x++) {
      (callback)(x, y);
    }
  }
};
