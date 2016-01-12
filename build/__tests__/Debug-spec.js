'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Debug = require('../Debug');

describe('debug', function () {

  describe('spaces(n)', function () {
    it('should return n spaces', function () {
      (0, _chai.expect)((0, _Debug.spaces)(4)).to.equal('    ');
      (0, _chai.expect)((0, _Debug.spaces)(2)).to.equal('  ');
      (0, _chai.expect)((0, _Debug.spaces)(0)).to.equal('');
    });
  });

  describe('indent(depth, string)', function () {
    it('should indent a single-line string by (n) spaces', function () {
      (0, _chai.expect)((0, _Debug.indent)(4, 'hello')).to.equal('    hello');
      (0, _chai.expect)((0, _Debug.indent)(2, 'hello')).to.equal('  hello');
      (0, _chai.expect)((0, _Debug.indent)(0, 'hello')).to.equal('hello');
    });

    it('should intent a multiline string by (n) spaces', function () {
      (0, _chai.expect)((0, _Debug.indent)(2, 'foo\nbar')).to.equal('  foo\n  bar');
    });
  });

  describe('debugNode(node)', function () {

    it('should render a node with no props or children as single single xml tag', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement('div', null))).to.equal('<div />');
    });

    it('should render props inline inline', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement('div', { id: 'foo', className: 'bar' }))).to.equal('<div id="foo" className="bar" />');
    });

    it('should render children on newline and indented', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', null)
      ))).to.equal('<div>\n  <span />\n</div>');
    });

    it('should render props on root and children', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement(
        'div',
        { id: 'foo' },
        _react2['default'].createElement('span', { id: 'bar' })
      ))).to.equal('<div id="foo">\n  <span id="bar" />\n</div>');
    });

    it('should render text on new line and indented', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement(
        'span',
        null,
        'some text'
      ))).to.equal('<span>\n  some text\n</span>');
    });

    it('should render composite components as tags w/ displayName', function () {
      var Foo = (function (_React$Component) {
        _inherits(Foo, _React$Component);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement('div', null);
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      Foo.displayName = 'Foo'; // TODO(lmr): why do i have to do this...?

      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(Foo, null)
      ))).to.equal('<div>\n  <Foo />\n</div>');
    });

    it('should render mapped children properly', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'i',
          null,
          'not in array'
        ),
        ['a', 'b', 'c']
      ))).to.equal('<div>\n  <i>\n    not in array\n  </i>\n  a\n  b\n  c\n</div>');
    });

    it('renders html entities properly', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement(
        'div',
        null,
        '>'
      ))).to.equal('<div>\n  &gt;\n</div>');
    });

    it('should not render falsy children ', function () {
      (0, _chai.expect)((0, _Debug.debugNode)(_react2['default'].createElement(
        'div',
        { id: 'foo' },
        false
      ))).to.equal('<div id="foo" />');
    });
  });
});