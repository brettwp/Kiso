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
        }
      }
    );
		var testObj = new childClass();
		expect(2);
		equal(testObj.sayName(), 'Brett');
		equal(testObj.sayNameAndNumber(), 'Brett10');
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
					Backward: -1,
					DontMove: 0,
					Forward: 1
				}
      },
      {
        testConst: function() {
					return (testClass.Backward == -1) &&
						(testClass.DontMove == 0) && (testClass.Forward == 1);
				}
      }
    );
    var testObj = new testClass();
		expect(4);
		equal(testClass.Backward, -1);
		equal(testClass.DontMove, 0);
		equal(testClass.Forward, 1);
		ok(testObj.testConst());
	});
};
