UnitTest.testTree = function() {
	module('Kiso.Tree Tests');

	test('Add children and get by index', function() {
		var testNode = new Kiso.Tree();
		var childNode1 = new Kiso.Tree();
		var childNode2 = new Kiso.Tree();
		testNode.addChild(childNode1);
		testNode.addChild(childNode2);
		expect(2);
		ok(testNode.getChild(0) == childNode1);
		ok(testNode.getChild(1) == childNode2);
	});

	test('Add children and check parent connection', function() {
		var parentNode = new Kiso.Tree();
		var childNode = new Kiso.Tree();
		parentNode.addChild(childNode);
		expect(2);
		ok(parentNode.getChild(0) == childNode);
		ok(childNode.getParent() == parentNode);
	});

	test('Unlinked node has zero children', function() {
		var testNode = new Kiso.Tree();
		expect(1);
		equal(testNode.getChildCount(), 0);
	});

	test('Get number children', function() {
		var parentNode = new Kiso.Tree();
		parentNode.addChild(new Kiso.Tree());
		parentNode.addChild(new Kiso.Tree());
		parentNode.addChild(new Kiso.Tree());
		expect(1);
		equal(parentNode.getChildCount(), 3);
	});

	test('Remove child by index', function() {
		var parentNode = new Kiso.Tree();
		var childNode = new Kiso.Tree();
		parentNode.addChild(new Kiso.Tree());
		parentNode.addChild(new Kiso.Tree());
		parentNode.addChild(childNode);
		parentNode.removeChild(1);
		expect(2);
		equal(parentNode.getChildCount(), 2);
		ok(parentNode.getChild(1) == childNode);
	});

	test('Remove child by node', function() {
		var parentNode = new Kiso.Tree();
		var childNode1 = new Kiso.Tree();
		var childNode2 = new Kiso.Tree();
		parentNode.addChild(new Kiso.Tree());
		parentNode.addChild(childNode1);
		parentNode.addChild(childNode2);
		parentNode.removeChild(childNode1);
		expect(2);
		equal(parentNode.getChildCount(), 2);
		ok(parentNode.getChild(1) == childNode2);
	});

	test('Is leaf, node, and/or root?', function() {
		var parentNode = new Kiso.Tree();
		var childNode1 = new Kiso.Tree();
		var childNode2 = new Kiso.Tree();
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
		var testNode = new Kiso.Tree();
		var testObj = new Kiso.Class({ data: null });
		testNode.setData(testObj);
		expect(4);
		equal(testNode.getData(), testObj);
		ok(!testNode.isEmpty());
		testNode.purgeData();
		equal(testNode.getData(), null);
		ok(testNode.isEmpty());
	});
};
