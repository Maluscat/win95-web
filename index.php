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

      <template>
        <div data-template="resize-areas" class="resize-areas">
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
      </template>

      <template>
        <li data-template="file-item" class="file-item" tabindex="0">
          <span class="image">
            <span class="image"></span>
          </span>
          <span class="text noselect">{{ text }}</span>
        </li>
      </template>

      <template>
        <button data-template="task-btn" type="button" class="task-btn btn click-btn" data-on="click, toggleTaskBtn()">
          <div class="inner btn-inner">
            <span class="image"></span>
            <span class="text">{{ appTitle }}</span>
          </div>
        </button>
      </template>

      <template>
        <div data-template="explorer" data-app class="window-wrapper">
          <div class="window">
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
            <div class="menu">
              <ul class="list">
                <li class="menu-item">
                  <div class="wrapper">
                    <span class="text">File</span>
                  </div>
                  <div class="window-wrapper item-list">
                    <div class="window">
                      <ul class="index">
                        <div class="section">
                          <li>Open</li>
                          <li>Explore</li>
                          <li>Find...</li>
                        </div>
                        <div class="section">
                          <li class="expandable">
                            <div class="wrapper">New</div>
                            <div class="window-wrapper">
                              <div class="window">
                                <ul class="index">
                                  <div class="section">
                                    <li data-task="!app.explorer.newFolder()">Folder</li>
                                    <li>Shortcut</li>
                                  </div>
                                  <div class="section">
                                    <li>Text Document</li>
                                  </div>
                                </ul>
                              </div>
                            </div>
                          </li>
                        </div>
                        <div class="section">
                          <li>Create Shortcut</li>
                          <li>Delete</li>
                          <li>Rename</li>
                          <li>Properties</li>
                        </div>
                        <div class="section">
                          <li>Close</li>
                        </div>
                      </ul>
                    </div>
                  </div>
                </li>
                <li class="menu-item">
                  <div class="wrapper">
                    <span class="text">Edit</span>
                  </div>
                  <div class="window-wrapper item-list">
                    <div class="window">
                      <ul class="index">
                        <div class="section">
                          <li>Undo Rename</li>
                        </div>
                        <div class="section">
                          <li class="shortcut">
                            <span class="text">Cut</span>
                            <span class="shortcut">Ctrl+X</span>
                          </li>
                          <li class="shortcut">
                            <span class="text">Copy</span>
                            <span class="shortcut">Ctrl+C</span>
                          </li>
                          <li class="shortcut disabled">
                            <span class="text">Paste</span>
                            <span class="shortcut">Ctrl+V</span>
                          </li>
                          <li class="disabled">Paste Shortcut</li>
                        </div>
                        <div class="section">
                          <li class="shortcut">
                            <span class="text">Select All</span>
                            <span class="shortcut">Ctrl+A</span>
                          </li>
                          <li>Invert Selection</li>
                        </div>
                      </ul>
                    </div>
                  </div>
                </li>
                <li class="menu-item">
                  <div class="wrapper">
                    <span class="text">View</span>
                  </div>
                  <div class="window-wrapper item-list">
                    <div class="window">
                      <ul class="index">
                        <div class="section">
                          <li>Toolbar</li>
                          <li class="checkmark">Status bar</li>
                        </div>
                        <div class="section">
                          <li class="radio-btn">Large Icons</li>
                          <li>Small Icons</li>
                          <li>List</li>
                          <li>Details</li>
                        </div>
                        <div class="section">
                          <li>Arrange Icons //TODO COLLAPSIBLE ARROW MENU</li>
                          <li>Line up Icons //?</li>
                        </div>
                        <div class="section">
                          <li>Refresh</li>
                          <li>Options</li>
                        </div>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="body">
              <div class="file-viewer">
                <ul class="file-items">
                </ul>
              </div>
            </div>
          </div>
          <div data-template-expand="resize-areas"></div>
        </div>
      </template>

      <template>
        <div data-template="notepad" data-app class="window-wrapper">
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
                  <div class="window-wrapper item-list">
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
                  <div class="window-wrapper item-list">
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
                  <div class="window-wrapper item-list">
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
                  <div class="window-wrapper item-list">
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
          <div data-template-expand="resize-areas"></div>
        </div>
      </template>

      <template>
        <div data-template="error" data-app class="window-wrapper" data-ghost>
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
      </template>

      <template>
        <div data-template="minesweeper:prompt" data-app class="window-wrapper slim" data-ghost>
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
                    <input class="input" type="text" value="{{ inputHeight }}">
                  </div>
                </div>
                <div class="field item-width">
                  <div class="caption">
                    <span class="text">Width:</span>
                  </div>
                  <div class="input-wrapper">
                    <input class="input" type="text" value="{{ inputWidth }}">
                  </div>
                </div>
                <div class="field item-mines">
                  <div class="caption">
                    <span class="text">Mines:</span>
                  </div>
                  <div class="input-wrapper">
                    <input class="input" type="text" value="{{ inputMines }}">
                  </div>
                </div>
              </div>
              <div class="buttons">
                <button class="btn click-btn action-btn submit" type="button" data-on="click, submitSweeperPrompt()">
                  <div class="inner btn-inner">
                    <span class="text">OK</span>
                  </div>
                </button>
                <button class="btn click-btn action-btn cancel" type="button" data-on="click, closeApp()">
                  <div class="inner btn-inner">
                    <span class="text">Cancel</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template>
        <div data-template="minesweeper" data-app class="window-wrapper slim">
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
                  <div class="window-wrapper item-list">
                    <div class="window">
                      <ul class="index">
                        <div class="section">
                          <li class="shortcut" data-task="!app.minesweeper.newGame()">
                            <span class="text">New</span>
                            <span class="shortcut">F2</span>
                          </li>
                        </div>
                        <div class="section" data-task="!app.minesweeper.changeField(this, menu)">
                          <li class="checkmark checked">Beginner</li>
                          <li class="checkmark">Intermediate</li>
                          <li class="checkmark">Expert</li>
                          <li class="checkmark">Custom...</li>
                        </div>
                        <div class="section">
                          <li class="checkmark" data-task="!app.minesweeper.toggleQuestionMarks()">Marks (?)</li>
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
      </template>

      <div id="desktop" class="file-viewer"></div>

      <div class="taskbar-wrapper">
        <div id="taskbar">
          <div class="start-menu">
            <div class="window-wrapper item-list" id="start-window">
              <div class="window">
                <aside class="brand">
                  <span class="image"></span>
                </aside>
                <div class="body">
                  <ul id="first-list">
                    <div class="section">
                      <li class="item expandable">
                        <div class="wrapper">Programs</div>
                        <div class="window-wrapper">
                          <div class="window">
                            <ul class="index">
                              <li class="item expandable">
                                <div class="wrapper">Accessories</div>
                                <div class="window-wrapper">
                                  <div class="window">
                                    <ul class="index">
                                      <li data-execute="minesweeper">
                                        <span class="image"></span>
                                        <span class="text">Minesweeper</span>
                                      </li>
                                      <li data-execute="notepad">
                                        <span class="image"></span>
                                        <span class="text">Notepad</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </li>
                              <li>Startup</li>
                              <li>MS-DOS Prompt</li>
                              <li>The Microsoft Network</li>
                              <li data-execute="explorer">
                                <span class="image"></span>
                                <span class="text">Windows Explorer</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>Documents</li>
                      <li>Settings</li>
                      <li>Disclaimer</li>
                    </div>
                    <div class="section">
                      <li>Shut Down</li>
                    </div>
                  </ul>
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

    <script src="script/TemplateEngine.js"></script>
    <script src="script/main.js"></script>
    <script src="script/main-app.js"></script>
    <script src="script/FileViewer.js"></script>
    <script src="script/application/Explorer.js"></script>
    <script src="script/application/filesystem.js"></script>
    <script src="script/application/minesweeper.js"></script>
    <script>
      const content = document.getElementById('content');

      const moveIndicator = document.getElementById('move-indicator');
      const headExpander = document.getElementById('header-expander');
      const expanderTitle = headExpander.querySelector('.title .text');

      const desktop = document.getElementById('desktop');

      const taskbar = document.getElementById('taskbar');
      const taskbarWrapper = content.querySelector('.taskbar-wrapper');
      const taskbarBtns = taskbar.querySelector('.task-btns');
      const taskResize = taskbarWrapper.querySelectorAll('.resize-areas [data-dir="north"]');

      const startExecutables = content.querySelectorAll('[data-execute]');
      const clock = taskbar.querySelector('#clock .text');

      const startBtn = document.getElementById('start-btn');
      const startWindow = document.getElementById('start-window');
      const firstStartList = document.getElementById('first-list');
      const startItems = firstStartList.querySelectorAll('li');
      const startItemsExpand = firstStartList.querySelectorAll('li.expandable .wrapper');

      const engine = new TemplateEngine({
        templatesContent: content,
        templateNodes: content.getElementsByTagName('template'),
      });

      const templateApps = Object.values(engine.templates)
        .filter(node => node.dataset.app !== null);

      // Preloading icons for the canvas of Minesweeper
      (function() {
        const sweeperIcons = [ 'digits', 'faces', 'symbols', 'tile' ];
        for (let icon of sweeperIcons) {
          const img = new Image();
          img.src = 'resource/image/minesweeper/' + icon + '.png';
          sweeperImgs[icon] = new Promise(resolve => {
            img.onload = function() {
              resolve(img);
            };
          });
        }
      })();

      //Adding a new stylesheet with rules for app icon URLs
      (function() {
        const availableIcons = {
          notepad: [ 'app', 'menu', 'tray' ],
          explorer: [ 'app', 'menu', 'tray' ],
          minesweeper: [ 'app', 'menu', 'tray' ],
        };

        if (Object.keys(availableIcons).length > 0) {
          const styleNode = document.createElement('style');
          var sheet = document.head.appendChild(styleNode).sheet;
        }
        for (const icon in availableIcons) {
          const item = availableIcons[icon];
          if (item.includes('tray')) {
            const appTitle = engine.templates[icon].querySelector('.header .title');
            appTitle.dataset.trayIcon = icon;
            addIconRule('tray', icon);
          }
          if (item.includes('menu')) {
            const startExecute = startWindow.querySelector('li[data-execute="' + icon + '"]');
            if (startExecute) startExecute.dataset.menuIcon = icon;
            addIconRule('menu', icon);
          }
          if (item.includes('app')) {
            addIconRule('app', icon);
          }
        }

        function addIconRule(type, icon) {
          sheet.insertRule(
            `[data-${type}-icon="${icon}"] .image {
              background-image: url('./resource/image/icon/${type}-icon/${icon}.png');
            }`,
            0
          );
        }
      })();

      //Adding event listeners
      (function() {
        //Application events, prepared for cloning
        for (const app of templateApps) {
          const maxBtn = app.querySelector('.header .title-btns .maximize-btn');
          if (maxBtn && !maxBtn.classList.contains('disabled')) {
            engine.addTemplateEventListener(app, '.maximize-btn', 'click', maximizeApp);
            engine.addTemplateEventListener(app, '.header .title .text', 'dblclick', maximizeApp);
          }
          engine.addTemplateEventListener(app, '.minimize-btn', 'click', minimizeApp);
          engine.addTemplateEventListener(app, '.close-btn', 'click', closeApp);
          engine.addTemplateEventListener(app, '.header', 'pointerdown', addWindowMove);

          engine.addTemplateEventListener(app, '.item-list li.expandable > .wrapper', 'pointerdown', expandableListClick, true);
          engine.addTemplateEventListener(app, '.item-list li', 'pointerenter', handleListItems, true);
          engine.addTemplateEventListener(app, '.item-list li', 'pointerup', handleAppMenuItems, true);
          engine.addTemplateEventListener(app, '.menu .menu-item > .wrapper', 'pointerdown', toggleAppMenu, true);
          engine.addTemplateEventListener(app, '.resize-areas > .edge > span', 'pointerdown', addWindowResize, true);
        }

        window.addEventListener('pointerdown', mouseDown);
        startBtn.addEventListener('click', () => toggleStartMenu());
        for (l of startExecutables) l.addEventListener('click', executeApp);
        for (l of taskResize) l.addEventListener('pointerdown', addWindowResize);
        for (l of startItems) l.addEventListener('pointerenter', handleListItems);
        for (l of startItemsExpand) l.addEventListener('pointerdown', expandableListClick);
      })();

      //Parsing app menu tasks and saving their functions in appMenuTasks
      (function() {
        for (const app of templateApps) {

          const menuSections = app.querySelectorAll('.menu > .list .index .section');
          for (const section of menuSections) {

            const items = section.querySelectorAll('li');
            for (const item of items) {

              const task = item.dataset.task || section.dataset.task;
              if (task && !appMenuTasks[task]) {
                fn = parseFunctionStr(task, ['app', 'menu']);
                appMenuTasks[task] = fn;
              }
            }
          }
        }
      })();

      // ------- Feature specific init functions -------
      new FileViewer(desktop, ['Windows', 'Desktop']);

      updateClock();
      setInterval(updateClock, 1000);
    </script>
  </body>
</html>
