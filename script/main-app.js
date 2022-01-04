'use strict';
// ------- App menu -------
function toggleAppMenu(e) {
  if (e.button == 0) {
    const item = this.parentNode;
    if (item.classList.contains('active')) {
      removeAppMenu(item);
    } else {
      handleAppMenuEvents('add', item.parentNode);
      //Redundancy check
      switchAppMenu.call(this);
    }
  }
}
function removeAppMenu(node, ignoreEvents) {
  node.classList.remove('active');
  removeListDropouts(node, false);
  if (!ignoreEvents) handleAppMenuEvents('remove', node.parentNode);
}
function switchAppMenu() {
  const active = this.parentNode.parentNode.querySelector('.menu-item.active');
  if (active) removeAppMenu(active, true);
  this.parentNode.classList.add('active');
}
function handleAppMenuEvents(type, node) {
  if (!type || type != 'add' && type != 'remove') type = 'add';

  for (const menuWrapper of node.querySelectorAll('.menu-item > .wrapper')) {
    menuWrapper[type + 'EventListener']('mouseenter', switchAppMenu);
  }
}

function handleAppMenuItems(e, app) {
  let task = this.dataset.task;
  if (!task) {
    const section = this.findNodeUp('section');
    if (section) task = section.dataset.task;
  }
  if (task) {
    const fn = appMenuTasks[task];
    if (fn) {
      const menu = this.findNodeUp('menu-item');
      fn.call(this, app, menu, engine);
      removeAppMenu(menu);
    }
  }
}

// ------- App utility buttons -------
function closeApp(e, app) {
  app.remove();
  switchActiveApp(false);
  const states = engine.appStates.get(app);
  if (states[app.dataset.app] && states[app.dataset.app].onClose) {
    states[app.dataset.app].onClose();
  }
  if (states.blockTarget) unblockApp(states.blockTarget);
  if (states.taskBtn) states.taskBtn.remove();
  engine.appStates.delete(app);
  taskBtnLink.delete(states.taskBtn);
}
function expandApp(btn) {
  const app = taskBtnLink.get(btn);
  if (app.classList.contains('minimized')) {
    prepareHeadExpander(app, btn);
    if (app.classList.contains('fullscreen'))
      animateHeadExpander(app, '100vw', 'none', 'minimized', 'remove');
    else
      animateHeadExpander(app, app.style.width, app.style.transform, 'minimized', 'remove');
  }
  switchActiveApp(app, btn);
}
function minimizeApp(e, app) {
  const taskBtn = engine.appStates.get(app).taskBtn;
  const width = (taskBtn.offsetWidth / 15) + 'em';
  const innerRect = taskBtn.querySelector('.btn-inner').getBoundingClientRect();
  const transform = 'translate(' + innerRect.left + 'px, ' + innerRect.top + 'px)';
  if (!app.classList.contains('fullscreen')) app.style.width = (app.offsetWidth / 15) + 'em';
  prepareHeadExpander(app);
  animateHeadExpander(app, width, transform, 'minimized', 'add');
}
function maximizeApp(e, app) {
  prepareHeadExpander(app);
  if (app.classList.contains('fullscreen')) {
    animateHeadExpander(app, app.style.width, app.style.transform, 'fullscreen', 'remove');
  } else {
    app.style.width = (app.offsetWidth / 15) + 'em';
    animateHeadExpander(app, '100vw', 'none', 'fullscreen', 'add');
  }
}

function blockApp(target, source, srcStates) {
  engine.appStates.get(target).blockSrc = source;
  target.classList.add('blocked');
  srcStates.blockTarget = target;
}
function unblockApp(app) {
  const states = engine.appStates.get(app);
  delete states.blockSrc;
  app.classList.remove('blocked');
  switchActiveApp(app, states.taskBtn);
}

// ------- Automated adding functions -------
function executeApp() {
  toggleStartMenu('remove');
  addApp(this.dataset.execute);
}
function addApp(appName, carryStates, blockTarget, initFn) {
  const appClone = engine.cloneApp(appName);
  const isGhost = appClone.dataset.ghost != null;
  const states = {};
  engine.appStates.set(appClone, states);

  if (initFn) {
    (initFn)(appClone, states);
  }
  if (blockTarget) {
    blockApp(blockTarget, appClone, states);
  }
  if (!isGhost) {
    //automatically call the constructor (title cased app name) and add it to states[appname]
    const constructorFn = appName.slice(0, 1).toUpperCase() + appName.slice(1);
    if (window[constructorFn]) states[appName] = new window[constructorFn](appClone, carryStates || {});
    addTaskButton(appClone);
  }

  appClone.style.transform = 'translate(' + ((appIndent[0] / 15) || '0.001') + 'em, ' + ((appIndent[1] / 15) || '0.001') + 'em)';
  content.appendChild(appClone);
  switchActiveApp(appClone);
  if (!isGhost) {
    appIndent[0] += 24;
    appIndent[1] += 22;
  }
}
function addTaskButton(app, appName) {
  const states = engine.appStates.get(app);
  const btnClone = engine.cloneSnippet(engine.snipTemplates['task-btn']);
  const title = app.querySelector('.header .title');
  const appHeading = app.querySelector('.header > .title > .text').textContent;

  if (title.dataset.trayIcon) btnClone.dataset.trayIcon = title.dataset.trayIcon;
  btnClone.querySelector('.text').textContent = appHeading;

  taskBtnLink.set(btnClone, app);
  states['taskBtn'] = btnClone;
  taskbarBtns.appendChild(btnClone);
}

// ------- App init functions -------
function translateError(node) {
  node.style.transform = 'translate(' + errorCoords[0] + 'em, ' + errorCoords[1] + 'em)';
  errorCoords[0] += .9;
  errorCoords[1] += .9;
}

// ------- App helper functions -------
function switchActiveApp(newNode, newTaskBtn) {
  if (activeApp) {
    const activeBtn = engine.appStates.get(activeApp).taskBtn;
    if (activeBtn) {
      activeBtn.classList.remove('active');
    }
    activeApp.classList.remove('focus');
  }
  if (newNode) {
    const states = engine.appStates.get(newNode);
    if (!newTaskBtn) {
      newTaskBtn = states.blockTarget ? engine.appStates.get(states.blockTarget).taskBtn : states.taskBtn;
    }
    if (newTaskBtn) newTaskBtn.classList.add('active');
    if (states.blockSrc) {
      //Proxying activation to another app
      switchActiveApp(states.blockSrc, newTaskBtn);
    } else {
      newNode.classList.add('focus');
      activeApp = newNode;
      if (newNode.style.zIndex !== windowZ) newNode.style.zIndex = ++windowZ;
    }
  } else activeApp = null;
}
