unittest.testClass = function() {
	module('Kiso.Class Tests');

	test('Member variable default value', function() {
		var testClass = kiso.Class({
			x: 'xyz',
			y: null
		});
		var testObj = new testClass();
		expect(2);
		equal(testObj.x, 'xyz');
		equal(testObj.y, null);
	});

	test('Constructor called', function() {
		var testClass = kiso.Class({
			x: 'xyz',
			initialize: function(y) {
				this.x = y;
			}
		});
		var testObj = new testClass('abc');
		expect(1);
		equal(testObj.x, 'abc');
	});

	test('Method binding', function() {
  	var testClass = kiso.Class({
			counter: null,
			initialize: function() {
				this.counter = 0;
			},
			add: function() {
				this.counter++;
			}
		});
		var testObj = new testClass();
		testObj.add();
		expect(1);
		equal(testObj.counter, 1);
  });

	test('Array unique to instance', function() {
		var testClass = kiso.Class({
			a: [1, 2, 3]
		});
		var testObj1 = new testClass();
		var testObj2 = new testClass();
		testObj2.a[0] = 5;
		notEqual(testObj1.a[0], testObj2.a[0]);
	});

	test('Object unique to instance', function() {
		var testClass = kiso.Class({
			a: {
	  		x: 1,
	  		y: 2,
	  		z: 3
	  	}
		});
		var testObj1 = new testClass();
		var testObj2 = new testClass();
		testObj2.a.x = 5;
		notDeepEqual(testObj1.a, testObj2.a);
	});

	test('Mixed array-object unique to instance', function() {
		var testClass = kiso.Class({
			a: {
	  		x: [{ deep: [8, 9, 10] }, { extra: 'extra' }],
	  		y: 2,
	  		z: 3
	  	}
		});
		var testObj1 = new testClass();
		var testObj2 = new testClass();
		testObj2.a.x[0].deep[1] = 5;
		notDeepEqual(testObj1.a, testObj2.a);
	});

	test('Simple inheritance', function() {
		var parentClass = kiso.Class({
			name: 'Brett',
			sayName: function() {
				return this.name;
			}
		});
		var childClass = kiso.Class(parentClass, {
			number: 10,
			sayNameAndNumber: function() {
				return this.sayName() + this.number;
			}
		});
		var testObj = new childClass();
		expect(2);
		equal(testObj.sayName(), 'Brett');
		equal(testObj.sayNameAndNumber(), 'Brett10');
	});

	test('Function overloading', function() {
		var parentClass = kiso.Class({
			name: 'Brett',
			sayName: function() {
				return this.name;
			}
		});
		var childClass = kiso.Class(parentClass, {
			sayName: function() {
				return 'Name=' + this.name;
			}
		});
		var testObj = new childClass();
		expect(1);
		equal(testObj.sayName(), 'Name=Brett');
	});

	test('Call parent constructor and function', function() {
		var parentClass = kiso.Class({
			name: 'Brett',
			initialize: function(name) {
				if (name) this.name = name;
			},
			sayName: function() {
				return this.name;
			}
		});
		var childClass = kiso.Class(parentClass, {
			sayName: function() {
				return 'Name=' + this.name;
			},
			saySimpleName: function() {
				return this.superclass.sayName();
			}
		});
		var testObj = new childClass('Tim');
		expect(2);
		equal(testObj.sayName(), 'Name=Tim');
		equal(testObj.saySimpleName(), 'Tim');
	});

  test('Inherit using object {extends: ...}', function() {
		var parentClass = kiso.Class({
			name: 'Brett',
			sayName: function() {
				return this.name;
			}
		});
		var childClass = kiso.Class(
      {
        parent: parentClass
      },
      {
        number: 10,
        sayNameAndNumber: function() {
          return this.sayName() + this.number;
        },
				sayName: function() {
					return 'Name=' + this.superclass.sayName();
				}
      }
    );
		var testObj = new childClass();
		expect(2);
		equal(testObj.sayName(), 'Name=Brett');
		equal(testObj.sayNameAndNumber(), 'Name=Brett10');
	});

  test('Implements single Interface', function() {
		var testInterface = kiso.Interface(['foo', 'bar', 'baz']);
    var testClass = kiso.Class(
      {
        interfaces: testInterface
      },
      {
        foo: function() { return 'foo'; },
        bar: function() { return 'bar'; },
        baz: function() { return 'baz'; }
      }
    );
    var testObj = new testClass();
		expect(3);
		equal(testObj.foo(), 'foo');
		equal(testObj.bar(), 'bar');
    equal(testObj.baz(), 'baz');
	});

  test('Implements array of Interfaces', function() {
		var testInterface1 = kiso.Interface(['foo', 'bar']);
    var testInterface2 = kiso.Interface(['baz', 'tim']);
    var testClass = kiso.Class(
      {
        interfaces: [testInterface1, testInterface2]
      },
      {
        foo: function() { return 'foo'; },
        bar: function() { return 'bar'; },
        baz: function() { return 'baz'; },
        tim: function() { return 'tim'; }
      }
    );
    var testObj = new testClass();
		expect(4);
		equal(testObj.foo(), 'foo');
		equal(testObj.bar(), 'bar');
    equal(testObj.baz(), 'baz');
    equal(testObj.tim(), 'tim');
	});

  test('Throws error if Interface not implemented', function() {
    var errorThrown = false;
    var errorMsg = 'No error thrown.';
    try {
      var testInterface = kiso.Interface(['foo', 'bar', 'baz']);
      var testClass = kiso.Class(
        {
          interfaces: testInterface
        },
        {
          foo: function() { return 'foo'; },
          bar: function() { return 'bar'; }
        }
      );
    } catch(e) {
      errorThrown = true;
      errorMsg = 'Error Thrown with message: ' + e.message;
    }
		expect(1);
    ok(errorThrown, errorMsg)
	});

  test('Class constants', function() {
    var testClass = kiso.Class(
      {
        constants: {
					BACKWARD: -1,
					DONTMOVE: 0,
					FORWARD: 1
				}
      },
      {
        testConst: function() {
					return (testClass.BACKWARD == -1) &&
						(testClass.DONTMOVE == 0) && (testClass.FORWARD == 1);
				}
      }
    );
    var testObj = new testClass();
		expect(4);
		equal(testClass.BACKWARD, -1);
		equal(testClass.DONTMOVE, 0);
		equal(testClass.FORWARD, 1);
		ok(testObj.testConst());
	});

  test('Class constants and inheritance', function() {
    var testClass1 = kiso.Class(
      {
        constants: {
					BACKWARD: -1,
					DONTMOVE: 0,
					FORWARD: 1
				}
      },
      {
				_empty: 0,
				testFunc: function() {
					return 1;
				}
      }
    );
		var testClass2 = kiso.Class(
			{
				parent: testClass1,
				constants: {
					UP: 2,
					DOWN: -2
				}
			},
			{
				testConst: function() {
					return (testClass2.BACKWARD == -1) &&
						(testClass2.DONTMOVE == 0) && (testClass2.FORWARD == 1) &&
						(testClass2.UP == 2) && (testClass2.DOWN == -2);
				}
			}
		);
    var testObj = new testClass2();
		expect(7);
		equal(testClass2.BACKWARD, -1);
		equal(testClass2.DONTMOVE, 0);
		equal(testClass2.FORWARD, 1);
		equal(testClass2.UP, 2);
		equal(testClass2.DOWN, -2);
		equal(testObj.testFunc(), 1)
		ok(testObj.testConst());
	});

  test('Throws error if interface doesn\'t exists (e.g. is declared after)', function() {
    var errorThrown = false;
    var errorMsg = 'No error thrown.';
    try {
      var testClass = kiso.Class(
        {
          interfaces: kiso.testInterface
        },
        {
          foo: function() { return 'foo'; },
          bar: function() { return 'bar'; }
        }
      );
    } catch(e) {
      errorThrown = true;
      errorMsg = 'Error Thrown with message: ' + e.message;
    }
		expect(1);
    ok(errorThrown, errorMsg)
	});

  test('Throws error if parent doesn\'t exists (e.g. is declared after)', function() {
    var errorsThrown = 0;
    try {
      var testClass1 = kiso.Class(
				kiso.parentClass,
        {
          foo: function() { return 'foo'; },
          bar: function() { return 'bar'; }
        }
      );
    } catch(e) {
      errorsThrown++;
    }
    try {
			var testClass2 = kiso.Class(
				{
					parent: kiso.parentClass
				},
        {
          foo: function() { return 'foo'; },
          bar: function() { return 'bar'; }
        }
      );
    } catch(e) {
      errorsThrown++;
    }
		expect(1);
    equal(errorsThrown, 2);
	});

	test('Complex inheritance calls parent function with proper this', function() {
		var classX = kiso.Class({
			complex: null,
			initialize: function() { this.complex = {}; },
			setComplex: function(data) { this.complex.data = data; },
			getComplex: function() { return this.complex.data; }
		});
		var parentA = kiso.Class({
			value: null,
			setValue: function(value) { this.value = value; },
			getValue: function() { return this.value; }
		});
		var childA = kiso.Class(parentA, {
				setValue: function(value) { this.superclass.setValue(value); },
				getValueNew: function() { return this.value; }
		});
		var objectX1 = new classX();
		var objectX2 = new classX();
		var objectA1 = new childA();
		var objectA2 = new childA();
		objectX1.setComplex({ a:1, b:2 });
		objectA1.setValue(objectX1);
		objectX2.setComplex({ a:2, b:3 });
		objectA2.setValue(objectX2);
		expect(2);
		deepEqual(objectA2.getValue().getComplex(), { a:1, b:2 });
		deepEqual(objectA1.getValue().getComplex(), { a:2, b:3 });
	});
};
