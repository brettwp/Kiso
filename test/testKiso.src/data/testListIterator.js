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
};