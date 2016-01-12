'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _version = require('./version');

var TestUtils = undefined;
var createShallowRenderer = undefined;
var renderToStaticMarkup = undefined;
var renderIntoDocument = undefined;
var findDOMNode = undefined;
var React = undefined;
var ReactContext = undefined;
if (_version.REACT013) {
  renderToStaticMarkup = require('react').renderToStaticMarkup;
  React = require('react');
  /* eslint-disable react/no-deprecated */
  findDOMNode = React.findDOMNode;
  /* eslint-enable react/no-deprecated */
  TestUtils = require('react/addons').addons.TestUtils;
  ReactContext = require('react/lib/ReactContext');

  // Shallow rendering in 0.13 did not properly support context. This function provides a shim
  // around `TestUtils.createRenderer` that instead returns a ShallowRenderer that actually
  // works with context. See https://github.com/facebook/react/issues/3721 for more details.
  createShallowRenderer = function createRendererCompatible() {
    var renderer = TestUtils.createRenderer();
    renderer.render = (function (originalRender) {
      return function contextCompatibleRender(node) {
        var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        ReactContext.current = context;
        originalRender.call(this, React.createElement(node.type, node.props), context);
        ReactContext.current = {};
        return renderer.getRenderOutput();
      };
    })(renderer.render);
    return renderer;
  };
  renderIntoDocument = TestUtils.renderIntoDocument;
  // this fixes some issues in React 0.13 with setState and jsdom...
  // see issue: https://github.com/airbnb/enzyme/issues/27
  require('react/lib/ExecutionEnvironment').canUseDOM = true;
} else {
  renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
  findDOMNode = require('react-dom').findDOMNode;
  // We require the testutils, but they don't come with 0.14 out of the box, so we
  // require them here through this node module. The bummer is that we are not able
  // to list this as a dependency in package.json and have 0.13 work properly.
  // As a result, right now this is basically an implicit dependency.
  TestUtils = require('react-addons-test-utils');

  // Shallow rendering changed from 0.13 => 0.14 in such a way that
  // 0.14 now does not allow shallow rendering of native DOM elements.
  // This is mainly because the result of such a call should not realistically
  // be any different than the JSX you passed in (result of `React.createElement`.
  // In order to maintain the same behavior across versions, this function
  // is essentially a replacement for `TestUtils.createRenderer` that doesn't use
  // shallow rendering when it's just a DOM element.
  createShallowRenderer = function createRendererCompatible() {
    var renderer = TestUtils.createRenderer();
    var isDOM = false;
    var _node = undefined;
    return {
      _instance: renderer._instance,
      render: function render(node, context) {
        if (typeof node.type === 'string') {
          isDOM = true;
          _node = node;
        } else {
          isDOM = false;
          renderer.render(node, context);
          this._instance = renderer._instance;
        }
      },
      getRenderOutput: function getRenderOutput() {
        if (isDOM) {
          return _node;
        }
        return renderer.getRenderOutput();
      }
    };
  };
  renderIntoDocument = TestUtils.renderIntoDocument;
}

var _TestUtils = TestUtils;
var mockComponent = _TestUtils.mockComponent;
var isElement = _TestUtils.isElement;
var isElementOfType = _TestUtils.isElementOfType;
var isDOMComponent = _TestUtils.isDOMComponent;
var isCompositeComponent = _TestUtils.isCompositeComponent;
var isCompositeComponentWithType = _TestUtils.isCompositeComponentWithType;
var isCompositeComponentElement = _TestUtils.isCompositeComponentElement;
var Simulate = _TestUtils.Simulate;
var findAllInRenderedTree = _TestUtils.findAllInRenderedTree;
exports['default'] = {
  createShallowRenderer: createShallowRenderer,
  renderToStaticMarkup: renderToStaticMarkup,
  renderIntoDocument: renderIntoDocument,
  mockComponent: mockComponent,
  isElement: isElement,
  isElementOfType: isElementOfType,
  isDOMComponent: isDOMComponent,
  isCompositeComponent: isCompositeComponent,
  isCompositeComponentWithType: isCompositeComponentWithType,
  isCompositeComponentElement: isCompositeComponentElement,
  Simulate: Simulate,
  findDOMNode: findDOMNode,
  findAllInRenderedTree: findAllInRenderedTree
};
module.exports = exports['default'];