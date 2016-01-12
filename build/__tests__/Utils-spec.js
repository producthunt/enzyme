'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _Utils = require('../Utils');

var _ = require('../');

describe('Utils', function () {

  describe('onPrototype', function () {
    var Foo = (function () {
      function Foo() {
        _classCallCheck(this, Foo);
      }

      _createClass(Foo, [{
        key: 'a',
        value: function a() {}
      }, {
        key: 'b',
        value: function b() {}
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {}
      }]);

      return Foo;
    })();

    var lifecycleSpy = _sinon2['default'].spy();
    var methodSpy = _sinon2['default'].spy();

    (0, _Utils.onPrototype)(Foo, lifecycleSpy, methodSpy);

    (0, _chai.expect)(lifecycleSpy.callCount).to.equal(1);
    (0, _chai.expect)(lifecycleSpy.args[0][0]).to.equal(Foo.prototype);
    (0, _chai.expect)(lifecycleSpy.args[0][1]).to.equal('componentDidUpdate');

    (0, _chai.expect)(methodSpy.callCount).to.equal(2);
    (0, _chai.expect)(methodSpy.args[0][0]).to.equal(Foo.prototype);
    (0, _chai.expect)(methodSpy.args[0][1]).to.equal('a');
    (0, _chai.expect)(methodSpy.args[1][1]).to.equal('b');
  });

  (0, _.describeWithDOM)('getNode', function () {

    it('should return a DOMNode when a DOMComponent is given', function () {
      var div = (0, _.mount)(_reactAddons2['default'].createElement('div', null)).node;
      (0, _chai.expect)((0, _Utils.getNode)(div)).to.be.instanceOf(window.HTMLElement);
    });

    it('should return the component when a component is given', function () {
      var Foo = (function (_React$Component) {
        _inherits(Foo, _React$Component);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _reactAddons2['default'].createElement('div', null);
          }
        }]);

        return Foo;
      })(_reactAddons2['default'].Component);

      var foo = (0, _.mount)(_reactAddons2['default'].createElement(Foo, null)).node;
      (0, _chai.expect)((0, _Utils.getNode)(foo)).to.equal(foo);
    });
  });

  describe('nodeEqual', function () {

    it('should match empty elements of same tag', function () {

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement('div', null), _reactAddons2['default'].createElement('div', null))).to.equal(true);
    });

    it('should not match empty elements of different type', function () {

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement('div', null), _reactAddons2['default'].createElement('nav', null))).to.equal(false);
    });

    it('should match basic prop types', function () {

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement('div', { className: 'foo' }), _reactAddons2['default'].createElement('div', { className: 'foo' }))).to.equal(true);

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement('div', { id: 'foo', className: 'bar' }), _reactAddons2['default'].createElement('div', { id: 'foo', className: 'bar' }))).to.equal(true);

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement('div', { id: 'foo', className: 'baz' }), _reactAddons2['default'].createElement('div', { id: 'foo', className: 'bar' }))).to.equal(false);
    });

    it('should check children as well', function () {

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('div', null)
      ), _reactAddons2['default'].createElement('div', null))).to.equal(false);

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('div', null)
      ), _reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('div', null)
      ))).to.equal(true);

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('div', { className: 'foo' })
      ), _reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('div', { className: 'foo' })
      ))).to.equal(true);

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('div', { className: 'foo' })
      ), _reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement('div', null)
      ))).to.equal(false);
    });

    it('should test deepEquality with object props', function () {

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement('div', { foo: { a: 1, b: 2 } }), _reactAddons2['default'].createElement('div', { foo: { a: 1, b: 2 } }))).to.equal(true);

      (0, _chai.expect)((0, _Utils.nodeEqual)(_reactAddons2['default'].createElement('div', { foo: { a: 2, b: 2 } }), _reactAddons2['default'].createElement('div', { foo: { a: 1, b: 2 } }))).to.equal(false);
    });
  });

  describe('propFromEvent', function () {

    var fn = _Utils.propFromEvent;

    it('should work', function () {
      (0, _chai.expect)(fn('click')).to.equal('onClick');
      (0, _chai.expect)(fn('mouseEnter')).to.equal('onMouseEnter');
    });
  });

  describe('isSimpleSelector', function () {

    describe('prohibited selectors', function () {
      function isComplex(selector) {
        it(selector, function () {
          (0, _chai.expect)((0, _Utils.isSimpleSelector)(selector)).to.equal(false);
        });
      }

      isComplex('.foo .bar');
      isComplex(':visible');
      isComplex('.foo>.bar');
      isComplex('.foo > .bar');
      isComplex('.foo~.bar');
    });

    describe('allowed selectors', function () {
      function isSimple(selector) {
        it(selector, function () {
          (0, _chai.expect)((0, _Utils.isSimpleSelector)(selector)).to.equal(true);
        });
      }

      isSimple('.foo');
      isSimple('.foo-and-foo');
      isSimple('input[foo="bar"]');
      isSimple('input[foo="bar"][bar="baz"][baz="foo"]');
      isSimple('.FoOaNdFoO');
      isSimple('tag');
      isSimple('.foo.bar');
      isSimple('input.foo');
    });
  });

  describe('selectorType', function () {

    it('returns CLASS_TYPE for a prefixed .', function () {
      var type = (0, _Utils.selectorType)('.foo');

      (0, _chai.expect)(type).to.be.equal(_Utils.SELECTOR.CLASS_TYPE);
    });

    it('returns ID_TYPE for a prefixed #', function () {
      var type = (0, _Utils.selectorType)('#foo');

      (0, _chai.expect)(type).to.be.equal(_Utils.SELECTOR.ID_TYPE);
    });

    it('returns PROP_TYPE for []', function () {
      function isProp(selector) {
        (0, _chai.expect)((0, _Utils.selectorType)(selector)).to.be.equal(_Utils.SELECTOR.PROP_TYPE);
      }

      isProp('[foo]');
      isProp('[foo="bar"]');
    });
  });

  describe('coercePropValue', function () {

    it('returns undefined if passed undefined', function () {
      (0, _chai.expect)((0, _Utils.coercePropValue)(undefined)).to.equal(undefined);
    });

    it('returns number if passed a stringified number', function () {
      (0, _chai.expect)((0, _Utils.coercePropValue)('1')).to.be.equal(1);
      (0, _chai.expect)((0, _Utils.coercePropValue)('0')).to.be.equal(0);
    });

    it('returns a boolean if passed a stringified bool', function () {
      (0, _chai.expect)((0, _Utils.coercePropValue)('true')).to.equal(true);
      (0, _chai.expect)((0, _Utils.coercePropValue)('false')).to.equal(false);
    });
  });
});