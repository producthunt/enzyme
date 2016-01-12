'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.typeName = typeName;
exports.spaces = spaces;
exports.indent = indent;
exports.debugNode = debugNode;
exports.debugNodes = debugNodes;

var _ShallowTraversal = require('./ShallowTraversal');

var _Utils = require('./Utils');

var _underscore = require('underscore');

function typeName(node) {
  return typeof node.type === 'function' ? node.type.displayName || 'Component' : node.type;
}

function spaces(n) {
  return Array(n + 1).join(' ');
}

function indent(depth, string) {
  return string.split('\n').map(function (x) {
    return '' + spaces(depth) + x;
  }).join('\n');
}

function propString(prop) {
  switch (typeof prop) {
    case 'function':
      return '{[Function]}';
    case 'string':
      return '"' + prop + '"';
    case 'number':
    case 'boolean':
      return '{' + prop + '}';
    case 'object':
      return '{{...}}';
    default:
      return '{[' + typeof prop + ']}';
  }
}

function propsString(node) {
  var props = (0, _Utils.propsOfNode)(node);
  var keys = (0, _underscore.without)(Object.keys(props), 'children');
  return keys.map(function (key) {
    return key + '=' + propString(props[key]);
  }).join(' ');
}

function debugNode(node) {
  var indentLength = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

  if (!node) return '';
  if (typeof node === 'string') return (0, _underscore.escape)(node);

  var children = (0, _underscore.compact)((0, _ShallowTraversal.childrenOfNode)(node).map(function (n) {
    return debugNode(n, indentLength);
  }));
  var type = typeName(node);
  var props = propsString(node);
  var beforeProps = props ? ' ' : '';
  var nodeClose = children.length ? '</' + type + '>' : '/>';
  var afterProps = children.length ? '>' : ' ';
  var childrenIndented = children.length ? '\n' + children.map(function (x) {
    return indent(indentLength, x);
  }).join('\n') + '\n' : '';
  return '<' + type + beforeProps + props + afterProps + childrenIndented + nodeClose;
}

function debugNodes(nodes) {
  return nodes.map(debugNode).join('\n\n\n');
}