<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Windows 95 web | Hallo89</title>
    <link rel="stylesheet" href="style/index.css">
  </head>
  <body>
    <div id="content">
      <aside class="indicator hidden" id="move-indicator"></aside>
      <aside class="indicator hidden" id="header-expander">
        <div class="header">
          <div class="title">
            <span class="image"></span>
            <span class="text"></span>
          </div>
          <div class="title-btns">
            <button type="button" class="minimize-btn click-btn btn">
              <div class="btn-inner">
                <span class="image"></span>
              </div>
            </button>
            <button type="button" class="maximize-btn click-btn btn">
              <div class="btn-inner">
                <span class="image"></span>
              </div>
            </button>
            <button type="button" class="close-btn click-btn btn">
              <div class="btn-inner">
                <span class="image"></span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <div data-snippet="resize-areas">
        <div class="edge horizontal north">
          <span class="corner left" data-dir="north-west"></span>
          <span class="filler" data-dir="north"></span>
          <span class="corner right" data-dir="north-east"></span>
        </div>
        <div class="edge vertical east">
          <span class="corner top" data-dir="north-east"></span>
          <span class="filler" data-dir="east"></span>
          <span class="corner bottom" data-dir="south-east"></span>
        </div>
        <div class="edge horizontal south">
          <span class="corner left" data-dir="south-west"></span>
          <span class="filler" data-dir="south"></span>
          <span class="corner right" data-dir="south-east"></span>
        </div>
        <div class="edge vertical west">
          <span class="corner top" data-dir="north-west"></span>
          <span class="filler" data-dir="west"></span>
          <span class="corner bottom" data-dir="south-west"></span>
        </div>
      </div>

      <button data-snippet="task-btn" type="button" class="btn click-btn" data-on="click, toggleTaskBtn">
        <div class="inner btn-inner">
          <span class="image"></span>
          <span class="text"></span>
        </div>
      </button>

      <div data-template data-app="notepad" class="window-wrapper">
        <div class="window">
          <div class="header">
            <div class="title">
              <span class="image"></span>
              <span class="text">Untitled - Notepad</span>
            </div>
            <div class="title-btns">
              <button type="button" class="minimize-btn click-btn btn">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
              <button type="button" class="maximize-btn click-btn btn">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
              <button type="button" class="close-btn click-btn btn">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
            </div>
          </div>
          <div class="menu">
            <ul class="list">
              <li class="menu-item">
                <div class="wrapper">
                  <span class="text">File</span>
                </div>
                <div class="window-wrapper menu-dropdown">
                  <div class="window">
                    <ul class="index">
                      <div class="section">
                        <li>New</li>
                        <li>Open</li>
                        <li>Save</li>
                        <li>Save as...</li>
                      </div>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="menu-item">
                <div class="wrapper">
                  <span class="text">Edit</span>
                </div>
                <div class="window-wrapper menu-dropdown">
                  <div class="window">
                    <ul class="index">
                      <div class="section">
                        <li class="disabled">Word wrap</li>
                        <li class="disabled">Disabled :(</li>
                      </div>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="menu-item">
                <div class="wrapper">
                  <span class="text">Search</span>
                </div>
                <div class="window-wrapper menu-dropdown">
                  <div class="window">
                    <ul class="index">
                      <div class="section">
                        <li>More options!</li>
                        <li>Option 2!</li>
                      </div>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="menu-item">
                <div class="wrapper">
                  <span class="text">Help</span>
                </div>
                <div class="window-wrapper menu-dropdown">
                  <div class="window">
                    <ul class="index">
                      <div class="section">
                        <li>Even more</li>
                        <li>Options!</li>
                      </div>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="body">
            <textarea></textarea>
          </div>
        </div>
        <div data-expand-snippet="resize-areas"></div>
      </div>

      <div data-template data-app="error" data-class="window-wrapper" data-ghost>
        <div class="window">
          <div class="header">
            <div class="title">
              <span class="image"></span>
              <span class="text">404 Not Found</span>
            </div>
            <div class="title-btns">
              <button type="button" class="close-btn click-btn btn">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
            </div>
          </div>
          <div class="body">
            <div class="message">
              <span class="image"></span>
              <span class="text">The requested page couldn't be found</span>
            </div>
            <div class="further">
              <span class="text">Maybe try one of these:</span>
              <div class="btns">
                <a class="btn action-btn" href="/">
                  <div class="btn-inner inner">
                    <span class="text">Home</span>
                  </div>
                </a>
                <a class="btn action-btn" href="/tools">
                  <div class="btn-inner inner">
                    <span class="text">Tools</span>
                  </div>
                </a>
                <a class="btn action-btn" href="/slider89">
                  <div class="btn-inner inner">
                    <span class="text">Slider89</span>
                  </div>
                </a>
                <a class="btn action-btn" href="/webgl">
                  <div class="btn-inner inner">
                    <span class="text">WebGL</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-template data-app="minesweeper-prompt" class="window-wrapper slim" data-ghost>
        <div class="window slim">
          <div class="header">
            <div class="title">
              <span class="text">Custom Field</span>
            </div>
            <div class="title-btns">
              <button type="button" class="close-btn click-btn btn">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
            </div>
          </div>
          <div class="body">
            <div class="inputs">
              <div class="field item-height">
                <div class="caption">
                  <span class="text">Height:</span>
                </div>
                <div class="input-wrapper">
                  <input class="input" type="text" value="8">
                </div>
              </div>
              <div class="field item-width">
                <div class="caption">
                  <span class="text">Width:</span>
                </div>
                <div class="input-wrapper">
                  <input class="input" type="text" value="8">
                </div>
              </div>
              <div class="field item-mines">
                <div class="caption">
                  <span class="text">Mines:</span>
                </div>
                <div class="input-wrapper">
                  <input class="input" type="text" value="10">
                </div>
              </div>
            </div>
            <div class="buttons">
              <button class="btn click-btn action-btn submit" type="button">
                <div class="inner btn-inner">
                  <span class="text">OK</span>
                </div>
              </button>
              <button class="btn click-btn action-btn cancel" type="button">
                <div class="inner btn-inner">
                  <span class="text">Cancel</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div data-template data-app="minesweeper" class="window-wrapper slim" data-init="minesweeperInit">
        <div class="window">
          <div class="header">
            <div class="title">
              <span class="image"></span>
              <span class="text">Minesweeper</span>
            </div>
            <div class="title-btns">
              <button type="button" class="minimize-btn click-btn btn">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
              <button type="button" class="maximize-btn click-btn btn disabled">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
              <button type="button" class="close-btn click-btn btn">
                <div class="btn-inner">
                  <span class="image"></span>
                </div>
              </button>
            </div>
          </div>
          <div class="menu">
            <ul class="list">
              <li class="menu-item">
                <div class="wrapper">
                  <span class="text">Game</span>
                </div>
                <div class="window-wrapper menu-dropdown">
                  <div class="window">
                    <ul class="index">
                      <div class="section">
                        <li class="shortcut" data-task="!app.sweeper.newGame()">
                          <span class="text">New</span>
                          <span class="shortcut">F2</span>
                        </li>
                      </div>
                      <div class="section" data-task="!app.sweeper.changeField(this, menu)">
                        <li class="checkmark enabled">Beginner</li>
                        <li class="checkmark">Intermediate</li>
                        <li class="checkmark">Expert</li>
                        <li class="checkmark">Custom...</li>
                      </div>
                      <div class="section">
                        <li class="checkmark enabled">Marks (?)</li>
                      </div>
                      <div class="section">
                        <li>Best Times</li>
                      </div>
                      <div class="section">
                        <li class="exit" data-task="closeApp(null, app)">Exit</li>
                      </div>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="menu-item">
                <div class="wrapper">
                  <span class="text">Help</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="body">
            <div class="game-window">
              <div class="head-panel">
                <div class="counter bombs">
                  <canvas width="39" height="23"></canvas>
                </div>
                <button class="btn click-btn face">
                  <div class="btn-inner inner">
                    <span class="image smile"></span>
                  </div>
                </button>
                <div class="counter time">
                  <canvas width="39" height="23"></canvas>
                </div>
              </div>
              <div class="game-panel">
                <canvas width="128" height="128"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="taskbar-wrapper">
        <div id="taskbar">
          <div class="start-menu">
            <div class="window-wrapper" id="start-window">
              <div class="window">
                <aside class="brand">
                  <span class="image"></span>
                </aside>
                <div class="body">
                  <div class="section-main">
                    <ul>
                      <li class="item expandable">
                        <div class="wrapper">
                          <span class="image"></span>
                          <span class="text">Programs</span>
                        </div>
                        <div class="window-wrapper menu-dropout">
                          <div class="window">
                            <ul>
                              <li class="item expandable">
                                <div class="wrapper">
                                  <span class="image"></span>
                                  <span class="text">Accessories</span>
                                </div>
                                <div class="window-wrapper menu-dropout">
                                  <div class="window">
                                    <ul>
                                      <li class="item" data-execute="minesweeper">
                                        <div class="wrapper">
                                          <span class="image"></span>
                                          <span class="text">Minesweeper</span>
                                        </div>
                                      </li>
                                      <li class="item" data-execute="notepad">
                                        <div class="wrapper">
                                          <span class="image"></span>
                                          <span class="text">Notepad</span>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </li>
                              <li class="item">
                                <div class="wrapper">
                                  <span class="image"></span>
                                  <span class="text">Startup</span>
                                </div>
                              </li>
                              <li class="item">
                                <div class="wrapper">
                                  <span class="image"></span>
                                  <span class="text">MS-DOS Prompt</span>
                                </div>
                              </li>
                              <li class="item">
                                <div class="wrapper">
                                  <span class="image"></span>
                                  <span class="text">The Microsoft Network</span>
                                </div>
                              </li>
                              <li class="item">
                                <div class="wrapper">
                                  <span class="image"></span>
                                  <span class="text">Windows Explorer</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li class="item">
                        <div class="wrapper">
                          <span class="image"></span>
                          <span class="text">Documents</span>
                        </div>
                      </li>
                      <li class="item">
                        <div class="wrapper">
                          <span class="image"></span>
                          <span class="text">Settings</span>
                        </div>
                      </li>
                      <li class="item">
                        <div class="wrapper">
                          <span class="image"></span>
                          <span class="text">Disclaimer</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="section-bottom">
                    <div class="item">
                      <div class="wrapper">
                        <span class="image"></span>
                        <span class="text">Shut Down</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" class="btn click-btn focus-btn" id="start-btn">
              <div class="inner btn-inner">
                <span class="image"></span>
                <span class="text">Start</span>
              </div>
            </button>
          </div>
          <div class="task-btns"></div>
          <div id="clock">
            <span class="image"></span>
            <span class="text"></span>
          </div>
        </div>
        <div class="resize-areas">
          <div class="edge horizontal north">
            <span class="filler" data-dir="north"></span>
          </div>
        </div>
      </div>

    </div>

    <script src="script/index.js"></script>
    <script src="script/glb-app.js"></script>
    <script src="script/applications.js"></script>
    <script>
      const content = document.getElementById('content');

      const snippets = content.querySelectorAll('[data-snippet]');
      const templateApps = content.querySelectorAll('[data-app]');

      const moveIndicator = document.getElementById('move-indicator');
      const headExpander = document.getElementById('header-expander');
      const expanderTitle = headExpander.querySelector('.title .text');

      const taskbar = document.getElementById('taskbar');
      const taskbarWrapper = content.querySelector('.taskbar-wrapper');
      const taskbarBtns = taskbar.querySelector('.task-btns');
      const taskResize = taskbarWrapper.querySelectorAll('.resize-areas [data-dir="north"]');

      const executes = content.querySelectorAll('[data-execute]');
      const clock = taskbar.querySelector('#clock .text');

      const startBtn = document.getElementById('start-btn');
      const startWindow = document.getElementById('start-window');
      const firstStartList = startWindow.querySelector('.section-main > ul');
      const startItems = firstStartList.querySelectorAll('.item .wrapper');
      const startItemsExpand = firstStartList.querySelectorAll('.item.expandable > .wrapper');

      //Preloading icons for the canvas of Minesweeper
      (function() {
        for (let icon of sweeperIcons) {
          let srcBase = 'resource/image/minesweeper/';
          let srcName = '';
          if (icon.includes('/')) {
            const index = icon.indexOf('/');
            srcName += icon.slice(0, index) + '/';
            icon = icon.slice(index);
          }
          if (icon.includes('{') && icon.includes('}')) {
            const range = icon.slice(icon.indexOf('{') + 1, icon.indexOf('}')).split('-').map(val => Number(val));
            for (let i = range[0]; i <= range[1]; i++) {
              createImage(srcBase, srcName + i);
            }
          } else {
            createImage(srcBase, srcName + icon);
          }
        }

        function createImage(srcBase, source) {
          const img = new Image();
          img.src = srcBase + source + '.png';
          sweeperImgs[source] = new Promise(resolve => {
            img.onload = function() {
              resolve(img);
            };
          });
        }
      })();

      //Adding a new stylesheet with rules for app icon URLs
      //`app-icon` is NOT implemented yet
      (function() {
        if (availableIcons.length > 0) {
          const styleNode = document.createElement('style');
          var sheet = document.head.appendChild(styleNode).sheet;
        }
        for (const icon of availableIcons) {
          const appTitle = content.querySelector('[data-app="' + icon + '"] .header .title');
          appTitle.dataset.trayIcon = icon;
          sheet.insertRule(`
            [data-tray-icon="${icon}"] .image {
              background-image: url('resource/image/icon/tray-icon/${icon}.png');
            }
          `, 0);
          const startEntry = startWindow.querySelector('li[data-execute="' + icon + '"]');
          if (startEntry) startEntry.dataset.menuIcon = icon;
          sheet.insertRule(`
            [data-menu-icon="${icon}"] .image {
              background-image: url('resource/image/icon/menu-icon/${icon}.png');
            }
          `, 0);
        }
      })();

      //Looping over snippets and expanding them
      (function() {
        for (const snip of snippets) {
          snipTemplates[snip.dataset.snippet] = snip;

          let evtNodes = snip.querySelectorAll('[data-on]');
          if (evtNodes != null && snip.dataset.on) (evtNodes = Array.from(evtNodes)).push(snip);
          for (const evtNode of evtNodes) {
            const data = splitDataEvent(evtNode.dataset.on);
            if (data) snip.addSnipEventListener(evtNode == snip ? false : evtNode, data.type, data.fn);
            delete evtNode.dataset.on;
          }

          const expandSpots = content.querySelectorAll('[data-expand-snippet="' + snip.dataset.snippet + '"]');
          for (const expandSpot of expandSpots) {
            const clone = cloneSnippet(snip);
            expandSpot.parentNode.replaceChild(clone, expandSpot);
            clone.classList.add(clone.dataset.snippet);
            delete clone.dataset.snippet;
            delete clone.dataset.expandSnippet;
          }

          snip.remove();
        }
      })();

      //Adding event listeners
      (function() {
        //Application events, prepared for cloning
        for (const app of templateApps) {
          const maxBtn = app.querySelector('.header .title-btns .maximize-btn');
          if (maxBtn && !maxBtn.classList.contains('disabled')) {
            app.addAppEventListener('.maximize-btn', 'click', maximizeApp);
            app.addAppEventListener('.header .title .text', 'dblclick', maximizeApp);
          }
          app.addAppEventListener('.minimize-btn', 'click', minimizeApp);
          app.addAppEventListener('.close-btn', 'click', closeApp);
          app.addAppEventListener('.header', 'mousedown', addWindowMove);
          app.addAppChildrenEvents('.menu > .list', 'mousedown', toggleAppMenu, '> .wrapper');
          app.addAppChildrenEvents('.menu > .list .index', 'mouseup', handleAppMenuItems, null, true);
          app.addAppChildrenEvents('.resize-areas', 'mousedown', addWindowResize, null, true);

          if (app.dataset.app == 'minesweeper-prompt') {
            app.addAppEventListener('.body .buttons .btn.submit', 'click', submitSweeperPrompt);
            app.addAppEventListener('.body .buttons .btn.cancel', 'click', closeApp);
          }
        }

        window.addEventListener('mousedown', mouseDown);
        startBtn.addEventListener('click', function() {
          toggleStartMenu();
        });
        for (l of executes) l.addEventListener('click', executeApp);
        for (l of taskResize) l.addEventListener('mousedown', addWindowResize);
        for (l of startItems) l.addEventListener('mouseenter', handleStartItems);
        for (l of startItemsExpand) l.addEventListener('mousedown', startExpandableClick);
      })();

      (function() {
        for (const app of templateApps) {

          const menuSections = app.querySelectorAll('.menu > .list .index .section');
          for (const section of menuSections) {

            const items = section.querySelectorAll('li');
            for (const item of items) {

              const task = item.dataset.task || section.dataset.task;
              if (task && !appMenuTasks[task]) {
                let fn = task;
                let path = '';
                if (/^!app/.test(fn)) {
                  path += 'appStates.get(app)';
                  fn = fn.slice(5);
                }
                while(fn.includes('.')) {
                  const index = fn.indexOf('.');
                  const level = fn.slice(0, index);
                  path += '.' + level;
                  fn = fn.slice(index + 1);
                }
                let params;
                if (fn.includes('(')) {
                  const index = fn.indexOf('(');
                  const indexClosing = fn.indexOf(')');
                  if (indexClosing > index + 1) {
                    params = fn.slice(index + 1, -1).split(',');
                  }
                  fn = fn.slice(0, index);
                } else params = [item, app];

                path += (path ? '.' : '') + fn;
                appMenuTasks[task] = {
                  path: new Function('app', '"use strict"; return ' + path),
                  params: params
                };
              }
            }
          }
        }
      })();

      //Removing template applications, saving them in appTemplates
      (function() {
        for (const app of templateApps) {
          app.remove();
          delete app.dataset.template;
          appTemplates[app.dataset.app] = app;
        }
      })();

      //Adding error windows to have it serve as error (404, etc.) page
      // (function() {
      //   for (let i = 0; i < 10; i++) {
      //     setTimeout(function() {
      //       addApp('error', translateError);
      //     }, 125 * i);
      //   }
      // })();

      // addApp('minesweeper');

      updateClock();
      setInterval(updateClock, 1000);
    </script>
  </body>
</html>
