'use strict';
function Explorer(app, states) {
  const that = this;

  that.onClose = onClose;

  const itemWrapper = app.querySelector('.body > .file-viewer > .file-items');
  const titleText = app.querySelector('.header > .title > .text');

  // ------- Init -------
  Object.assign(that, new FileViewer(itemWrapper, states.path));
  titleText.textContent = ['C:', ...that.path].join('\\') + '\\';

  // ------- Prototype functions -------
  function onClose() {
    that.removeFileViewer();
  }
}
