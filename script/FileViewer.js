'use strict';
function FileViewer(itemTarget, path = new Array()) {
  const that = this;

  that.itemTarget = itemTarget;
  that.path = path;

  that.newFolder = newFolder;
  that.addItem = addItem;
  that.removeFileViewer = removeFileViewer;

  //TODO pass a custom path
  that.directory = path.reduce((acc, curr) => {
    for (const item of acc.children) {
      if (item.name == curr) return item;
    }
  }, WinFileSystem);

  // ------- Init -------
  for (const directoryChild of that.directory.children) {
    addItem(directoryChild);
  }

  let linkedViewers;
  if (fileViewerInstances.has(that.directory)) {
    linkedViewers = fileViewerInstances.get(that.directory);
  } else {
    linkedViewers = new Set();
    fileViewerInstances.set(that.directory, linkedViewers);
  }
  linkedViewers.add(that);

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
    that.directory.children.push(folder);
    for (const viewer of linkedViewers) {
      addItem(folder, viewer.itemTarget);
    }
  }

  function addItem(item, target = that.itemTarget) {
    const node = cloneSnippet('file-item');
    node.addEventListener('dblclick', openItem);
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
    target.appendChild(node);
  }

  function removeFileViewer() {
    linkedViewers.delete(that);
    if (linkedViewers.size == 0) {
      fileViewerInstances.delete(that.directory);
    }
  }
}
