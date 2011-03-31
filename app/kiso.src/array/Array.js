kiso.array = new (kiso.Class({
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
