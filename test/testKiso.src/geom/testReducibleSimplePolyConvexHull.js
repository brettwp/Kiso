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

	module('kiso.geom.ReducalbeSimplePolyConvexHull Tests');
	
	test('6 point hull', function() {
		var hull = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints);
		hull.build();
		
		expect(1);
		deepEqual(
			hull.getOperationStack(), 
			[ 
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
				{ index: 3, operation: POP_OPERATION_AT_TAIL },
				{ index: 1, operation: PUSH_OPERATION },
				{ index: 1, operation: POP_OPERATION_AT_HEAD },
				{ index: 3, operation: POP_OPERATION_AT_HEAD },
				{ index: 0, operation: PUSH_OPERATION },
			]
		);
	});
	
	test('Reduce Hull', function() {
		var mapFunc = function(point) { return [point.getX(), point.getY()]; };
		var hull1 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints);
		hull1.build();
		hull1.reduceTo(4);
		var hull2 = new kiso.geom.ReducibleSimplePolyConvexHull(testPoints);
		hull2.build();
		hull2.reduceTo(3);
		expect(4);
		deepEqual(hull1.getPoints().map(mapFunc), testPoints.slice(0, 4).map(mapFunc));
		deepEqual(hull1.getHullIndexes(), [4,0,1,2,4]);
		deepEqual(hull2.getPoints().map(mapFunc), testPoints.slice(0, 3).map(mapFunc));
		deepEqual(hull2.getHullIndexes(), [4,0,1,2,4]);
	});
};
