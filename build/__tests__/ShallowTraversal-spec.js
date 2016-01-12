'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

var _Utils = require('../Utils');

var _ShallowTraversal = require('../ShallowTraversal');

describe('ShallowTraversal', function () {

  describe('splitSelector', function () {
    var fn = _Utils.splitSelector;
    it('splits multiple class names', function () {
      (0, _chai.expect)(fn('.foo.bar')).to.eql(['.foo', '.bar']);
      (0, _chai.expect)(fn('.foo.bar.baz')).to.eql(['.foo', '.bar', '.baz']);
    });

    it('splits tag names and class names', function () {
      (0, _chai.expect)(fn('input.bar')).to.eql(['input', '.bar']);
      (0, _chai.expect)(fn('div.bar.baz')).to.eql(['div', '.bar', '.baz']);
      (0, _chai.expect)(fn('Foo.bar')).to.eql(['Foo', '.bar']);
    });

    it('splits tag names and attributes', function () {
      (0, _chai.expect)(fn('input[type="text"]')).to.eql(['input', '[type="text"]']);
      (0, _chai.expect)(fn('div[title="title"][data-value="foo"]')).to.eql(['div', '[title="title"]', '[data-value="foo"]']);
    });
  });

  describe('hasClassName', function () {

    it('should work for standalone classNames', function () {
      var node = _react2['default'].createElement('div', { className: 'foo' });
      (0, _chai.expect)((0, _ShallowTraversal.hasClassName)(node, 'foo')).to.equal(true);
      (0, _chai.expect)((0, _ShallowTraversal.hasClassName)(node, 'bar')).to.equal(false);
    });

    it('should work for multiple classNames', function () {
      var node = _react2['default'].createElement('div', { className: 'foo bar baz' });
      (0, _chai.expect)((0, _ShallowTraversal.hasClassName)(node, 'foo')).to.equal(true);
      (0, _chai.expect)((0, _ShallowTraversal.hasClassName)(node, 'bar')).to.equal(true);
      (0, _chai.expect)((0, _ShallowTraversal.hasClassName)(node, 'baz')).to.equal(true);
      (0, _chai.expect)((0, _ShallowTraversal.hasClassName)(node, 'bax')).to.equal(false);
    });

    it('should also allow hyphens', function () {
      var node = _react2['default'].createElement('div', { className: 'foo-bar' });
      (0, _chai.expect)((0, _ShallowTraversal.hasClassName)(node, 'foo-bar')).to.equal(true);
    });
  });

  describe('nodeHasProperty', function () {

    it('should find properties', function () {
      function noop() {}
      var node = _react2['default'].createElement('div', { onChange: noop, title: 'foo' });

      (0, _chai.expect)((0, _ShallowTraversal.nodeHasProperty)(node, 'onChange')).to.equal(true);
      (0, _chai.expect)((0, _ShallowTraversal.nodeHasProperty)(node, 'title', 'foo')).to.equal(true);
    });

    it('should not match on html attributes', function () {
      var node = _react2['default'].createElement('div', { htmlFor: 'foo' });

      (0, _chai.expect)((0, _ShallowTraversal.nodeHasProperty)(node, 'for', 'foo')).to.equal(false);
    });

    it('should not find undefined properties', function () {
      var node = _react2['default'].createElement('div', { title: undefined });

      (0, _chai.expect)((0, _ShallowTraversal.nodeHasProperty)(node, 'title')).to.equal(false);
    });
  });

  describe('treeForEach', function () {

    it('should be called once for a leaf node', function () {
      var spy = _sinon2['default'].spy();
      var node = _react2['default'].createElement('div', null);
      (0, _ShallowTraversal.treeForEach)(node, spy);
      (0, _chai.expect)(spy.calledOnce).to.equal(true);
    });

    it('should handle a single child', function () {
      var spy = _sinon2['default'].spy();
      var node = _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', null)
      );
      (0, _ShallowTraversal.treeForEach)(node, spy);
      (0, _chai.expect)(spy.callCount).to.equal(2);
    });

    it('should handle several children', function () {
      var spy = _sinon2['default'].spy();
      var node = _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', null),
        _react2['default'].createElement('div', null)
      );
      (0, _ShallowTraversal.treeForEach)(node, spy);
      (0, _chai.expect)(spy.callCount).to.equal(3);
    });

    it('should handle multiple hierarchies', function () {
      var spy = _sinon2['default'].spy();
      var node = _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement('div', null),
          _react2['default'].createElement('div', null)
        )
      );
      (0, _ShallowTraversal.treeForEach)(node, spy);
      (0, _chai.expect)(spy.callCount).to.equal(4);
    });

    it('should not get trapped from empty strings', function () {
      var spy = _sinon2['default'].spy();
      var node = _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'p',
          null,
          ""
        )
      );
      (0, _ShallowTraversal.treeForEach)(node, spy);
      (0, _chai.expect)(spy.callCount).to.equal(3);
    });

    it('should pass in the node', function () {
      var spy = _sinon2['default'].spy();
      var node = _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('button', null),
        _react2['default'].createElement(
          'nav',
          null,
          _react2['default'].createElement('input', null)
        )
      );
      (0, _ShallowTraversal.treeForEach)(node, spy);
      (0, _chai.expect)(spy.callCount).to.equal(4);
      (0, _chai.expect)(spy.args[0][0].type).to.equal('div');
      (0, _chai.expect)(spy.args[1][0].type).to.equal('button');
      (0, _chai.expect)(spy.args[2][0].type).to.equal('nav');
      (0, _chai.expect)(spy.args[3][0].type).to.equal('input');
    });
  });

  describe('treeFilter', function () {
    var tree = _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement('button', null),
      _react2['default'].createElement('button', null),
      _react2['default'].createElement(
        'nav',
        null,
        _react2['default'].createElement('input', null)
      )
    );

    it('should return an empty array for falsey test', function () {
      (0, _chai.expect)((0, _ShallowTraversal.treeFilter)(tree, function () {
        return false;
      }).length).to.equal(0);
    });

    it('should return the full array for truthy test', function () {
      (0, _chai.expect)((0, _ShallowTraversal.treeFilter)(tree, function () {
        return true;
      }).length).to.equal(5);
    });

    it('should filter for truthiness', function () {
      (0, _chai.expect)((0, _ShallowTraversal.treeFilter)(tree, function (node) {
        return node.type === 'nav';
      }).length).to.equal(1);
      (0, _chai.expect)((0, _ShallowTraversal.treeFilter)(tree, function (node) {
        return node.type === 'button';
      }).length).to.equal(2);
    });
  });
});