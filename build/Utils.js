/* eslint no-use-before-define:0 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.propsOfNode = propsOfNode;
exports.onPrototype = onPrototype;
exports.getNode = getNode;
exports.childrenEqual = childrenEqual;
exports.nodeEqual = nodeEqual;
exports.propFromEvent = propFromEvent;
exports.withSetStateAllowed = withSetStateAllowed;
exports.splitSelector = splitSelector;
exports.isSimpleSelector = isSimpleSelector;
exports.selectorError = selectorError;
exports.selectorType = selectorType;
exports.AND = AND;
exports.coercePropValue = coercePropValue;

var _underscore = require('underscore');

var _reactCompat = require('./react-compat');

var _version = require('./version');

function propsOfNode(node) {
  if (_version.REACT013) {
    return node && node._store && node._store.props || {};
  }
  return node && node.props || {};
}

function onPrototype(Component, lifecycle, method) {
  var proto = Component.prototype;
  Object.getOwnPropertyNames(proto).forEach(function (name) {
    if (typeof proto[name] !== 'function') return;
    switch (name) {
      case 'componentDidMount':
      case 'componentWillMount':
      case 'componentDidUnmount':
      case 'componentWillUnmount':
      case 'componentWillReceiveProps':
      case 'componentDidUpdate':
      case 'componentWillUpdate':
      case 'shouldComponentUpdate':
      case 'render':
        if (lifecycle) lifecycle(proto, name);
        break;
      case 'constructor':
        // don't spy on the constructor, even though it shows up in the prototype
        break;
      default:
        if (method) method(proto, name);
        break;
    }
  });
}

function getNode(node) {
  return (0, _reactCompat.isDOMComponent)(node) ? (0, _reactCompat.findDOMNode)(node) : node;
}

function childrenEqual(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return nodeEqual(a, b);
  }
  if (!a && !b) return true;
  if (a.length !== b.length) return false;
  if (a.length === 0 && b.length === 0) return true;
  for (var i = 0; i < a.length; i++) {
    if (!nodeEqual(a[i], b[i])) return false;
  }
  return true;
}

function nodeEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.type !== b.type) return false;
  var left = propsOfNode(a);
  var leftKeys = Object.keys(left);
  var right = propsOfNode(b);
  for (var i = 0; i < leftKeys.length; i++) {
    var prop = leftKeys[i];
    if (!(prop in right)) return false;
    if (prop === 'children') {
      if (!childrenEqual(left.children, right.children)) return false;
    } else if (right[prop] === left[prop]) {
      // continue;
    } else if (typeof right[prop] === typeof left[prop] && typeof left[prop] === 'object') {
        if (!(0, _underscore.isEqual)(left[prop], right[prop])) return false;
      } else {
        return false;
      }
  }
  return leftKeys.length === Object.keys(right).length;
}

// 'click' => 'onClick'
// 'mouseEnter' => 'onMouseEnter'

function propFromEvent(event) {
  return 'on' + event[0].toUpperCase() + event.substring(1);
}

function withSetStateAllowed(fn) {
  // NOTE(lmr):
  // this is currently here to circumvent a React bug where `setState()` is
  // not allowed without global being defined.
  var cleanup = false;
  if (typeof global.document === 'undefined') {
    cleanup = true;
    global.document = {};
  }
  fn();
  if (cleanup) {
    delete global.document;
  }
}

function splitSelector(selector) {
  return selector.split(/(?=\.|\[.*\])/);
}

function isSimpleSelector(selector) {
  // any of these characters pretty much guarantee it's a complex selector
  return !/[~\s:>]/.test(selector);
}

function selectorError(selector) {
  return new TypeError('Enzyme received a complex CSS selector (\'' + selector + '\') that it does not currently support');
}

var isCompoundSelector = /([a-z]\.[a-z]|[a-z]\[.*\])/i;

exports.isCompoundSelector = isCompoundSelector;
var isPropSelector = /^\[.*\]$/;

var SELECTOR = {
  CLASS_TYPE: 0,
  ID_TYPE: 1,
  PROP_TYPE: 2
};

exports.SELECTOR = SELECTOR;

function selectorType(selector) {
  if (selector[0] === '.') {
    return SELECTOR.CLASS_TYPE;
  } else if (selector[0] === '#') {
    return SELECTOR.ID_TYPE;
  } else if (isPropSelector.test(selector)) {
    return SELECTOR.PROP_TYPE;
  }
}

function AND(fns) {
  return function (x) {
    var i = fns.length;
    while (i--) {
      if (!fns[i](x)) return false;
    }
    return true;
  };
}

function coercePropValue(propValue) {
  // can be undefined
  if (propValue === undefined) {
    return propValue;
  }

  // if propValue includes quotes, it should be
  // treated as a string
  if (propValue.search(/"/) !== -1) {
    return propValue.replace(/"/g, '');
  }

  var numericPropValue = parseInt(propValue, 10);

  // if parseInt is not NaN, then we've wanted a number
  if (!isNaN(numericPropValue)) {
    return numericPropValue;
  }

  // coerce to boolean
  return propValue === 'true' ? true : false;
}