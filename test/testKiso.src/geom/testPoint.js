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
};
