'use strict';
class Folder {
  constructor(name, children, props) {
    this.name = name;
    this.children = children || new Array();
    for (const key in props) this[key] = props[key];
  }
}
class File {
  constructor(name, extension, props) {
    this.name = name;
    this.extension = extension;
    for (const key in props) this[key] = props[key];
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
