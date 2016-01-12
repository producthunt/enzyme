'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createWrapperComponent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

/**
 * This is a utility component to wrap around the nodes we are
 * passing in to `mount()`. Theoretically, you could do everything
 * we are doing without this, but this makes it easier since
 * `renderIntoDocument()` doesn't really pass back a reference to
 * the DOM node it rendered to, so we can't really "re-render" to
 * pass new props in.
 */

function createWrapperComponent(node) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var spec = {

    propTypes: {
      Component: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.string]).isRequired,
      props: _react.PropTypes.object.isRequired,
      context: _react.PropTypes.object
    },

    getDefaultProps: function getDefaultProps() {
      return {
        context: null
      };
    },

    getInitialState: function getInitialState() {
      return {
        props: this.props.props,
        context: this.props.context
      };
    },

    setChildProps: function setChildProps(newProps) {
      var _this = this;

      var props = (0, _objectAssign2['default'])({}, this.state.props, newProps);
      return new Promise(function (resolve) {
        return _this.setState({ props: props }, resolve);
      });
    },

    setChildContext: function setChildContext(context) {
      var _this2 = this;

      return new Promise(function (resolve) {
        return _this2.setState({ context: context }, resolve);
      });
    },

    getInstance: function getInstance() {
      var component = this._reactInternalInstance._renderedComponent;
      var inst = component.getPublicInstance();
      if (inst === null) {
        throw new Error('You cannot get an instance of a stateless component.');
      }
      return inst;
    },

    getWrappedComponent: function getWrappedComponent() {
      var component = this._reactInternalInstance._renderedComponent;
      var inst = component.getPublicInstance();
      if (inst === null) {
        return component;
      }
      return inst;
    },

    render: function render() {
      var Component = this.props.Component;

      return _react2['default'].createElement(Component, this.state.props);
    }
  };

  if (options.context && node.type.contextTypes) {
    // For full rendering, we are using this wrapper component to provide context if it is
    // specified in both the options AND the child component defines `contextTypes` statically.
    // In that case, we define both a `getChildContext()` function and a `childContextTypes` prop.
    Object.assign(spec, {
      childContextTypes: node.type.contextTypes,
      getChildContext: function getChildContext() {
        return this.state.context;
      }
    });
  }

  return _react2['default'].createClass(spec);
}

module.exports = exports['default'];