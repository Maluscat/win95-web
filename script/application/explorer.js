const WinFileSystem = {
  Test: {},
  'Program Files': {
    notepad: 'notepad',
    Winmine: 'minesweeper'
  }
};


function Explorer(app, states) {
  const that = this;

  that.openItem = openItem;

  const itemWrapperSelector = '.body > .file-wrapper > .items';
  const itemWrapper = app.querySelector(itemWrapperSelector);
  const titleText = app.querySelector('.header > .title > .text');

  //TODO pass a custom path
  const path = states.path || new Array();
  const directory = path.reduce((acc, curr) => acc[curr], WinFileSystem);

  const pathName = ['C:', ...path].join('\\') + '\\';
  titleText.textContent = pathName;

  for (const [item, val] of Object.entries(directory)) {
    const node = cloneSnippet('explorer-item', [app]);
    node.querySelector('.text').textContent = item;
    if (typeof val == 'object') {
      node.classList.add('folder');
    } else {
      node.classList.add('file');
      node.dataset.appIcon = val;
    }
    itemWrapper.appendChild(node);
  }


  function openItem() {
    const itemName = this.querySelector('.text').textContent;
    addApp('explorer', function(newApp, newStates) {
      const newPath = Array.from(path);
      newPath.push(itemName);
      newStates.path = newPath;
    });
  }
}
