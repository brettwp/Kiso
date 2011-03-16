unittest.data.testDeque = function() {
	module('kiso.data.Deque Tests');

	test('New Deque is empty', function() {
		var deque = new kiso.data.Deque();
		expect(1);
		ok(deque.isEmpty());
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
