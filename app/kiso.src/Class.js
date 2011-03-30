/**
 * @description Creates a new class.
 * @param {Class|Object} parentClassOrObj The parent class, an object of parameters, or the class definition object.
 * @param childDefinition The class definition object when the first arguments is an object
 *
 * There are three basic ways to instantiate a class:
 * 1) Class({...}) - A base class
 * 2) Class(parentClass, {...}) - A sub-class that inherits from a parent class.
 * 3) Class({...}, {...}) - The second argument is the class definition while the first contains one or more of the following: parent, constants, interfaces
 *    Full usage of the 3 case might look like this:
 *    kiso.Class(
 *			{
 *				parent: someParent,
 *				interfaces: [a single interface or an array of interfaces],
 *				constants: {an object of constant names and values}
 *			},
 *			{...}
 *		)
 *
 *		Note that constants are attached to the function, so for a class defined roughly like this:
 *		  var example = kiso.Class({ constants: { ONE:1, TWO:2 } }, {...});
 *		the constants will be like this:
 *		  example.ONE == 1
 *		  example.TWO == 2
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
