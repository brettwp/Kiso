/*!
 * Unit Tests for kiso JavaScript Library
 * Copyright 2010 Brett Pontarelli
 * Licensed under the MIT License.
 */
this.unittest = this.unittest || {};
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
    }
    catch(e) {
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
unittest.testInterface = function() {
	module('Kiso.Interface Tests');

  test('Create Interface', function() {
    expect(1);
    var testInterface = kiso.Interface(['foo', 'bar', 'baz']);
    deepEqual(testInterface.getMethods(), ['foo', 'bar', 'baz']);
  });

  test('Extend Interface', function() {
    var parentInterface = kiso.Interface(['foo', 'bar']);
    var extendedInterface = kiso.Interface(parentInterface, ['baz', 'tim']);
    expect(1);
    deepEqual(extendedInterface.getMethods(), ['foo', 'bar', 'baz', 'tim']);
  });
};
unittest.data = {};
unittest.data.testTree = function() {
	module('kiso.data.Tree Tests');

	test('Add children and get by index', function() {
		var testNode = new kiso.data.Tree();
		var childNode1 = new kiso.data.Tree();
		var childNode2 = new kiso.data.Tree();
		testNode.addChild(childNode1);
		testNode.addChild(childNode2);
		expect(2);
		ok(testNode.getChild(0) == childNode1);
		ok(testNode.getChild(1) == childNode2);
	});

	test('Add children and check parent connection', function() {
		var parentNode = new kiso.data.Tree();
		var childNode = new kiso.data.Tree();
		parentNode.addChild(childNode);
		expect(2);
		ok(parentNode.getChild(0) == childNode);
		ok(childNode.getParent() == parentNode);
	});

	test('Unlinked node has zero children', function() {
		var testNode = new kiso.data.Tree();
		expect(1);
		equal(testNode.getChildCount(), 0);
	});

	test('Get number children', function() {
		var parentNode = new kiso.data.Tree();
		parentNode.addChild(new kiso.data.Tree());
		parentNode.addChild(new kiso.data.Tree());
		parentNode.addChild(new kiso.data.Tree());
		expect(1);
		equal(parentNode.getChildCount(), 3);
	});

	test('Remove child by index', function() {
		var parentNode = new kiso.data.Tree();
		var childNode = new kiso.data.Tree();
		parentNode.addChild(new kiso.data.Tree());
		parentNode.addChild(new kiso.data.Tree());
		parentNode.addChild(childNode);
		parentNode.removeChild(1);
		expect(2);
		equal(parentNode.getChildCount(), 2);
		ok(parentNode.getChild(1) == childNode);
	});

	test('Remove child by node', function() {
		var parentNode = new kiso.data.Tree();
		var childNode1 = new kiso.data.Tree();
		var childNode2 = new kiso.data.Tree();
		parentNode.addChild(new kiso.data.Tree());
		parentNode.addChild(childNode1);
		parentNode.addChild(childNode2);
		parentNode.removeChild(childNode1);
		expect(2);
		equal(parentNode.getChildCount(), 2);
		ok(parentNode.getChild(1) == childNode2);
	});

	test('Is leaf, node, and/or root?', function() {
		var parentNode = new kiso.data.Tree();
		var childNode1 = new kiso.data.Tree();
		var childNode2 = new kiso.data.Tree();
		parentNode.addChild(childNode1);
		childNode1.addChild(childNode2);
		expect(6);
		ok(parentNode.isRoot(), 'Parent is Root');
		ok(!parentNode.isLeaf(), 'Parent not a leaf');
		ok(!childNode1.isRoot(), 'Child1 is not root');
		ok(!childNode1.isLeaf(), 'Child1 is not a leaf');
		ok(!childNode2.isRoot(), 'Child2 is not root');
		ok(childNode2.isLeaf(), 'Child2 is a leaf');
	});
	
	test('Get/set/purge data', function() {
		var testNode = new kiso.data.Tree();
		var testObj = new kiso.Class({ data: null });
		testNode.setData(testObj);
		expect(4);
		equal(testNode.getData(), testObj);
		ok(!testNode.isEmpty());
		testNode.purgeData();
		equal(testNode.getData(), null);
		ok(testNode.isEmpty());
	});
};
unittest.ui = {};
unittest.ui.testCookieAdapter = function() {
	var mockDocumentCookie;
	var MockCookieAdapter = new kiso.Class(
		kiso.ui.CookieAdapter,
		{
			_setDocumentCookie: function(cookieDef) {
		  	mockDocumentCookie = cookieDef;
			},
			_getDocumentCookie: function() {
		  	return mockDocumentCookie;
			}
		}
	);

	module('kiso.ui.CookieAdapter Tests with Mock Date and Cookie', {
		setup: function() {
			this.testMockCookieAdapter = new MockCookieAdapter();
		  this.origDateGetTime = Date.prototype.getTime;
		  Date.prototype.getTime = function() {
		  	return 0;
		  };
		},
		teardown: function() {
			this.testMockCookieAdapter = null;
			Date.prototype.getTime = this.origDateGetTime;
		}
	});

  test('Set (Mock) Cookie', function() {
    this.testMockCookieAdapter.setCookie('CookieSet', 'Monster', {
      path: 'path', domain: 'domain', secure: false
    });
    var expRegEx = new RegExp('CookieSet=Monster;expires=Thu, 0*1 Jan 1970 00:00:00[ A-z]*;path=path;domain=domain');
    expect(1);
    ok(expRegEx.test(mockDocumentCookie));
  });

  test('Set (Mock) Cookie Secure', function() {
    this.testMockCookieAdapter.setCookie('CookieSetSecure', 'Monster', {
      path: 'path', domain: 'domain', secure: true
    });
    var expRegEx = new RegExp('CookieSetSecure=Monster;expires=Thu, 0*1 Jan 1970 00:00:00[ A-z]*;path=path;domain=domain;secure');
    expect(1);
    ok(expRegEx.test(mockDocumentCookie));
  });

	test('Get (Mock) Cookie', function() {
		mockDocumentCookie = 'CookieGet=Monster;';
		expect(1);
		equal(this.testMockCookieAdapter.getCookie('CookieGet'), 'Monster');
	});
	
	test('Is (Mock) Cookie Set', function() {
		mockDocumentCookie = 'Cookie=Monster;';
		expect(1);
		ok(this.testMockCookieAdapter.isCookieSet('Cookie'));
	});
	
	test('Set Cookie by Days Till Expire', function() {
		this.testMockCookieAdapter.setCookie('Test', 'Monster', 15);
		var expStr = 'Test=Monster;expires=Fri, 16 Jan 1970 00:00:00';
		expect(1);
		equal(mockDocumentCookie.substr(0,expStr.length), expStr);
	});
	
	test('Set Cookie by UTC', function() {
		this.testMockCookieAdapter.setCookie('Test', 'Monster', { utc: 9*24*60*60*1000 + 1000 });
		var expStr = 'Test=Monster;expires=Sat, 10 Jan 1970 00:00:01';
		expect(1);
		equal(mockDocumentCookie.substr(0,expStr.length), expStr);
	});
	
	test('Set Cookie by Time Units', function() {
		this.testMockCookieAdapter.setCookie('Test', 'Monster', {
			days: 11,
			hours: 1,
			minutes: 1,
			seconds: 1
		});
		var expStr = 'Test=Monster;expires=Mon, 12 Jan 1970 01:01:01';
		expect(1);
		equal(mockDocumentCookie.substr(0,expStr.length), expStr);
	});
	
	module('kiso.ui.CookieAdapter Browser Tests');

	test('Set and Clear', function() {
		var cookieAdapter = new kiso.ui.CookieAdapter();
		cookieAdapter.setCookie('Temp', 'Short', 1);
		cookieAdapter.clearCookie('Temp');
		expect(1);
		ok(!cookieAdapter.isCookieSet('Temp'));
	});
};
