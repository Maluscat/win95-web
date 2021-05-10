'use strict';
class FileItemBase {
  constructor(props) {
    for (const key in props) this[key] = props[key];
  }

  addToDOM(targetNode, path = new Array(), className, name) {
    const node = cloneSnippet('file-item');
    node.classList.add(className);
    node.querySelector('.text').textContent = name;
    node.addEventListener('dblclick', this.open.bind(this, path));
    targetNode.appendChild(node);
    return node;
  }
}

class Folder extends FileItemBase {
  constructor(name, children = new Array(), props = {}) {
    super({...props, name, children});
  }

  addToDOM(targetNode, path) {
    super.addToDOM(targetNode, path, 'folder', this.name);
  }

  open(path) {
    addApp('explorer', (newApp, newStates) => {
      const newPath = Array.from(path);
      newPath.push(this.name);
      newStates.path = newPath;
    });
  }
}
class File extends FileItemBase {
  constructor(name, extension, props = {}) {
    super(Object.assign(props, {
      name,
      extension,
      internalName: props.execute || name
    }));
  }

  addToDOM(targetNode, path) {
    const node = super.addToDOM(targetNode, path, 'file', this.name + '.' + this.extension);
    node.dataset.appIcon = this.internalName;
  }

  open() {
    // TODO Don't just execute everything when implementing files other than .exe
    addApp(this.internalName);
  }
}

const WinFileSystem = new Folder('', [
  new Folder('Program Files', [
    new File('notepad', 'exe'),
    new File('Winmine', 'exe', {
      execute: 'minesweeper'
    })
  ]),
  new Folder('Windows', [
    new Folder('Desktop', [
      new File('explorer', 'exe'),
      new File('notepad', 'exe'),
      new File('Winmine', 'exe', {
        execute: 'minesweeper'
      })
    ])
  ])
]);
