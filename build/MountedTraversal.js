'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.internalInstance = internalInstance;
exports.getNode = getNode;
exports.instEqual = instEqual;
exports.instHasClassName = instHasClassName;
exports.instHasId = instHasId;
exports.instHasType = instHasType;
exports.instHasProperty = instHasProperty;
exports.renderedChildrenOfInst = renderedChildrenOfInst;
exports.childrenOfInstInternal = childrenOfInstInternal;
exports.internalInstanceOrComponent = internalInstanceOrComponent;
exports.childrenOfInst = childrenOfInst;
exports.pathToNode = pathToNode;
exports.parentsOfInst = parentsOfInst;
exports.buildInstPredicate = buildInstPredicate;
exports.treeFilter = treeFilter;

var _Utils = require('./Utils');

var _reactCompat = require('./react-compat');

var _version = require('./version');

function internalInstance(inst) {
  return inst._reactInternalInstance;
}

function getNode(inst) {
  if (!inst || inst._store || typeof inst === 'string') {
    return inst;
  }
  if (inst._currentElement) {
    return inst._currentElement;
  }
  if (internalInstance(inst)) {
    return internalInstance(inst)._currentElement;
  }
  if (inst._reactInternalComponent) {
    return inst._reactInternalComponent._currentElement;
  }
  return inst;
}

function instEqual(a, b) {
  return (0, _Utils.nodeEqual)(getNode(a), getNode(b));
}

function instHasClassName(inst, className) {
  if (!(0, _reactCompat.isDOMComponent)(inst)) {
    return false;
  }
  var classes = (0, _reactCompat.findDOMNode)(inst).className || '';
  return (' ' + classes + ' ').indexOf(' ' + className + ' ') > -1;
}

function instHasId(inst, id) {
  if (!(0, _reactCompat.isDOMComponent)(inst)) return false;
  var instId = (0, _reactCompat.findDOMNode)(inst).id || '';
  return instId === id;
}

function instHasType(inst, type) {
  switch (typeof type) {
    case 'string':
      return (0, _reactCompat.isDOMComponent)(inst) && inst.tagName.toUpperCase() === type.toUpperCase();
    case 'function':
      return (0, _reactCompat.isCompositeComponentWithType)(inst, type);
    default:
      return false;
  }
}

function instHasProperty(inst, propKey, stringifiedPropValue) {
  if (!(0, _reactCompat.isDOMComponent)(inst)) return false;
  var node = getNode(inst);
  var nodeProps = (0, _Utils.propsOfNode)(node);
  var nodePropValue = nodeProps[propKey];

  var propValue = (0, _Utils.coercePropValue)(stringifiedPropValue);

  // intentionally not matching node props that are undefined
  if (nodePropValue === undefined) {
    return false;
  }

  if (propValue) {
    return nodePropValue === propValue;
  }

  return nodeProps.hasOwnProperty(propKey);
}

// called with private inst

function renderedChildrenOfInst(inst) {
  return _version.REACT013 ? inst._renderedComponent._renderedChildren : inst._renderedChildren;
}

// called with a private instance

function childrenOfInstInternal(_x) {
  var _again = true;

  _function: while (_again) {
    var inst = _x;
    _again = false;

    if (!inst) {
      return [];
    }
    if (!inst.getPublicInstance) {
      var internal = internalInstance(inst);
      _x = internal;
      _again = true;
      internal = undefined;
      continue _function;
    }
    var publicInst = inst.getPublicInstance();
    var currentElement = inst._currentElement;
    if ((0, _reactCompat.isDOMComponent)(publicInst)) {
      var children = [];
      var renderedChildren = renderedChildrenOfInst(inst);
      var key = undefined;
      for (key in renderedChildren) {
        if (!renderedChildren.hasOwnProperty(key)) {
          continue;
        }
        if (_version.REACT013 && !renderedChildren[key].getPublicInstance) {
          continue;
        }
        children.push(renderedChildren[key].getPublicInstance());
      }
      return children;
    } else if (_version.REACT014 && (0, _reactCompat.isElement)(currentElement) && typeof currentElement.type === 'function') {
      _x = inst._renderedComponent;
      _again = true;
      internal = publicInst = currentElement = children = renderedChildren = key = undefined;
      continue _function;
    } else if (_version.REACT013 && (0, _reactCompat.isCompositeComponent)(publicInst)) {
      _x = inst._renderedComponent;
      _again = true;
      internal = publicInst = currentElement = children = renderedChildren = key = undefined;
      continue _function;
    }
    return [];
  }
}

function internalInstanceOrComponent(node) {
  if (_version.REACT013) {
    return node;
  } else if (node._reactInternalComponent) {
    return node._reactInternalComponent;
  } else if (node._reactInternalInstance) {
    return node._reactInternalInstance;
  }
  return node;
}

function childrenOfInst(node) {
  return childrenOfInstInternal(internalInstanceOrComponent(node));
}

function pathToNode(node, root) {
  var queue = [root];
  var path = [];

  while (queue.length) {
    var current = queue.pop();
    var children = childrenOfInst(current);

    if (current === node) return path;

    path.push(current);

    if (children.length === 0) {
      // leaf node. if it isn't the node we are looking for, we pop.
      path.pop();
    }
    queue.push.apply(queue, children);
  }

  return null;
}

function parentsOfInst(inst, root) {
  return pathToNode(inst, root).reverse();
}

function buildInstPredicate(selector) {
  switch (typeof selector) {
    case 'function':
      // selector is a component constructor
      return function (inst) {
        return instHasType(inst, selector);
      };

    case 'string':
      if (!(0, _Utils.isSimpleSelector)(selector)) {
        throw (0, _Utils.selectorError)(selector);
      }
      if (_Utils.isCompoundSelector.test(selector)) {
        return (0, _Utils.AND)((0, _Utils.splitSelector)(selector).map(buildInstPredicate));
      }

      switch ((0, _Utils.selectorType)(selector)) {
        case _Utils.SELECTOR.CLASS_TYPE:
          return function (inst) {
            return instHasClassName(inst, selector.substr(1));
          };
        case _Utils.SELECTOR.ID_TYPE:
          return function (inst) {
            return instHasId(inst, selector.substr(1));
          };
        case _Utils.SELECTOR.PROP_TYPE:
          var propKey = selector.split(/\[([a-zA-Z\-\:]*?)(=|\])/)[1];
          var propValue = selector.split(/=(.*?)]/)[1];

          return function (node) {
            return instHasProperty(node, propKey, propValue);
          };
        default:
          // selector is a string. match to DOM tag or constructor displayName
          return function (inst) {
            return instHasType(inst, selector);
          };
      }
      break;

    default:
      throw new TypeError('Expecting a string or Component Constructor');
  }
}

// This function should be called with an "internal instance". Nevertheless, if it is
// called with a "public instance" instead, the function will call itself with the
// internal instance and return the proper result.
function findAllInRenderedTreeInternal(_x2, _x3) {
  var _again2 = true;

  _function2: while (_again2) {
    var inst = _x2,
        test = _x3;
    _again2 = false;

    if (!inst) {
      return [];
    }

    if (!inst.getPublicInstance) {
      var internal = internalInstance(inst);
      _x2 = internal;
      _x3 = test;
      _again2 = true;
      internal = undefined;
      continue _function2;
    }

    var publicInst = inst.getPublicInstance();
    var ret = test(publicInst) ? [publicInst] : [];
    var currentElement = inst._currentElement;
    if ((0, _reactCompat.isDOMComponent)(publicInst)) {
      var renderedChildren = renderedChildrenOfInst(inst);
      var key = undefined;
      for (key in renderedChildren) {
        if (!renderedChildren.hasOwnProperty(key)) {
          continue;
        }
        if (_version.REACT013 && !renderedChildren[key].getPublicInstance) {
          continue;
        }
        ret = ret.concat(findAllInRenderedTreeInternal(renderedChildren[key], test));
      }
    } else if (_version.REACT014 && (0, _reactCompat.isElement)(currentElement) && typeof currentElement.type === 'function') {
      ret = ret.concat(findAllInRenderedTreeInternal(inst._renderedComponent, test));
    } else if (_version.REACT013 && (0, _reactCompat.isCompositeComponent)(publicInst)) {
      ret = ret.concat(findAllInRenderedTreeInternal(inst._renderedComponent, test));
    }
    return ret;
  }
}

// This function could be called with a number of different things technically, so we need to
// pass the *right* thing to our internal helper.

function treeFilter(node, test) {
  return findAllInRenderedTreeInternal(internalInstanceOrComponent(node), test);
}