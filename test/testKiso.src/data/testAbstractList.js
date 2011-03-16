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
