'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ = require('../');

var _helpers = require('./_helpers');

var _version = require('../version');

(0, _.describeWithDOM)('mount', function () {

  describe('context', function () {
    it('can pass in context', function () {
      var SimpleComponent = _react2['default'].createClass({
        displayName: 'SimpleComponent',

        contextTypes: {
          name: _react2['default'].PropTypes.string
        },
        render: function render() {
          return _react2['default'].createElement(
            'div',
            null,
            this.context.name
          );
        }
      });

      var context = { name: 'foo' };
      var wrapper = (0, _.mount)(_react2['default'].createElement(SimpleComponent, null), { context: context });
      (0, _chai.expect)(wrapper.text()).to.equal('foo');
    });

    it('should not throw if context is passed in but contextTypes is missing', function () {
      var SimpleComponent = _react2['default'].createClass({
        displayName: 'SimpleComponent',

        render: function render() {
          return _react2['default'].createElement(
            'div',
            null,
            this.context.name
          );
        }
      });

      var context = { name: 'foo' };
      (0, _chai.expect)(function () {
        return (0, _.mount)(_react2['default'].createElement(SimpleComponent, null), { context: context });
      }).to.not['throw'](Error);
    });
  });

  (0, _helpers.describeIf)(!_version.REACT013, 'stateless components', function () {
    it('works with stateless components', function () {
      var Foo = function Foo(_ref) {
        var foo = _ref.foo;
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'div',
            { className: 'bar' },
            'bar'
          ),
          _react2['default'].createElement(
            'div',
            { className: 'qoo' },
            foo
          )
        );
      };
      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, { foo: 'qux' }));
      (0, _chai.expect)(wrapper.type()).to.equal(Foo);
      (0, _chai.expect)(wrapper.find('.bar')).to.have.length(1);
      (0, _chai.expect)(wrapper.find('.qoo').text()).to.equal('qux');
    });
  });

  describe('.contains(node)', function () {

    it('should allow matches on the root node', function () {
      var a = _react2['default'].createElement('div', { className: 'foo' });
      var b = _react2['default'].createElement('div', { className: 'foo' });
      var c = _react2['default'].createElement('div', { className: 'bar' });
      (0, _chai.expect)((0, _.mount)(a).contains(b)).to.equal(true);
      (0, _chai.expect)((0, _.mount)(a).contains(c)).to.equal(false);
    });

    it('should allow matches on a nested node', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo' })
      ));
      var b = _react2['default'].createElement('div', { className: 'foo' });
      (0, _chai.expect)(wrapper.contains(b)).to.equal(true);
    });

    it('should match composite components', function () {
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

      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(Foo, null)
      ));
      var b = _react2['default'].createElement(Foo, null);
      (0, _chai.expect)(wrapper.contains(b)).to.equal(true);
    });
  });

  describe('.find(selector)', function () {

    it('should find an element based on a class name', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' })
      ));
      (0, _chai.expect)(wrapper.find('.foo').type()).to.equal('input');
    });

    it('should find an element based on a tag name', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' })
      ));
      (0, _chai.expect)(wrapper.find('input').props().className).to.equal('foo');
    });

    it('should find a component based on a constructor', function () {
      var Foo = (function (_React$Component2) {
        _inherits(Foo, _React$Component2);

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

      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(Foo, { className: 'foo' })
      ));
      (0, _chai.expect)(wrapper.find(Foo).type()).to.equal(Foo);
    });

    it('should find component based on a react prop', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', { htmlFor: 'foo' })
      ));

      (0, _chai.expect)(wrapper.find('[htmlFor="foo"]')).to.have.length(1);
      (0, _chai.expect)(wrapper.find('[htmlFor]')).to.have.length(1);
    });

    it('should compound tag and prop selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', { htmlFor: 'foo' })
      ));

      (0, _chai.expect)(wrapper.find('span[htmlFor="foo"]')).to.have.length(1);
      (0, _chai.expect)(wrapper.find('span[htmlFor]')).to.have.length(1);
    });

    it('should support data prop selectors', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', { 'data-foo': 'bar' })
      ));

      (0, _chai.expect)(wrapper.find('[data-foo="bar"]')).to.have.length(1);
      (0, _chai.expect)(wrapper.find('[data-foo]')).to.have.length(1);
    });

    it('should find components with multiple matching props', function () {
      var onChange = function onChange() {};
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', { htmlFor: 'foo', onChange: onChange, preserveAspectRatio: 'xMaxYMax' })
      ));

      (0, _chai.expect)(wrapper.find('span[htmlFor="foo"][onChange]')).to.have.length(1);
      (0, _chai.expect)(wrapper.find('span[htmlFor="foo"][preserveAspectRatio="xMaxYMax"]')).to.have.length(1);
    });

    it('should not find property when undefined', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', { 'data-foo': undefined })
      ));

      (0, _chai.expect)(wrapper.find('[data-foo]')).to.have.length(0);
    });

    it('should support boolean and numeric values for matching props', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', { value: 1 }),
        _react2['default'].createElement('a', { value: false })
      ));

      (0, _chai.expect)(wrapper.find('span[value=1]')).to.have.length(1);
      (0, _chai.expect)(wrapper.find('span[value=2]')).to.have.length(0);
      (0, _chai.expect)(wrapper.find('a[value=false]')).to.have.length(1);
      (0, _chai.expect)(wrapper.find('a[value=true]')).to.have.length(0);
    });

    it('should not find key or ref via property selector', function () {
      var Foo = (function (_React$Component3) {
        _inherits(Foo, _React$Component3);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            var arrayOfComponents = [_react2['default'].createElement('div', { key: '1' }), _react2['default'].createElement('div', { key: '2' })];

            return _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement('div', { ref: 'foo' }),
              arrayOfComponents
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));

      (0, _chai.expect)(wrapper.find('div[ref="foo"]')).to.have.length(0);
      (0, _chai.expect)(wrapper.find('div[key="1"]')).to.have.length(0);
      (0, _chai.expect)(wrapper.find('[ref]')).to.have.length(0);
      (0, _chai.expect)(wrapper.find('[key]')).to.have.length(0);
    });

    it('should find multiple elements based on a class name', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' }),
        _react2['default'].createElement('button', { className: 'foo' })
      ));
      (0, _chai.expect)(wrapper.find('.foo').length).to.equal(2);
    });

    it('should find multiple elements based on a tag name', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' }),
        _react2['default'].createElement('input', null),
        _react2['default'].createElement('button', null)
      ));
      (0, _chai.expect)(wrapper.find('input').length).to.equal(2);
      (0, _chai.expect)(wrapper.find('button').length).to.equal(1);
    });

    it('should find multiple elements based on a constructor', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' }),
        _react2['default'].createElement('input', null),
        _react2['default'].createElement('button', null)
      ));
      (0, _chai.expect)(wrapper.find('input').length).to.equal(2);
      (0, _chai.expect)(wrapper.find('button').length).to.equal(1);
    });

    it('should throw on a complex selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' }),
        _react2['default'].createElement('input', null),
        _react2['default'].createElement('button', null)
      ));
      (0, _chai.expect)(function () {
        return wrapper.find('.foo .foo');
      }).to['throw'](Error);
    });
  });

  describe('.findWhere(predicate)', function () {

    it('should return all elements for a truthy test', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' }),
        _react2['default'].createElement('input', null)
      ));
      (0, _chai.expect)(wrapper.findWhere(function () {
        return true;
      }).length).to.equal(3);
    });

    it('should return no elements for a falsy test', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('input', { className: 'foo' }),
        _react2['default'].createElement('input', null)
      ));
      (0, _chai.expect)(wrapper.findWhere(function () {
        return false;
      }).length).to.equal(0);
    });

    it('should call the predicate with the wrapped node as the first argument', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' }),
        _react2['default'].createElement('div', { className: 'foo bux' })
      ));

      var stub = _sinon2['default'].stub();
      stub.returns(true);
      var spy = _sinon2['default'].spy(stub);
      wrapper.findWhere(spy);
      (0, _chai.expect)(spy.callCount).to.equal(4);
      (0, _chai.expect)(spy.args[0][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[1][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[2][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[3][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[1][0].hasClass('bar')).to.equal(true);
      (0, _chai.expect)(spy.args[2][0].hasClass('baz')).to.equal(true);
      (0, _chai.expect)(spy.args[3][0].hasClass('bux')).to.equal(true);
    });
  });

  describe('.setProps(newProps)', function () {

    it('should set props for a component multiple times', function () {
      var Foo = (function (_React$Component4) {
        _inherits(Foo, _React$Component4);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'div',
              { className: this.props.id },
              this.props.id
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, { id: 'foo' }));
      (0, _chai.expect)(wrapper.find('.foo').length).to.equal(1);
      wrapper.setProps({ id: 'bar', foo: 'bla' });
      (0, _chai.expect)(wrapper.find('.bar').length).to.equal(1);
    });

    it('should call componentWillReceiveProps for new renders', function () {

      var spy = _sinon2['default'].spy();

      var Foo = (function (_React$Component5) {
        _inherits(Foo, _React$Component5);

        function Foo(props) {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).call(this, props);
          this.componentWillReceiveProps = spy;
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'div',
              { className: this.props.id },
              this.props.id
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var nextProps = { id: 'bar', foo: 'bla' };
      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, { id: 'foo' }));
      (0, _chai.expect)(spy.calledOnce).to.equal(false);
      wrapper.setProps(nextProps);
      (0, _chai.expect)(spy.calledOnce).to.equal(true);
      (0, _chai.expect)(spy.calledWith(nextProps)).to.equal(true);
    });

    it('should merge newProps with oldProps', function () {
      var Foo = (function (_React$Component6) {
        _inherits(Foo, _React$Component6);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement('div', this.props);
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, { a: 'a', b: 'b' }));
      (0, _chai.expect)(wrapper.props().a).to.equal('a');
      (0, _chai.expect)(wrapper.props().b).to.equal('b');

      wrapper.setProps({ b: 'c', d: 'e' });
      (0, _chai.expect)(wrapper.props().a).to.equal('a');
      (0, _chai.expect)(wrapper.props().b).to.equal('c');
      (0, _chai.expect)(wrapper.props().d).to.equal('e');
    });
  });

  describe('.setContext(newContext)', function () {
    var SimpleComponent = _react2['default'].createClass({
      displayName: 'SimpleComponent',

      contextTypes: {
        name: _react2['default'].PropTypes.string
      },
      render: function render() {
        return _react2['default'].createElement(
          'div',
          null,
          this.context.name
        );
      }
    });

    it('should set context for a component multiple times', function () {
      var context = { name: 'foo' };
      var wrapper = (0, _.mount)(_react2['default'].createElement(SimpleComponent, null), { context: context });
      (0, _chai.expect)(wrapper.text()).to.equal('foo');
      wrapper.setContext({ name: 'bar' });
      (0, _chai.expect)(wrapper.text()).to.equal('bar');
      wrapper.setContext({ name: 'baz' });
      (0, _chai.expect)(wrapper.text()).to.equal('baz');
    });

    it('should throw if it is called when shallow didnt include context', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(SimpleComponent, null));
      (0, _chai.expect)(function () {
        return wrapper.setContext({ name: 'bar' });
      }).to['throw'](Error);
    });
  });

  describe('.simulate(eventName, data)', function () {

    it('should simulate events', function () {
      var Foo = (function (_React$Component7) {
        _inherits(Foo, _React$Component7);

        function Foo(props) {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).call(this, props);
          this.state = { count: 0 };
          this.incrementCount = this.incrementCount.bind(this);
        }

        _createClass(Foo, [{
          key: 'incrementCount',
          value: function incrementCount() {
            this.setState({ count: this.state.count + 1 });
          }
        }, {
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'a',
              {
                className: 'clicks-' + this.state.count,
                onClick: this.incrementCount
              },
              'foo'
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));

      (0, _chai.expect)(wrapper.find('.clicks-0').length).to.equal(1);
      wrapper.simulate('click');
      (0, _chai.expect)(wrapper.find('.clicks-1').length).to.equal(1);
    });

    it('should pass in event data', function () {
      var spy = _sinon2['default'].spy();

      var Foo = (function (_React$Component8) {
        _inherits(Foo, _React$Component8);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'a',
              { onClick: spy },
              'foo'
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));

      wrapper.simulate('click', { someSpecialData: 'foo' });
      (0, _chai.expect)(spy.calledOnce).to.equal(true);
      (0, _chai.expect)(spy.args[0][0].someSpecialData).to.equal('foo');
    });
  });

  describe('.setState(newState)', function () {
    it('should set the state of the root node', function () {
      var Foo = (function (_React$Component9) {
        _inherits(Foo, _React$Component9);

        function Foo(props) {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).call(this, props);
          this.state = { id: 'foo' };
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement('div', { className: this.state.id });
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));
      (0, _chai.expect)(wrapper.find('.foo').length).to.equal(1);
      wrapper.setState({ id: 'bar' });
      (0, _chai.expect)(wrapper.find('.bar').length).to.equal(1);
    });

    it('allows setState inside of componentDidMount', function () {
      // NOTE: this test is a test to ensure that the following issue is
      // fixed: https://github.com/airbnb/enzyme/issues/27

      var MySharona = (function (_React$Component10) {
        _inherits(MySharona, _React$Component10);

        function MySharona(props) {
          _classCallCheck(this, MySharona);

          _get(Object.getPrototypeOf(MySharona.prototype), 'constructor', this).call(this, props);
          this.state = { mounted: false };
        }

        _createClass(MySharona, [{
          key: 'componentDidMount',
          value: function componentDidMount() {
            this.setState({ mounted: true });
          }
        }, {
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'div',
              null,
              this.state.mounted ? 'a' : 'b'
            );
          }
        }]);

        return MySharona;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(MySharona, null));
      (0, _chai.expect)(wrapper.find('div').text()).to.equal('a');
    });
  });

  describe('.is(selector)', function () {
    it('should return true when selector matches current element', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement('div', { className: 'foo bar baz' }));
      (0, _chai.expect)(wrapper.is('.foo')).to.equal(true);
    });

    it('should allow for compound selectors', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement('div', { className: 'foo bar baz' }));
      (0, _chai.expect)(wrapper.is('.foo.bar')).to.equal(true);
    });

    it('should return false when selector does not match', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement('div', { className: 'bar baz' }));
      (0, _chai.expect)(wrapper.is('.foo')).to.equal(false);
    });
  });

  describe('.not(selector)', function () {
    it('filters to things not matching a selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bar baz' }),
        _react2['default'].createElement('div', { className: 'foo' }),
        _react2['default'].createElement('div', { className: 'bar baz' }),
        _react2['default'].createElement('div', { className: 'baz' }),
        _react2['default'].createElement('div', { className: 'foo bar' })
      ));

      (0, _chai.expect)(wrapper.find('.foo').not('.bar').length).to.equal(1);
      (0, _chai.expect)(wrapper.find('.baz').not('.foo').length).to.equal(2);
      (0, _chai.expect)(wrapper.find('.foo').not('div').length).to.equal(0);
    });
  });

  describe('.filter(selector)', function () {
    it('should return a new wrapper of just the nodes that matched the selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bar baz' }),
        _react2['default'].createElement('div', { className: 'foo' }),
        _react2['default'].createElement(
          'div',
          { className: 'bar baz' },
          _react2['default'].createElement('div', { className: 'foo bar baz' }),
          _react2['default'].createElement('div', { className: 'foo' })
        ),
        _react2['default'].createElement('div', { className: 'baz' }),
        _react2['default'].createElement('div', { className: 'foo bar' })
      ));

      (0, _chai.expect)(wrapper.find('.foo').filter('.bar').length).to.equal(3);
      (0, _chai.expect)(wrapper.find('.bar').filter('.foo').length).to.equal(3);
      (0, _chai.expect)(wrapper.find('.bar').filter('.bax').length).to.equal(0);
      (0, _chai.expect)(wrapper.find('.foo').filter('.baz.bar').length).to.equal(2);
    });

    it('should only look in the current wrappers nodes, not their children', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement('div', { className: 'bar' })
        ),
        _react2['default'].createElement('div', { className: 'foo bar' })
      ));

      (0, _chai.expect)(wrapper.find('.foo').filter('.bar').length).to.equal(1);
    });
  });

  describe('.filterWhere(predicate)', function () {
    it('should filter only the nodes of the wrapper', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' }),
        _react2['default'].createElement('div', { className: 'foo bux' })
      ));

      var stub = _sinon2['default'].stub();
      stub.onCall(0).returns(false);
      stub.onCall(1).returns(true);
      stub.onCall(2).returns(false);

      var baz = wrapper.find('.foo').filterWhere(stub);
      (0, _chai.expect)(baz.length).to.equal(1);
      (0, _chai.expect)(baz.hasClass('baz')).to.equal(true);
    });

    it('should call the predicate with the wrapper as the first argument', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' }),
        _react2['default'].createElement('div', { className: 'foo bux' })
      ));

      var stub = _sinon2['default'].stub();
      stub.returns(true);
      var spy = _sinon2['default'].spy(stub);
      wrapper.find('.foo').filterWhere(spy);
      (0, _chai.expect)(spy.callCount).to.equal(3);
      (0, _chai.expect)(spy.args[0][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[1][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[2][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[0][0].hasClass('bar')).to.equal(true);
      (0, _chai.expect)(spy.args[1][0].hasClass('baz')).to.equal(true);
      (0, _chai.expect)(spy.args[2][0].hasClass('bux')).to.equal(true);
    });
  });

  describe('.text()', function () {

    var matchesRender = function matchesRender(node) {
      var actual = (0, _.mount)(node).text();
      var expected = (0, _.render)(node).text();
      (0, _chai.expect)(expected).to.equal(actual);
    };

    it('should handle simple text nodes', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        'some text'
      ));
      (0, _chai.expect)(wrapper.text()).to.equal('some text');
    });

    it('should handle nodes with mapped children', function () {
      var Foo = (function (_React$Component11) {
        _inherits(Foo, _React$Component11);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'div',
              null,
              this.props.items.map(function (x) {
                return x;
              })
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      matchesRender(_react2['default'].createElement(Foo, { items: ['abc', 'def', 'hij'] }));
      matchesRender(_react2['default'].createElement(Foo, {
        items: [_react2['default'].createElement(
          'i',
          { key: 1 },
          'abc'
        ), _react2['default'].createElement(
          'i',
          { key: 2 },
          'def'
        ), _react2['default'].createElement(
          'i',
          { key: 3 },
          'hij'
        )]
      }));
    });

    it('should render composite components smartly', function () {
      var Foo = (function (_React$Component12) {
        _inherits(Foo, _React$Component12);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'div',
              null,
              'foo'
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(Foo, null),
        _react2['default'].createElement(
          'div',
          null,
          'test'
        )
      ));
      (0, _chai.expect)(wrapper.text()).to.equal('footest');
    });

    it('should handle html entities', function () {
      matchesRender(_react2['default'].createElement(
        'div',
        null,
        '>'
      ));
    });
  });

  describe('.props()', function () {

    it('should return the props object', function () {
      var fn = function fn() {};
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { id: 'fooId', className: 'bax', onClick: fn },
        _react2['default'].createElement('div', { className: 'baz' }),
        _react2['default'].createElement('div', { className: 'foo' })
      ));

      (0, _chai.expect)(wrapper.props().className).to.equal('bax');
      (0, _chai.expect)(wrapper.props().onClick).to.equal(fn);
      (0, _chai.expect)(wrapper.props().id).to.equal('fooId');
    });

    it('should be allowed to be used on an inner node', function () {
      var fn = function fn() {};
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'bax' },
        _react2['default'].createElement('div', { className: 'baz', onClick: fn }),
        _react2['default'].createElement('div', { className: 'foo', id: 'fooId' })
      ));

      (0, _chai.expect)(wrapper.find('.baz').props().onClick).to.equal(fn);
      (0, _chai.expect)(wrapper.find('.foo').props().id).to.equal('fooId');
    });
  });

  describe('.state(name)', function () {

    it('should return the state object', function () {
      var Foo = (function (_React$Component13) {
        _inherits(Foo, _React$Component13);

        function Foo(props) {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).call(this, props);
          this.state = { foo: 'foo' };
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement('div', null);
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));
      (0, _chai.expect)(wrapper.state()).to.eql({ foo: 'foo' });
    });

    it('should return the current state after state transitions', function () {
      var Foo = (function (_React$Component14) {
        _inherits(Foo, _React$Component14);

        function Foo(props) {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).call(this, props);
          this.state = { foo: 'foo' };
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement('div', null);
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));
      wrapper.setState({ foo: 'bar' });
      (0, _chai.expect)(wrapper.state()).to.eql({ foo: 'bar' });
    });

    it('should allow a state property name be passed in as an argument', function () {
      var Foo = (function (_React$Component15) {
        _inherits(Foo, _React$Component15);

        function Foo(props) {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).call(this, props);
          this.state = { foo: 'foo' };
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement('div', null);
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));
      (0, _chai.expect)(wrapper.state('foo')).to.equal('foo');
    });
  });

  describe('.children([selector])', function () {
    it('should return empty wrapper for node with no children', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement('div', null));
      (0, _chai.expect)(wrapper.children().length).to.equal(0);
    });

    it('should return the children nodes of the root', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo' }),
        _react2['default'].createElement('div', { className: 'bar' }),
        _react2['default'].createElement('div', { className: 'baz' })
      ));
      (0, _chai.expect)(wrapper.children().length).to.equal(3);
      (0, _chai.expect)(wrapper.children().at(0).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(wrapper.children().at(1).hasClass('bar')).to.equal(true);
      (0, _chai.expect)(wrapper.children().at(2).hasClass('baz')).to.equal(true);
    });

    it('should not return any of the children of children', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement('div', { className: 'bar' })
        ),
        _react2['default'].createElement('div', { className: 'baz' })
      ));
      (0, _chai.expect)(wrapper.children().length).to.equal(2);
      (0, _chai.expect)(wrapper.children().at(0).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(wrapper.children().at(1).hasClass('baz')).to.equal(true);
    });

    it('should handle mixed children with and without arrays', function () {
      var Foo = (function (_React$Component16) {
        _inherits(Foo, _React$Component16);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement('span', { className: 'foo' }),
              this.props.items.map(function (x) {
                return x;
              })
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, {
        items: [_react2['default'].createElement(
          'i',
          { key: 1, className: 'bar' },
          'abc'
        ), _react2['default'].createElement(
          'i',
          { key: 2, className: 'baz' },
          'def'
        )]
      }));
      (0, _chai.expect)(wrapper.children().length).to.equal(3);
      (0, _chai.expect)(wrapper.children().at(0).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(wrapper.children().at(1).hasClass('bar')).to.equal(true);
      (0, _chai.expect)(wrapper.children().at(2).hasClass('baz')).to.equal(true);
    });

    it('should optionally allow a selector to filter by', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo' }),
        _react2['default'].createElement('div', { className: 'bar bip' }),
        _react2['default'].createElement('div', { className: 'baz bip' })
      ));
      var children = wrapper.children('.bip');
      (0, _chai.expect)(children.length).to.equal(2);
      (0, _chai.expect)(children.at(0).hasClass('bar')).to.equal(true);
      (0, _chai.expect)(children.at(1).hasClass('baz')).to.equal(true);
    });
  });

  describe('.parents([selector])', function () {
    it('should return an array of current nodes ancestors', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'bax' },
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement(
            'div',
            { className: 'bar' },
            _react2['default'].createElement('div', { className: 'baz' })
          )
        )
      ));

      var parents = wrapper.find('.baz').parents();

      (0, _chai.expect)(parents.length).to.equal(3);
      (0, _chai.expect)(parents.at(0).hasClass('bar')).to.equal(true);
      (0, _chai.expect)(parents.at(1).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(parents.at(2).hasClass('bax')).to.equal(true);
    });

    it('should work for non-leaf nodes as well', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'bax' },
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement(
            'div',
            { className: 'bar' },
            _react2['default'].createElement('div', { className: 'baz' })
          )
        )
      ));

      var parents = wrapper.find('.bar').parents();

      (0, _chai.expect)(parents.length).to.equal(2);
      (0, _chai.expect)(parents.at(0).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(parents.at(1).hasClass('bax')).to.equal(true);
    });

    it('should optionally allow a selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'bax foo' },
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement(
            'div',
            { className: 'bar' },
            _react2['default'].createElement('div', { className: 'baz' })
          )
        )
      ));

      var parents = wrapper.find('.baz').parents('.foo');

      (0, _chai.expect)(parents.length).to.equal(2);
      (0, _chai.expect)(parents.at(0).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(parents.at(1).hasClass('bax')).to.equal(true);
    });
  });

  describe('.parent()', function () {
    it('should return only the immediate parent of the node', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'bax' },
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement(
            'div',
            { className: 'bar' },
            _react2['default'].createElement('div', { className: 'baz' })
          )
        )
      ));

      (0, _chai.expect)(wrapper.find('.baz').parent().hasClass('bar')).to.equal(true);
    });

    it('should work for multiple nodes', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement('div', { className: 'baz' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'bar' },
          _react2['default'].createElement('div', { className: 'baz' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'bax' },
          _react2['default'].createElement('div', { className: 'baz' })
        )
      ));

      var parents = wrapper.find('.baz').parent();
      (0, _chai.expect)(parents).to.have.length(3);
      (0, _chai.expect)(parents.at(0).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(parents.at(1).hasClass('bar')).to.equal(true);
      (0, _chai.expect)(parents.at(2).hasClass('bax')).to.equal(true);
    });
  });

  describe('.closest(selector)', function () {
    it('should return the closest ancestor for a given selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'foo' },
        _react2['default'].createElement(
          'div',
          { className: 'foo baz' },
          _react2['default'].createElement(
            'div',
            { className: 'bax' },
            _react2['default'].createElement('div', { className: 'bar' })
          )
        )
      ));

      var closestFoo = wrapper.find('.bar').closest('.foo');
      (0, _chai.expect)(closestFoo.hasClass('baz')).to.equal(true);
      (0, _chai.expect)(closestFoo.length).to.equal(1);
    });

    it('should only ever return a wrapper of a single node', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'bax' },
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement(
            'div',
            { className: 'bar' },
            _react2['default'].createElement('div', { className: 'baz' })
          )
        )
      ));

      (0, _chai.expect)(wrapper.find('.baz').parent().hasClass('bar')).to.equal(true);
    });

    it('should return itself if matching', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        { className: 'bax' },
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement(
            'div',
            { className: 'baz' },
            _react2['default'].createElement('div', { className: 'bux baz' })
          )
        )
      ));

      (0, _chai.expect)(wrapper.find('.bux').closest('.baz').hasClass('bux')).to.equal(true);
    });
  });

  describe('.hasClass(className)', function () {
    it('should return whether or not node has a certain class', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement('div', { className: 'foo bar baz some-long-string FoOo' }));

      (0, _chai.expect)(wrapper.hasClass('foo')).to.equal(true);
      (0, _chai.expect)(wrapper.hasClass('bar')).to.equal(true);
      (0, _chai.expect)(wrapper.hasClass('baz')).to.equal(true);
      (0, _chai.expect)(wrapper.hasClass('some-long-string')).to.equal(true);
      (0, _chai.expect)(wrapper.hasClass('FoOo')).to.equal(true);
      (0, _chai.expect)(wrapper.hasClass('doesnt-exist')).to.equal(false);
    });
  });

  describe('.forEach(fn)', function () {
    it('should call a function for each node in the wrapper', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bax' }),
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' })
      ));
      var spy = _sinon2['default'].spy();

      wrapper.find('.foo').forEach(spy);

      (0, _chai.expect)(spy.callCount).to.equal(3);
      (0, _chai.expect)(spy.args[0][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[0][0].hasClass('bax')).to.equal(true);
      (0, _chai.expect)(spy.args[1][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[1][0].hasClass('bar')).to.equal(true);
      (0, _chai.expect)(spy.args[2][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[2][0].hasClass('baz')).to.equal(true);
    });
  });

  describe('.map(fn)', function () {
    it('should call a function with a wrapper for each node in the wrapper', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bax' }),
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' })
      ));
      var spy = _sinon2['default'].spy();

      wrapper.find('.foo').map(spy);

      (0, _chai.expect)(spy.callCount).to.equal(3);
      (0, _chai.expect)(spy.args[0][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[0][0].hasClass('bax')).to.equal(true);
      (0, _chai.expect)(spy.args[1][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[1][0].hasClass('bar')).to.equal(true);
      (0, _chai.expect)(spy.args[2][0]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[2][0].hasClass('baz')).to.equal(true);
    });

    it('should return an array with the mapped values', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bax' }),
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' })
      ));
      var result = wrapper.find('.foo').map(function (w) {
        return w.props().className;
      });

      (0, _chai.expect)(result).to.eql(['foo bax', 'foo bar', 'foo baz']);
    });
  });

  describe('.reduce(fn[, initialValue])', function () {
    it('should call a function with a wrapper for each node in the wrapper', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bax' }),
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' })
      ));
      var spy = _sinon2['default'].spy(function (n) {
        return n + 1;
      });

      wrapper.find('.foo').reduce(spy, 0);

      (0, _chai.expect)(spy.callCount).to.equal(3);
      (0, _chai.expect)(spy.args[0][1]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[0][1].hasClass('bax')).to.equal(true);
      (0, _chai.expect)(spy.args[1][1]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[1][1].hasClass('bar')).to.equal(true);
      (0, _chai.expect)(spy.args[2][1]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[2][1].hasClass('baz')).to.equal(true);
    });

    it('should accumulate a value', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { id: 'bax', className: 'foo qoo' }),
        _react2['default'].createElement('div', { id: 'bar', className: 'foo boo' }),
        _react2['default'].createElement('div', { id: 'baz', className: 'foo hoo' })
      ));
      var result = wrapper.find('.foo').reduce(function (obj, n) {
        obj[n.prop('id')] = n.prop('className');
        return obj;
      }, {});

      (0, _chai.expect)(result).to.eql({
        bax: 'foo qoo',
        bar: 'foo boo',
        baz: 'foo hoo'
      });
    });
  });

  describe('.reduceRight(fn[, initialValue])', function () {
    it('should call a function with a wrapper for each node in the wrapper in reverse', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo bax' }),
        _react2['default'].createElement('div', { className: 'foo bar' }),
        _react2['default'].createElement('div', { className: 'foo baz' })
      ));
      var spy = _sinon2['default'].spy(function (n) {
        return n + 1;
      });

      wrapper.find('.foo').reduceRight(spy, 0);

      (0, _chai.expect)(spy.callCount).to.equal(3);
      (0, _chai.expect)(spy.args[0][1]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[0][1].hasClass('baz')).to.equal(true);
      (0, _chai.expect)(spy.args[1][1]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[1][1].hasClass('bar')).to.equal(true);
      (0, _chai.expect)(spy.args[2][1]).to.be.instanceOf(_.ReactWrapper);
      (0, _chai.expect)(spy.args[2][1].hasClass('bax')).to.equal(true);
    });

    it('should accumulate a value', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { id: 'bax', className: 'foo qoo' }),
        _react2['default'].createElement('div', { id: 'bar', className: 'foo boo' }),
        _react2['default'].createElement('div', { id: 'baz', className: 'foo hoo' })
      ));
      var result = wrapper.find('.foo').reduceRight(function (obj, n) {
        obj[n.prop('id')] = n.prop('className');
        return obj;
      }, {});

      (0, _chai.expect)(result).to.eql({
        bax: 'foo qoo',
        bar: 'foo boo',
        baz: 'foo hoo'
      });
    });
  });

  describe('.some(selector)', function () {
    it('should return if a node matches a selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo qoo' }),
        _react2['default'].createElement('div', { className: 'foo boo' }),
        _react2['default'].createElement('div', { className: 'foo hoo' })
      ));
      (0, _chai.expect)(wrapper.find('.foo').some('.qoo')).to.equal(true);
      (0, _chai.expect)(wrapper.find('.foo').some('.foo')).to.equal(true);
      (0, _chai.expect)(wrapper.find('.foo').some('.bar')).to.equal(false);
    });
  });

  describe('.someWhere(predicate)', function () {
    it('should return if a node matches a predicate', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo qoo' }),
        _react2['default'].createElement('div', { className: 'foo boo' }),
        _react2['default'].createElement('div', { className: 'foo hoo' })
      ));
      (0, _chai.expect)(wrapper.find('.foo').someWhere(function (n) {
        return n.hasClass('qoo');
      })).to.equal(true);
      (0, _chai.expect)(wrapper.find('.foo').someWhere(function (n) {
        return n.hasClass('foo');
      })).to.equal(true);
      (0, _chai.expect)(wrapper.find('.foo').someWhere(function (n) {
        return n.hasClass('bar');
      })).to.equal(false);
    });
  });

  describe('.every(selector)', function () {
    it('should return if every node matches a selector', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo qoo' }),
        _react2['default'].createElement('div', { className: 'foo boo' }),
        _react2['default'].createElement('div', { className: 'foo hoo' })
      ));
      (0, _chai.expect)(wrapper.find('.foo').every('.foo')).to.equal(true);
      (0, _chai.expect)(wrapper.find('.foo').every('.qoo')).to.equal(false);
      (0, _chai.expect)(wrapper.find('.foo').every('.bar')).to.equal(false);
    });
  });

  describe('.everyWhere(predicate)', function () {
    it('should return if every node matches a predicate', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'foo qoo' }),
        _react2['default'].createElement('div', { className: 'foo boo' }),
        _react2['default'].createElement('div', { className: 'foo hoo' })
      ));
      (0, _chai.expect)(wrapper.find('.foo').everyWhere(function (n) {
        return n.hasClass('foo');
      })).to.equal(true);
      (0, _chai.expect)(wrapper.find('.foo').everyWhere(function (n) {
        return n.hasClass('qoo');
      })).to.equal(false);
      (0, _chai.expect)(wrapper.find('.foo').everyWhere(function (n) {
        return n.hasClass('bar');
      })).to.equal(false);
    });
  });

  describe('.flatMap(fn)', function () {
    it('should return a wrapper with the mapped and flattened nodes', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement('div', { className: 'bar' }),
          _react2['default'].createElement('div', { className: 'bar' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement('div', { className: 'baz' }),
          _react2['default'].createElement('div', { className: 'baz' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'foo' },
          _react2['default'].createElement('div', { className: 'bax' }),
          _react2['default'].createElement('div', { className: 'bax' })
        )
      ));

      var nodes = wrapper.find('.foo').flatMap(function (w) {
        return w.children().nodes;
      });

      (0, _chai.expect)(nodes.length).to.equal(6);
      (0, _chai.expect)(nodes.at(0).hasClass('bar')).to.equal(true);
      (0, _chai.expect)(nodes.at(1).hasClass('bar')).to.equal(true);
      (0, _chai.expect)(nodes.at(2).hasClass('baz')).to.equal(true);
      (0, _chai.expect)(nodes.at(3).hasClass('baz')).to.equal(true);
      (0, _chai.expect)(nodes.at(4).hasClass('bax')).to.equal(true);
      (0, _chai.expect)(nodes.at(5).hasClass('bax')).to.equal(true);
    });
  });

  describe('.first()', function () {
    it('should return the first node in the current set', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'bar baz' }),
        _react2['default'].createElement('div', { className: 'bar' }),
        _react2['default'].createElement('div', { className: 'bar' }),
        _react2['default'].createElement('div', { className: 'bar' })
      ));
      (0, _chai.expect)(wrapper.find('.bar').first().hasClass('baz')).to.equal(true);
    });
  });

  describe('.last()', function () {
    it('should return the last node in the current set', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'bar' }),
        _react2['default'].createElement('div', { className: 'bar' }),
        _react2['default'].createElement('div', { className: 'bar' }),
        _react2['default'].createElement('div', { className: 'bar baz' })
      ));
      (0, _chai.expect)(wrapper.find('.bar').last().hasClass('baz')).to.equal(true);
    });
  });

  describe('.isEmpty()', function () {
    it('should return true iff wrapper is empty', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement('div', { className: 'foo' }));
      (0, _chai.expect)(wrapper.find('.bar').isEmpty()).to.equal(true);
      (0, _chai.expect)(wrapper.find('.foo').isEmpty()).to.equal(false);
    });
  });

  describe('.at(index)', function () {
    it('gets a wrapper of the node at the specified index', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'bar foo' }),
        _react2['default'].createElement('div', { className: 'bar bax' }),
        _react2['default'].createElement('div', { className: 'bar bux' }),
        _react2['default'].createElement('div', { className: 'bar baz' })
      ));
      (0, _chai.expect)(wrapper.find('.bar').at(0).hasClass('foo')).to.equal(true);
      (0, _chai.expect)(wrapper.find('.bar').at(1).hasClass('bax')).to.equal(true);
      (0, _chai.expect)(wrapper.find('.bar').at(2).hasClass('bux')).to.equal(true);
      (0, _chai.expect)(wrapper.find('.bar').at(3).hasClass('baz')).to.equal(true);
    });
  });

  describe('.get(index)', function () {
    it('gets the node at the specified index', function () {
      var wrapper = (0, _.mount)(_react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('div', { className: 'bar foo' }),
        _react2['default'].createElement('div', { className: 'bar bax' }),
        _react2['default'].createElement('div', { className: 'bar bux' }),
        _react2['default'].createElement('div', { className: 'bar baz' })
      ));
      (0, _chai.expect)(wrapper.find('.bar').get(0)).to.equal(wrapper.find('.foo').node);
      (0, _chai.expect)(wrapper.find('.bar').get(1)).to.equal(wrapper.find('.bax').node);
      (0, _chai.expect)(wrapper.find('.bar').get(2)).to.equal(wrapper.find('.bux').node);
      (0, _chai.expect)(wrapper.find('.bar').get(3)).to.equal(wrapper.find('.baz').node);
    });
  });

  describe('.ref(refName)', function () {
    it('gets a wrapper of the node matching the provided refName', function () {
      var Foo = (function (_React$Component17) {
        _inherits(Foo, _React$Component17);

        function Foo() {
          _classCallCheck(this, Foo);

          _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Foo, [{
          key: 'render',
          value: function render() {
            return _react2['default'].createElement(
              'div',
              null,
              _react2['default'].createElement(
                'span',
                { ref: 'firstRef', amount: 2 },
                'First'
              ),
              _react2['default'].createElement(
                'span',
                { ref: 'secondRef', amount: 4 },
                'Second'
              ),
              _react2['default'].createElement(
                'span',
                { ref: 'thirdRef', amount: 8 },
                'Third'
              )
            );
          }
        }]);

        return Foo;
      })(_react2['default'].Component);

      var wrapper = (0, _.mount)(_react2['default'].createElement(Foo, null));
      (0, _chai.expect)(wrapper.ref('secondRef').prop('amount')).to.equal(4);
      (0, _chai.expect)(wrapper.ref('secondRef').text()).to.equal('Second');
    });
  });
});