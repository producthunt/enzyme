'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.childrenOfNode = childrenOfNode;
exports.hasClassName = hasClassName;
exports.treeForEach = treeForEach;
exports.treeFilter = treeFilter;
exports.pathToNode = pathToNode;
exports.parentsOfNode = parentsOfNode;
exports.nodeHasId = nodeHasId;
exports.nodeHasProperty = nodeHasProperty;
exports.nodeHasType = nodeHasType;
exports.buildPredicate = buildPredicate;
exports.getTextFromNode = getTextFromNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Utils = require('./Utils');

function childrenOfNode(node) {
  if (!node) return [];
  var maybeArray = (0, _Utils.propsOfNode)(node).children;
  var result = [];
  _react2['default'].Children.forEach(maybeArray, function (child) {
    return result.push(child);
  });
  return result;
}

function hasClassName(node, className) {
  var classes = (0, _Utils.propsOfNode)(node).className || '';
  return (' ' + classes + ' ').indexOf(' ' + className + ' ') > -1;
}

function treeForEach(tree, fn) {
  fn(tree);
  childrenOfNode(tree).forEach(function (node) {
    return treeForEach(node, fn);
  });
}

function treeFilter(tree, fn) {
  var results = [];
  treeForEach(tree, function (node) {
    if (fn(node)) {
      results.push(node);
    }
  });
  return results;
}

function pathToNode(node, root) {
  var queue = [root];
  var path = [];

  while (queue.length) {
    var current = queue.pop();
    var children = childrenOfNode(current);

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

function parentsOfNode(node, root) {
  return pathToNode(node, root).reverse();
}

function nodeHasId(node, id) {
  return (0, _Utils.propsOfNode)(node).id === id;
}

function nodeHasProperty(node, propKey, stringifiedPropValue) {
  var nodeProps = (0, _Utils.propsOfNode)(node);
  var propValue = (0, _Utils.coercePropValue)(stringifiedPropValue);
  var nodePropValue = nodeProps[propKey];

  if (nodePropValue === undefined) {
    return false;
  }

  if (propValue) {
    return nodePropValue === propValue;
  }

  return nodeProps.hasOwnProperty(propKey);
}

function nodeHasType(node, type) {
  if (!type || !node) return false;
  if (!node.type) return false;
  if (typeof node.type === 'string') return node.type === type;
  return node.type.name === type || node.type.displayName === type;
}

function buildPredicate(selector) {
  switch (typeof selector) {
    case 'function':
      // selector is a component constructor
      return function (node) {
        return node && node.type === selector;
      };

    case 'string':
      if (!(0, _Utils.isSimpleSelector)(selector)) {
        throw (0, _Utils.selectorError)(selector);
      }
      if (_Utils.isCompoundSelector.test(selector)) {
        return (0, _Utils.AND)((0, _Utils.splitSelector)(selector).map(buildPredicate));
      }

      switch ((0, _Utils.selectorType)(selector)) {
        case _Utils.SELECTOR.CLASS_TYPE:
          return function (node) {
            return hasClassName(node, selector.substr(1));
          };

        case _Utils.SELECTOR.ID_TYPE:
          return function (node) {
            return nodeHasId(node, selector.substr(1));
          };

        case _Utils.SELECTOR.PROP_TYPE:
          var propKey = selector.split(/\[([a-zA-Z\-]*?)(=|\])/)[1];
          var propValue = selector.split(/=(.*?)\]/)[1];

          return function (node) {
            return nodeHasProperty(node, propKey, propValue);
          };
        default:
          // selector is a string. match to DOM tag or constructor displayName
          return function (node) {
            return nodeHasType(node, selector);
          };
      }
      break;

    default:
      throw new TypeError('Expecting a string or Component Constructor');
  }
}

function getTextFromNode(node) {
  if (node === null || node === undefined) {
    return '';
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return '' + node;
  }

  if (node.type && typeof node.type === 'function') {
    return '<' + (node.type.name || node.type.displayName) + ' />';
  }

  return childrenOfNode(node).map(getTextFromNode).join('').replace(/\s+/, ' ');
}