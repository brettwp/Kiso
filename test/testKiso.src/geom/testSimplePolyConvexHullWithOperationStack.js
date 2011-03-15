unittest.geom.testSimplePolyConvexHullWithOperationStack = function() {
	var testPoints = [
		new kiso.geom.Point(2, 0),
		new kiso.geom.Point(1, 1),
		new kiso.geom.Point(0, 0),
		new kiso.geom.Point(1, 0.5),
		new kiso.geom.Point(1, -1),
		new kiso.geom.Point(-2, -1),
	];
	var POP_OPERATION_AT_HEAD = kiso.geom.SimplePolyConvexHullWithOperationStack._POP_OPERATION_AT_HEAD
	var POP_OPERATION_AT_TAIL = kiso.geom.SimplePolyConvexHullWithOperationStack._POP_OPERATION_AT_TAIL
	var PUSH_OPERATION = kiso.geom.SimplePolyConvexHullWithOperationStack._PUSH_OPERATION

	module('kiso.geom.SimplePolyConvexHullWithOperationStack Tests');
	
	test('6 point hull', function() {
		var hull = new kiso.geom.SimplePolyConvexHullWithOperationStack(testPoints);
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

	test('6 point hull reverse directionWithOperationStack', function() {
		var hull = new kiso.geom.SimplePolyConvexHullWithOperationStack(
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
};
