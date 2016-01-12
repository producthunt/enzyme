'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.describeWithDOM = describeWithDOM;
exports.useSetStateHack = useSetStateHack;
exports.spySetup = spySetup;
exports.spyTearDown = spyTearDown;
exports.useSinon = useSinon;
exports.spyLifecycle = spyLifecycle;
exports.spyMethods = spyMethods;
exports.mount = mount;
exports.shallow = shallow;
exports.render = render;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ReactWrapper = require('./ReactWrapper');

var _ReactWrapper2 = _interopRequireDefault(_ReactWrapper);

var _ShallowWrapper = require('./ShallowWrapper');

var _ShallowWrapper2 = _interopRequireDefault(_ShallowWrapper);

var _Utils = require('./Utils');

var _reactCompat = require('./react-compat');

/**
 * @class Enzyme
 */

var jsdom = undefined;
try {
  require('jsdom'); // could throw
  jsdom = require('mocha-jsdom');
} catch (e) {
  // jsdom is not supported...
}

var sinon = _sinon2['default'].sandbox.create();

exports.sinon = sinon;

function describeWithDOM(a, b) {
  describe('(uses jsdom)', function () {
    if (typeof jsdom === 'function') {
      jsdom();
      describe(a, b);
    } else {
      // if jsdom isn't available, skip every test in this describe context
      describe.skip(a, b);
    }
  });
}

function useSetStateHack() {
  var cleanup = false;
  before(function () {
    if (typeof global.document === 'undefined') {
      cleanup = true;
      global.document = {};
    }
  });
  after(function () {
    if (cleanup) {
      delete global.document;
    }
  });
}

function spySetup() {
  exports.sinon = sinon = _sinon2['default'].sandbox.create();
}

function spyTearDown() {
  sinon.restore();
}

function useSinon() {
  beforeEach(spySetup);
  afterEach(spyTearDown);
}

function spyLifecycle(Component) {
  (0, _Utils.onPrototype)(Component, function (proto, name) {
    return sinon.spy(proto, name);
  });
}

function spyMethods(Component) {
  (0, _Utils.onPrototype)(Component, null, function (proto, name) {
    return sinon.spy(proto, name);
  });
}

/**
 * Mounts and renders a react component into the document and provides a testing wrapper around it.
 *
 * @param node
 * @returns {ReactWrapper}
 */

function mount(node, options) {
  return new _ReactWrapper2['default'](node, null, options);
}

/**
 * Shallow renders a react component and provides a testing wrapper around it.
 *
 * @param node
 * @returns {ShallowWrapper}
 */

function shallow(node, options) {
  return new _ShallowWrapper2['default'](node, null, options);
}

/**
 * Renders a react component into static HTML and provides a cheerio wrapper around it. This is
 * somewhat asymmetric with `mount` and `shallow`, which don't use any external libraries, but
 * Cheerio's API is pretty close to what we actually want and has a significant amount of utility
 * that would be recreating the wheel if we didn't use it.
 *
 * I think there are a lot of good use cases to use `render` instead of `shallow` or `mount`, and
 * thus I'd like to keep this API in here even though it's not really "ours".
 *
 * @param node
 * @returns {Cheerio}
 */

function render(node) {
  var html = (0, _reactCompat.renderToStaticMarkup)(node);
  return _cheerio2['default'].load(html).root();
}

exports.ShallowWrapper = _ShallowWrapper2['default'];
exports.ReactWrapper = _ReactWrapper2['default'];