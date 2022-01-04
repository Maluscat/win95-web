'use strict';
function Explorer(app, carryStates) {
  const that = this;

  that.onClose = onClose;

  const itemWrapper = app.querySelector('.body > .file-viewer > .file-items');
  const titleText = app.querySelector('.header > .title > .text');

  // ------- Init -------
  Object.assign(that, new FileViewer(itemWrapper, carryStates.path));
  titleText.textContent = ['C:', ...that.path].join('\\') + '\\';

  // ------- Prototype functions -------
  function onClose() {
    that.removeFileViewer();
  }
}
