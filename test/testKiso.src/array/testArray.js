unittest.array.testArray = function() {
	module('kiso.array.Array Tests');

	test('Standard Functions', function() {
		var testArray = new kiso.array.Array([1,2,3,4,5,6]);
		expect(11);
		equal(testArray.concat([7,8,9]).toString(), '1,2,3,4,5,6,7,8,9');
		equal(testArray.join('+'), '1+2+3+4+5+6');
		equal(testArray.pop(), 6);
		equal(testArray.push(7,8,9,0).toString(), '1,2,3,4,5,7,8,9,0');
		equal(testArray.remove(3,2,10,11).toString(), '1,2,3,10,11,7,8,9,0')
		equal(testArray.reverse().toString(), '0,9,8,7,11,10,3,2,1');
		equal(testArray.shift(), 0);
		equal(testArray.slice(-6,-3).toString(), '7,11,10');
		equal(
			testArray.sort(
				function(a,b){
					var aOdd = a%2;
					var bOdd = b%2;
					if (aOdd != bOdd) {return bOdd-aOdd;} else {return b-a;}
				}
			).toString(),
			'11,9,7,3,1,10,8,2'
		);
		equal(testArray.splice(-7,2,'x','y').toString(), '9,7');
		equal(testArray.unshift('z').toString(), 'z,11,x,y,3,1,10,8,2');
	});

	test('indexOf', function() {
		var testArray = new kiso.array.Array([1,2,3,4,5]);

		expect(1);
		equal(testArray.indexOf(3), 2);
/*
		var a = new Array(0,1,2,3,4,5,6,7,8,9);
		var b = new kiso.array.Array(a);
		var d = new Date();
		var i, t1, t2;
		t1 = new Date().getTime();
		for (i=0; i<10000; i++) {
			a = new Array(0,1,2,3,4,5,6,7,8,9).reverse().toString();
		}
		t2 = new Date().getTime();
		for (i=0; i<10000; i++) {
			b = new kiso.array.Array([0,1,2,3,4,5,6,7,8,9]).reverse().toString();
		}
		t1 -= t2;
		t2 -= new Date().getTime();
		equal(0,t1,'Native');
		equal(0,t2,'Kiso');
*/
	});

	/*
every
filter
forEach
indexOf
lastIndexOf
map
reduce
reduceRight
some
	 */
};
