kiso.array.Array = kiso.Class({
	_array: null,

	initialize: function(useArray) {
		this._array = (useArray)? useArray : new Array();
	},

	concat: function() {
		return this._array.concat.apply(this._array, arguments);
	},

	join: function() {
		return this._array.join.apply(this._array, arguments);
	},

	pop: function() {
		return this._array.pop();
	},

	push: function() {
		this._array.push.apply(this._array, arguments);
		return this;
	},

	remove: function() {
		this._array.splice.apply(this._array, arguments);
		return this;
	},

	reverse: function() {
		this._array.reverse();
		return this;
	},

	shift: function() {
		return this._array.shift();
	},

	sort: function() {
		this._array.sort.apply(this._array, arguments);
		return this;
	},

	slice: function() {
		return this._array.slice.apply(this._array, arguments);
	},

	splice: function() {
		return this._array.splice.apply(this._array, arguments);
	},

	toString: function() {
		return this._array.toString();
	},

	unshift: function() {
		this._array.unshift.apply(this._array, arguments);
		return this;
	},

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	every: function() {
		return this._useNativeOrWrapper('every', arguments);
	},

	filter: function() {
		return this._useNativeOrWrapper('filter', arguments);
	},

	forEach: function() {
		return this._useNativeOrWrapper('forEach', arguments);
	},

	indexOf: function() {
		return this._useNativeOrWrapper('indexOf', arguments);
	},

	lastIndexOf: function() {
		return this._useNativeOrWrapper('lastIndexOf', arguments);
	},

	map: function() {
		return this._useNativeOrWrapper('map', arguments);
	},

	reduce: function() {
		return this._useNativeOrWrapper('reduce', arguments);
	},

	reduceRight: function() {
		return this._useNativeOrWrapper('reduceRight', arguments);
	},

	some: function() {
		return this._useNativeOrWrapper('some', arguments);
	},

	_useNativeOrWrapper: function(func, args) {
		if (Array.prototype[func]) {
			return this._array[func].apply(this._array, args);
		} else {
			return this['_'+func].apply(this, args);
		}
	},

	_indexOf: function(searchElement, fromIndex) {
		this._findIndexOf(searchElement, fromIndex, +1);
	},

	_lastIndexOf: function(searchElement, fromIndex) {
		this._findIndexOf(searchElement, fromIndex, -1);
	},

	_findIndexOf: function(searchElement, fromIndex, direction) {
		var length = this._array.length;
		var index = (fromIndex >= 0) ? fromIndex : Math.max(length + fromIndex, 0);
		while(0 <= index && index < length) {
			if (index in this._array && this._array[index] === searchElement) return index;
			index += direction;
		}
		return -1;
	},

	_filter: function(callbackFunction, thisContext) {
		if (typeof callbackFunction !== "function")
			throw new TypeError();
		var filteredArray = [];
		this._eachWhileTrue(function(index) {
			var valueBeforeCall = this._array[index];
			if (callbackFunction.call(thisContext, this._array[index], index, this._array))
				filteredArray.push(valueBeforeCall);
			return true;
		});
		return filteredArray;
	},

	_forEach: function(callbackFunction, thisContext) {
		if (typeof callbackFunction !== "function")
			throw new TypeError();
		this._eachWhileTrue(function(index) {
			callbackFunction.call(thisContext, this._array[index], index, this._array);
			return true;
		});
	},

	_every: function(callbackFunction, thisContext) {
		if (typeof callbackFunction !== "function")
			throw new TypeError();
		var firstFalseIndex = this._eachWhileTrue(function(index) {
			return callbackFunction.call(thisContext, this._array[index], index, this._array);
		});
		return (firstFalseIndex == -1);
	},

	_map: function(callbackFunction, thisContext) {
		if (typeof callbackFunction !== "function")
			throw new TypeError();
		var mappedArray = new Array(this._array.length);
		this._eachWhileTrue(function(index) {
			mappedArray[index] = callbackFunction.call(
				thisContext, this._array[index], index, this._array
			);
			return true;
		});
		return mappedArray;
	},

	_some: function(callbackFunction, thisContext) {
		if (typeof callbackFunction !== "function")
			throw new TypeError();
		var firstTrueIndex = this._eachWhileTrue(function(index) {
			 return !callbackFunction.call(thisContext, this._array[index], index, this._array);
		});
		return (firstTrueIndex != -1);
	},

	_reduce: function(callbackFunction, initialValue) {
		this._reduceFromDirection(callbackFunction, initialValue, +1);
	},

	_reduceRight: function(callbackFunction, initialValue) {
		this._reduceFromDirection(callbackFunction, initialValue, -1);
	},

	_reduceFromDirection: function(callbackFunction, initialValue, direction) {
		var length = this._array.length;
		var accumulator;
		var index = (direction == -1) ? length-1 : 0;
		if (initialValue) {
			accumulator = initialValue;
		} else {
			do {
				if (index in this._array) break;
				index += direction;
				if (index < 0 || index >= length) throw new TypeError();
			} while(true);
			accumulator = this._array[index];
		}
		while (0 <= index && index < length) {
			if (index in this._array)
				accumulator = callbackFunction.call(
					undefined, accumulator, this._array[index], index, this._array
				);
			index += direction;
		}
		return -1;
	},

	_eachWhileTrue: function(func) {
		var length = this._array.length;
		for (var index = 0; index < length; index++) {
			if (index in this._array) {
				if (!func.call(this, index)) break;
			}
		}
		return (index == length) ? -1 : index;
	}
});
