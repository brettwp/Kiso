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
};
