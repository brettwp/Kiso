unittest.geom.testSimplePolyApproximatorHS = function() {
	module('kiso.geom.SimplePolyApproximatorHS Tests');

	test('Simplify', function() {
		var poly = [
			new kiso.geom.Point(0.0,  9.80),
			new kiso.geom.Point(0.5, -0.30),
			new kiso.geom.Point(1.0, -4.40),
			new kiso.geom.Point(1.5,  6.80),
			new kiso.geom.Point(2.0, -1.20),
			new kiso.geom.Point(2.5,  6.00),
			new kiso.geom.Point(3.0, -8.00),
			new kiso.geom.Point(3.5, -1.00),
			new kiso.geom.Point(4.0, -5.90),
			new kiso.geom.Point(4.5, -3.90),
			new kiso.geom.Point(5.0, -3.20),
			new kiso.geom.Point(5.5, -7.40),
			new kiso.geom.Point(6.0, -9.80),
			new kiso.geom.Point(6.5,  3.80),
			new kiso.geom.Point(7.0,  4.40),
			new kiso.geom.Point(7.5, -3.60),
			new kiso.geom.Point(8.0, -2.20),
			new kiso.geom.Point(8.5,  0.30),
			new kiso.geom.Point(9.0, -1.70),
			new kiso.geom.Point(9.5, -4.30)
		];
		var newPolyDP = new kiso.geom.SimplePolyApproximatorDP(poly);
		var newPolyHS = new kiso.geom.SimplePolyApproximatorHS(poly);

		expect(6);
		newPolyDP.setTolerance(7.4);
		newPolyDP.build();
		newPolyHS.setTolerance(7.4);
		newPolyHS.build();
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes());
		/*
		newPolyDP.setTolerance(3.4);
		newPolyDP.build();
		newPolyHS.setTolerance(3.4);
		newPolyHS.build();
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes());
		newPolyDP.setTolerance(1.8);
		newPolyDP.build();
		newPolyHS.setTolerance(1.8);
		newPolyHS.build();
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes());
		newPolyDP.setTolerance(1.7);
		newPolyDP.build();
		newPolyHS.setTolerance(1.7);
		newPolyHS.build();
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes());
		newPolyDP.setTolerance(1.1);
		newPolyDP.build();
		newPolyHS.setTolerance(1.1);
		newPolyHS.build();
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes());
		newPolyDP.setTolerance(0.8);
		newPolyDP.build();
		newPolyHS.setTolerance(0.8);
		newPolyHS.build();
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes());
		*/
	});
};
