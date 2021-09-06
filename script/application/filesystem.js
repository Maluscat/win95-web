'use strict';
class FileItemBase {
  constructor(props) {
    for (const key in props) this[key] = props[key];
  }

  addToDOM(targetNode, path = new Array(), className, name) {
    const node = cloneSnippet('file-item');
    node.classList.add(className);
    node.querySelector('.text').textContent = this.prepareItemNameWhitespace(name);
    node.addEventListener('dblclick', this.open.bind(this, path));
    targetNode.appendChild(node);
    return node;
  }

  // Replacing spaces with non-breaking spaces until width exceeds a threshold
  // This is needed to counter the needed min-content style of file items (see CSS)
  prepareItemNameWhitespace(text) {
    textMeasureCtx.font = '1rem Unifont';

    const words = text.split(/ /g);
    let intermediate = words[0];
    let result = '';
    for (var i = 1; i < words.length; i++) {
      const word = words[i];
      if (textMeasureCtx.measureText(intermediate + ' ' + word).width <= 96) {
        // xa0 is a non-breaking space
        intermediate += '\xa0' + word;
      } else {
        result += (result ? ' ' + intermediate : intermediate);
        intermediate = word;
      }
    }
    return result + ' ' + intermediate;
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
