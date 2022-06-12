class TemplateEngine {
  static PLACEHOLDER_REGEX = /{{\s*(\w+)\s*}}/g;

  static eventsIDCounter = 0;

  templates = {};
  templateEvents = {};
  templatePlaceholders = {};
  appStates = new Map();

  constructor(options) {
    if (!options.templatesContent) options.templatesContent = document.body;

    // Save & delete templates, expand templates, parse `data-on` events
    for (const templateWrapper of options.templateNodes) {
      const template = this.getElementFromTemplateWrapper(templateWrapper);
      const templateName = template.dataset.template;
      this.templates[templateName] = template;

      if (TemplateEngine.PLACEHOLDER_REGEX.test(template.outerHTML)) {
        this._registerTemplatePlaceholders(template, templateName);
      }

      const expandSpots = options.templatesContent.querySelectorAll('[data-template-expand="' + templateName + '"]');
      for (const expandSpot of expandSpots) {
        const clone = this.cloneTemplate(template);
        expandSpot.parentNode.replaceChild(clone, expandSpot);
      }

      parseDataEvents(template, ['e', 'app'], (node, type, fn) => {
        this.addTemplateNodeEventListener(template, node, type, fn, false);
      });
    }

    // I can't remove them directly in the upper loop, just GC stuff I guess
    for (const templateWrapper of options.templateNodes) {
      templateWrapper.remove();
    }
  }

  _registerTemplatePlaceholders(node, templateName) {
    if (node.childNodes.length === 0) {
      if (TemplateEngine.PLACEHOLDER_REGEX.test(node.textContent)) {
        if (!this.templatePlaceholders[templateName]) {
          this.templatePlaceholders[templateName] = new Array();
        }
        this.templatePlaceholders[templateName].push({
          node,
          content: node.textContent
        });
      }
      if (!node.attributes) return;
    }
    for (const child of node.attributes) {
      this._registerTemplatePlaceholders(child, templateName);
    }
    for (const child of node.childNodes) {
      this._registerTemplatePlaceholders(child, templateName);
    }
  }

  cloneTemplate(node, placeholderObj) {
    if (typeof node === 'string') {
      if (!Object.prototype.hasOwnProperty.call(this.templates, node)) {
        console.error("cloneTemplate Error: No app found with a name of the passed string. Skipping.");
        return;
      }
      node = this.templates[node];
    }
    const placeholders = this.templatePlaceholders[node.dataset.template];
    if (placeholders) {
      for (const {node: placeholderNode, content} of placeholders) {
        placeholderNode.textContent = content.replace(TemplateEngine.PLACEHOLDER_REGEX, function(match, placeholderName) {
          return placeholderObj && placeholderObj.hasOwnProperty(placeholderName) ? placeholderObj[placeholderName] : '';
        });
      }
    }
    const cloned = node.cloneNode(true);
    const events = this.templateEvents[node.dataset.template];
    if (events) {
      for (const evtData of events) {
        if (evtData.selector === false) {
          addEvent(cloned, evtData);
        } else if (evtData.matchAll) {
          for (const targetNode of cloned.querySelectorAll(evtData.selector)) {
            addEvent(targetNode, evtData);
          }
        } else {
          const targetNode = cloned.querySelector(evtData.selector);
          addEvent(targetNode, evtData)
        }
      }
    }
    return cloned;

    function addEvent(targetNode, evtData) {
      targetNode.addEventListener(evtData.type, function(e) {
        evtData.fn.call(this, e, cloned);
      });
    }
  }

  // Adding one or multiple event listeners to a template and saving it in templateEvents
  addTemplateEventListener(template, selector, type, callback, matchAll, assumeValid) {
    // matchAll? == use querySelectorAll
    // assumeValid? == assume that selector exists in template and don't check it
    if (assumeValid || (matchAll ? template.querySelectorAll(selector).length > 0 : template.querySelector(selector))) {
      const templateName = template.dataset.template;
      const data = {
        selector: selector,
        type: type,
        fn: callback,
        matchAll: !!matchAll
      };
      if (!this.templateEvents[templateName]) {
        this.templateEvents[templateName] = new Array();
      }
      this.templateEvents[templateName].push(data);
    }
  }

  addTemplateNodeEventListener(template, targetNode, type, callback) {
    let selector = false;
    if (targetNode !== template) {
      if (template.checkNode(targetNode)) {
        targetNode.dataset.templateEventId = TemplateEngine.eventsIDCounter;
        selector = `[data-template-event-id="${TemplateEngine.eventsIDCounter}"]`;
        TemplateEngine.eventsIDCounter++;
      } else {
        console.error(
          "addTemplateNodeEventListener Error: The targeted node isn't a descendent of the template node. Skipping event.\n" +
          "- template node: %o\n" +
          "- target node: %o",
          template, targetNode
        );
        return;
      }
    }
    this.addTemplateEventListener(template, selector, type, callback, false, true);
  }

  // ------- Utility methods -------
  getElementFromTemplateWrapper(templateWrapper) {
    if (templateWrapper.content.childElementCount > 1) {
      throw new Error(
        `TemplateEngine: Template wrapper ${templateWrapper} contains multiple children but may only contain one`);
    }
    return templateWrapper.content.firstElementChild;
  }
}

// ------- Helper functions -------
function parseDataEvents(node, args, callback) {
  let eventNodes = node.querySelectorAll('[data-on]');
  if (node.dataset.on) {
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
  if (Array.isArray(params) && params.length === 0) {
    throw new Error('@ parseFunctionStr: second argument `params` may not be an empty array.');
  }
  const lastOpenParen = fnStr.lastIndexOf('(');
  const hasNoArguments = lastOpenParen + 1 === fnStr.lastIndexOf(')');

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

// Looping over all children of a specified node, stopping when finding a target
Node.prototype.checkNode = function(target) {
  if (this === target) return true;

  for (const child of this.children) {
    if (child.checkNode(target)) {
      return true;
    }
  }
};

// Looking upwards for a node with the specified class
Node.prototype.findNodeUp = function(target, isData = false) {
  if (this === document.body) return false;
  if (!isData && target[0] === '[' && target[target.length - 1] === ']') {
    isData = true;
    target = target.slice(1, -1);
    while (target.includes('-')) {
      const index = target.indexOf('-');
      target = target.slice(0, index) + target[index + 1].toUpperCase() + target.slice(index + 2);
    }
  }
  if (Array.isArray(target)) {
    for (const l of target) {
      if (isData && this.dataset[target] != null || !isData && this.classList.contains(l)) {
        return this;
      }
    }
  } else if (isData && this.dataset[target] != null || !isData && this.classList.contains(target)) {
    return this;
  }
  return Node.prototype.findNodeUp.call(this.parentNode, target, isData);
};
