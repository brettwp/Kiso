/*!
 * Kiso JavaScript Library v0.2.1
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
/** @namespace */
this.kiso = this.kiso || {};
kiso.VERSION = '0.2.1';
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
			if (this.superclass) {this.superclass.__sub = this;}
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
			if (prop != 'superclass') {
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
			newClass.prototype.superclass = {
				__super: parentClass.prototype,
				__sub: null
			};
			setupClassConstants(newClass, parentClass);
		}
	}

  function extendClassMembers(newClass, extension) {
		var extObj = null;
		var propType = null;
		if (typeof extension == 'function') {
			extObj = extension.prototype;
		} else {
			extObj = extension
		}
		for (var prop in extObj) {
			propType = typeof newClass.prototype[prop];
			if (newClass.prototype[prop] && propType == 'function') {
				eval(
					'newClass.prototype.superclass.'+prop+'=function(){'+
					'return this.__super.'+prop+'.apply(this.__sub,arguments);};'
				);
			}
			newClass.prototype[prop] = extObj[prop];
		}
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
kiso.data = kiso.data || {};
kiso.data.IDeque = kiso.Interface([
	'pushHead',
	'pushTail',
	'popHead',
	'popTail',
	'getHeadData',
	'getTailData'
]);
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
kiso.data.AbstractList = kiso.Class({
	_last: null,
	_first: null,
	_size: 0,
	
	initialize: function() {
		this._last = this._newNode();
		this._first = this._newNode();
		this._last._prev = this._first;
		this._first._next = this._last;
		this._size = 0;
	},
	
	getSize: function() {
		return this._size;
	},
	
	isEmpty: function() {
		return (this._size == 0);
	},
	
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
kiso.data.Deque = kiso.Class(
	{
		parent: kiso.data.AbstractList,
		interfaces: kiso.data.IDeque
	},
	{
		pushHead: function(data) {
			this._addBefore(this._last, data);
		},

		pushTail: function(data) {
			this._addAfter(this._first, data);
		},

		popHead: function() {
			if (this.isEmpty()) {
				throw new Error('Cannot pop head on empty Deque');
			}
			return this._removeNode(this._last._prev);
		},

		popTail: function() {
			if (this.isEmpty()) {
				throw new Error('Cannot pop tail on empty Deque');
			}
			return this._removeNode(this._first._next);
		},

		getHeadData: function(index) {
			return this._getNode(this._size-index-1)._data;
		},

		getTailData: function(index) {
			return this._getNode(index)._data;
		}
	}
);
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
kiso.data.LinkedList = kiso.Class(
	{
		parent: kiso.data.AbstractList,
		interfaces: kiso.data.ILinkedList
	},
	{
		addFirst: function(data) {
			this._addAfter(this._first, data);
		},

		addLast: function(data) {
			this._addBefore(this._last, data);
		},

		addBefore: function(index, data) {
			this._addBefore(this._getNode(index), data);
		},

		addAfter: function(index, data) {
			this._addAfter(this._getNode(index), data);
		},

		remove: function(index) {
			return this._removeNode(this._getNode(index));
		},

		removeFirst: function() {
			if (this.isEmpty()) {
				throw new Error('Cannot remove first from empty LinkedList');
			}
			return this._removeNode(this._first._next);
		},

		removeLast: function() {
			if (this.isEmpty()) {
				throw new Error('Cannot remove last from empty LinkedList');
			}
			return this._removeNode(this._last._prev);
		},

		getData: function(index) {
			return this._getNode(index)._data;
		}
	}
);
kiso.data.ListIterator = kiso.Class(
	{
		constants: {
			STARTATFIRST: 0,
			STARTATLAST: 1
		}
	},
	{
		_list: null,
		_currentNode: null,
		_index: null,

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

		addAfter: function(data) {
			this._list._addAfter(this._currentNode, data);
		},

		addBefore: function(data) {
			this._list._addBefore(this._currentNode, data);
			this._index++;
		},

		hasNext: function() {
			return (this._currentNode._next != this._list._last);
		},

		hasPrevious: function() {
			return (this._currentNode._prev != this._list._first);
		},

		getIndex: function() {
			return this._index;
		},

		gotoNext: function() {
			if (this.hasNext()) {
				this._currentNode = this._currentNode._next;
				this._index++;
			} else {
				throw new Error('No such element');
			}
		},

		gotoPrevious: function() {
			if (this.hasPrevious()) {
				this._currentNode = this._currentNode._prev;
				this._index--;
			} else {
				throw new Error('No such element');
			}
		},

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

		getData: function() {
			return this._currentNode._data;
		},

		setData: function(data) {
			this._currentNode._data = data;
		}
	}
);kiso.data.Tree = kiso.Class(
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
// BEGIN: DEBUG CODE
kiso.hulls = [];
// END: DEBUG CODE
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
			// BEGIN: DEBUG CODE
			this.aaName = kiso.hulls.length;
			kiso.hulls.push(this);
			// END: DEBUG CODE
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
});kiso.geom.ReducibleSimplePolyConvexHull = kiso.Class(
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
);kiso.geom.SimplePolyApproximatorHS = kiso.Class(
	{
		parent: kiso.geom.SimplePolyApproximatorDP
		//interfaces: kiso.geom.IPolyApproximator
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
			if (sectionSize > 3) {
				if (section.firstToLastHull) {
					section.firstToLastHull.reduceTo(sectionSize);
				} else {
					section.firstToLastHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint)
					);
					section.firstToLastHull.build();
				}
				if (section.lastToFirstHull) {
					section.lastToFirstHull.reduceTo(section.lastPoint - section.firstPoint);
				} else {
					section.lastToFirstHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint),
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
			if ((section.lastPoint - section.firstPoint) <=3) {
				this.superclass._findFarthestInCurrentSection();
			} else {
				this._useHullToFindFarthest();
			}
		},

		_useHullToFindFarthest: function() {
			var section = this._iterator.getData();
			var point0 = this._simplePoly[section.firstPoint];
			var point1 = this._simplePoly[section.lastPoint];
			var hullData = {
				vectorX: point1.getX() - point0.getX(),
				vectorY: point1.getY() - point0.getY(),
				hullIndexes: section.firstToLastHull.getHullIndexes()
			};
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
			var distanceSquared1 = this._simplePoly[hullData.hullIndexes[edgeFar1]]
				.distanceSquaredToLine(point0, point1);
			var distanceSquared2 = this._simplePoly[hullData.hullIndexes[edgeFar2]]
				.distanceSquaredToLine(point0, point1);
			if (distanceSquared1 > distanceSquared2) {
				section.distanceSquared = distanceSquared1;
				section.farthestPoint = hullData.hullIndexes[edgeFar1];
			} else {
				section.distanceSquared = distanceSquared2;
				section.farthestPoint = hullData.hullIndexes[edgeFar2];
			}
		},

		_computeSlopeSign: function(hullData, index0, index1) {
			var point0 = this._simplePoly[hullData.hullIndexes[index0]];
			var point1 = this._simplePoly[hullData.hullIndexes[index1]];
			var dotProd = hullData.vectorX*(point1.getX() - point0.getX()) +
				hullData.vectorY*(point1.getY() - point0.getY());
			return dotProd < 0 ? -1 : 1;
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
kiso.ui = kiso.ui || {};kiso.ui.CookieAdapter = kiso.Class({
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
