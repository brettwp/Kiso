unittest.geom.testSimplePolyApproximatorDP = function() {
	module('kiso.geom.SimplePolyApproximatorDP Tests');

	test('Simplify', function() {
		var newPoly = new kiso.geom.SimplePolyApproximatorDP([
			new kiso.geom.Point(0,  9.80),
			new kiso.geom.Point(1, -4.40),
			new kiso.geom.Point(2, -1.20),
			new kiso.geom.Point(3, -8.00),
			new kiso.geom.Point(4, -5.90),
			new kiso.geom.Point(5, -3.20),
			new kiso.geom.Point(6, -9.80),
			new kiso.geom.Point(7,  4.40),
			new kiso.geom.Point(8, -2.20),
			new kiso.geom.Point(9, -1.70)
		]);

		expect(6);
		newPoly.setTolerance(8.6);
		newPoly.build();
		deepEqual(newPoly.getIndexes(), [0,3,9]);
		newPoly.setTolerance(5.6);
		newPoly.build();
		deepEqual(newPoly.getIndexes(), [0,3,7,9]);
		newPoly.setTolerance(3.4);
		newPoly.build();
		deepEqual(newPoly.getIndexes(), [0,3,5,6,7,9]);
		newPoly.setTolerance(1.3);
		newPoly.build();
		deepEqual(newPoly.getIndexes(), [0,1,2,3,5,6,7,9]);
		newPoly.setTolerance(1.1);
		newPoly.build();
		deepEqual(newPoly.getIndexes(), [0,1,2,3,5,6,7,8,9]);
		newPoly.setTolerance(0.1);
		newPoly.build();
		deepEqual(newPoly.getIndexes(), [0,1,2,3,4,5,6,7,8,9]);
	});
};
