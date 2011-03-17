/*!
 * Unit Tests for kiso JavaScript Library
 * Copyright 2010 Brett Pontarelli
 * Licensed under the MIT License.
 */
/** @namespace */
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
/** @namespace */
unittest.data = {};
unittest.data.testAbstractList = function() {
	module('kiso.data.AbstractList Tests');

	test('New list is empty', function() {
		var list = new kiso.data.AbstractList();
		expect(1);
		ok(list.isEmpty());
	});

	test('New list size zero', function() {
		var list = new kiso.data.AbstractList();
		expect(1);
		equals(list.getSize(), 0);
	});
	
	test('New list array form is null', function() {
		var list = new kiso.data.AbstractList();
		expect(1);
		equals(list.toArray(), 0);
	});
};
unittest.data.testDeque = function() {
	module('kiso.data.Deque Tests');

	test('List size equals number of elements', function() {
		var deque = new kiso.data.Deque();
		for (var i=0; i<10; i++) deque.pushHead(0);
		expect(1);
		equal(deque.getSize(), 10);
	});
	
	test('Pop on empty list throws error', function() {
		var deque = new kiso.data.Deque();
		var errorsThrown = 0;
		try {
			deque.popHead();
		} catch(e) {
			errorsThrown++;
		}
		try {
			deque.popTail();
		} catch(e) {
			errorsThrown++;
		}
		expect(1);
		equal(errorsThrown, 2);
	});
	
	test('Push/pop head and tail', function() {
		var deque1 = new kiso.data.Deque();
		deque1.pushHead(5);
		deque1.pushHead(3);
		deque1.pushHead(4);
		var deque2 = new kiso.data.Deque();
		deque2.pushTail(2);
		deque2.pushTail(0);
		deque2.pushTail(1);
		expect(8);
		equal(deque1.popTail(),5);
		equal(deque1.popTail(),3);
		equal(deque1.popHead(),4);
		ok(deque1.isEmpty());
		equal(deque2.popHead(),2);
		equal(deque2.popHead(),0);
		equal(deque2.popTail(),1);
		ok(deque2.isEmpty());		
	});

	test('Get indexed head/tail data', function() {
		var deque = new kiso.data.Deque();
		deque.pushHead(5);
		deque.pushHead(3);
		deque.pushHead(4);
		deque.pushTail(2);
		deque.pushTail(0);
		deque.pushTail(1);
		expect(4);
		equal(deque.getHeadData(0), 4);
		equal(deque.getHeadData(3), 2);
		equal(deque.getTailData(0), 1);
		equal(deque.getTailData(3), 5);
	});
	
	test('Convert to array', function() {
		var deque = new kiso.data.Deque();
		deque.pushHead(5);
		deque.pushHead(3);
		deque.pushHead(4);
		deque.pushTail(2);
		deque.pushTail(0);
		deque.pushTail(1);
		expect(1);
		deepEqual(deque.toArray(), [1, 0, 2, 5, 3, 4]);
	});
};
unittest.data.testLinkedList = function() {
	module('kiso.data.LinkedList Tests');

	test('List size equals number of elements', function() {
		var list = new kiso.data.LinkedList();
		for (var i=0; i<10; i++) list.addFirst(0);
		expect(1);
		equal(list.getSize(), 10);
	});
	
	test('Pop on empty list throws error', function() {
		var list = new kiso.data.LinkedList();
		var errorsThrown = 0;
		try {
			list.removeFirst();
		} catch(e) {
			errorsThrown++;
		}
		try {
			list.removeLast();
		} catch(e) {
			errorsThrown++;
		}
		expect(1);
		equal(errorsThrown, 2);
	});
		
	test('Insert/remove first and last', function() {
		var list1 = new kiso.data.LinkedList();
		list1.addFirst(5);
		list1.addFirst(3);
		list1.addFirst(4);
		var list2 = new kiso.data.LinkedList();
		list2.addLast(2);
		list2.addLast(0);
		list2.addLast(1);
		expect(8);
		equal(list1.removeLast(),5);
		equal(list1.removeLast(),3);
		equal(list1.removeFirst(),4);
		ok(list1.isEmpty());
		equal(list2.removeFirst(),2);
		equal(list2.removeFirst(),0);
		equal(list2.removeLast(),1);
		ok(list2.isEmpty());		
	});
	
	test('Insert before/after and remove', function() {
		var list1 = new kiso.data.LinkedList();
		list1.addFirst(2);
		list1.addAfter(0,5);
		list1.addAfter(1,3);
		list1.addAfter(2,4);
		var list2 = new kiso.data.LinkedList();
		list2.addLast(2);
		list2.addBefore(0,5);
		list2.addBefore(1,3);
		list2.addBefore(2,4);
		expect(10);
		equal(list1.remove(1),5);
		equal(list1.remove(2),4);
		equal(list1.remove(0),2);
		equal(list1.remove(0),3);
		ok(list1.isEmpty());
		equal(list2.remove(3),2);
		equal(list2.remove(1),3);
		equal(list2.remove(1),4);
		equal(list2.remove(0),5);
		ok(list2.isEmpty());		
	});

	test('Get indexed data', function() {
		var list = new kiso.data.LinkedList();
		list.addFirst(5);
		list.addFirst(3);
		list.addFirst(4);
		list.addLast(2);
		list.addLast(0);
		list.addLast(1);
		var listArray = [];
		for (var i=0; i<6; i++) listArray.push(list.getData(i));
		expect(1);
		deepEqual(listArray, [4,3,5,2,0,1]);
	});
	
	test('Convert to array', function() {
		var list = new kiso.data.LinkedList();
		list.addFirst(5);
		list.addFirst(3);
		list.addFirst(4);
		list.addLast(2);
		list.addLast(0);
		list.addLast(1);
		expect(1);
		deepEqual(list.toArray(), [4,3,5,2,0,1]);
	});
};
unittest.data.testListIterator = function() {
	var MockList = kiso.Class(kiso.data.AbstractList,
		{
			initialize: function(array) {
				this.superclass.initialize();
				for (i=0; i<array.length; i++) {
					this._addBefore(this._last, array[i]);
				}
			}
		}
	);
		
	module('kiso.data.ListIterator Tests');

	test('One item list has no next or previous', function() {
		var list = new MockList([1]);
		var iterator = new kiso.data.ListIterator(list);
		expect(2);
		ok(!iterator.hasNext());
		ok(!iterator.hasPrevious());
	});
	
	test('Add before and after', function() {
		var list1 = new MockList([1]);
		var iterator1 = new kiso.data.ListIterator(list1);
		var list2 = new MockList([1]);
		var iterator2 = new kiso.data.ListIterator(list2);
		iterator1.addAfter(2);
		iterator2.addBefore(3);
		expect(4);
		ok(iterator1.hasNext());
		iterator1.gotoNext()
		equal(iterator1.getData(), 2);
		ok(iterator2.hasPrevious());
		iterator2.gotoPrevious()
		equal(iterator2.getData(), 3);
	});
	
	test('Get index', function() {
		var list = new MockList([0,1,2,3,4,5]);
		var iterator = new kiso.data.ListIterator(list);
		var testArray = [];
		for (i=0; i<6; i++) {
			testArray.push(iterator.getIndex());
			if (iterator.hasNext()) iterator.gotoNext();
		}
		expect(1);
		deepEqual(testArray, [0,1,2,3,4,5]);
	});
	
	test('Remove', function() {
		var list = new MockList([0,1,2,3,4,5]);
		var iterator = new kiso.data.ListIterator(list);
		iterator.gotoNext();
		iterator.gotoNext();
		iterator.gotoNext();
		iterator.remove();
		expect(1);
		deepEqual(list.toArray(), [0,1,2,4,5]);
	});
	
	test('Get and set data', function() {
		var list = new MockList([0,1,2,3,4,5]);
		var iterator = new kiso.data.ListIterator(list);
		var doNext = true;
		while (1) {
			iterator.setData(iterator.getData() + 1);
			if (iterator.hasNext()) {
				iterator.gotoNext();
			} else {
				break;
			}
		}
		expect(1);
		deepEqual(list.toArray(), [1,2,3,4,5,6]);
	});
};unittest.data.testTree = function() {
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
/** @namespace */
unittest.geom = {};
unittest.geom.testPoint = function() {
	module('kiso.geom.Point Tests');

	test('Point Constructor', function() {
		var testPoint1 = new kiso.geom.Point();
		var testPoint2 = new kiso.geom.Point(2,3);
		var testPoint3 = new kiso.geom.Point(testPoint2);
		expect(3);
		ok(testPoint1.getX() == 0 && testPoint1.getY() == 0);
		ok(testPoint2.getX() == 2 && testPoint2.getY() == 3);
		ok(testPoint3.getX() == 2 && testPoint3.getY() == 3);
	});

	test('Getters & Setters', function() {
		var testPoint = new kiso.geom.Point();
		testPoint.setXY(4,5);
		expect(1);
		ok(testPoint.getX() == 4 && testPoint.getY() == 5);
	});
	
	test('Equal points', function() {
		var testPoint1 = new kiso.geom.Point(4, 5);
		var testPoint2 = new kiso.geom.Point(4, 5);
		expect(1);
		ok(testPoint1.equals(testPoint2));
	});
	
	test('Distance between points', function() {
		var testPoint1 = new kiso.geom.Point(2, 3);
		var testPoint2 = new kiso.geom.Point(5, 7);
		expect(2);
		equals(testPoint1.distanceTo(testPoint2), 5);
		equals(testPoint1.distanceSquaredTo(testPoint2), 25);
	});
	
	test('Slope between points', function() {
		var testPoint1 = new kiso.geom.Point(2, 3);
		var testPoint2 = new kiso.geom.Point(2, 7);
		var testPoint3 = new kiso.geom.Point(5, 7);
		expect(2);
		equals(testPoint1.slopeTo(testPoint2), Infinity);
		equals(testPoint1.slopeTo(testPoint3), 4/3);
	});
	
	test('Distance from point to line', function() {
		var testPoint1 = new kiso.geom.Point(1, 0);
		var testPoint2 = new kiso.geom.Point(0, 0);
		var testPoint3 = new kiso.geom.Point(1, 1);
		expect(2);
		ok(testPoint1.distanceToLine(testPoint2, testPoint3) - Math.SQRT2/2 < 1e-6);
		equals(testPoint1.unscaledDistanceToLine(testPoint2, testPoint3), 1);
	});
};
unittest.geom.testReducibleSimplePolyConvexHull = function() {
	var testPoints = [
		new kiso.geom.Point(2, 0),
		new kiso.geom.Point(1, 1),
		new kiso.geom.Point(0, 0),
		new kiso.geom.Point(1, 0.5),
		new kiso.geom.Point(1, -1),
		new kiso.geom.Point(-2, -1),
	];
	var POP_OPERATION_AT_HEAD = kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_HEAD
	var POP_OPERATION_AT_TAIL = kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_TAIL
	var PUSH_OPERATION = kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION

	module('kiso.geom.ReducibleSimplePolyConvexHull Tests');
	
	test('6 point hull', function() {
		var hull = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints);
		hull.build();
		
		expect(1);
		deepEqual(
			hull.getOperationStack(), 
			[ 
				{ index: 2, operation: PUSH_OPERATION },
				{ index: 2, operation: POP_OPERATION_AT_TAIL },
				{ index: 4, operation: PUSH_OPERATION },
				{ index: 4, operation: POP_OPERATION_AT_HEAD },
				{ index: 2, operation: POP_OPERATION_AT_HEAD },
				{ index: 5, operation: PUSH_OPERATION },
			]
		);
	});

	test('6 point hull reverse direction', function() {
		var hull = new kiso.geom.ReducibleSimplePolyConvexHull(
			testPoints,
			kiso.geom.SimplePolyConvexHull.LAST2FIRST
		);
		hull.build();
		
		expect(1);
		deepEqual(
			hull.getOperationStack(), 
			[
				{ index: 3, operation: PUSH_OPERATION },
				{ index: 3, operation: POP_OPERATION_AT_TAIL },
				{ index: 1, operation: PUSH_OPERATION },
				{ index: 1, operation: POP_OPERATION_AT_HEAD },
				{ index: 3, operation: POP_OPERATION_AT_HEAD },
				{ index: 0, operation: PUSH_OPERATION },
			]
		);
	});
	
	test('Reduce hull', function() {
		var mapFunc = function(point) { return [point.getX(), point.getY()]; };
		var hull1 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints);
		hull1.build();
		hull1.reduceTo(4);
		var hull2 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints);
		hull2.build();
		hull2.reduceTo(3);
		var hull3 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints);
		hull3.build();
		hull3.reduceTo(2);
		expect(6);
		deepEqual(hull1.getPoints().map(mapFunc), testPoints.slice(0, 5).map(mapFunc));
		deepEqual(hull1.getHullIndexes(), [4,0,1,2,4]);
		deepEqual(hull2.getPoints().map(mapFunc), testPoints.slice(0, 4).map(mapFunc));
		deepEqual(hull2.getHullIndexes(), [2,0,1,2]);
		deepEqual(hull3.getPoints().map(mapFunc), testPoints.slice(0, 3).map(mapFunc));
		deepEqual(hull3.getHullIndexes(), [2,0,1,2]);
	});
	
	test('Reduce hull reverse direction', function() {
		var mapFunc = function(point) { return [point.getX(), point.getY()]; };
		var hull1 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints,
			kiso.geom.SimplePolyConvexHull.LAST2FIRST);
		hull1.build();
		hull1.reduceTo(1);
		var hull2 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints,
			kiso.geom.SimplePolyConvexHull.LAST2FIRST);
		hull2.build();
		hull2.reduceTo(2);
		var hull3 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints,
			kiso.geom.SimplePolyConvexHull.LAST2FIRST);
		hull3.build();
		hull3.reduceTo(3);
		expect(6);
		deepEqual(hull1.getPoints().map(mapFunc), testPoints.slice(1).map(mapFunc));
		deepEqual(hull1.getHullIndexes(), [0,4,3,2,0]);
		deepEqual(hull2.getPoints().map(mapFunc), testPoints.slice(2).map(mapFunc));
		deepEqual(hull2.getHullIndexes(), [1,3,2,1]);
		deepEqual(hull3.getPoints().map(mapFunc), testPoints.slice(3).map(mapFunc));
		deepEqual(hull3.getHullIndexes(), [0,2,1,0]);
	});
};
unittest.geom.testSimplePolyConvexHull = function() {
	module('kiso.geom.SimplePolyConvexHull Tests');

	test('3 point hull', function() {
		var hull1 = new kiso.geom.SimplePolyConvexHull([
			new kiso.geom.Point(2, 0),
			new kiso.geom.Point(1, 1),
			new kiso.geom.Point(0, 0)
		]);
		hull1.build();
		var hull2 = new kiso.geom.SimplePolyConvexHull([
			new kiso.geom.Point(2, 0),
			new kiso.geom.Point(1, -1),
			new kiso.geom.Point(0, 0)
		]);
		hull2.build();
		
		expect(2);
		deepEqual(hull1.getHullIndexes(), [2,0,1,2], 'CCW since v2 is left of v0v1');
		deepEqual(hull2.getHullIndexes(), [2,1,0,2], 'CCW sincev2 is right of v0v1');
	});
	
	test('4 point hull w/ v3 inside triangle v0v1v2', function() {
		var hull = new kiso.geom.SimplePolyConvexHull([
			new kiso.geom.Point(2, 0),
			new kiso.geom.Point(1, 1),
			new kiso.geom.Point(0, 0),
			new kiso.geom.Point(1, 0.5)
		]);
		hull.build();
		
		expect(1);
		deepEqual(hull.getHullIndexes(), [2,0,1,2]);
	});

	test('5 point hull w/ v4 outside triangle v0v1v2', function() {
		var hull = new kiso.geom.SimplePolyConvexHull([
			new kiso.geom.Point(2, 0),
			new kiso.geom.Point(1, 1),
			new kiso.geom.Point(0, 0),
			new kiso.geom.Point(1, 0.5),
			new kiso.geom.Point(1, -1)
		]);
		hull.build();
		
		expect(1);
		deepEqual(hull.getHullIndexes(), [4,0,1,2,4], '2 popped from tail and 4 pushed');
	});

	test('6 point hull w/ v5 outside triangle v0v1v2', function() {
		var hull = new kiso.geom.SimplePolyConvexHull([
			new kiso.geom.Point(2, 0),
			new kiso.geom.Point(1, 1),
			new kiso.geom.Point(0, 0),
			new kiso.geom.Point(1, 0.5),
			new kiso.geom.Point(1, -1),
			new kiso.geom.Point(-2, -1),
		]);
		hull.build();
		
		expect(1);
		deepEqual(hull.getHullIndexes(), [5,4,0,1,5], '4&2 popped from head and 5 pushed');
	});

	test('6 point hull reverse direction', function() {
		var hull = new kiso.geom.SimplePolyConvexHull(
			[
				new kiso.geom.Point(2, 0),
				new kiso.geom.Point(1, 1),
				new kiso.geom.Point(0, 0),
				new kiso.geom.Point(1, 0.5),
				new kiso.geom.Point(1, -1),
				new kiso.geom.Point(-2, -1),
			],
			kiso.geom.SimplePolyConvexHull.LAST2FIRST
		);
		hull.build();
		
		expect(1);
		deepEqual(hull.getHullIndexes(), [0,1,5,4,0]);
	});
};
/** @namespace */
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
