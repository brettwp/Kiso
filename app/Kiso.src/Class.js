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
