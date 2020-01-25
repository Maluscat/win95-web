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
function removeAppMenu(node) {
  node.classList.remove('active');
  handleAppMenuEvents('remove', node.parentNode);
}
function switchAppMenu() {
  const active = this.parentNode.parentNode.querySelector('.menu-item.active');
  if (active) active.classList.remove('active');
  this.parentNode.classList.add('active');
}
function handleAppMenuEvents(type, node) {
  if (!type || type != 'add' && type != 'remove') type = 'add';
  const children = node.querySelectorAll('.menu-item > .wrapper');
  for (let i = 0; i < node.children.length; i++)
    children[i][type + 'EventListener']('mouseenter', switchAppMenu);
}

// ------- App utility buttons -------
function closeApp() {
  const app = this.findNodeUp('application');
  app.remove();
  switchActiveApp(false);
  const states = appStates.get(app);
  if (states.taskBtn) states.taskBtn.remove();
  appStates.delete(app);
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
  switchActiveApp(app, false, btn);
}
function minimizeApp() {
  const app = this.findNodeUp('application');
  const taskBtn = appStates.get(app).taskBtn;
  const width = (taskBtn.offsetWidth / 15) + 'em';
  const innerRect = taskBtn.querySelector('.btn-inner').getBoundingClientRect();
  const transform = 'translate(' + innerRect.left + 'px, ' + innerRect.top + 'px)';
  if (!app.classList.contains('fullscreen')) app.style.width = (app.offsetWidth / 15) + 'em';
  prepareHeadExpander(app);
  animateHeadExpander(app, width, transform, 'minimized', 'add');
}
function maximizeApp() {
  const app = this.findNodeUp('application');
  prepareHeadExpander(app);
  if (app.classList.contains('fullscreen')) {
    animateHeadExpander(app, app.style.width, app.style.transform, 'fullscreen', 'remove');
  } else {
    app.style.width = (app.offsetWidth / 15) + 'em';
    animateHeadExpander(app, '100vw', 'none', 'fullscreen', 'add');
  }
}

// ------- Automated adding functions -------
function executeApp() {
  //For now: always closing the start menu, regardless of how it was executed
  toggleStartMenu('remove');
  const appName = this.dataset.execute;
  addApp(appName);
}
function addApp(appName, initFn) {
  const appClone = cloneApp(appName);
  const isGhost = appClone.dataset.ghost != null;
  appStates.set(appClone, {});
  if (!isGhost) addTaskButton(appClone);
  appClone.style.transform = 'translate(' + ((appIndent[0] / 15) || '0.001') + 'em, ' + ((appIndent[1] / 15) || '0.001') + 'em)';
  if (initFn) {
    (initFn)(appClone);
  }
  if (appClone.dataset.init) {
    window[appClone.dataset.init](appClone, appStates.get(appClone));
  }
  switchActiveApp(appClone);
  content.appendChild(appClone);
  if (!isGhost) {
    appIndent[0] += 24;
    appIndent[1] += 22;
  }
}
function addTaskButton(app, appName) {
  btnClone = cloneSnippet(snippets['task-btn']);
  const title = app.querySelector('.header .title');
  if (title.dataset.trayIcon) btnClone.dataset.trayIcon = title.dataset.trayIcon;
  appHeading = app.querySelector('.header > .title > .text').textContent;
  btnClone.querySelector('.text').textContent = appHeading;
  taskBtnLink.set(btnClone, app);
  const states = appStates.get(app);
  states['taskBtn'] = btnClone;
  appStates.set(app, states);
  taskbarBtns.appendChild(btnClone);
}

// ------- App init functions -------
function translateError(node) {
  node.style.transform = 'translate(' + errorCoords[0] + 'em, ' + errorCoords[1] + 'em)';
  errorCoords[0] += .9;
  errorCoords[1] += .9;
}

// ------- App helper functions -------
function switchActiveApp(newNode, indexCheck, newTaskBtn) {
  if (activeApp) {
    const activeBtn = appStates.get(activeApp).taskBtn;
    if (activeBtn) {
      activeBtn.classList.remove('active');
    }
    activeApp.classList.remove('focus');
  }
  if (newNode) {
    if (newNode.dataset.ghost == null) {
      if (!newTaskBtn) newTaskBtn = appStates.get(newNode).taskBtn;
      newTaskBtn.classList.add('active');
    }
    newNode.classList.add('focus');
    activeApp = newNode;
    if (!indexCheck || newNode.style.zIndex != windowZ) newNode.style.zIndex = ++windowZ;
  } else activeApp = null;
}

//Cloning an application including event listeners saved in appEvents
function cloneApp(node) {
  if (typeof node == 'string') {
    if (!appTemplates[node]) {
      console.error("cloneApp Error: No app found with a name of the passed string. Skipping.");
      return;
    }
    node = appTemplates[node];
  }
  const cloned = node.cloneNode(true);
  const appName = node.dataset.appName;
  if (appEvents[appName]) {
    const events = appEvents[appName];
    for (let i = 0; i < events.length; i++) {
      const elem = cloned.querySelector(events[i].selector);
      elem.addEventListener(events[i].type, events[i].fn);
    }
  }
  return cloned;
};

//Adding an event listener to an app and saving it in appEvents
Node.prototype.addAppEventListener = function(selector, type, callback, node) {
  //this == app, node? == already gotten element of selector to prevent an unnecessary re-checking
  if (!node) node = this.querySelector(selector);
  if (node) {
    const appName = this.dataset.appName;
    const data = {
      selector: selector,
      type: type,
      fn: callback
    };
    if (!appEvents[appName]) {
      const item = new Array(data);
      appEvents[appName] = item;
    } else {
      const item = appEvents[appName];
      item.push(data);
    }
  }
};
//Adding an event listener to all children of an app and saving them in appEvents
Node.prototype.addAppChildrenEvents = function(selector, type, callback, modifier, deep) {
  //this == app, deep? == depth of 2
  const node = this.querySelector(selector);
  if (node && node.children) {
    for (let i = 0; i < node.children.length; i++) {
      if (deep) {
        for (let n = 0; n < node.children[i].children.length; n++) {
          let childSelector = selector + ' > :nth-child(' + (i + 1) + ')';
          childSelector += ' > :nth-child(' + (n + 1) + ')' + (modifier ? ' ' + modifier : '');
          this.addAppEventListener(childSelector, type, callback);
        }
      } else {
        const childSelector = selector + ' > :nth-child(' + (i + 1) + ')' + (modifier ? ' ' + modifier : '');
        this.addAppEventListener(childSelector, type, callback);
      }
    }
  } else if (node && !node.children) {
    console.error(
      'addAppChildrenEvents error: Specified node does not have any children. Skipping event.\n' +
      '- app name: %s\n' +
      '- selector: %s\n' +
      '- type: %s\n' +
      '- callback: %o\n' +
      '- found target node: %o',
      this.dataset.appName, selector, type, callback, node
    );
  }
};

// ------- Snippet helper functions, somewhat like app helper functions but more general -------
function cloneSnippet(node) {
  if (typeof node == 'string') {
    if (!snippets[node]) {
      console.error("cloneSnippet Error: No snippet found with a name of the passed string. Skipping.");
      return;
    }
    node = snippets[node];
  }
  const cloned = node.cloneNode(true);
  const name = node.dataset.snippet;
  if (snipEvents[name]) {
    snipEvents[name].forEach(function(event, i) {
      const elem = event.selector ? cloned.querySelector(event.selector) : cloned;
      elem.addEventListener(event.type, event.fn);
    });
  }
  cloned.classList.add(cloned.dataset.snippet);
  delete cloned.dataset.snippet;
  return cloned;
};

//This is fundamentally different from addAppEventListener
Node.prototype.addSnipEventListener = function(node, type, callback) {
  const name = this.dataset.snippet;
  const data = {
    type: type,
    fn: callback
  };
  if (node) {
    const selector = this.checkNode(node, true);
    if (selector) {
      data['selector'] = selector;
    } else {
      console.error(
        "addSnipEventListener Error: The specified node isn't a descendant of the target node. Skipping event.\n" +
        "- target node: %o\n" +
        "- specified node: %o\n" +
        "- snippet name: %s",
        this, node, name
      );
    }
  } else { //if !!node, add the event to `this`
    data['selector'] = false;
  }
  if (!snipEvents[name]) {
    const item = new Array(data);
    snipEvents[name] = item;
  } else {
    const item = snipEvents[name];
    item.push(data);
  }
};
