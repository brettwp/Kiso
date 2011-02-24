UnitTest.testInterface = function() {
	module('Kiso.Interface Tests');

  test('Create Interface', function() {
    expect(1);
    var testInterface = Kiso.Interface(['foo', 'bar', 'baz']);
    deepEqual(testInterface.getMethods(), ['foo', 'bar', 'baz']);
  });

  test('Extend Interface', function() {
    var parentInterface = Kiso.Interface(['foo', 'bar']);
    var extendedInterface = Kiso.Interface(parentInterface, ['baz', 'tim']);
    expect(1);
    deepEqual(extendedInterface.getMethods(), ['foo', 'bar', 'baz', 'tim']);
  });
};
