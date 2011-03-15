unittest.data.testDoubleEndedQueue = function() {
	module('kiso.data.DoubleEndedQueue Tests');

	test('New Deque is empty', function() {
		var deque = new kiso.data.DoubleEndedQueue();
		expect(1);
		ok(deque.isEmpty());
	});
	
	test('Push/pop head and tail', function() {
		var deque1 = new kiso.data.DoubleEndedQueue();
		deque1.pushHead(5);
		deque1.pushHead(3);
		deque1.pushHead(4);
		var deque2 = new kiso.data.DoubleEndedQueue();
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
};
