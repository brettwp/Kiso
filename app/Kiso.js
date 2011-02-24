/*!
 * Kiso JavaScript Library v0.1.3
 * Copyright 2010 Brett Pontarelli
 * Licensed under the MIT License.
 */
/** @namespace */
this.Kiso = this.Kiso || {};
Kiso.VERSION = '0.1.2';
Kiso.Class = function(parentClassOrObj, childDefinition) {
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
Kiso.Interface = function(parentInterface, methods) {
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
Kiso.CookieAdapter = Kiso.Class({
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
Kiso.ITree = new Kiso.Interface([
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
Kiso.Tree = Kiso.Class(
	{
		interfaces: Kiso.ITree
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
			if (indexOrTree instanceof Kiso.Tree) {
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
