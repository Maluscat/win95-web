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
    const rect = canvas.getBoundingClientRect();
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
    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  }());
  const ctx = that.canvas.getContext('2d');

  // ------- Mouse events -------
  function mouseDown(e) {
    if (!that.canvas.classList.contains('static')) {
      if (e.buttons == 1 || e.buttons == 2) {
        var tilePos = getTilePosition(e);
        if (!that.state) {
          //0 == undiscovered, 1 == discovered, 2 == flagged
          that.state = mapField(Uint8Array);
        }
      }
      if (e.buttons == 1) {
        drawIcon('tile-empty', tilePos, true);
        that.face.classList.toggle('surprised');
        that.surprised = true;
        toggleGlobalEvents();
      } else if (e.buttons == 2 && that.state[tilePos.y][tilePos.x] != 1) {
        if (that.state[tilePos.y][tilePos.x] == 2) {
          drawIcon('tile', tilePos, false, true);
          that.state[tilePos.y][tilePos.x] = 0;
        } else {
          drawIcon('flag', tilePos);
          that.state[tilePos.y][tilePos.x] = 2;
        }
      }
    }
  }
  function mouseMove(e) {
    const tilePos = getTilePosition(e);
    if (!that.canvas.classList.contains('static')) {
      if (that.activeTile && tilePos.x === that.activeTile.x && tilePos.y === that.activeTile.y) return;
      else {
        drawIcon('tile', that.activeTile);
        if (tilePosIsValid(tilePos)) drawIcon('tile-empty', tilePos, true);
      }
    }
  }
  function mouseUp(e) {
    const tilePos = getTilePosition(e);
    if (!that.canvas.classList.contains('static')) {
      if (!that.pattern) that.pattern = createPattern(tilePos);

      if (tilePosIsValid(tilePos) && that.state[tilePos.y][tilePos.x] === 0) uncoverTile(tilePos);

      that.face.classList.toggle('surprised');
      that.surprised = false;

    }
    toggleGlobalEvents('remove');
  }

  // ------- General functions -------
  function newGame(e) {
    if (!e || e && (that.pattern || that.state)) {
      const rect = that.canvas.getBoundingClientRect();
      sweeperImgs['tile'].then(img => {
        ctx.fillStyle = ctx.createPattern(img, 'repeat');
        ctx.fillRect(0, 0, rect.width, rect.height);
      });
      that.pattern = null;
      that.state = null;
      that.surprised = false;
      that.canvas.classList.remove('static');
      switchBtnFace('smile');
    }
  }
  function lostGame(tilePos) {
    ctx.fillStyle = 'red';
    ctx.fillRect(tilePos.x * 16, tilePos.y * 16, 15, 15);
    that.pattern.loopSweeperMap((x, y, item) => {
      if (item === true) {
        const itemPos = {
          x: x,
          y: y
        };
        if (!(itemPos.x == tilePos.x && itemPos.y == tilePos.y)) drawIcon('tile-empty', itemPos);
        drawIcon('bomb', itemPos);
      } else if (that.state[y][x] == 2) {
        const itemPos = {
          x: x,
          y: y
        };
        drawIcon('tile-empty', itemPos, false, true);
        drawIcon('cross', itemPos, false, true);
      }
    });
    that.canvas.classList.add('static');
    switchBtnFace('devastated');
  }
  function wonGame(bombPos) {
    for (const pos of bombPos) {
      if (that.state[pos.y][pos.x] !== 2) drawIcon('flag', pos);
    }
    that.canvas.classList.add('static');
    switchBtnFace('swag');
  }

  function createPattern(tilePos) {
    const pattern = mapField();

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

    pattern.loopSweeperMap((x, y, item) => {
      if (item !== true) {
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
  function seekEmptyArea(tilePos, dirMod, visited, positions = new Array()) {
    if (!visited) visited = mapField(Uint8Array);
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
      if (!tilePosIsValid(path) || visited[path.y][path.x] == 1) continue;
      visited[path.y][path.x] = 1;
      if (that.state[path.y][path.x] != 2) {
        positions.push(path);
        if (that.pattern[path.y][path.x] === 0) {
          seekEmptyArea(path, mod, visited, positions);
        }
      }
    }
    return positions;
  }

  function uncoverTile(tilePos, recursion) {
    const tile = that.pattern[tilePos.y][tilePos.x];
    let icon;
    if (tile === true) {
      lostGame(tilePos);
      return;
    } else if (tile === 0) {
      icon = 'tile-empty';
      if (!recursion) {
        const tiles = seekEmptyArea(tilePos);
        for (const pos of tiles) {
          drawIcon(icon, pos);
          uncoverTile(pos, true);
        }
      }
    } else {
      icon = 'number/' + tile;
    }
    if (recursion || tile !== 0) {
      drawIcon(icon, tilePos);
      that.state[tilePos.y][tilePos.x] = 1;
    }
    if (!recursion) {
      const bombPos = new Array();
      for (let y = 0; y < that.state.length; y++) {
        for (let x = 0; x < that.state[y].length; x++) {
          if (that.state[y][x] === 0 && that.pattern[y][x] !== true) return;
          const pos = {
            x: x,
            y: y
          };
          bombPos.push(pos);
        }
      }
      wonGame(bombPos);
    }
  }

  // ------- Helper functions -------
  function drawIcon(icon, tilePos, keepActive, force) {
    if (tilePos && (!that.state || force || that.state[tilePos.y][tilePos.x] === 0)) {
      sweeperImgs[icon].then(img => {
        that.activeTile = keepActive ? tilePos : null;
        ctx.drawImage(img, tilePos.x * 16, tilePos.y * 16);
      });
    }
  }
  function mapField(method) {
    let pattern = new Array(that.tileCount.y);
    for (let i = 0; i < that.tileCount.y; i++) {
      pattern[i] = new (method || Array)(that.tileCount.x);
    }
    return pattern;
  }
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
  function switchBtnFace(face) {
    const node = that.face;
    if (!node.classList.contains(face)) {
      ['smile', 'surprised', 'devastated', 'swag']
      .forEach(function(variant) {
        node.classList.remove(variant);
      });
      node.classList.add(face);
    }
  }
  function tilePosIsValid(tilePos) {
    return (
      tilePos.x >= 0 &&
      tilePos.y >= 0 &&
      tilePos.x < that.tileCount.x &&
      tilePos.y < that.tileCount.y
    );
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
      (callback)(x, y, this[y][x]);
    }
  }
};
