unittest.geom.testSimplePolyApproximatorHS = function() {
	module('kiso.geom.SimplePolyApproximatorHS Tests');

	test('Smooth down to all points (tol = 0)', function() {
		var poly = [
			new kiso.geom.Point(0.0,  9.8),
			new kiso.geom.Point(0.5, -0.3),
			new kiso.geom.Point(1.0, -4.4),
			new kiso.geom.Point(1.5,  6.8),
			new kiso.geom.Point(2.0, -1.2),
			new kiso.geom.Point(2.5,  6.0),
			new kiso.geom.Point(3.0, -8.0),
			new kiso.geom.Point(3.5, -1.0),
			new kiso.geom.Point(4.0, -5.9),
			new kiso.geom.Point(4.5, -3.9),
			new kiso.geom.Point(5.0, -3.2),
			new kiso.geom.Point(5.5, -7.4),
			new kiso.geom.Point(6.0, -9.8),
			new kiso.geom.Point(6.5,  3.8),
			new kiso.geom.Point(7.0,  4.4),
			new kiso.geom.Point(7.5, -3.6),
			new kiso.geom.Point(8.0, -2.2),
			new kiso.geom.Point(8.5,  0.3),
			new kiso.geom.Point(9.0, -1.7),
			new kiso.geom.Point(9.5, -4.3)
		];
		var newPolyDP = new kiso.geom.SimplePolyApproximatorDP(poly);
		var newPolyHS = new kiso.geom.SimplePolyApproximatorHS(poly);

		expect(6);
		newPolyDP.setTolerance(7.4);
		newPolyDP.build();
		newPolyHS.setTolerance(7.4);
		newPolyHS.build();
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes());
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
	});

	test('Polyline with many points ensures we use Tag logic', function() {
		var polyBase = [
			[0.0,  9.8],
			[0.5, -0.3],
			[1.0, -4.4],
			[1.5,  6.8],
			[2.0, -1.2],
			[2.5,  6.0],
			[3.0, -8.0],
			[3.5, -1.0],
			[4.0, -5.9],
			[4.5, -3.9],
			[5.0, -3.2],
			[5.5, -7.4],
			[6.0, -9.8],
			[6.5,  3.8],
			[7.0,  4.4],
			[7.5, -3.6],
			[8.0, -2.2],
			[8.5,  0.3],
			[9.0, -1.7],
			[9.5, -4.3]
		];
		var poly = [];
		for (var repeat=0; repeat<20; repeat++) {
			for (var index=0; index<10; index++) {
				poly.push(new kiso.geom.Point(
					polyBase[index][0] + (repeat*10),
					polyBase[index][1] + polyBase[repeat][1]
				));
			}
		}
		var newPolyDP = new kiso.geom.SimplePolyApproximatorDP(poly);
		var newPolyHS = new kiso.geom.SimplePolyApproximatorHS(poly);
		var setBuildBoth = function(dp, hs, tol) {
			dp.setTolerance(tol);
			dp.build();
			hs.setTolerance(tol);
			hs.build();
		}

		expect(8);
		setBuildBoth(newPolyDP, newPolyHS, 25);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
		setBuildBoth(newPolyDP, newPolyHS, 15);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
		setBuildBoth(newPolyDP, newPolyHS, 10);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
		setBuildBoth(newPolyDP, newPolyHS, 5);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
		setBuildBoth(newPolyDP, newPolyHS, 3);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
		setBuildBoth(newPolyDP, newPolyHS, 1);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
		setBuildBoth(newPolyDP, newPolyHS, 0.5);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
		setBuildBoth(newPolyDP, newPolyHS, 0.1);
		deepEqual(newPolyDP.getIndexes(), newPolyHS.getIndexes(), newPolyHS.getIndexes().length);
	});
};
