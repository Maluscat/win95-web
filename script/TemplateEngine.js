class TemplateEngine {
  constructor(options) {
    Object.assign(this, options);
  }

  parseSnippets() {
    for (const snip of this.snippets) {
      snipTemplates[snip.dataset.snippet] = snip;

      parseDataEvents(snip, ['e'], (node, type, fn) => {
        snip.addSnipEventListener(node == snip ? false : node, type, fn);
      }, true);

      const expandSpots = content.querySelectorAll('[data-expand-snippet="' + snip.dataset.snippet + '"]');
      for (const expandSpot of expandSpots) {
        const clone = cloneSnippet(snip);
        expandSpot.parentNode.replaceChild(clone, expandSpot);
      }

      snip.remove();
    }
  }
  parseTemplates() {
    for (const app of this.templates) {
      app.remove();
      delete app.dataset.template;
      appTemplates[app.dataset.app] = app;
    }
  }
  parseDataEvents() {
    for (const app of this.templates) {
      parseDataEvents(app, ['e', 'app'], (node, type, fn) => {
        const selector = app.checkNode(node, true);
        app.addAppEventListener(selector, type, fn, false, true);
      });
    }
  }
}
