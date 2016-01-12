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

var _ReactWrapperComponent = require('./ReactWrapperComponent');

var _ReactWrapperComponent2 = _interopRequireDefault(_ReactWrapperComponent);

var _MountedTraversal = require('./MountedTraversal');

var _reactCompat = require('./react-compat');

/**
 * Finds all nodes in the current wrapper nodes' render trees that match the provided predicate
 * function.
 *
 * @param {ReactWrapper} wrapper
 * @param {Function} predicate
 * @returns {ReactWrapper}
 */
function findWhereUnwrapped(wrapper, predicate) {
  return wrapper.flatMap(function (n) {
    return (0, _MountedTraversal.treeFilter)(n.node, predicate);
  });
}

/**
 * Returns a new wrapper instance with only the nodes of the current wrapper instance that match
 * the provided predicate function.
 *
 * @param {ReactWrapper} wrapper
 * @param {Function} predicate
 * @returns {ReactWrapper}
 */
function filterWhereUnwrapped(wrapper, predicate) {
  return wrapper.wrap((0, _underscore.compact)(wrapper.nodes.filter(predicate)));
}

/**
 * @class ReactWrapper
 */

var ReactWrapper = (function () {
  function ReactWrapper(nodes, root) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, ReactWrapper);

    if (!global.window && !global.document) {
      throw new Error('It looks like you called `mount()` without a jsdom document being loaded. ' + 'Make sure to only use `mount()` inside of a `describeWithDOM(...)` call. ');
    }

    if (!root) {
      var ReactWrapperComponent = (0, _ReactWrapperComponent2['default'])(nodes, options);
      this.component = (0, _reactCompat.renderIntoDocument)(_react2['default'].createElement(ReactWrapperComponent, {
        Component: nodes.type,
        props: nodes.props,
        context: options.context
      }));
      this.root = this;
      this.node = this.component.getWrappedComponent();
      this.nodes = [this.node];
      this.length = 1;
    } else {
      this.component = null;
      this.root = root;
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
   * If the root component contained a ref, you can access it here
   * and get a wrapper around it.
   *
   * NOTE: can only be called on a wrapper instance that is also the root instance.
   *
   * @param {String} refname
   * @returns {ReactWrapper}
   */

  _createClass(ReactWrapper, [{
    key: 'ref',
    value: function ref(refname) {
      if (this.root !== this) {
        throw new Error('ReactWrapper::ref(refname) can only be called on the root');
      }
      return this.wrap(this.instance().refs[refname]);
    }

    /**
     * Gets the instance of the component being rendered as the root node passed into `mount()`.
     *
     * NOTE: can only be called on a wrapper instance that is also the root instance.
     *
     * Example:
     * ```
     * const wrapper = mount(<MyComponent />);
     * const inst = wrapper.instance();
     * expect(inst).to.be.instanceOf(MyComponent);
     * ```
     * @returns {ReactComponent}
     */
  }, {
    key: 'instance',
    value: function instance() {
      return this.component.getInstance();
    }

    /**
     * Forces a re-render. Useful to run before checking the render output if something external
     * may be updating the state of the component somewhere.
     *
     * NOTE: can only be called on a wrapper instance that is also the root instance.
     *
     * @returns {ReactWrapper}
     */
  }, {
    key: 'update',
    value: function update() {
      var _this = this;

      if (this.root !== this) {
        // TODO(lmr): this requirement may not be necessary for the ReactWrapper
        throw new Error('ReactWrapper::update() can only be called on the root');
      }
      this.single(function () {
        _this.component.forceUpdate();
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
     * @returns {ReactWrapper}
     */
  }, {
    key: 'setProps',
    value: function setProps(props) {
      if (this.root !== this) {
        throw new Error('ReactWrapper::setProps() can only be called on the root');
      }
      this.component.setChildProps(props);
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
     * @returns {ReactWrapper}
     */
  }, {
    key: 'setState',
    value: function setState(state) {
      if (this.root !== this) {
        throw new Error('ReactWrapper::setState() can only be called on the root');
      }
      this.instance().setState(state);
      return this;
    }

    /**
     * A method that sets the context of the root component, and re-renders. Useful for when you are
     * wanting to test how the component behaves over time with changing contexts.
     *
     * NOTE: can only be called on a wrapper instance that is also the root instance.
     *
     * @param {Object} context object
     * @returns {ReactWrapper}
     */
  }, {
    key: 'setContext',
    value: function setContext(context) {
      if (this.root !== this) {
        throw new Error('ReactWrapper::setContext() can only be called on the root');
      }
      if (!this.options.context) {
        throw new Error('ShallowWrapper::setContext() can only be called on a wrapper that was originally passed ' + 'a context option');
      }
      this.component.setChildContext(context);
      return this;
    }

    /**
     * Whether or not a given react element exists in the mount render tree.
     *
     * Example:
     * ```
     * const wrapper = mount(<MyComponent />);
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
        return (0, _MountedTraversal.instEqual)(node, other);
      }).length > 0;
    }

    /**
     * Finds every node in the render tree of the current wrapper that matches the provided selector.
     *
     * @param {String|Function} selector
     * @returns {ReactWrapper}
     */
  }, {
    key: 'find',
    value: function find(selector) {
      var predicate = (0, _MountedTraversal.buildInstPredicate)(selector);
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
      var predicate = (0, _MountedTraversal.buildInstPredicate)(selector);
      return this.single(function (n) {
        return predicate(n);
      });
    }

    /**
     * Returns a new wrapper instance with only the nodes of the current wrapper instance that match
     * the provided predicate function.
     *
     * @param {Function} predicate
     * @returns {ReactWrapper}
     */
  }, {
    key: 'filterWhere',
    value: function filterWhere(predicate) {
      var _this2 = this;

      return filterWhereUnwrapped(this, function (n) {
        return predicate(_this2.wrap(n));
      });
    }

    /**
     * Returns a new wrapper instance with only the nodes of the current wrapper instance that match
     * the provided selector.
     *
     * @param {String|Function} selector
     * @returns {ReactWrapper}
     */
  }, {
    key: 'filter',
    value: function filter(selector) {
      var predicate = (0, _MountedTraversal.buildInstPredicate)(selector);
      return filterWhereUnwrapped(this, predicate);
    }

    /**
     * Returns a new wrapper instance with only the nodes of the current wrapper that did not match
     * the provided selector. Essentially the inverse of `filter`.
     *
     * @param {String|Function} selector
     * @returns {ReactWrapper}
     */
  }, {
    key: 'not',
    value: function not(selector) {
      var predicate = (0, _MountedTraversal.buildInstPredicate)(selector);
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
      return this.single(function (n) {
        return (0, _reactCompat.findDOMNode)(n).textContent;
      });
    }

    /**
     * Used to simulate events. Pass an eventname and (optionally) event arguments. This method of
     * testing events should be met with some skepticism.
     *
     * @param {String} event
     * @param {Array} args
     * @returns {ReactWrapper}
     */
  }, {
    key: 'simulate',
    value: function simulate(event) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.single(function (n) {
        return _reactCompat.Simulate[event].apply(_reactCompat.Simulate, [(0, _reactCompat.findDOMNode)(n)].concat(args));
      });
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
      return this.single(function (n) {
        return (0, _MountedTraversal.getNode)(n).props || {};
      });
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
      var _this3 = this;

      if (this.root !== this) {
        throw new Error('ReactWrapper::state() can only be called on the root');
      }
      var _state = this.single(function () {
        return _this3.instance().state;
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
     * @returns {ReactWrapper}
     */
  }, {
    key: 'children',
    value: function children(selector) {
      var allChildren = this.flatMap(function (n) {
        return (0, _MountedTraversal.childrenOfInst)(n.node);
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
     * @returns {ReactWrapper}
     */
  }, {
    key: 'parents',
    value: function parents(selector) {
      var _this4 = this;

      var allParents = this.wrap(this.single(function (n) {
        return (0, _MountedTraversal.parentsOfInst)(n, _this4.root.node);
      }));
      return selector ? allParents.filter(selector) : allParents;
    }

    /**
     * Returns a wrapper around the immediate parent of the current node.
     *
     * @returns {ReactWrapper}
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
     * @returns {ReactWrapper}
     */
  }, {
    key: 'closest',
    value: function closest(selector) {
      return this.is(selector) ? this : this.parents().filter(selector).first();
    }

    /**
     * Returns the value of  prop with the given name of the root node.
     *
     * @param {String} propName
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
        return (0, _MountedTraversal.getNode)(n).type;
      });
    }

    /**
     * Returns whether or not the current root node has the given class name or not.
     *
     * NOTE: can only be called on a wrapper of a single node.
     *
     * @param {String} className
     * @returns {Boolean}
     */
  }, {
    key: 'hasClass',
    value: function hasClass(className) {
      if (className && className.indexOf('.') !== -1) {
        console.log('It looks like you\'re calling `ReactWrapper::hasClass()` with a CSS selector. ' + 'hasClass() expects a class name, not a CSS selector.');
      }
      return this.single(function (n) {
        return (0, _MountedTraversal.instHasClassName)(n, className);
      });
    }

    /**
     * Iterates through each node of the current wrapper and executes the provided function with a
     * wrapper around the corresponding node passed in as the first argument.
     *
     * @param {Function} fn
     * @returns {ReactWrapper}
     */
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      var _this5 = this;

      this.nodes.forEach(function (n, i) {
        return fn.call(_this5, _this5.wrap(n), i);
      });
      return this;
    }

    /**
     * Maps the current array of nodes to another array. Each node is passed in as a `ReactWrapper`
     * to the map function.
     *
     * @param {Function} fn
     * @returns {Array}
     */
  }, {
    key: 'map',
    value: function map(fn) {
      var _this6 = this;

      return this.nodes.map(function (n, i) {
        return fn.call(_this6, _this6.wrap(n), i);
      });
    }

    /**
     * Reduces the current array of nodes to another array.
     * Each node is passed in as a `ShallowWrapper` to the reducer function.
     *
     * @param {Function} fn - the reducer function
     * @param {*} initialValue - the initial value
     * @returns {*}
     */
  }, {
    key: 'reduce',
    value: function reduce(fn, initialValue) {
      var _this7 = this;

      return this.nodes.reduce(function (accum, n, i) {
        return fn.call(_this7, accum, _this7.wrap(n), i);
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
      var _this8 = this;

      return this.nodes.reduceRight(function (accum, n, i) {
        return fn.call(_this8, accum, _this8.wrap(n), i);
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
      var predicate = (0, _MountedTraversal.buildInstPredicate)(selector);
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
      var _this9 = this;

      return this.nodes.some(function (n, i) {
        return predicate.call(_this9, _this9.wrap(n), i);
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
      var predicate = (0, _MountedTraversal.buildInstPredicate)(selector);
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
      var _this10 = this;

      return this.nodes.every(function (n, i) {
        return predicate.call(_this10, _this10.wrap(n), i);
      });
    }

    /**
     * Utility method used to create new wrappers with a mapping function that returns an array of
     * nodes in response to a single node wrapper. The returned wrapper is a single wrapper around
     * all of the mapped nodes flattened (and de-duplicated).
     *
     * @param {Function} fn
     * @returns {ReactWrapper}
     */
  }, {
    key: 'flatMap',
    value: function flatMap(fn) {
      var _this11 = this;

      var nodes = this.nodes.map(function (n, i) {
        return fn.call(_this11, _this11.wrap(n), i);
      });
      var flattened = (0, _underscore.flatten)(nodes, true);
      var uniques = (0, _underscore.unique)(flattened);
      return this.wrap(uniques);
    }

    /**
     * Finds all nodes in the current wrapper nodes' render trees that match the provided predicate
     * function.
     *
     * @param {Function} predicate
     * @returns {ReactWrapper}
     */
  }, {
    key: 'findWhere',
    value: function findWhere(predicate) {
      var _this12 = this;

      return findWhereUnwrapped(this, function (n) {
        return predicate(_this12.wrap(n));
      });
    }

    /**
     * Returns the node at a given index of the current wrapper.
     *
     * @param {Number} index
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
     * @param {Number} index
     * @returns {ReactWrapper}
     */
  }, {
    key: 'at',
    value: function at(index) {
      return this.wrap(this.nodes[index]);
    }

    /**
     * Returns a wrapper around the first node of the current wrapper.
     *
     * @returns {ReactWrapper}
     */
  }, {
    key: 'first',
    value: function first() {
      return this.at(0);
    }

    /**
     * Returns a wrapper around the last node of the current wrapper.
     *
     * @returns {ReactWrapper}
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
     * @param {Function} fn
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
     * @param {ReactWrapper|ReactElement|Array<ReactElement>} node
     * @returns {ReactWrapper}
     */
  }, {
    key: 'wrap',
    value: function wrap(node) {
      if (node instanceof ReactWrapper) {
        return node;
      }
      return new ReactWrapper(node, this.root);
    }
  }]);

  return ReactWrapper;
})();

exports['default'] = ReactWrapper;
module.exports = exports['default'];