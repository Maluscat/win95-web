function FileViewer(itemTarget, path = new Array()) {
  const that = this;

  that.path = path;

  that.openItem = openItem;
  that.newFolder = newFolder;
  that.addItem = addItem;

  //TODO pass a custom path
  const directory = path.reduce((acc, curr) => {
    for (const item of acc) {
      if (item.name == curr) return item.children;
    }
  }, WinFileSystem);

  // ------- Init -------
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
    } else {
      if (this.dataset.execute) {
        addApp(this.dataset.execute);
      }
    }
  }

  function newFolder() {
    const folder = new Folder('New folder');
    directory.push(folder);
    addItem(folder);
  }

  function addItem(item) {
    const node = cloneSnippet('file-item');
    node.addEventListener('dblclick', that.openItem);
    let fullName = item.name;
    if (item instanceof Folder) {
      node.classList.add('folder');
    } else {
      const internalName = item.execute || item.name;
      node.classList.add('file');
      node.dataset.execute = node.dataset.appIcon = internalName;
      fullName += '.' + item.extension;
    }
    node.querySelector('.text').textContent = fullName;
    itemTarget.appendChild(node);
  }
}
