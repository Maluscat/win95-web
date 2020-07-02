// ------- Minesweeper -------
function submitSweeperPrompt(e, app) {
  const fields = app.querySelector('.body .inputs');
  const values = {
    height: fields.querySelector('.field.item-height input').value,
    width: fields.querySelector('.field.item-width input').value,
    mines: fields.querySelector('.field.item-mines input').value
  };
  const sweeper = appStates.get(app).sweeperLink;
  const states = appStates.get(sweeper).minesweeper;
  states.dims.height = values.height * 16;
  states.dims.width = values.width * 16;
  states.bombAmount = values.mines;
  states.newGame(null, true);

  closeApp(e, app);
}

function Minesweeper(app) {
  const that = this;
  let timeInterval;

  this.newGame = newGame;
  this.changeField = changeField;
  this.toggleQuestionMarks = toggleQuestionMarks;
  (function() {
    const counterBombs = app.querySelector('.body .head-panel .counter.bombs canvas');
    const counterTime = app.querySelector('.body .head-panel .counter.time canvas');
    const canvas = app.querySelector('.body .game-panel canvas');
    const faceBtn = app.querySelector('.body .head-panel .btn.face');
    const face = faceBtn.querySelector('.image');
    const rect = canvas.getBoundingClientRect();
    that.face = face;
    that.canvas = canvas;
    that.counterBombs = counterBombs;
    that.counterTime = counterTime;
    that.bombAmount = 10;
    that.bombVal = 10; //Bomb panel value
    that.time = 0; //Time panel value
    that.marks = false;
    that.stateIcons = {
      0: 'tile',
      1: 'tile-empty',
      2: 'flag',
      3: 'mark'
    };
    that.dims = {
      width: 128,
      height: 128
    };

    faceBtn.addEventListener('click', that.newGame);
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  }());
  const ctxBombs = that.counterBombs.getContext('2d');
  const ctxTime = that.counterTime.getContext('2d');
  const ctx = that.canvas.getContext('2d');

  that.newGame(null, true);

  // ------- Mouse events -------
  function mouseDown(e) {
    if (!that.canvas.classList.contains('static')) {
      if (e.buttons == 1 || e.buttons == 2) {
        var tilePos = getTilePosition(e);
        if (!that.state) {
          //0 == undiscovered, 1 == discovered, 2 == flagged, 3 == question marked
          that.state = mapField(Uint8Array);
        }
      }
      const tileState = that.state[tilePos.y][tilePos.x];
      if (e.buttons == 1) {
        drawIcon('tile-empty', tilePos, true);
        if (tileState == 3) drawIcon('mark', tilePos, true, false, true);
        that.face.classList.toggle('surprised');
        toggleGlobalEvents();
      } else if (e.buttons == 2 && tileState != 1) {
        if (that.marks && tileState == 3) {
          that.state[tilePos.y][tilePos.x] = 0;
        } else if (tileState == 2) {
          let state = 0;
          if (that.marks) {
            state = 3;
            drawIcon('tile', tilePos, false, true);
          }
          that.state[tilePos.y][tilePos.x] = state;
          that.bombVal++;
        } else { //tileState == 0
          that.state[tilePos.y][tilePos.x] = 2;
          that.bombVal--;
        }
        drawIcon(null, tilePos);
        drawPanel('bombs');
      }
    }
  }
  function mouseMove(e) {
    const tilePos = getTilePosition(e);
    if (!that.canvas.classList.contains('static')) {
      if (that.activeTile && tilePos.x === that.activeTile.x && tilePos.y === that.activeTile.y) return;
      else {
        drawIcon('tile', that.activeTile);
        if (that.activeTile && that.state[that.activeTile.y][that.activeTile.x] == 3) drawIcon('mark', that.activeTile);
        if (tilePosIsValid(tilePos)) {
          drawIcon('tile-empty', tilePos, true);
          if (that.state[tilePos.y][tilePos.x] == 3) drawIcon('mark', tilePos, true, false, true);
        }
      }
    }
  }
  function mouseUp(e) {
    const tilePos = getTilePosition(e);
    if (!that.canvas.classList.contains('static')) {
      if (!that.pattern) {
        startTime();
        that.pattern = createPattern(tilePos);
      }

      if (tilePosIsValid(tilePos) && (that.state[tilePos.y][tilePos.x] === 0 || that.state[tilePos.y][tilePos.x] == 3)) uncoverTile(tilePos);

      that.face.classList.toggle('surprised');

    }
    toggleGlobalEvents('remove');
  }

  // ------- General functions -------
  function newGame(e, recompute) {
    if (!e || recompute || e && (that.pattern || that.state)) {
      if (recompute === true) {
        if (that.dims.width > 512) that.dims.width = 512;
        else if (that.dims.width < 128) that.dims.width = 128;
        if (that.dims.height > 512) that.dims.height = 512;
        else if (that.dims.height < 64) that.dims.height = 64;
        that.canvas.width = that.dims.width;
        that.canvas.height = that.dims.height;
        that.canvas.style.width = (that.dims.width / 15) + 'em';
        that.canvas.style.height = (that.dims.height / 15) + 'em';
        that.tileCount = {
          x: Math.round(that.dims.width) / 16,
          y: Math.round(that.dims.height) / 16,
        };
        const fieldSize = that.tileCount.x * that.tileCount.y;
        if (that.bombAmount > fieldSize - 2) that.bombAmount = fieldSize - 2;
        else if (that.bombAmount < 2) that.bombAmount = 2;
      }
      that.bombVal = that.bombAmount;
      sweeperImgs['tile'].then(img => {
        ctx.fillStyle = ctx.createPattern(img, 'repeat');
        ctx.fillRect(0, 0, that.dims.width, that.dims.height);
      });
      that.pattern = null;
      that.state = null;
      drawPanel('bombs');
      stopTime();
      clearTime();
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
    stopTime();
    that.canvas.classList.add('static');
    switchBtnFace('devastated');
  }
  function wonGame(bombPos) {
    for (const pos of bombPos) {
      if (that.state[pos.y][pos.x] !== 2) drawIcon('flag', pos);
    }
    drawPanel('bombs', that.bombVal = 0);
    stopTime();
    that.canvas.classList.add('static');
    switchBtnFace('swag');
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
      if (that.state[tilePos.y][tilePos.x] == 3) drawIcon('tile-empty', tilePos, false, true, false);
      drawIcon(icon, tilePos);
      that.state[tilePos.y][tilePos.x] = 1;
    }
    if (!recursion) {
      const bombPos = new Array();
      for (let y = 0; y < that.state.length; y++) {
        for (let x = 0; x < that.state[y].length; x++) {
          if (that.state[y][x] !== 1 && that.pattern[y][x] !== true) return;
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
    if (!visited) { //serves as an init directive
      positions.push(tilePos);
      visited = mapField(Uint8Array);
      visited[tilePos.y][tilePos.x] = 1;
    }
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

  // ------- Context menu functions -------
  //TODO: automatic checkmark toggling
  //TODO: ^ what did I mean by this?
  function toggleQuestionMarks() {
    that.marks = !that.marks;
    this.classList.toggle('enabled');
  }

  function changeField(menuItem, menuSection) {
    const textContent = menuItem.textContent.trim();
    if (textContent !== 'Custom...' && menuItem.classList.contains('enabled')) return;
    let reset = true;
    switch (textContent) {
      case 'Beginner':
        that.dims.width = 128;
        that.dims.height = 128;
        that.bombAmount = 10;
        break;
      case 'Intermediate':
        that.dims.width = 256;
        that.dims.height = 256;
        that.bombAmount = 40;
        break;
      case 'Expert':
        that.dims.width = 480;
        that.dims.height = 256;
        that.bombAmount = 99;
        break;
      case 'Custom...':
        addApp('minesweeper:prompt', function(thisApp, states) {
          const appRect = app.getBoundingClientRect();
          thisApp.style.transform = 'translate(' + (appRect.left + 30) / 15 + 'em, ' + (appRect.top + 65) / 15 + 'em)';
          const fields = thisApp.querySelector('.body .inputs');
          const inputs = {
            height: fields.querySelector('.field.item-height input'),
            width: fields.querySelector('.field.item-width input'),
            mines: fields.querySelector('.field.item-mines input')
          };
          inputs.height.value = that.dims.height / 16;
          inputs.width.value = that.dims.width / 16;
          inputs.mines.value = that.bombAmount;
          states.inputs = inputs;
          states.sweeperLink = app;
        }, app);
        reset = false;
        break;
      default: return;
    }
    menuSection.querySelector('li.enabled').classList.remove('enabled');
    menuItem.classList.add('enabled');
    if (reset) newGame(null, true);
  }

  // ------- Helper functions -------
  function drawIcon(icon, tilePos, keepActive, force, offset) {
    if (tilePos && (!that.state || force || !icon || that.state[tilePos.y][tilePos.x] === 0 || that.state[tilePos.y][tilePos.x] == 3)) {
      const iconPos = [tilePos.x * 16, tilePos.y * 16];
      if (offset) iconPos[0] += 1;
      if (!icon) icon = that.stateIcons[that.state[tilePos.y][tilePos.x]];
      sweeperImgs[icon].then(img => {
        that.activeTile = keepActive ? tilePos : null;
        ctx.drawImage(img, iconPos[0], iconPos[1]);
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

  //Panels
  function startTime() {
    updateTime();
    if (timeInterval == null) {
      timeInterval = setInterval(updateTime, 1000);
    }
  }
  function stopTime() {
    if (timeInterval != null) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
  }
  function clearTime() {
    that.time = 000;
    drawPanel('time');
  }
  function updateTime() {
    const time = that.time++ >= 999 ? 999 : that.time;
    drawPanel('time', time);
  }
  function drawPanel(method, number) {
    let thisCanvas;
    let thisCtx;
    if (method == 'bombs') {
      thisCanvas = that.counterBombs;
      thisCtx = ctxBombs;
      if (number == null) number = that.bombVal;
    } else if (method == 'time') {
      thisCanvas = that.counterTime;
      thisCtx = ctxTime;
      if (number == null) number = that.time;
    } else {
      console.error("Error @ Minesweeper drawPanel: method must be either 'bombs' or 'time' but it is " + method);
      return;
    }

    thisCtx.fillStyle = 'black';
    thisCtx.fillRect(0, 0, thisCanvas.clientWidth, thisCanvas.clientHeight);
    let numStr = Math.abs(number).toString().slice(-3);
    //Pad the string to a length of 3
    if (numStr.length < 3) numStr = '0'.repeat(3 - numStr.length) + numStr;
    if (number < 0) numStr = '-' + numStr.slice(1);
    const numParts = numStr.split('');
    for (let i = 0; i < numParts.length; i++) {
      const digit = numParts[i];
      sweeperImgs['counter/' + digit].then(img => {
        thisCtx.drawImage(img, 13 * i, 0);
      });
    };
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
