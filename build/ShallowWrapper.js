'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _Utils = require('./Utils');

var _Debug = require('./Debug');

var _ShallowTraversal = require('./ShallowTraversal');

var _reactCompat = require('./react-compat');

/**
 * Finds all nodes in the current wrapper nodes' render trees that match the provided predicate
 * function.
 *
 * @param {ShallowWrapper} wrapper
 * @param {Function} predicate
 * @returns {ShallowWrapper}
 */
function findWhereUnwrapped(wrapper, predicate) {
  return wrapper.flatMap(function (n) {
    return (0, _ShallowTraversal.treeFilter)(n.node, predicate);
  });
}

/**
 * Returns a new wrapper instance with only the nodes of the current wrapper instance that match
 * the provided predicate function.
 *
 * @param {ShallowWrapper} wrapper
 * @param {Function} predicate
 * @returns {ShallowWrapper}
 */
function filterWhereUnwrapped(wrapper, predicate) {
  return wrapper.wrap((0, _underscore.compact)(wrapper.nodes.filter(predicate)));
}

/**
 * @class ShallowWrapper
 */

var ShallowWrapper = (function () {
  function ShallowWrapper(nodes, root) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, ShallowWrapper);

    if (!root) {
      this.root = this;
      this.unrendered = nodes;
      this.renderer = (0, _reactCompat.createShallowRenderer)();
      this.renderer.render(nodes, options.context);
      this.node = this.renderer.getRenderOutput();
      this.nodes = [this.node];
      this.length = 1;
    } else {
      this.root = root;
      this.unrendered = null;
      this.renderer = null;
      if (!Array.isArray(nodes)) {
        this.node = nodes;
        this.nodes = [nodes];
      } else {
        this.node = nodes[0];
        this.nodes = nodes;
      }
      this.length = this.nodes.length;
    }
    this.options = options;
  }

  /**
   * Gets the instance of the component being rendered as the root node passed into `shallow()`.
   *
   * NOTE: can only be called on a wrapper instance that is also the root instance.
   *
   * Example:
   * ```
   * const wrapper = shallow(<MyComponent />);
   * const inst = wrapper.instance();
   * expect(inst).to.be.instanceOf(MyComponent);
   * ```
   * @returns {ReactComponent}
   */

  _createClass(ShallowWrapper, [{
    key: 'instance',
    value: function instance() {
      return this.renderer._instance._instance;
    }

    /**
     * Forces a re-render. Useful to run before checking the render output if something external
     * may be updating the state of the component somewhere.
     *
     * NOTE: can only be called on a wrapper instance that is also the root instance.
     *
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'update',
    value: function update() {
      var _this = this;

      if (this.root !== this) {
        throw new Error('ShallowWrapper::update() can only be called on the root');
      }
      this.single(function () {
        _this.node = _this.renderer.getRenderOutput();
        _this.nodes = [_this.node];
      });
      return this;
    }

    /**
     * A method that sets the props of the root component, and re-renders. Useful for when you are
     * wanting to test how the component behaves over time with changing props. Calling this, for
     * instance, will call the `componentWillReceiveProps` lifecycle method.
     *
     * Similar to `setState`, this method accepts a props object and will merge it in with the already
     * existing props.
     *
     * NOTE: can only be called on a wrapper instance that is also the root instance.
     *
     * @param {Object} props object
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'setProps',
    value: function setProps(props) {
      var _this2 = this;

      if (this.root !== this) {
        throw new Error('ShallowWrapper::setProps() can only be called on the root');
      }
      this.single(function () {
        (0, _Utils.withSetStateAllowed)(function () {
          _this2.unrendered = _react2['default'].cloneElement(_this2.unrendered, props);
          _this2.renderer.render(_this2.unrendered);
          _this2.update();
        });
      });
      return this;
    }

    /**
     * A method to invoke `setState` on the root component instance similar to how you might in the
     * definition of the component, and re-renders.  This method is useful for testing your component
     * in hard to achieve states, however should be used sparingly. If possible, you should utilize
     * your component's external API in order to get it into whatever state you want to test, in order
     * to be as accurate of a test as possible. This is not always practical, however.
     *
     * NOTE: can only be called on a wrapper instance that is also the root instance.
     *
     * @param {Object} state to merge
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'setState',
    value: function setState(state) {
      var _this3 = this;

      if (this.root !== this) {
        throw new Error('ShallowWrapper::setState() can only be called on the root');
      }
      this.single(function () {
        (0, _Utils.withSetStateAllowed)(function () {
          _this3.instance().setState(state);
          _this3.update();
        });
      });
      return this;
    }

    /**
     * A method that sets the context of the root component, and re-renders. Useful for when you are
     * wanting to test how the component behaves over time with changing contexts.
     *
     * NOTE: can only be called on a wrapper instance that is also the root instance.
     *
     * @param {Object} context object
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'setContext',
    value: function setContext(context) {
      if (this.root !== this) {
        throw new Error('ShallowWrapper::setContext() can only be called on the root');
      }
      if (!this.options.context) {
        throw new Error('ShallowWrapper::setContext() can only be called on a wrapper that was originally passed ' + 'a context option');
      }
      this.renderer.render(this.unrendered, context);
      this.update();
      return this;
    }

    /**
     * Whether or not a given react element exists in the shallow render tree.
     *
     * Example:
     * ```
     * const wrapper = shallow(<MyComponent />);
     * expect(wrapper.contains(<div className="foo bar" />)).to.equal(true);
     * ```
     *
     * @param {ReactElement} node
     * @returns {Boolean}
     */
  }, {
    key: 'contains',
    value: function contains(node) {
      return findWhereUnwrapped(this, function (other) {
        return (0, _Utils.nodeEqual)(node, other);
      }).length > 0;
    }

    /**
     * Finds every node in the render tree of the current wrapper that matches the provided selector.
     *
     * @param {String|Function} selector
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'find',
    value: function find(selector) {
      var predicate = (0, _ShallowTraversal.buildPredicate)(selector);
      return findWhereUnwrapped(this, predicate);
    }

    /**
     * Returns whether or not current node matches a provided selector.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @param {String|Function} selector
     * @returns {boolean}
     */
  }, {
    key: 'is',
    value: function is(selector) {
      var predicate = (0, _ShallowTraversal.buildPredicate)(selector);
      return this.single(predicate);
    }

    /**
     * Returns a new wrapper instance with only the nodes of the current wrapper instance that match
     * the provided predicate function. The predicate should receive a wrapped node as its first
     * argument.
     *
     * @param {Function} predicate
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'filterWhere',
    value: function filterWhere(predicate) {
      var _this4 = this;

      return filterWhereUnwrapped(this, function (n) {
        return predicate(_this4.wrap(n));
      });
    }

    /**
     * Returns a new wrapper instance with only the nodes of the current wrapper instance that match
     * the provided selector.
     *
     * @param {String|Function} selector
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'filter',
    value: function filter(selector) {
      var predicate = (0, _ShallowTraversal.buildPredicate)(selector);
      return filterWhereUnwrapped(this, predicate);
    }

    /**
     * Returns a new wrapper instance with only the nodes of the current wrapper that did not match
     * the provided selector. Essentially the inverse of `filter`.
     *
     * @param {String|Function} selector
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'not',
    value: function not(selector) {
      var predicate = (0, _ShallowTraversal.buildPredicate)(selector);
      return filterWhereUnwrapped(this, function (n) {
        return !predicate(n);
      });
    }

    /**
     * Returns a string of the rendered text of the current render tree.  This function should be
     * looked at with skepticism if being used to test what the actual HTML output of the component
     * will be. If that is what you would like to test, use enzyme's `render` function instead.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @returns {String}
     */
  }, {
    key: 'text',
    value: function text() {
      return this.single(_ShallowTraversal.getTextFromNode);
    }

    /**
     * Returns the HTML of the node.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @returns {String}
     */
  }, {
    key: 'html',
    value: function html() {
      return this.single(_reactCompat.renderToStaticMarkup);
    }

    /**
     * Returns the current node rendered to HTML and wrapped in a CheerioWrapper.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @returns {CheerioWrapper}
     */
  }, {
    key: 'render',
    value: function render() {
      return _cheerio2['default'].load(this.html()).root();
    }

    /**
     * Used to simulate events. Pass an eventname and (optionally) event arguments. This method of
     * testing events should be met with some skepticism.
     *
     * @param {String} event
     * @param {Array} args
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'simulate',
    value: function simulate(event) {
      var _this5 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var handler = this.prop((0, _Utils.propFromEvent)(event));
      if (handler) {
        (0, _Utils.withSetStateAllowed)(function () {
          // TODO(lmr): create/use synthetic events
          // TODO(lmr): emulate React's event propagation
          handler.apply(undefined, args);
          _this5.root.update();
        });
      }
      return this;
    }

    /**
     * Returns the props hash for the root node of the wrapper.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @returns {Object}
     */
  }, {
    key: 'props',
    value: function props() {
      return this.single(_Utils.propsOfNode);
    }

    /**
     * Returns the state hash for the root node of the wrapper. Optionally pass in a prop name and it
     * will return just that value.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @param {String} name (optional)
     * @returns {*}
     */
  }, {
    key: 'state',
    value: function state(name) {
      var _this6 = this;

      if (this.root !== this) {
        throw new Error('ShallowWrapper::state() can only be called on the root');
      }
      var _state = this.single(function () {
        return _this6.instance().state;
      });
      if (name !== undefined) {
        return _state[name];
      }
      return _state;
    }

    /**
     * Returns a new wrapper with all of the children of the current wrapper.
     *
     * @param {String|Function} [selector]
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'children',
    value: function children(selector) {
      var allChildren = this.flatMap(function (n) {
        return (0, _ShallowTraversal.childrenOfNode)(n.node);
      });
      return selector ? allChildren.filter(selector) : allChildren;
    }

    /**
     * Returns a wrapper around all of the parents/ancestors of the wrapper. Does not include the node
     * in the current wrapper.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @param {String|Function} [selector]
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'parents',
    value: function parents(selector) {
      var _this7 = this;

      var allParents = this.wrap(this.single(function (n) {
        return (0, _ShallowTraversal.parentsOfNode)(n, _this7.root.node);
      }));
      return selector ? allParents.filter(selector) : allParents;
    }

    /**
     * Returns a wrapper around the immediate parent of the current node.
     *
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'parent',
    value: function parent() {
      return this.flatMap(function (n) {
        return [n.parents().get(0)];
      });
    }

    /**
     *
     * @param {String|Function} selector
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'closest',
    value: function closest(selector) {
      return this.is(selector) ? this : this.parents().filter(selector).first();
    }

    /**
     * Shallow renders the current node and returns a shallow wrapper around it.
     *
     * NOTE: can only be called on wrapper of a single node.
     *
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'shallow',
    value: function shallow() {
      return this.single(function (n) {
        return new ShallowWrapper(n);
      });
    }

    /**
     * Returns the value of  prop with the given name of the root node.
     *
     * @param propName
     * @returns {*}
     */
  }, {
    key: 'prop',
    value: function prop(propName) {
      return this.props()[propName];
    }

    /**
     * Returns the type of the root ndoe of this wrapper. If it's a composite component, this will be
     * the component constructor. If it's native DOM node, it will be a string.
     *
     * @returns {String|Function}
     */
  }, {
    key: 'type',
    value: function type() {
      return this.single(function (n) {
        return n.type;
      });
    }

    /**
     * Returns whether or not the current root node has the given class name or not.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @param className
     * @returns {Boolean}
     */
  }, {
    key: 'hasClass',
    value: function hasClass(className) {
      if (className && className.indexOf('.') !== -1) {
        console.warn('It looks like you\'re calling `ShallowWrapper::hasClass()` with a CSS selector. ' + 'hasClass() expects a class name, not a CSS selector.');
      }
      return this.single(function (n) {
        return (0, _ShallowTraversal.hasClassName)(n, className);
      });
    }

    /**
     * Iterates through each node of the current wrapper and executes the provided function with a
     * wrapper around the corresponding node passed in as the first argument.
     *
     * @param {Function} fn
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      var _this8 = this;

      this.nodes.forEach(function (n, i) {
        return fn.call(_this8, _this8.wrap(n), i);
      });
      return this;
    }

    /**
     * Maps the current array of nodes to another array. Each node is passed in as a `ShallowWrapper`
     * to the map function.
     *
     * @param {Function} fn
     * @returns {Array}
     */
  }, {
    key: 'map',
    value: function map(fn) {
      var _this9 = this;

      return this.nodes.map(function (n, i) {
        return fn.call(_this9, _this9.wrap(n), i);
      });
    }

    /**
     * Reduces the current array of nodes to a value. Each node is passed in as a `ShallowWrapper`
     * to the reducer function.
     *
     * @param {Function} fn - the reducer function
     * @param {*} initialValue - the initial value
     * @returns {*}
     */
  }, {
    key: 'reduce',
    value: function reduce(fn, initialValue) {
      var _this10 = this;

      return this.nodes.reduce(function (accum, n, i) {
        return fn.call(_this10, accum, _this10.wrap(n), i);
      }, initialValue);
    }

    /**
     * Reduces the current array of nodes to another array, from right to left. Each node is passed
     * in as a `ShallowWrapper` to the reducer function.
     *
     * @param {Function} fn - the reducer function
     * @param {*} initialValue - the initial value
     * @returns {*}
     */
  }, {
    key: 'reduceRight',
    value: function reduceRight(fn, initialValue) {
      var _this11 = this;

      return this.nodes.reduceRight(function (accum, n, i) {
        return fn.call(_this11, accum, _this11.wrap(n), i);
      }, initialValue);
    }

    /**
     * Returns whether or not any of the nodes in the wrapper match the provided selector.
     *
     * @param {Function|String} selector
     * @returns {Boolean}
     */
  }, {
    key: 'some',
    value: function some(selector) {
      var predicate = (0, _ShallowTraversal.buildPredicate)(selector);
      return this.nodes.some(predicate);
    }

    /**
     * Returns whether or not any of the nodes in the wrapper pass the provided predicate function.
     *
     * @param {Function} predicate
     * @returns {Boolean}
     */
  }, {
    key: 'someWhere',
    value: function someWhere(predicate) {
      var _this12 = this;

      return this.nodes.some(function (n, i) {
        return predicate.call(_this12, _this12.wrap(n), i);
      });
    }

    /**
     * Returns whether or not all of the nodes in the wrapper match the provided selector.
     *
     * @param {Function|String} selector
     * @returns {Boolean}
     */
  }, {
    key: 'every',
    value: function every(selector) {
      var predicate = (0, _ShallowTraversal.buildPredicate)(selector);
      return this.nodes.every(predicate);
    }

    /**
     * Returns whether or not any of the nodes in the wrapper pass the provided predicate function.
     *
     * @param {Function} predicate
     * @returns {Boolean}
     */
  }, {
    key: 'everyWhere',
    value: function everyWhere(predicate) {
      var _this13 = this;

      return this.nodes.every(function (n, i) {
        return predicate.call(_this13, _this13.wrap(n), i);
      });
    }

    /**
     * Utility method used to create new wrappers with a mapping function that returns an array of
     * nodes in response to a single node wrapper. The returned wrapper is a single wrapper around
     * all of the mapped nodes flattened (and de-duplicated).
     *
     * @param {Function} fn
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'flatMap',
    value: function flatMap(fn) {
      var _this14 = this;

      var nodes = this.nodes.map(function (n, i) {
        return fn.call(_this14, _this14.wrap(n), i);
      });
      var flattened = (0, _underscore.flatten)(nodes, true);
      var uniques = (0, _underscore.unique)(flattened);
      return this.wrap(uniques);
    }

    /**
     * Finds all nodes in the current wrapper nodes' render trees that match the provided predicate
     * function. The predicate function will receive the nodes inside a ShallowWrapper as its
     * first argument.
     *
     * @param {Function} predicate
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'findWhere',
    value: function findWhere(predicate) {
      var _this15 = this;

      return findWhereUnwrapped(this, function (n) {
        return predicate(_this15.wrap(n));
      });
    }

    /**
     * Returns the node at a given index of the current wrapper.
     *
     * @param index
     * @returns {ReactElement}
     */
  }, {
    key: 'get',
    value: function get(index) {
      return this.nodes[index];
    }

    /**
     * Returns a wrapper around the node at a given index of the current wrapper.
     *
     * @param index
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'at',
    value: function at(index) {
      return this.wrap(this.nodes[index]);
    }

    /**
     * Returns a wrapper around the first node of the current wrapper.
     *
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'first',
    value: function first() {
      return this.at(0);
    }

    /**
     * Returns a wrapper around the last node of the current wrapper.
     *
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'last',
    value: function last() {
      return this.at(this.length - 1);
    }

    /**
     * Returns true if the current wrapper has no nodes. False otherwise.
     *
     * @returns {boolean}
     */
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.length === 0;
    }

    /**
     * Utility method that throws an error if the current instance has a length other than one.
     * This is primarily used to enforce that certain methods are only run on a wrapper when it is
     * wrapping a single node.
     *
     * @param fn
     * @returns {*}
     */
  }, {
    key: 'single',
    value: function single(fn) {
      if (this.length !== 1) {
        throw new Error('This method is only meant to be run on single node. ' + this.length + ' found instead.');
      }
      return fn.call(this, this.node);
    }

    /**
     * Helpful utility method to create a new wrapper with the same root as the current wrapper, with
     * any nodes passed in as the first parameter automatically wrapped.
     *
     * @param node
     * @returns {ShallowWrapper}
     */
  }, {
    key: 'wrap',
    value: function wrap(node) {
      if (node instanceof ShallowWrapper) {
        return node;
      }
      return new ShallowWrapper(node, this.root);
    }

    /**
     * Returns an html-like string of the shallow render for debugging purposes.
     *
     * @returns {String}
     */
  }, {
    key: 'debug',
    value: function debug() {
      return (0, _Debug.debugNodes)(this.nodes);
    }
  }]);

  return ShallowWrapper;
})();

exports['default'] = ShallowWrapper;
module.exports = exports['default'];