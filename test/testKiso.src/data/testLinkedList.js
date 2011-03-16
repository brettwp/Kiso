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
