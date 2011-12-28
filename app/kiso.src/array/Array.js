/**
 * @class
 * @description A singleton of extended array functions.
 *
 * Methods of <code>kiso.array</code> allow for cross browser implementation of some common array
 * manipulations.  Each method will execute using native browser array functions in those browsers
 * that implement them and will fall back on javascript implementaions in those browsers that
 * do not.
 */
kiso.array = new (kiso.Class(/** @lends kiso.array */{
  /**
   * @description Tests whether all elements in the array pass the test implemented by the provided function.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param {Function} callback Function to test for each element.
   * @param {Object} [thisObject] Object to use as this when executing callback.
   * @returns {Boolean} True if for every item in the array the callback function returns true.
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
   * @returns {Array} A new array
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
   * @function
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
   * @function
   * @description Creates a new array with the results of calling a provided function on every element in this array.
   *   Calls to the callback function are passed three values:
   *   <code>value, index, theArray</code> such that <code>theArray[index] == value</code>
   * @param {Array} theArray An array.
   * @param {Function} callback A function that produces an element of the new Array from an element of the current one.
   * @param {Object} [thisObject] Object to use as this when executing callback.
   * @returns {Array} A new array
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
   * @param {*} [initialValue] The value to use as the first argument to the first call of the callback.
   * @returns {*} The last value returned by the callback function.
   */
  reduce: function() {
    return this._useNativeOrWrapper('reduce', arguments);
  },

  /**
   * @description Apply a function simultaneously against two values of the array (from
   *   right-to-left) as to reduce it to a single value.
   *   Calls to the callback function are passed four values:
   *   <code>accumulator, value, index, theArray</code> such that <code>theArray[index] == value</code>.
   *   The <code>accumulator</code> on the first call is the <code>initialValue</code> and on all subsequent
   *   calls is the value returned from the last call to the callback function.
   * @param {Array} theArray An array.
   * @param {Function} callback Function to execute on each value in the array.
   * @param {*} [initialValue] The value to use as the first argument to the first call of the callback.
   * @returns {*} The last value returned by the callback function.
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
   * @returns {Boolean} True if for any item in the array the callback function returns true.  False only if for every item in the array the callback function returns false.
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
