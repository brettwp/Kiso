/*!
 * kiso JavaScript Library v0.2.1
 * Copyright 2010 Brett Pontarelli
 * Licensed under the MIT License.
 */
/** @namespace */
this.kiso = this.kiso || {};
kiso.VERSION = '0.2.1';
kiso.Class = function(parentClassOrObj, childDefinition) {
	return create(parentClassOrObj, childDefinition);

	function create(parentClassOrObj, childDefinition) {
    var interfaces = null;
		var constants = null;
    var parentClass = null;
		if (childDefinition == undefined) {
			childDefinition = parentClassOrObj;
		} else if (typeof parentClassOrObj == 'object') {
      parentClass = parentClassOrObj.parent;
      interfaces = parentClassOrObj.interfaces;
			constants = parentClassOrObj.constants;
    } else {
      parentClass = parentClassOrObj;
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
      newClass._interfaces = newClass._interfaces || [];
      for (var index in interfaces) {
        newClass._interfaces.push(interfaces[index]);
      }
    }
  }

  function ensureImplementsInterfaces(testClass) {
    if (testClass._interfaces) {
			var index;
      var methods = [];
      for (index in testClass._interfaces) {
        methods = methods.concat(testClass._interfaces[index].getMethods());
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
/** @namespace */
kiso.data = {};kiso.data.DoubleEndedQueue = kiso.Class({
	_head: null,
	_tail: null,
	
	initialize: function() {
		this._head = this._newNode();
		this._tail = this._newNode();
		this._head._prev = this._tail;
		this._tail._next = this._head;
	},
	
	pushHead: function(data) {
		var node = this._newNode(data);
		node._prev = this._head._prev;
		node._next = this._head;
		this._head._prev._next = node;
		this._head._prev = node;
	},

	pushTail: function(data) {
		var node = this._newNode(data);
		node._prev = this._tail;
		node._next = this._tail._next;
		this._tail._next._prev = node;
		this._tail._next = node;
	},
	
	_newNode: function(nodeData) {
		return {
			_data: nodeData,
			_next: null,
			_prev: null
		};
	},
	
	popHead: function() {
		if (this.isEmpty()) {
			throw new Error('Cannot popHead on empty DoubleEndedQueue');
		} else {
			var node = this._head._prev;
			node._prev._next = this._head;
			this._head._prev = node._prev;
			return node._data;
		}
	},
	
	popTail: function() {
		if (this.isEmpty()) {
			throw new Error('Cannot popTail on empty DoubleEndedQueue');
		} else {
			var node = this._tail._next;
			node._next._prev = this._tail;
			this._tail._next = node._next;
			return node._data;	
		}
	},
	
	isEmpty: function() {
		return (this._tail._next == this._head);
	}
});kiso.data.ITree = new kiso.Interface([
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
kiso.data.IndexedDoubleEndedQueue = kiso.Class(
	kiso.data.DoubleEndedQueue,
	{
		_nodeCursor: null,
		
		getHeadData: function(index) {
			if (this.isEmpty()) {
				return null;
			} else {
				return this._getIndexedData(index, -1);
			}
		},
		
		getTailData: function(index) {
			if (this.isEmpty()) {
				return null;
			} else {
				return this._getIndexedData(index, 1);
			}
		},
		
		_getIndexedData: function(index, direction) {
			var node = (direction == 1) ? this._tail._next : this._head._prev;
			while (index > 0 && node != null) {
				node = (direction == 1) ? node._next : node._prev;
				index--;
			}
			if (node == null || node == this._tail) {
				return null;
			} else {
				return node._data;
			}
		},
		
		toArray: function() {
			var arrayOut = new Array();
			var node = this._tail._next;
			while (node != this._head) {
				arrayOut.push(node._data);
				node = node._next;
			}
			return arrayOut;
		}
	}
);
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
/** @namespace */
kiso.geom = {};kiso.geom.IConvexHull = kiso.Interface([
	'setPoints',
	'getHullIndexes',
	'build'
]);
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
	
	equals: function(point) {
		return (this._x === point._x & this._y === point._y);
	},
	
	isLeftOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) >= 
				(point1._x - this._x)*(point0._y - this._y)
		);
	}
});kiso.geom.SimplePolyConvexHull = kiso.Class(
	{
		interfaces: kiso.geom.IConvexHull,
		constants: {
			AT_HEAD: 0,
			AT_TAIL: 1
		}
	},
	{
		_simplePoly: null,
		_hullIndexes: null,
		
		initialize: function(simplePoly) {
			this.setPoints(simplePoly);
		},
		
		setPoints: function(simplePoly) {
			this._simplePoly = simplePoly;
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
			this._hullIndexes = new kiso.data.IndexedDoubleEndedQueue();
			var indexes = [2, 1, 0, 2];
			if (this._simplePoly[2].isLeftOfVector(this._simplePoly[0], this._simplePoly[1])) {
				indexes = [2, 0, 1, 2];
			}
			for (var i = 0; i < 4; i++) {
				this._hullIndexes.pushHead(indexes[i]);
			}
		},
		
		_expandHull: function() {
			for (var index = 3; index < this._simplePoly.length; index++) {
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull.AT_HEAD);
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull.AT_TAIL);
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
				this._hullIndexes.pushHead(index);
				this._hullIndexes.pushTail(index);
			}
		},
		
		_isPointLeftOfVector: function(index, atEnd) {
			var atHead = (atEnd == kiso.geom.SimplePolyConvexHull.AT_HEAD);
			var index0 = atHead ? this._hullIndexes.getHeadData(1) : this._hullIndexes.getTailData(0);
			var index1 = atHead ? this._hullIndexes.getHeadData(0) : this._hullIndexes.getTailData(1);
			return !this._simplePoly[index].isLeftOfVector(
				this._simplePoly[index0], this._simplePoly[index1]
			);
		},
		
		_popHullPoint: function(atEnd) {
			if (atEnd == kiso.geom.SimplePolyConvexHull.AT_HEAD) {
				this._hullIndexes.popHead()
			}	else {
				this._hullIndexes.popTail();
			}
		}
	}
);
/** @namespace */
kiso.ui = {};kiso.ui.CookieAdapter = kiso.Class({
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
