/*!
 * Kiso JavaScript Library v0.3.0
 * http://www.github.com/brettwp/Kiso
 * Copyright (c) 2010 Brett Pontarelli
 *
 * Licensed under The MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @namespace kiso
 * @description  Contains the core functions <code>Class</code> and <code>Interface</code> along
 *   with all sub-namespaces of the Kiso library.
 * @author Brett Pontarelli (www.github.com/brettwp/Kiso)
 * @version 0.3.0
 */
this.kiso = this.kiso || {};
/** @ignore */
kiso.VERSION = '0.3.0';

/**
 * @description Creates a new interface
 * @param parentInterface A parent interface or an array of methods.
 * @param methods An array of methods when inheriting from a parent interface.
 *
 * There are two basic ways to create and interface:
 * 1) Interface([...]) - An array of strings for the required methods of the interface
 * 2) Interface(parent, [...]) - The parent interface and an array of strings to extend the parent.
 *
 * @returns {Interface} A new interface
 */
kiso.Interface = function(parentInterface, methods) {
  return create(parentInterface, methods);

  function create(parentInterface, methods) {
    if (methods == undefined) {
        methods = parentInterface;
        parentInterface = null;
    }
    var newInterface = {
      _methods: [],
      getMethods: function() { return this._methods; }
    };
    setupInterfaceFromParent(newInterface, parentInterface);
    extendInterface(newInterface, methods);
    return newInterface;
  }

  function setupInterfaceFromParent(newInterface, parentInterface) {
    if (parentInterface) {
      newInterface._methods = [].concat(parentInterface._methods);
    }
  }

  function extendInterface(newInterface, methods) {
    for (var index in methods) {
      newInterface._methods.push(methods[index]);
    }
  }
};

/**
 * @description Creates a new class.
 * @param {Class|Object} parentClassOrObj The parent class, an object of parameters (see paramObj) or the class definition object (see classObj).
 * @param {Object} childDefinition The class definition object (see classObj) when the first arguments is an object.
 *
 * There are three basic ways to instantiate a class:
 * <ol>
 *   <li><code>Class(classObject)</code> - A base class.</li>
 *   <li><code>Class(parentClass, classObject)</code> - A sub-class that inherits from a parent class.</li>
 *   <li><code>Class(paramObject, classObject)</code> - A base or sub-class that uses a paramObject.</li>
 * </ol>
 * A <code>parentClass</code> is any class created by a previous call to <code>kiso.Class</code> where the
 * <code>paramObject</code> and <code>classObject</code> are defined as follows.
 *
 * <dl>
 *   <dt><strong><code>paramObject</code></strong><dt>
 *   <dd>Contains atleast one of the following:
 * <pre>{
 *   parent: parentClass,
 *   interfaces: [a single interface or an array of interfaces],
 *   constants: {an object of constant names and values}
 * }</pre>
 *     <p>Note that constants are attached to the class.  For example a class defined like,<p>
 *     <pre>  var example = kiso.Class({ constants: { ONE:1, TWO:2 } }, {...});</pre>
 *     <p>the constants will be</p>
 *     <pre>
 *   example.ONE == 1
 *   example.TWO == 2
 *     </pre>
 *   </dd>
 *
 *   <dt><strong><code>classObject</code></strong></dt>
 *   <dd>An object of variables and methods (using <code>initialize</code> for the constructor):
 * <pre>{
 *   variable1: 1,
 *   variable2: 2,
 *   initialize: funciton(...) {...},
 *   method1: funciton(...) {...},
 *   method2: funciton(...) {...}
 * }</pre>
 *   </dd>
 * </dl>
 *
 * @returns {Class} A new class
 */
kiso.Class = function(parentClassOrObj, childDefinition) {
  return create(parentClassOrObj, childDefinition);

  function create(parentClassOrObj, childDefinition) {
    var interfaces = null;
    var constants = null;
    var parentClass = null;
    if (childDefinition == undefined) {
      childDefinition = parentClassOrObj;
    } else if (typeof parentClassOrObj == 'object') {
      if (parentClassOrObj.hasOwnProperty('parent') && !parentClassOrObj.parent) {
        throw new Error('Parent class undefined.');
      } else {
        parentClass = parentClassOrObj.parent;
      }
      if (parentClassOrObj.hasOwnProperty('interfaces') && !parentClassOrObj.interfaces) {
        throw new Error('Interface undefined.');
      } else {
        interfaces = parentClassOrObj.interfaces;
      }
      constants = parentClassOrObj.constants;
    } else if (parentClassOrObj) {
      parentClass = parentClassOrObj;
    } else {
      throw new Error('Parent class undefined.');
    }
    var newClass = function() {
      createUniqueInstanceVariables(this);
      if (this.__superclass) this.superclass = new this.__superclass(this);
      if (this.initialize) this.initialize.apply(this, arguments);
    };
    setupClassFromParent(newClass, parentClass);
    extendClassMembers(newClass, childDefinition);
    extendClassInterfaces(newClass, interfaces);
    ensureImplementsInterfaces(newClass);
    setupClassConstants(newClass, constants);
    return newClass;
  }

  function createUniqueInstanceVariables(obj) {
    for (var prop in obj) {
      if (prop != '__superclass') {
        if (obj[prop] != null &&
          typeof obj[prop] == 'object') obj[prop] = clone(obj[prop]);
      }
    }
  }

  function clone(oldObj) {
    var newObj = (oldObj instanceof Array) ? [] : {};
    for (var prop in oldObj) {
      if (typeof oldObj[prop] == 'object') {
        newObj[prop] = clone(oldObj[prop]);
      } else {
        newObj[prop] = oldObj[prop];
      }
    }
    return newObj;
  }

  function setupClassFromParent(newClass, parentClass) {
    if (parentClass) {
      var func = function() {};
      func.prototype = parentClass.prototype;
      newClass.prototype = new func();
      newClass.prototype.__superclass = function(subObject) {
        this._subObject = subObject;
        this._parentClass = parentClass.prototype;
      };
      setupClassConstants(newClass, parentClass);
    }
  }

  function extendClassMembers(newClass, extension) {
    var extObj, prop;
    if (typeof extension == 'function') {
      extObj = extension.prototype;
    } else {
      extObj = extension
    }
    for (prop in extObj) {
      if (newClass.prototype.__superclass &&
          newClass.prototype[prop] && typeof newClass.prototype[prop] == 'function') {
        newClass.prototype.__superclass.prototype[prop] = wrapParentFunction(prop);
      }
      newClass.prototype[prop] = extObj[prop];
    }
  }

  function wrapParentFunction(superFunc) {
    var sFunc = superFunc;
    return function() { return this._parentClass[sFunc].apply(this._subObject,arguments) }
  }

  function extendClassInterfaces(newClass, interfaces) {
    if (interfaces) {
      interfaces = (interfaces instanceof Array) ? interfaces : [interfaces];
      newClass.__interfaces = newClass.__interfaces || [];
      for (var index in interfaces) {
        newClass.__interfaces.push(interfaces[index]);
      }
    }
  }

  function ensureImplementsInterfaces(testClass) {
    if (testClass.__interfaces) {
      var index;
      var methods = [];
      for (index in testClass.__interfaces) {
        methods = methods.concat(testClass.__interfaces[index].getMethods());
      }
      for (index in methods) {
        if (typeof testClass.prototype[methods[index]] != 'function') {
          throw new Error('Class does not implement interface(s).');
        }
      }
    }
  }

  function setupClassConstants(newClass, constants) {
    if (constants) {
      for (var constKey in constants) {
        newClass[constKey] = constants[constKey];
      }
    }
  }
};

kiso.array = kiso.array || {};

/**
 * @class
 * @description A singleton of extended array functions.
 *
 * Methods of <code>kiso.array</code> allow for cross browser implementation of some common array
 * manipulations.  Each function will execute using native browser array functions in those browsers
 * that implements them and will fall back on javascript implementaions in those browsers that
 * don't.
 */
kiso.array = new (kiso.Class(/** @lends kiso.array */{
  /**
   * @description Tests whether all elements in the array pass the test implemented by the provided function.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param {Function} callback Function to test for each element.
   * @param {Object} [thisObject] Object to use as this when executing callback.
   * @returns True if for every item in the array the callback function returns true.
   */
  every: function() {
    return this._useNativeOrWrapper('every', arguments);
  },

  /**
   * @description Creates a new array with all elements that pass the test implemented by the provided function.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param {Function} callback Function to test each element of the array.
   * @param {Object} [thisObject] Object to use as this when executing callback.
   * @returns A new array
   */
  filter: function() {
    return this._useNativeOrWrapper('filter', arguments);
  },

  /**
   * @description Executes a provided function once per array element.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param {Function} callback Function to execute for each element.
   * @param {Object} [thisObject] Object to use as this when executing callback.
   */
  forEach: function() {
    return this._useNativeOrWrapper('forEach', arguments);
  },

  /**
   * @description Returns the first index at which a given element can be found in the array, or -1 if it is not present.
   *   If the index is greater than or equal to the length of the array, -1 is returned, and the array is not searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param searchElement Element to locate in the array.
   * @param {Intger} [fromIndex=0] The index at which to begin the search.
   * @returns {Integer} The index of the first match or -1 if it is not present.
   */
  indexOf: function() {
    return this._useNativeOrWrapper('indexOf', arguments);
  },

  /**
   * @description Returns the last index at which a given element can be found in the array, or -1 if it is not present.
   *   If the index is greater than or equal to the length of the array, the whole array will be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from back to front. If the calculated index is less than 0, -1 is returned, and the array is not searched.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param searchElement Element to locate in the array.
   * @param {Intger} [fromIndex=theArray.length] The index at which to start searching backwards.
   * @returns {Integer} The index of the first match or -1 if it is not present.
   */
  lastIndexOf: function() {
    return this._useNativeOrWrapper('lastIndexOf', arguments);
  },

  /**
   * @description Creates a new array with the results of calling a provided function on every element in this array.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param {Function} callback A function that produces an element of the new Array from an element of the current one.
   * @param {Object} [thisObject] Object to use as this when executing callback.
   * @returns A new array
   */
  map: function() {
    return this._useNativeOrWrapper('map', arguments);
  },

  /**
   * @description Apply a function simultaneously against two values of the array (from left-to-right) as to reduce it to a single value.
   *   Calls to the callback function are passed four values:
   *   <code>accumulator, value, index, theArray</code> such that <code>theArray[index] == value</code>.
   *   The <code>accumulator</code> on the first call is the <code>initialValue</code> and on all subsequent
   *   calls is the value returned from the last call to the callback function.
   * @param {Array} theArray An array.
   * @param {Function} callback Function to execute on each value in the array.
   * @param [initialValue] The value to use as the first argument to the first call of the callback.
   * @returns The last value returned by the callback function.
   */
  reduce: function() {
    return this._useNativeOrWrapper('reduce', arguments);
  },

  /**
   * @description Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.
   *   Calls to the callback function are passed four values:
   *   <code>accumulator, value, index, theArray</code> such that <code>theArray[index] == value</code>.
   *   The <code>accumulator</code> on the first call is the <code>initialValue</code> and on all subsequent
   *   calls is the value returned from the last call to the callback function.
   * @param {Array} theArray An array.
   * @param {Function} callback Function to execute on each value in the array.
   * @param [initialValue] The value to use as the first argument to the first call of the callback.
   * @returns The last value returned by the callback function.
   */
  reduceRight: function() {
    return this._useNativeOrWrapper('reduceRight', arguments);
  },

  /**
   * @description Tests whether some elements in the array pass the test implemented by the provided function.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param {Function} callback Function to test for each element.
   * @param {Object} [thisObject] Object to use as this when executing callback.
   * @returns True if for any item in the array the callback function returns true.  False only if for every item in the array the callback function returns false.
   */
  some: function() {
    return this._useNativeOrWrapper('some', arguments);
  },

  _useNativeOrWrapper: function(func, args) {
    if (Array.prototype[func]) {
      var theArray = Array.prototype.shift.call(args);
      return Array.prototype[func].apply(theArray, args);
    } else {
      return this['_'+func].apply(this, args);
    }
  },

  _every: function(theArray, callbackFunction, thisContext) {
    if (typeof callbackFunction !== "function") throw new TypeError();
    var length = theArray.length;
    for (var index = 0; index < length; index++) {
      if (index in theArray) {
        if (!callbackFunction.call(thisContext, theArray[index], index, theArray)) break;
      }
    }
    return (index == length);
  },

  _forEach: function(theArray, callbackFunction, thisContext) {
    if (typeof callbackFunction !== "function") throw new TypeError();
    var length = theArray.length;
    for (var index = 0; index < length; index++) {
      callbackFunction.call(thisContext, theArray[index], index, theArray);
    }
  },

  _filter: function(theArray, callbackFunction, thisContext) {
    if (typeof callbackFunction !== "function") throw new TypeError();
    var filteredArray = [];
    var length = theArray.length;
    for (var index = 0; index < length; index++) {
      var valueBeforeCall = theArray[index];
      if (callbackFunction.call(thisContext, theArray[index], index, theArray))
        filteredArray.push(valueBeforeCall);
    }
    return filteredArray;
  },

  _indexOf: function(theArray, searchElement, fromIndex) {
    return this._findIndexOf(theArray, searchElement, fromIndex, +1);
  },

  _lastIndexOf: function(theArray, searchElement, fromIndex) {
    return this._findIndexOf(theArray, searchElement, fromIndex, -1);
  },

  _findIndexOf: function(theArray, searchElement, fromIndex, direction) {
    var length = theArray.length;
    var index = (typeof fromIndex == 'undefined') ? 0 : (
      (fromIndex >= 0) ? fromIndex : Math.max(length + fromIndex, 0)
    );
    while(0 <= index && index < length) {
      if (index in theArray && theArray[index] === searchElement) return index;
      index += direction;
    }
    return -1;
  },

  _map: function(theArray, callbackFunction, thisContext) {
    if (typeof callbackFunction !== "function") throw new TypeError();
    var length = theArray.length;
    var mappedArray = new Array(length);
    for (var index = 0; index < length; index++) {
      mappedArray[index] = callbackFunction.call(thisContext, theArray[index], index, theArray);
    }
    return mappedArray;
  },

  _some: function(theArray, callbackFunction, thisContext) {
    if (typeof callbackFunction !== "function") throw new TypeError();
    var length = theArray.length;
    for (var index = 0; index < length; index++) {
      if (callbackFunction.call(thisContext, theArray[index], index, theArray)) break;
    }
    return (index != length);
  },

  _reduce: function(theArray, callbackFunction, initialValue) {
    return this._reduceFromDirection(theArray, callbackFunction, initialValue, +1);
  },

  _reduceRight: function(theArray, callbackFunction, initialValue) {
    return this._reduceFromDirection(theArray, callbackFunction, initialValue, -1);
  },

  _reduceFromDirection: function(theArray, callbackFunction, initialValue, direction) {
    var length = theArray.length;
    var accumulator;
    var index = (direction == -1) ? length-1 : 0;
    //initialValue = (typeof initialValue != 'undefined') ? initialValue : 0;
    if (typeof initialValue != 'undefined') {
      accumulator = initialValue;
    } else {
      do {
        if (index in theArray) break;
        index += direction;
        if (index < 0 || index >= length) throw new TypeError();
      } while(true);
      accumulator = theArray[index];
      index += direction;
    }
    while (0 <= index && index < length) {
      if (index in theArray)
        accumulator = callbackFunction.call(
          undefined, accumulator, theArray[index], index, theArray
        );
      index += direction;
    }
    return accumulator;
  }
}))();

/** @namespace */
kiso.data = kiso.data || {};

/**
 * @interface
 * @description Interface for a double ended queue.
 * <ul>
 *   <li>pushHead</li>
 *   <li>pushTail</li>
 *   <li>popHead</li>
 *   <li>popTail</li>
 *   <li>getHeadData</li>
 *   <li>getTailData</li>
 * </ul>
 */
kiso.data.IDeque = kiso.Interface([
	'pushHead',
	'pushTail',
	'popHead',
	'popTail',
	'getHeadData',
	'getTailData'
]);

/**
 * @interface
 * @description Methods for a linked list.
 */
kiso.data.ILinkedList = kiso.Interface([
	'addFirst',
	'addLast',
	'addBefore',
	'addAfter',
	'remove',
	'removeFirst',
	'removeLast',
	'getData'
]);

/**
 * @interface
 * @description Methods for a list interator.
 */
kiso.data.IListIterator = kiso.Interface([
	'addAfter',
	'addBefore',
	'hasNext',
	'hasPrevious',
	'getIndex',
	'gotoNext',
	'gotoPrevious',
	'remove',
	'getData',
	'setData'
]);

/**
 * @interface
 * @description Methods for a tree.
 */
kiso.data.ITree = kiso.Interface([
	'addChild',
	'getChild',
	'getChildCount',
	'removeChild',
	'getParent',
	'getData',
	'setData',
	'purgeData',
	'isLeaf',
	'isRoot',
	'isEmpty'
]);

kiso.data.AbstractList = kiso.Class(/** @lends kiso.data.AbstractList.prototype */{
  _last: null,
  _first: null,
  _size: 0,

  /**
   * @constructs
   * @description A base class to build various types of lists from.
   */
  initialize: function() {
    this._last = this._newNode();
    this._first = this._newNode();
    this._last._prev = this._first;
    this._first._next = this._last;
    this._size = 0;
  },

  /**
   * @returns {Integer} The current number of elements in the list.
   */
  getSize: function() {
    return this._size;
  },

  /**
   * @returns {boolean} True if the list has no elements.
   */
  isEmpty: function() {
    return (this._size == 0);
  },

  /**
   * @description Converts the list to an array.
   * Data for each element in the list is <em>not</em> cloned, but instead pushed directly onto the
   * array.
   *
   * @returns {Array}
   */
  toArray: function() {
    var arrayOut = new Array();
    var node = this._first._next;
    while (node != this._last) {
      arrayOut.push(node._data);
      node = node._next;
    }
    return arrayOut;
  },

  _addBefore: function(node, data) {
    var newNode = this._newNode(data);
    newNode._prev = node._prev;
    node._prev = newNode;
    newNode._next = node;
    newNode._prev._next = newNode;
    this._size++;
  },

  _addAfter: function(node, data) {
    var newNode = this._newNode(data);
    newNode._next = node._next;
    node._next = newNode;
    newNode._prev = node;
    newNode._next._prev = newNode;
    this._size++;
  },

  _removeNode: function(node) {
    node._prev._next = node._next;
    node._next._prev = node._prev;
    this._size--;
    return node._data;
  },

  _getNode: function(index) {
    if (index < 0 || index >= this._size) {
      throw new Error('Index out of bounds.');
    }
    var direction = (index*2 > this._size) ? -1 : 1;
    var node = (direction == 1) ? this._first._next : this._last._prev;
    var offset = (direction == 1) ? index : (this._size - index - 1);
    while (offset > 0) {
      node = (direction == 1) ? node._next : node._prev;
      offset--;
    }
    return node;
  },

  _newNode: function(nodeData) {
    return {
      _data: nodeData,
      _next: null,
      _prev: null
    };
  }
});

/**
 * @class
 * @description A double ended queue
 * @augments kiso.data.AbstractList
 */
kiso.data.Deque = kiso.Class(
  {
    parent: kiso.data.AbstractList,
    interfaces: kiso.data.IDeque
  },
  /** @lends kiso.data.Deque.prototype */
  {
    /**
     * @description Push a new element on to the head of the list.
     * @param data The data for the new element.
     */
    pushHead: function(data) {
      this._addBefore(this._last, data);
    },

    /**
     * @description Push a new element on to the tail of the list.
     * @param data The data for the new element.
     */
    pushTail: function(data) {
      this._addAfter(this._first, data);
    },

    /**
     * @description Pop the last element off the head of the list.
     * @returns The data of the last element.
     * @throws A error when the list is empty.
     */
    popHead: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot pop head on empty Deque');
      }
      return this._removeNode(this._last._prev);
    },

    /**
     * @description Pop the last element off the tail of the list.
     * @returns The data of the last element.
     * @throws A error when the list is empty.
     */
    popTail: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot pop tail on empty Deque');
      }
      return this._removeNode(this._first._next);
    },

    /**
     * @description Retrieves the data of the indexed element starting at the head of the list.  Does not alter the list.
     * @param {integer} index The element index (zero based) from the head of the list.
     * @returns The data from the specified element.
     *
     */
    getHeadData: function(index) {
      return this._getNode(this._size-index-1)._data;
    },

    /**
     * @description Retrieves the data of the indexed element starting at the tail of the list.  Does not alter the list.
     * @param {integer} index The element index (zero based) from the head of the list.
     * @returns The data from the specified element.
     *
     */
    getTailData: function(index) {
      return this._getNode(index)._data;
    }
  }
);

/**
 * @class
 * @description A linked list.
 * @augments kiso.data.AbstractList
 */
kiso.data.LinkedList = kiso.Class(
  {
    parent: kiso.data.AbstractList,
    interfaces: kiso.data.ILinkedList
  },
  /** @lends kiso.data.LinkedList.prototype */
  {
    /**
     * @description Add a new element to the front of the list.
     * @param data The data for the new first element.
     */
    addFirst: function(data) {
      this._addAfter(this._first, data);
    },

    /**
     * @description Add a new element to the end of the list.
     * @param data The data for the new last element.
     */
    addLast: function(data) {
      this._addBefore(this._last, data);
    },

    /**
     * @description Add a new element just before the indexed element.
     * @param {Integer} index The zero based offset from the front of the list.
     * @param data The data for the new element.
     */
    addBefore: function(index, data) {
      this._addBefore(this._getNode(index), data);
    },

    /**
     * @description Add a new element just after the indexed element.
     * @param {Integer} index The zero based offset from the front of the list.
     * @param data The data for the new element.
     */
    addAfter: function(index, data) {
      this._addAfter(this._getNode(index), data);
    },

    /**
     * @description Remove the specfied element.
     * @param {Integer} index The zero based offset from the front of the list.
     * @throws A an error if the index is out of bounds.
     */
    remove: function(index) {
      return this._removeNode(this._getNode(index));
    },

    /**
     * @description Remove the first element in the list.
     * @throws A an error if the list is empty.
     */
    removeFirst: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot remove first from empty LinkedList');
      }
      return this._removeNode(this._first._next);
    },

    /**
     * @description Remove the last element in the list.
     * @throws A an error if the list is empty.
     */
    removeLast: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot remove last from empty LinkedList');
      }
      return this._removeNode(this._last._prev);
    },

    /**
     * @description Get the data of an element without altering the list.
     * @param {Integer} index The zero base offset from the front of the list.
     * @returns The data from the specified element.
     * @throws A an error if the list is empty.
     */
    getData: function(index) {
      return this._getNode(index)._data;
    }
  }
);

kiso.data.ListIterator = kiso.Class(
  {
    constants: /** @lends kiso.data.ListIterator */ {
      /** @constant */
      STARTATFIRST: 0,
      /** @constant */
      STARTATLAST: 1
    }
  },
  /** @lends kiso.data.ListIterator.prototype */
  {
    _list: null,
    _currentNode: null,
    _index: null,

    /**
     * @constructs
     * @description Creates a new iterator for the given list and in the specified direction.
     * @param {List} list The list to iterator over.
     * @param {STARTATFIRST|STARTATLAST} direction Which end of the list to start from.
     * @returns {ListIterator} A new list iterator.
     */
    initialize: function(list, direction) {
      if (list.isEmpty()) {
        throw new Error('Cannot iterate on empty list');
      }
      this._list = list;
      this._currentNode = (direction == kiso.data.ListIterator.STARTATLAST) ?
        this._list._last._prev : this._list._first._next;
      this._index = (direction == kiso.data.ListIterator.STARTATLAST) ?
        this._list._size - 1 : 0;
    },

    /**
     * @description Adds a new element to the list after the current element.
     * @param data The data of the new element.
     */
    addAfter: function(data) {
      this._list._addAfter(this._currentNode, data);
    },

    /**
     * @description Adds a new element to the list before the current element.
     * @param data The data of the new element.
     */
    addBefore: function(data) {
      this._list._addBefore(this._currentNode, data);
      this._index++;
    },

    /**
     * @description Returns whether there is a next element.
     * @returns True if the current element has an element after it.
     */
    hasNext: function() {
      return (this._currentNode._next != this._list._last);
    },

    /**
     * @description Returns whether there is a previous element.
     * @returns True if the current element has an element before it.
     */
    hasPrevious: function() {
      return (this._currentNode._prev != this._list._first);
    },

    /**
     * @description Get the index of the current element.
     * @returns The zero based index from the front of the list of the current element.
     */
    getIndex: function() {
      return this._index;
    },

    /**
     * @description Moves the ListIterator to the next element in the list.
     * @throws An error if there is no next element.
     */
    gotoNext: function() {
      if (this.hasNext()) {
        this._currentNode = this._currentNode._next;
        this._index++;
      } else {
        throw new Error('No such element');
      }
    },

    /**
     * @description Moves the ListIterator to the previous element in the list.
     * @throws An error if there is no previous element.
     */
    gotoPrevious: function() {
      if (this.hasPrevious()) {
        this._currentNode = this._currentNode._prev;
        this._index--;
      } else {
        throw new Error('No such element');
      }
    },

    /**
     * @description Removes the current element from the list.
     */
    remove: function() {
      var oldNode = this._currentNode;
      if (this.hasNext()) {
        this.gotoNext();
      } else if (this.hasPrevious()) {
        this.gotoPrevious();
      } else {
        this._currentNode = null;
      }
      this._list._removeNode(oldNode);
    },

    /**
     * @description Gets the data of the current element without altering the list.
     * @returns The data for the current element.
     */
    getData: function() {
      return this._currentNode._data;
    },

    /**
     * @description Sets the data of the current element.
     * @param data The new data for the current element.
     */
    setData: function(data) {
      this._currentNode._data = data;
    }
  }
);
/**
 * @description A Tree.
 * This class will soon be reworked into an AbstractTree and some derived Tree classes, so I'm
 * waiting to document till after that's done.
 */
kiso.data.Tree = kiso.Class(
	{
		interfaces: kiso.data.ITree
	},
	{
		_data: null,
		_parentTree: null,
		_childTrees: null,

		initialize: function() {
			this._childTrees = new Array();
		},

		addChild: function(tree) {
			this._childTrees.push(tree);
			tree._parentTree = this;
		},

		getChildCount: function() {
			return this._childTrees.length;
		},

		getChild: function(index) {
			if (index < 0 || index >= this._childTrees.length) {
				throw new Error('Index out of bounds');
			} else {
				return this._childTrees[index];
			}
		},

		getParent: function() {
			return this._parentTree;
		},

		isLeaf: function() {
			return (this._childTrees.length == 0);
		},

		isRoot: function() {
			return (this._parentTree === null);
		},

		removeChild: function(indexOrTree) {
			if (indexOrTree instanceof kiso.data.Tree) {
				this._removeChildByTree(indexOrTree);
			} else {
				this._removeChildByIndex(indexOrTree);
			}
		},

		_removeChildByTree: function(tree) {
			for (var i=0; i<this._childTrees.length; i++) {
				if (tree == this._childTrees[i]) {
					this._removeChildByIndex(i);
				}
			}
		},

		_removeChildByIndex: function(index) {
			if (index < 0 || index >= this._childTrees.length) {
				throw new Error('Index out of bounds');
			} else {
				this._childTrees.splice(index,1);
			}
		},

		getData: function() {
			return this._data;
		},

		setData: function(data) {
			this._data = data;
		},

		purgeData: function() {
			this._data = null;
		},

		isEmpty: function() {
			return (this._data == null);
		}
	}
);

kiso.geom = kiso.geom || {};

kiso.geom.IConvexHull = kiso.Interface([
	'setPoints',
	'getHullIndexes',
	'build'
]);

kiso.geom.IPolyApproximator = kiso.Interface([
	'setPoints',
	'setTolerance',
	'getTolerance',
	'build',
	'getIndexes'
]);

kiso.geom.SimplePolyConvexHull = kiso.Class(
	{
		interfaces: kiso.geom.IConvexHull,
		constants: {
			_AT_HEAD: 0,
			_AT_TAIL: 1,
			FIRST2LAST: 2,
			LAST2FIRST: 3
		}
	},
	{
		_simplePoly: null,
		_hullIndexes: null,
		_direction: null,

		initialize: function(simplePoly, direction) {
			this.setPoints(simplePoly);
			this.setDirection(direction);
		},

		setPoints: function(simplePoly) {
			this._simplePoly = simplePoly.map(function(point) { return point.clone(); });
			this._hullIndexes = null;
		},

		getPoints: function() {
			return this._simplePoly;
		},

		setDirection: function(direction) {
			this._direction =
				(direction == kiso.geom.SimplePolyConvexHull.LAST2FIRST) ?
				kiso.geom.SimplePolyConvexHull.LAST2FIRST :
				kiso.geom.SimplePolyConvexHull.FIRST2LAST;
		},

		getHullIndexes: function() {
			return (this._hullIndexes) ? this._hullIndexes.toArray() : null;
		},

		build: function() {
			if (this._simplePoly && this._simplePoly.length >= 3) {
				this._initializeHullIndexes();
				this._expandHull();
			}
		},

		_initializeHullIndexes: function() {
			this._hullIndexes = new kiso.data.Deque();
			var indexes, point0, point1, point2;
			if (this._direction == kiso.geom.SimplePolyConvexHull.LAST2FIRST) {
				point0 = this._simplePoly.length-1;
				point1 = point0-1;
				point2 = point1-1;
			} else {
				point0 = 0;
				point1 = 1;
				point2 = 2;
			}
			if (this._simplePoly[point2].isLeftOfVector(
					this._simplePoly[point0], this._simplePoly[point1]
				)) {
				indexes = [point2, point0, point1, point2];
			} else {
				indexes = [point2, point1, point0, point2];
			}
			for (var i = 0; i < 4; i++) {
				this._hullIndexes.pushHead(indexes[i]);
			}
		},

		_expandHull: function() {
			var index, increment;
			if (this._direction == kiso.geom.SimplePolyConvexHull.LAST2FIRST) {
				index = this._simplePoly.length-4;
				increment = -1;
			} else {
				index = 3;
				increment = 1;
			}
			for (; (0 <= index && index < this._simplePoly.length); index += increment) {
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull._AT_HEAD);
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull._AT_TAIL);
			}
		},

		_maintainConvexity: function(index, atEnd) {
			var pushCurrentPoint = false;
			var popHullPoint = true;
			while (popHullPoint) {
				popHullPoint = this._isPointLeftOfVector(index, atEnd);
				if (popHullPoint) {
					this._popHullPoint(atEnd);
					pushCurrentPoint = true;
				}
			}
			if (pushCurrentPoint) {
				this._pushHullPoint(index);
			}
		},

		_isPointLeftOfVector: function(index, atEnd) {
			var atHead = (atEnd == kiso.geom.SimplePolyConvexHull._AT_HEAD);
			var index0 = atHead ? this._hullIndexes.getHeadData(1) : this._hullIndexes.getTailData(0);
			var index1 = atHead ? this._hullIndexes.getHeadData(0) : this._hullIndexes.getTailData(1);
			return !this._simplePoly[index].isLeftOfVector(
				this._simplePoly[index0], this._simplePoly[index1]
			);
		},

		_popHullPoint: function(atEnd) {
			if (atEnd == kiso.geom.SimplePolyConvexHull._AT_HEAD) {
				return this._hullIndexes.popHead()
			}	else {
				return this._hullIndexes.popTail();
			}
		},

		_pushHullPoint: function(index, atEnd) {
			if (atEnd != kiso.geom.SimplePolyConvexHull._AT_HEAD) this._hullIndexes.pushTail(index);
			if (atEnd != kiso.geom.SimplePolyConvexHull._AT_TAIL) this._hullIndexes.pushHead(index);
		}
	}
);

kiso.geom.SimplePolyApproximatorDP = kiso.Class(
	{
		interfaces: kiso.geom.IPolyApproximator
	},
	{
		_simplePoly: null,
		_subSections: null,
		_stopTolerance: null,
		_stopToleranceSquared: null,
		_iterator: null,

		initialize: function(simplePoly) {
			this.setPoints(simplePoly);
		},

		setPoints: function(simplePoly) {
			this._simplePoly = simplePoly.map(function(point) {return point.clone();});
		},

		build: function() {
			this._initializeSections();
			this._iterator = new kiso.data.ListIterator(this._subSections);
			var doNext = true;
			while(doNext) {
				this._simplifyCurrentSection();
				doNext = this._iterator.hasNext();
				if (doNext) this._iterator.gotoNext();
			}
		},

		_initializeSections: function() {
			var section = this._newSection();
			section.firstPoint = 0;
			section.lastPoint = this._simplePoly.length-1;
			this._subSections = new kiso.data.LinkedList();
			this._subSections.addFirst(section);
		},

		_simplifyCurrentSection: function() {
			var section = this._iterator.getData();
			while (section.distanceSquared == null) {
				this._findFarthestInCurrentSection();
				if (section.distanceSquared > this._stopToleranceSquared) {
					this._seperateCurrentSection();
				}
				section = this._iterator.getData();
			}
		},

		_seperateCurrentSection: function() {
			var sectionLeft = this._iterator.getData();
			var sectionRight = this._newSection();
			sectionRight.firstPoint = sectionLeft.farthestPoint;
			sectionRight.lastPoint = sectionLeft.lastPoint;
			sectionLeft.lastPoint = sectionLeft.farthestPoint;
			sectionLeft.farthestPoint = null;
			sectionLeft.distanceSquared = null;
			this._iterator.addAfter(sectionRight);
		},

		_findFarthestInCurrentSection: function() {
			var section = this._iterator.getData();
			var point0 = this._simplePoly[section.firstPoint];
			var point1 = this._simplePoly[section.lastPoint];
			var deltaX = point1.getX() - point0.getX();
			var deltaY = point1.getY() - point0.getY();
			var numeratorMax = 0;
			var numerator, indexMax;
			for (var index = section.firstPoint+1; index < section.lastPoint; index++) {
				numerator = Math.abs(
					(deltaX * (point0.getY() - this._simplePoly[index].getY())) +
					(deltaY * (this._simplePoly[index].getX() - point0.getX()))
				);
				if (numerator > numeratorMax) {
					numeratorMax = numerator;
					indexMax = index;
				}
			}
			section.farthestPoint = indexMax;
			section.distanceSquared = numeratorMax*numeratorMax/(deltaX*deltaX + deltaY*deltaY);
		},

		_newSection: function() {
			return {
				firstPoint: null,
				lastPoint: null,
				farthestPoint: null,
				distanceSquared: null
			};
		},

		setTolerance: function(tolerance) {
			this._stopTolerance = tolerance;
			this._stopToleranceSquared = tolerance*tolerance;
		},

		getTolerance: function() {
			return this._stopTolerance;
		},

		getIndexes: function() {
			var iterator = new kiso.data.ListIterator(this._subSections);
			var doNext = true;
			var sectionArray = [];
			while(doNext) {
				sectionArray.push(iterator.getData().firstPoint);
				doNext = iterator.hasNext();
				if (doNext) iterator.gotoNext();
			}
			sectionArray.push(iterator.getData().lastPoint);
			return sectionArray;
		}
	}
);

kiso.geom.Point = kiso.Class({
	_x: 0,
	_y: 0,
	
	initialize: function(xOrPoint, y) {
		if (arguments.length == 2) {
			this.setXY(xOrPoint, y);
		} else if (arguments.length == 1) {
			this.setXY(xOrPoint._x, xOrPoint._y);
		} else {
			this.setXY(0, 0);
		}
	},
	
	setXY: function(x, y) {
		this._x = x;
		this._y = y;
	},
	
	getX: function() {
		return this._x;
	},
	
	getY: function() {
		return this._y;
	},
	
	clone: function() {
		return new kiso.geom.Point(this);
	},
	
	equals: function(point) {
		return (this._x === point._x & this._y === point._y);
	},
	
	isLeftOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) >= 
			(point1._x - this._x)*(point0._y - this._y)
		);
	},
	
	//TODO: Check formulas for point being on line (add flag to include/exclude case?)
	
	isRightOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) <=
			(point1._x - this._x)*(point0._y - this._y)
		);
	},
		
	slopeTo: function(point) {
		return (point._y - this._y)/(point._x - this._x);
	},

	distanceSquaredTo: function(point) {
		return (point._x - this._x)*(point._x - this._x) + (point._y - this._y)*(point._y - this._y);
	},
	
	distanceTo: function(point) {
		return Math.sqrt(this.distanceSquaredTo(point));
	},
	
	distanceSquaredToLine: function(point0, point1) {
		var distance;
		if (point0._x == point1._x && point0._y == point1._y) {
			distance = this.distanceSquaredTo(point0);
		} else {
			distance = (point1._x - point0._x)*(point0._y - this._y) - 
				(point0._x - this._x)*(point1._y - point0._y);
			distance = distance*distance/point0.distanceSquaredTo(point1);
		}
		return distance;
	},
	
	distanceToLine: function(point0, point1) {
		return Math.sqrt(this.distanceSquaredToLine(point0, point1));
	}
});
kiso.geom.ReducibleSimplePolyConvexHull = kiso.Class(
	{
		parent: kiso.geom.SimplePolyConvexHull,
		constants: {
			_POP_OPERATION_AT_HEAD: 10,
			_POP_OPERATION_AT_TAIL: 11,
			_PUSH_OPERATION: 12
		}
	},
	{
		_operationStack: [],

		build: function() {
			this._operationStack = [];
			this.superclass.build();
		},

		getOperationStack: function() {
			return this._operationStack;
		},

		_initializeHullIndexes: function() {
			this.superclass._initializeHullIndexes();
			this._operationStack.push({
				index: this._hullIndexes.getHeadData(0),
				operation: kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION
			});
		},

		_popHullPoint: function(atEnd) {
			this._operationStack.push({
				index: this.superclass._popHullPoint(atEnd),
				operation:
					(atEnd == kiso.geom.ReducibleSimplePolyConvexHull._AT_HEAD) ?
					kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_HEAD :
					kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_TAIL
			});
		},

		_pushHullPoint: function(index) {
			this.superclass._pushHullPoint(index);
			this._operationStack.push({
				index: index,
				operation: kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION
			});
		},

		reduceTo: function(polyEndPoint) {
			var operationEndPoint = this._findPushOperation(polyEndPoint);
			this._reverseOperations(operationEndPoint);
			this._reduceSimplePoly(polyEndPoint);
		},

		_findPushOperation: function(polyEndPoint) {
			var operationEndPoint = this._operationStack.length - 1;
			for (var index = operationEndPoint; index >= 0; index--) {
				if (this._operationStack[index].operation ==
						kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION) {
					operationEndPoint = index;
					if (this._indexOrderInDirectionOfHull(
							this._operationStack[index].index, polyEndPoint)) {
						break;
					}
				}
			}
			return operationEndPoint;
		},

		_indexOrderInDirectionOfHull: function(index0, index1) {
			return (
				(
					(this._direction == kiso.geom.ReducibleSimplePolyConvexHull.FIRST2LAST)
						&&
					(index1 >= index0)
				) || (
					(this._direction == kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST)
						&&
					(index1 <= index0)
				)
			);
		},

		_reverseOperations: function(operationEndPoint) {
			var operation;
			for (var i = this._operationStack.length-1; i > operationEndPoint; i--) {
				operation = this._operationStack.pop();
				if (operation.operation == kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION) {
					this.superclass._popHullPoint(kiso.geom.ReducibleSimplePolyConvexHull._AT_HEAD);
					this.superclass._popHullPoint(kiso.geom.ReducibleSimplePolyConvexHull._AT_TAIL);
				} else if (operation.operation ==
						kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_HEAD) {
					this.superclass._pushHullPoint(
						operation.index,
						kiso.geom.ReducibleSimplePolyConvexHull._AT_HEAD
					);
				} else if (operation.operation ==
						kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_TAIL) {
					this.superclass._pushHullPoint(
						operation.index,
						kiso.geom.ReducibleSimplePolyConvexHull._AT_TAIL
					);
				}
			}
		},

		_reduceSimplePoly: function(polyEndPoint) {
			if (this._direction == kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST) {
				this._simplePoly.splice(0, polyEndPoint);
				this._reindexHull(polyEndPoint);
			} else {
				this._simplePoly.splice(polyEndPoint+1);
			}
		},

		_reindexHull: function(polyEndPoint) {
			if (this._direction == kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST) {
				var iterator = new kiso.data.ListIterator(this._hullIndexes);
				while(1) {
					iterator.setData(iterator.getData() - polyEndPoint);
					if (iterator.hasNext()) {
						iterator.gotoNext();
					} else {
						break;
					}
				}
			}
		}
	}
);
kiso.geom.SimplePolyApproximatorHS = kiso.Class(
	{
		parent: kiso.geom.SimplePolyApproximatorDP
	},
	{
		_initializeSections: function() {
			this.superclass._initializeSections();
			var section = this._subSections.getData();
			this._updateSectionHulls(section);
		},

		_seperateCurrentSection: function() {
			this.superclass._seperateCurrentSection();
			var sectionLeft, sectionRight;
			sectionLeft = this._iterator.getData();
			this._iterator.gotoNext();
			sectionRight = this._iterator.getData();
			this._iterator.gotoPrevious();
			sectionRight.lastToFirstHull = sectionLeft.lastToFirstHull;
			sectionLeft.lastToFirstHull = null;
			this._updateSectionHulls(sectionLeft);
			this._updateSectionHulls(sectionRight);
		},

		_updateSectionHulls: function(section) {
			var sectionSize = section.lastPoint - section.firstPoint;
			if (sectionSize > 6) {
				if (section.firstToLastHull) {
					section.firstToLastHull.reduceTo(sectionSize);
				} else {
					section.firstToLastHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint+1)
					);
					section.firstToLastHull.build();
				}
				if (section.lastToFirstHull) {
					section.lastToFirstHull.reduceTo(section.lastPoint - section.firstPoint);
				} else {
					section.lastToFirstHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint+1),
						kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST
					);
					section.lastToFirstHull.build();
				}
			} else {
				section.lastToFirstHull = null;
				section.firstToLastHull = null;
			}
		},

		_findFarthestInCurrentSection: function() {
			var section = this._iterator.getData();
			if ((section.lastPoint - section.firstPoint) > 6) {
				this._useHullToFindFarthest();
			} else {
				this.superclass._findFarthestInCurrentSection();
			}
		},

		_useHullToFindFarthest: function() {
			var section = this._iterator.getData();
			var point0 = this._simplePoly[section.firstPoint];
			var point1 = this._simplePoly[section.lastPoint];
			var hullData = {
				point0: point0,
				point1: point1,
				vectorX: point1.getX() - point0.getX(),
				vectorY: point1.getY() - point0.getY(),
				hullIndexes: section.firstToLastHull.getHullIndexes(),
				distanceSquared: null,
				farthestPoint: null
			};
			for (var i=0; i<hullData.hullIndexes.length; i++) {
				hullData.hullIndexes[i] += section.firstPoint;
			}
			this._bruteSearchHull(hullData);
			if (hullData.hullIndexes.length > 6) {
				this._binarySearchHull(hullData);
			} else {
				this._bruteSearchHull(hullData);
			}
			section.farthestPoint = hullData.farthestPoint;
			section.distanceSquared = hullData.distanceSquared;
		},

		_binarySearchHull: function(hullData) {
			var edgeLow, edgeHigh, edgeMid, edgeFar1, edgeFar2, slopeSignBase, slopeSignBreak;
			edgeLow = 0;
			edgeHigh = hullData.hullIndexes.length-1;
			slopeSignBase = this._computeSlopeSign(hullData, edgeLow, edgeLow+1);
			do {
				edgeMid = Math.floor((edgeLow + edgeHigh)/2);
				slopeSignBreak = this._computeSlopeSign(hullData, edgeMid, edgeMid+1);
				if (slopeSignBase == slopeSignBreak) {
					if (slopeSignBase == this._computeSlopeSign(hullData, edgeLow, edgeMid+1)) {
						edgeLow = edgeMid + 1;
					} else {
						edgeHigh = edgeMid;
					}
				}
			} while (slopeSignBase == slopeSignBreak);
			edgeFar1 = edgeMid;
			edgeFar2 = edgeMid;
			while (edgeLow < edgeFar1) {
				edgeMid = Math.floor((edgeLow + edgeFar1)/2);
				if (slopeSignBase == this._computeSlopeSign(hullData, edgeMid, edgeMid+1)) {
					edgeLow = edgeMid + 1;
				} else {
					edgeFar1 = edgeMid;
				}
			}
			while (edgeFar2 < edgeHigh) {
				edgeMid = Math.floor((edgeFar2 + edgeHigh)/2);
				if (slopeSignBase == this._computeSlopeSign(hullData, edgeMid, edgeMid+1)) {
					edgeHigh = edgeMid;
				} else {
					edgeFar2 = edgeMid + 1;
				}
			}
			edgeFar2--;
			this._compareFarthestCandidate(hullData, edgeFar1);
			this._compareFarthestCandidate(hullData, edgeFar2);
		},

		_computeSlopeSign: function(hullData, index0, index1) {
			var point0 = this._simplePoly[hullData.hullIndexes[index0]];
			var point1 = this._simplePoly[hullData.hullIndexes[index1]];
			var dotProd = hullData.vectorX*(point1.getX() - point0.getX()) +
				hullData.vectorY*(point1.getY() - point0.getY());
			return dotProd < 0 ? -1 : 1;
		},

		_bruteSearchHull: function(hullData) {
			for (var i=0; i<hullData.hullIndexes.length; i++) {
				this._compareFarthestCandidate(hullData, i);
			}
		},

		_compareFarthestCandidate: function(hullData, edgeIndex) {
			var distanceSquared = this._simplePoly[hullData.hullIndexes[edgeIndex]]
				.distanceSquaredToLine(hullData.point0, hullData.point1);
			if (hullData.distanceSquared == null ||
					(distanceSquared > hullData.distanceSquared) ||
					(
						(distanceSquared == hullData.distanceSquared) &&
						(hullData.hullIndexes[edgeIndex] < hullData.farthestPoint)
					)) {
				hullData.distanceSquared = distanceSquared;
				hullData.farthestPoint = hullData.hullIndexes[edgeIndex];
			}
		},

		_newSection: function() {
			return {
				firstPoint: null,
				lastPoint: null,
				farthestPoint: null,
				distanceSquared: null,
				firstToLastHull: null,
				lastToFirstHull: null
			};
		}
	}
);

kiso.ui = kiso.ui || {};
kiso.ui.CookieAdapter = kiso.Class({
	_MS_PER_DAY: 60 * 60 * 24 * 1000,

	setCookie: function(cookieName, cookieValue, daysOrObject) {
		var expireDate = this._buildExpireDate(daysOrObject);
  	this._setDocumentCookie(
      cookieName + '=' + escape(cookieValue) +
  		';expires=' + expireDate +
      ((daysOrObject.path) ? ';path=' + daysOrObject.path : '') +
      ((daysOrObject.domain) ? ';domain=' + daysOrObject.domain : '') +
      ((daysOrObject.secure) ? ';secure' : '')
    );
  },
  
  _buildExpireDate: function(daysOrObject) {
		var msTillExpire = 0;
		var utcExpire = null;
  	if (typeof daysOrObject == 'object') {
			if (daysOrObject.utc) {
				utcExpire = daysOrObject.utc;
			} else {
				msTillExpire = this._getMsTillExpire(daysOrObject);
			}
		} else {
			msTillExpire = daysOrObject * this._MS_PER_DAY;
		}
		var expireDate = new Date();
		expireDate.setTime(utcExpire ? utcExpire : (expireDate.getTime() + msTillExpire));
		expireDate = expireDate.toUTCString();
		return expireDate;
	},
	
	_getMsTillExpire: function(daysOrObject) {
		var seconds = daysOrObject.seconds || 0;
		var minutes = daysOrObject.minutes || 0;
		var hours = daysOrObject.hours || 0;
		var days = daysOrObject.days || 0;
		return ((((((days*24) + hours)*60) + minutes)*60) + seconds)*1000; 
	},
	
  getCookie: function(cookieName) {
  	var documentCookie = this._getDocumentCookie();
		var cookieValue = '';
  	if (documentCookie.length > 0) {
  		var cookieStart = documentCookie.indexOf(cookieName + '=');
  		if (cookieStart != -1) {
				cookieStart = cookieStart + cookieName.length + 1;
	      var cookieStop = documentCookie.indexOf(';', cookieStart);
	      if (cookieStop == -1) cookieStop = documentCookie.length;
	      cookieValue = unescape(documentCookie.substring(cookieStart, cookieStop));
      }
		}
    return cookieValue;
  },
  
  isCookieSet: function(cookieName) {
  	var cookieValue = this.getCookie(cookieName);
  	return (cookieValue != null && cookieValue != '');
	},
	
	clearCookie: function(cookieName) {
  	this.setCookie(cookieName, null, -1);
  },
  
  _setDocumentCookie: function(cookieDef) {
  	document.cookie = cookieDef;
  },
  
  _getDocumentCookie: function() {
  	return document.cookie;
  }
});

