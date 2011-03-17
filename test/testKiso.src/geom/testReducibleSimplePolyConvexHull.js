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
