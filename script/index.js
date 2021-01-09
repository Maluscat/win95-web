'use strict';
const sweeperImgs = {};
const snipTemplates = {};
const snipEvents = {};
const appTemplates = {};
const appEvents = {};
const appMenuTasks = {};
const appStates = new Map();
const taskBtnLink = new Map();

const startDropoutTime = 375;
const errorCoords = [
  Math.floor(Math.random() * 15 + 15),
  Math.floor(Math.random() * 15 + 15)
];
const resizeLimit = [
  112,
  65
];

var activeApp;
var appIndent = [
  0,
  0
];
var itemLeaveTimeout;
var startItemTimeout;
var startEventNode;
var windowZ = 0;
var resizeDir;
var resizeOffset;
var movingWindow;
var windowMoveClicked;


// ------- Window event listener functions -------
function mouseDown(e) { //`window` mousedown event
  //The first commercial mouse with a scroll wheel (not mentioning a middle mouse click) was invented in 1995
  //Microsoft began incorporating the concept of scroll wheels beginning with Office 1997 to match the release of their own mouse (with a scroll wheel)
  //Thus, Windows 95 has no capabilities for scroll wheels/middle mouse click at all
  //I will handle it as a lesser left-click, however
  if (e.button == 1) e.preventDefault();

  if (startWindow.classList.contains('active') && !startWindow.checkNode(e.target) && !startBtn.checkNode(e.target)) {
    toggleStartMenu('remove');
  }

  const isTaskBtn = taskbarBtns.checkNode(e.target);
  const activeBtn = taskbarBtns.querySelector('.task-btn.active');
  if (activeBtn && !activeBtn.checkNode(e.target) && !isTaskBtn) {
    activeBtn.classList.remove('active');
  }

  const activeAppMenu = content.querySelectorAll('.menu .menu-item.active');
  for (const menu of activeAppMenu) {
    if (!menu.parentNode.checkNode(e.target)) removeAppMenu(menu);
  }

  const clickedApp = e.target.findNodeUp('[app]');
  if (clickedApp) {
    switchActiveApp(clickedApp);
  } else if (!isTaskBtn) {
    switchActiveApp(false);
  }
}

// ------- Start menu functions -------
function toggleStartMenu(action) {
  if (startWindow.classList.contains('active')) {
    if (action != 'add') {
      removeStartDropouts(firstStartList, false);
      startWindow.classList.remove('active');
      startBtn.classList.remove('active');
    }
  } else if (action != 'remove') {
    startWindow.classList.add('active');
    startBtn.classList.add('active');
  }
}
function startExpandableClick(e) {
  if (e.button == 0) {
    const item = this.parentNode;
    if (item.classList.contains('active')) {
      const postActive = item.querySelector('.item.active');
      if (postActive) removeStartDropouts(postActive.parentNode, false);
    } else {
      item.classList.add('active');
      item.classList.add('enabled');
    }
  }
}
function handleStartItems() {
  const item = this.parentNode;
  if (!item.classList.contains('active')) {
    removeStartDropouts(item.parentNode, true);
  }
  if (item.classList.contains('expandable')) {
    startEventNode = this;
    this.addEventListener('mouseleave', clearStartItemMeta);
    itemLeaveTimeout = setTimeout(function() {
      startEventNode.removeEventListener('mouseleave', clearStartItemMeta);
    }, startDropoutTime);
    startItemTimeout = setTimeout(function() {
      item.classList.add('active');
      item.classList.add('enabled');
    }, startDropoutTime);
  }
}
function clearStartItemMeta() {
  clearTimeout(startItemTimeout);
  startEventNode.removeEventListener('mouseleave', clearStartItemMeta);
  clearTimeout(itemLeaveTimeout);
}
function removeStartDropouts(target, withTransition) {
  const activeItems = target.querySelectorAll('.item.active');
  //Very interesting Javascript mechanic: `item` has to be initialized with either const or let.
  //No variable keyword defaults to var - a singular variable which overwrites the last value with the current one.
  //That way, `item` is always the last assigned variable (here: the last item of activeItems) after the loop finishes
  //And the timeout executes long after the loop has finished
  for (const item of activeItems) {
    item.classList.remove('active');
    if (withTransition) {
      setTimeout(function() {
        item.classList.remove('enabled');
      }, startDropoutTime);
    } else {
      item.classList.remove('enabled');
    }
  }
}

// ------- Tray task buttons -------
function toggleTaskBtn() {
  //expandApp would also activate the taskBtn in theory (-> switchActiveApp), but this is noticable microseconds faster
  if (!this.classList.contains('active')) this.classList.add('active');
  expandApp(this);
}

// ------- Move indicator -------
function prepareMoveIndicator(that, node, e, fnMove, fnRemove, check) {
  if (movingWindow) return;
  if (node.classList.contains('fullscreen')) return;
  if (!check || !node.querySelector('.title-btns').checkNode(e.target)) {
    document.body.classList.add('noselect');
    windowMoveClicked = [e.clientX, e.clientY];
    movingWindow = node;
    const rect = node.getBoundingClientRect();
    moveIndicator.style.width = rect.width + 'px';
    moveIndicator.style.height = rect.height + 'px';
    if (rect.left !== 0 || rect.top !== 0) {
      moveIndicator.style.transform = 'translate(' + rect.left + 'px, ' + rect.top + 'px)';
    }
    if (node.classList.contains('taskbar-wrapper')) moveIndicator.classList.add('on-top');
    if (fnMove == resizeWindow) {
      resizeDir = that.dataset.dir;
      resizeOffset = [
        e.clientX - rect.left,
        e.clientY - rect.top
      ];
      moveIndicator.classList.remove('hidden');
    }
    content.addEventListener('mousemove', fnMove);
    window.addEventListener('mouseup', fnRemove);
  }
}
function removeMoveIndicator(fnMove, fnRemove) {
  if (!movingWindow.classList.contains('taskbar-wrapper')) {
    movingWindow.style.transform = moveIndicator.style.transform.computeTranslate(function(acc, val, i) {
      val = parseInt(val);
      //Minimum/Maximum window positions to keep it inside the viewport
      if (i == 0) {
        if (val <= 15 - movingWindow.offsetWidth) val = 15 - movingWindow.offsetWidth;
        else if (val > document.documentElement.clientWidth - 15) val = document.documentElement.clientWidth - 15;
      } else if (i == 1) {
        if (val <= -15) val = -15;
        else if (val > document.documentElement.clientHeight - 15) val = document.documentElement.clientHeight - 15;
      }
      const computed = val / 15;
      const result = computed == 0 ? '0.1px' + (i == 0 ? ', ' : '') : computed + (i == 0 ? 'em, ' : 'em');
      return acc + result;
    });
  } else {
    if (movingWindow.offsetHeight == 6) {
      movingWindow.classList.add('collapsed');
    } else if (movingWindow.classList.contains('collapsed')) {
      movingWindow.classList.remove('collapsed');
    }
    moveIndicator.classList.remove('on-top');
  }
  document.body.classList.remove('noselect');
  moveIndicator.classList.add('hidden');
  moveIndicator.style.removeProperty('transform');
  moveIndicator.style.removeProperty('width');
  moveIndicator.style.removeProperty('height');
  movingWindow = null;
  content.removeEventListener('mousemove', fnMove);
  window.removeEventListener('mouseup', fnRemove);
}

// ------- Move functions -------
function addWindowMove(e, app) {
  if (e.button == 0) prepareMoveIndicator(this, app, e, moveWindow, removeWindowMove, true);
}
function moveWindow(e) {
  if (moveIndicator.classList.contains('hidden')) moveIndicator.classList.remove('hidden');
  const distance = [
    e.clientX - windowMoveClicked[0],
    e.clientY - windowMoveClicked[1]
  ];
  const transform = moveIndicator.style.transform;
  const translateStart = transform.indexOf('translate(') + 'translate('.length;
  if (translateStart != -1) {
    moveIndicator.style.transform = transform.computeTranslate(function(acc, val, i, arr) {
      const computed = parseInt(val) + distance[i];
      return acc + (computed || '0.1') + 'px' + (i != arr.length - 1 ? ', ' : '');
    }, translateStart);
  } else {
    const rect = movingWindow.getBoundingClientRect();
    moveIndicator.style.transform = 'translate(' + rect.left + 'px, ' + rect.top + 'px)';
  }
  windowMoveClicked = [
    e.clientX,
    e.clientY
  ];
}
function removeWindowMove() {
  removeMoveIndicator(moveWindow, removeWindowMove);
}

// ------- Resize functions -------
function addWindowResize(e, app) {
  if (e.button == 0) prepareMoveIndicator(this, app || taskbarWrapper, e, resizeWindow, removeWindowResize);
}
function resizeWindow(e) {
  if (
    (resizeDir == 'north' || resizeDir == 'south') && windowMoveClicked[1] == e.clientY ||
    (resizeDir == 'west' || resizeDir == 'east') && windowMoveClicked[0] == e.clientX
  ) return;
  const isTaskbar = !!movingWindow.classList.contains('taskbar-wrapper');
  const rect = movingWindow.getBoundingClientRect();
  const distance = [
    e.clientX - windowMoveClicked[0],
    e.clientY - windowMoveClicked[1]
  ];

  const dim = {
    width: null,
    height: null
  };
  if (resizeDir.includes('north')) dim.height = rect.height - distance[1];
  if (resizeDir.includes('south')) dim.height = rect.height + distance[1];
  if (resizeDir.includes('west')) dim.width = rect.width - distance[0];
  if (resizeDir.includes('east')) dim.width = rect.width + distance[0];

  //Windows 95 apps' minimal sizes are very arbitrary; I think they are statically typed for every app
  //Some follow a rule: The height stops at a point where only the window "frame" is still visible
  //"Window frame" meaning things like header, menu bar, bottom bar, etc.
  if (isTaskbar) { //axis will always be y
    dim.height = (Math.round(dim.height / 25) * 25 || 3) + 3; //steps of 25, but always 3 added (and 6 at its smallest)
    if (dim.height !== null && dim.height > 428) dim.height = 428;
    if (dim.height !== null && dim.height < 6) dim.height = 6;
  } else {
    if (dim.height !== null && dim.height < resizeLimit[1]) dim.height = resizeLimit[1];
    if (dim.width !== null && dim.width < resizeLimit[0]) dim.width = resizeLimit[0];
  }
  if (dim.height === null && dim.width === null) return;

  for (const axis in dim) {
    if (dim[axis] !== null && dim[axis] + 'px' != moveIndicator.style[axis]) moveIndicator.style[axis] = dim[axis] + 'px';
  }

  if (resizeDir.includes('north') || resizeDir.includes('west')) {
    const limitPos = [
      rect.right - resizeLimit[0],
      rect.bottom - resizeLimit[1]
    ];
    const move = [
      e.clientX - resizeOffset[0],
      e.clientY - resizeOffset[1]
    ];
    const newTransform = moveIndicator.style.transform.computeTranslate(function(acc, val, i, arr) {
      let computed;
      if (!isTaskbar) {
        computed =
          i == 0 && resizeDir.includes('west')  ? (move[0] > limitPos[0] ? limitPos[0] : move[0]) :
          i == 1 && resizeDir.includes('north') ? (move[1] > limitPos[1] ? limitPos[1] : move[1]) :
          parseInt(val);
      } else {
        computed = i == 1 && resizeDir.includes('north') ? document.documentElement.clientHeight - dim.height : 0;
      }
      return acc + (computed || '0.1') + 'px' + (i != arr.length - 1 ? ', ' : '');
    });
    if (moveIndicator.style.transform != newTransform) moveIndicator.style.transform = newTransform;
  }
}
function removeWindowResize() {
  if (resizeDir.includes('north') || resizeDir.includes('south')) {
    movingWindow.style.height = parseInt(moveIndicator.style.height) / 15 + 'em';
  }
  if (resizeDir.includes('west') || resizeDir.includes('east')) {
    movingWindow.style.width = parseInt(moveIndicator.style.width) / 15 + 'em';
  }
  removeMoveIndicator(resizeWindow, removeWindowResize);
}

// ------- Header expander indicator -------
function prepareHeadExpander(app, rectNode) {
  const header = app.querySelector('.header');
  const title = header.querySelector('.title');
  const text = title.querySelector('.text');
  const rect = (rectNode || header).getBoundingClientRect();
  expanderTitle.textContent = title.textContent;
  headExpander.style.width = rect.width + 'px';
  headExpander.style.height = rect.height + 'px';
  if (rect.left !== 0 || rect.top !== 0) {
    headExpander.style.transform = 'translate(' + (rect.left / 15) + 'em, ' + (rect.top / 15) + 'em)';
  }
  if (title.dataset.trayIcon) headExpander.dataset.trayIcon = title.dataset.trayIcon;
  headExpander.classList.remove('hidden');
}
function removeHeadExpander() {
  headExpander.classList.add('hidden');
  headExpander.classList.remove('transition');
  headExpander.style.removeProperty('width');
  headExpander.style.removeProperty('height');
  headExpander.style.removeProperty('transform');
  delete headExpander.dataset.trayIcon;
}
function animateHeadExpander(app, width, transform, cssClass, classMethod) {
  setTimeout(function() {
    headExpander.classList.add('transition');
    headExpander.style.width = width;
    headExpander.style.transform = transform;
    setTimeout(function() {
      app.classList[classMethod](cssClass);
      removeHeadExpander();
    }, 275);
  }, 15);
}

// ------- Misc -------
function updateClock() {
  const date = new Date();
  const currentDate = clock.textContent;
  const currentMins = currentDate.slice(currentDate.indexOf(':') + 1);
  const mins = ('0' + date.getMinutes()).slice(-2);
  if (currentMins != mins) {
    clock.textContent = ('0' + date.getHours()).slice(-2) + ':' + mins;
  }
}

// ------- Helper functions -------
function parseFunctionStr(fnStr, params, paramsDefault) {
  //params: Array<String> = parameters of the new Function
  //paramsDefault: bool = whether to use `params` as the default when none were defined
  if (Array.isArray(params) && params.length == 0) {
    throw new Error('@ parseFunctionStr: second argument `params` may not be an empty array.');
  }
  const STATE_PRFX = '!app.';
  const hasNoArguments = fnStr.indexOf('(') + 1 == fnStr.indexOf(')');

  if (paramsDefault && hasNoArguments) {
    fnStr = fnStr.replace('()', '(' + params.join(',') + ')');
  }
  //converting the function string to a `call` for passing `this`
  fnStr = fnStr.replace('(', '.call(this' + (hasNoArguments && (!params || !paramsDefault) ? '' : ','));
  fnStr = fnStr.replace(STATE_PRFX, 'appStates.get(app).');

  return new Function(...params, `'use strict'; ${fnStr}`);
}
function parseDataEvents(node, args, callback, allowSelf) {
  let eventNodes = node.querySelectorAll('[data-on]');
  if (node.dataset.on && allowSelf) {
    (eventNodes = Array.from(eventNodes)).push(node);
  }
  for (const eventNode of eventNodes) {
    const events = eventNode.dataset.on
      .split(';')
      .map(evt => evt
        .split(',')
        .map(val => val.trim()));
    for (const [type, fnStr] of events) {
      const fn = parseFunctionStr(fnStr, args, true);
      callback(eventNode, type, fn);
    }
  }
}

String.prototype.computeTranslate = function(callback, indexStart) {
  return this
    .slice(indexStart || this.indexOf('translate(') + 'translate('.length, -1)
    .split(', ')
    .reduce(callback, 'translate(')
    + ')';
};

//Looping over all children of a specified node, stopping when finding a target
Node.prototype.checkNode = function(target, protocol, original = this) {
  //protocol: boolean? = construct a unique selector path from `original` to `target`
  //implicit unchecked condition: `original` needs to be unique across all of its descendants
  if (this == target) return true;

  for (var i = 0; i < this.childElementCount; i++) {
    let result = this.children[i].checkNode(target, protocol, original);
    if (result) {
      if (protocol) {
        let selector = '';
        //The original caller element needs to be uniquely matched because a nested tree of `:nth-child`s can start and match anywhere
        if (this == original) {
          if (this.tagName)
            selector += this.tagName.toLowerCase();
          if (this.classList.length != 0)
            selector += '.' + Array.prototype.join.call(this.classList, '.');
          if (this.hasAttributes())
            selector += Array.from(this.attributes)
              .filter(attr => attr.name != 'class' || attr.name != 'style')
              .reduce((acc, curr) => acc + `[${curr.name}="${curr.value}"]`, '');
        }
        selector += ' > :nth-child(' + (i + 1) +')' + (result === true ? '' : result);
        return selector;
      } else return true;
    }
  }
};

//Looking upwards for a node with the specified class
Node.prototype.findNodeUp = function(target, isData = false) {
  if (this == content) return false;
  if (!isData && target[0] == '[' && target[target.length - 1] == ']') {
    isData = true;
    target = target.slice(1, -1);
    while(target.includes('-')) {
      const index = target.indexOf('-');
      target = target.slice(0, index) + target[index + 1].toUpperCase() + target.slice(index + 2);
    }
  }
  if (Array.isArray(target)) {
    for (l of target)
      if (isData && this.dataset[target] != null || !isData && this.classList.contains(l))
        return this;
  } else if (isData && this.dataset[target] != null || !isData && this.classList.contains(target))
    return this;
  return Node.prototype.findNodeUp.call(this.parentNode, target, isData);
};
