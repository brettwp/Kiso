unittest.geom.testPoint = function() {
	module('kiso.geom.Point Tests');

	test('Point Constructor', function() {
		var testPoint1 = new kiso.geom.Point();
		var testPoint2 = new kiso.geom.Point(2,3);
		var testPoint3 = new kiso.geom.Point(testPoint2);
		expect(3);
		ok(testPoint1.getX() == 0 && testPoint1.getY() == 0);
		ok(testPoint2.getX() == 2 && testPoint2.getY() == 3);
		ok(testPoint3.getX() == 2 && testPoint3.getY() == 3);
	});

	test('Getters & Setters', function() {
		var testPoint = new kiso.geom.Point();
		testPoint.setXY(4,5);
		expect(1);
		ok(testPoint.getX() == 4 && testPoint.getY() == 5);
	});
	
	test('Equal points', function() {
		var testPoint1 = new kiso.geom.Point(4, 5);
		var testPoint2 = new kiso.geom.Point(4, 5);
		expect(1);
		ok(testPoint1.equals(testPoint2));
	});
	
	test('Distance between points', function() {
		var testPoint1 = new kiso.geom.Point(2, 3);
		var testPoint2 = new kiso.geom.Point(5, 7);
		expect(2);
		equals(testPoint1.distanceTo(testPoint2), 5);
		equals(testPoint1.distanceSquaredTo(testPoint2), 25);
	});
	
	test('Slope between points', function() {
		var testPoint1 = new kiso.geom.Point(2, 3);
		var testPoint2 = new kiso.geom.Point(2, 7);
		var testPoint3 = new kiso.geom.Point(5, 7);
		expect(2);
		equals(testPoint1.slopeTo(testPoint2), Infinity);
		equals(testPoint1.slopeTo(testPoint3), 4/3);
	});
	
	test('Distance from point to line', function() {
		var testPoint1 = new kiso.geom.Point(1, 0);
		var testPoint2 = new kiso.geom.Point(0, 0);
		var testPoint3 = new kiso.geom.Point(1, 1);
		expect(2);
		ok(testPoint1.distanceToLine(testPoint2, testPoint3) - Math.SQRT2/2 < 1e-6);
		equals(testPoint1.unscaledDistanceToLine(testPoint2, testPoint3), 1);
	});
};
