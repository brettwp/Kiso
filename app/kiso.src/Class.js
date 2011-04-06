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
