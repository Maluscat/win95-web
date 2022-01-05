class TemplateEngine {
  static SnipEventsIDCounter = 0;

  snipTemplates = {};
  snipEvents = {};
  appTemplates = {};
  appEvents = {};

  appStates = new Map();

  constructor(options) {
    Object.assign(this, options);
  }

  initSnippets() {
    for (const snip of this.snippets) {
      this.snipTemplates[snip.dataset.snippet] = snip;

      parseDataEvents(snip, ['e'], (node, type, fn) => {
        this.addSnipEventListener(snip, node, type, fn);
      }, true);

      const expandSpots = content.querySelectorAll('[data-expand-snippet="' + snip.dataset.snippet + '"]');
      for (const expandSpot of expandSpots) {
        const clone = this.cloneSnippet(snip);
        expandSpot.parentNode.replaceChild(clone, expandSpot);
      }

      snip.remove();
    }
  }
  initTemplates() {
    for (const app of this.templates) {
      app.remove();
      delete app.dataset.template;
      this.appTemplates[app.dataset.app] = app;
    }
  }
  initDataEvents() {
    for (const app of this.templates) {
      parseDataEvents(app, ['e', 'app'], (node, type, fn) => {
        const selector = app.checkNode(node, true);
        this.addAppEventListener(app, selector, type, fn, false, true);
      });
    }
  }

  cloneApp(node) {
    if (typeof node == 'string') {
      if (!this.appTemplates[node]) {
        console.error("cloneApp Error: No app found with a name of the passed string. Skipping.");
        return;
      }
      node = this.appTemplates[node];
    }
    const cloned = node.cloneNode(true);
    const appName = node.dataset.app;
    const events = this.appEvents[appName];
    if (events) {
      for (const evtData of events) {
        if (evtData.matchAll) {
          const nodes = cloned.querySelectorAll(evtData.selector);
          for (const node of nodes) {
            addEvent(node, cloned, evtData);
          }
        } else {
          const node = cloned.querySelector(evtData.selector);
          addEvent(node, cloned, evtData)
        }
      }
    }
    return cloned;

    function addEvent(node, cloned, evtData) {
      node.addEventListener(evtData.type, function(e) {
        evtData.fn.call(this, e, cloned);
      });
    }
  };

  cloneSnippet(node, extraArgs = []) {
    if (typeof node == 'string') {
      if (!this.snipTemplates[node]) {
        console.error("cloneSnippet Error: No snippet found with a name of the passed string. Skipping.");
        return;
      }
      node = this.snipTemplates[node];
    }
    const cloned = node.cloneNode(true);
    const name = node.dataset.snippet;
    if (this.snipEvents[name]) {
      this.snipEvents[name].forEach(function(event, i) {
        const elem = event.selector ? cloned.querySelector(event.selector) : cloned;
        elem.addEventListener(event.type, function(e) {
          event.fn.apply(this, [e, ...extraArgs]);
        });
      });
    }
    cloned.classList.add(cloned.dataset.snippet);
    delete cloned.dataset.snippet;
    return cloned;
  };

  //Adding one or multiple event listeners to an app respectively and saving it in appEvents
  addAppEventListener(app, selector, type, callback, matchAll, skipCheck) {
    //matchAll? == use querySelectorAll, skipCheck? == don't check whether the selector is valid within `this`
    if (skipCheck || matchAll ? app.querySelectorAll(selector).length > 0 : app.querySelector(selector)) {
      const appName = app.dataset.app;
      const data = {
        selector: selector,
        type: type,
        fn: callback,
        matchAll: !!matchAll
      };
      if (!this.appEvents[appName]) {
        this.appEvents[appName] = new Array(data);
      } else {
        this.appEvents[appName].push(data);
      }
    }
  };

  //This is fundamentally different from addAppEventListener
  addSnipEventListener(snip, node, type, callback) {
    const name = snip.dataset.snippet;
    const data = {
      type: type,
      fn: callback
    };
    if (node !== snip) {
      if (snip.checkNode(node)) {
        node.dataset.templateEventId = TemplateEngine.SnipEventsIDCounter;
        data.selector = `[data-template-event-id="${TemplateEngine.SnipEventsIDCounter}"]`;
        TemplateEngine.SnipEventsIDCounter++;
      } else {
        console.error(
          "addSnipEventListener Error: The specified node isn't a descendent of the target node. Skipping event.\n" +
          "- target node: %o\n" +
          "- specified node: %o\n" +
          "- snippet name: %s",
          snip, node, name
        );
      }
    } else {
      data.selector = false;
    }
    if (!this.snipEvents[name]) {
      const item = new Array(data);
      this.snipEvents[name] = item;
    } else {
      const item = this.snipEvents[name];
      item.push(data);
    }
  };
}

// ------- Helper functions -------
function parseDataEvents(node, args, callback, allowSelf) {
  let eventNodes = node.querySelectorAll('[data-on]');
  if (node.dataset.on && allowSelf) {
    (eventNodes = Array.from(eventNodes)).push(node);
  }
  for (const eventNode of eventNodes) {
    const events = eventNode.dataset.on
      .split(';')
      .map(evt => evt
        .split(',')
        .map(val => val.trim()));
    for (const [type, fnStr] of events) {
      const fn = parseFunctionStr(fnStr, args, true);
      callback(eventNode, type, fn);
    }
  }
}

function parseFunctionStr(fnStr, params, paramsDefault) {
  //params: Array<String> = parameters of the new Function
  //paramsDefault: bool = whether to use `params` as the default when none were defined
  if (Array.isArray(params) && params.length == 0) {
    throw new Error('@ parseFunctionStr: second argument `params` may not be an empty array.');
  }
  const lastOpenParen = fnStr.lastIndexOf('(');
  const hasNoArguments = lastOpenParen + 1 == fnStr.lastIndexOf(')');

  fnStr = fnStr.trim();
  if (paramsDefault && hasNoArguments) {
    fnStr = replaceAtIndex(lastOpenParen, fnStr, '(' + params.join(','));
  }
  //converting the function string to a `call` for passing `this`
  fnStr = replaceAtIndex(lastOpenParen, fnStr, '.call(this' + (hasNoArguments && (!params || !paramsDefault) ? '' : ','));
  fnStr = fnStr.replace('!app.', 'templateEngine.appStates.get(app).');

  return new Function(...params, 'templateEngine', `'use strict'; ${fnStr}`);

  function replaceAtIndex(idx, source, target) {
    return source.slice(0, idx) + target + source.slice(idx + 1);
  }
}

//Looping over all children of a specified node, stopping when finding a target
Node.prototype.checkNode = function(target, protocol, original = this) {
  //protocol: boolean? = construct a unique selector path from `original` to `target`
  //implicit unchecked condition: `original` needs to be unique across all of its descendants
  if (this == target) return true;

  for (var i = 0; i < this.childElementCount; i++) {
    let result = this.children[i].checkNode(target, protocol, original);
    if (result) {
      if (protocol) {
        let selector = '';
        //The original caller element needs to be uniquely matched because a nested tree of `:nth-child`s can start and match anywhere
        if (this == original) {
          if (this.tagName)
            selector += this.tagName.toLowerCase();
          if (this.classList.length != 0)
            selector += '.' + Array.prototype.join.call(this.classList, '.');
          if (this.hasAttributes())
            selector += Array.from(this.attributes)
              .filter(attr => attr.name != 'class' || attr.name != 'style')
              .reduce((acc, curr) => acc + `[${curr.name}="${curr.value}"]`, '');
        }
        selector += ' > :nth-child(' + (i + 1) +')' + (result === true ? '' : result);
        return selector;
      } else return true;
    }
  }
};

//Looking upwards for a node with the specified class
Node.prototype.findNodeUp = function(target, isData = false) {
  if (this == content) return false;
  if (!isData && target[0] == '[' && target[target.length - 1] == ']') {
    isData = true;
    target = target.slice(1, -1);
    while(target.includes('-')) {
      const index = target.indexOf('-');
      target = target.slice(0, index) + target[index + 1].toUpperCase() + target.slice(index + 2);
    }
  }
  if (Array.isArray(target)) {
    for (l of target)
      if (isData && this.dataset[target] != null || !isData && this.classList.contains(l))
        return this;
  } else if (isData && this.dataset[target] != null || !isData && this.classList.contains(target))
    return this;
  return Node.prototype.findNodeUp.call(this.parentNode, target, isData);
};
