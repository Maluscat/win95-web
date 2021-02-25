function Explorer(app, states) {
  const that = this;

  that.openItem = openItem;
  that.newFolder = newFolder;

  const itemWrapper = app.querySelector('.body > .file-wrapper > .items');
  const titleText = app.querySelector('.header > .title > .text');

  //TODO pass a custom path
  const path = states.path || new Array();
  const directory = path.reduce((acc, curr) => {
    for (const item of acc) {
      if (item.name == curr) return item.children;
    }
  }, WinFileSystem);

  // ------- Init -------
  titleText.textContent = ['C:', ...path].join('\\') + '\\';
  directory.forEach(addItem);

  // ------- Class functions -------
  function openItem() {
    if (this.classList.contains('folder')) {
      const itemName = this.querySelector('.text').textContent;
      addApp('explorer', function(newApp, newStates) {
        const newPath = Array.from(path);
        newPath.push(itemName);
        newStates.path = newPath;
      });
    }
  }

  function newFolder() {
    const folder = new Folder('New folder');
    directory.push(folder);
    addItem(folder);
  }

  // ------- Helper functions -------
  function addItem(item) {
    const node = cloneSnippet('explorer-item', [app]);
    let fullName = item.name;
    if (item instanceof Folder) {
      node.classList.add('folder');
    } else {
      node.classList.add('file');
      node.dataset.appIcon = item.execute || item.name;
      fullName += '.' + item.extension;
    }
    node.querySelector('.text').textContent = fullName;
    itemWrapper.appendChild(node);
  }
}
