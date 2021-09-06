'use strict';
function FileViewer(itemTarget, path = new Array()) {
  const that = this;

  that.itemTarget = itemTarget;
  that.path = path;

  that.newFolder = newFolder;
  that.removeFileViewer = removeFileViewer;

  that.newFolderCounter = 1;

  that.directory = path.reduce((acc, curr) => {
    for (const item of acc.children) {
      if (item.name == curr) return item;
    }
  }, WinFileSystem);

  for (const directoryChild of that.directory.children) {
    directoryChild.addToDOM(that.itemTarget, path);
  }

  let linkedViewers;
  if (fileViewerInstances.has(that.directory)) {
    linkedViewers = fileViewerInstances.get(that.directory);
  } else {
    linkedViewers = new Set();
    fileViewerInstances.set(that.directory, linkedViewers);
  }
  linkedViewers.add(that);

  // ------- Prototype functions -------
  function newFolder() {
    let newFolderName = 'New Folder';
    if (that.newFolderCounter > 1) newFolderName += ' (' + that.newFolderCounter + ')';
    that.newFolderCounter++;

    const folder = new Folder(newFolderName);
    that.directory.children.push(folder);
    for (const viewer of linkedViewers) {
      folder.addToDOM(viewer.itemTarget, path);
    }
  }

  function removeFileViewer() {
    linkedViewers.delete(that);
    if (linkedViewers.size == 0) {
      fileViewerInstances.delete(that.directory);
    }
  }
}
