unittest.geom.testSimplePolySimplifyDP = function() {
	module('kiso.geom.SimplePolySimplifyDP Tests');

	test('Simplify', function() {
		var newPoly = new kiso.geom.SimplePolyApproximator([
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

		expect(2);
		newPoly.simplifyOnce();
		deepEqual(newPoly.getCurrentIndexes(), [0,3,9]);
		newPoly.simplifyOnce();
		deepEqual(newPoly.getCurrentIndexes(), [0,3,7,9]);
		newPoly.simplifyOnce();
		deepEqual(newPoly.getCurrentIndexes(), [0,1,3,7,9]);
	});
};
