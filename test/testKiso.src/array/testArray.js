unittest.array.testArray = function() {
	module('kiso.array Standard Tests');

	test('every', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		expect(1);
		equal(kiso.array.every(testArray, function(v, i, a) { return (v > 0); }), true);
	});

	test('filter', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		expect(1);
		deepEqual(kiso.array.filter(testArray, function(v, i, a) {return (v > 4);}), [5,6,7,8,9]);
	});

	test('forEach', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		expect(1);
		kiso.array.forEach(testArray, function(v, i, a) {a[i] = v + 4;});
		deepEqual(testArray, [5,6,7,8,9,10,11,12,13]);
	});

	test('(last)indexOf', function() {
		var testArray = [1,2,3,3,3,6,7,8,9,3,0,0,0];
		expect(2);
		equal(kiso.array.indexOf(testArray, 3), 2);
		equal(kiso.array.lastIndexOf(testArray, 3, -5), 4);
	});

	test('map', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		expect(1);
		deepEqual(
			kiso.array.map(testArray, function(v, i, a) { if (v>6) a.push(v+20); return v+10; }),
			[11,12,13,14,15,16,17,18,19]
		);
	});

	test('reduce(Right)', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		expect(2);
		deepEqual(
			kiso.array.reduce(testArray, function(p, c, i, a) { return p+(c%2 ? -c : c); }, 1),
			-4
		);
		deepEqual(
			kiso.array.reduceRight(testArray, function(p, c, i, a) { return p++; }),
			9
		);
	});

	test('some', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		expect(1);
		equal(kiso.array.some(testArray, function(v, i, a) { return (v > 6); }), true);
	});


	module('kiso.array Non-native Tests', {
		setup: function() {
			this.oldFunc = kiso.array._useNativeOrWrapper;
			kiso.array._unittest = false;
			kiso.array._useNativeOrWrapper = function(func, args) {
				this._unittest = true;
				return this['_'+func].apply(this, args);
			}
		},
		teardown: function() {
			kiso.array._useNativeOrWrapper = this.oldFunc;
			delete kiso.array._unittest;
		}
	});

	test('every', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		var object = new (kiso.Class({
			_acc: 0,
			addCompare: function(v,i,a) {this._acc+=v;return (v>0)&&(a[i]==v);},
			test: function(a) {return kiso.array.every(a, this.addCompare, this) && (this._acc==45);}
		}))();

		expect(3);
		equal(kiso.array.every(testArray, function(v, i, a) {
			return (v > 0);
		}), true);
		equal(object.test(testArray), true);
		equal(kiso.array._unittest, true);
	});

	test('filter', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		var object = new (kiso.Class({
			_acc: 0,
			addFilter: function(v,i,a) {this._acc+=v;return (v>4)&&(a[i]==v);},
			test: function(a) {return kiso.array.filter(a, this.addFilter, this).length==5 && (this._acc==45);}
		}))();

		expect(3);
		deepEqual(kiso.array.filter(testArray, function(v, i, a) {return (v > 4);}), [5,6,7,8,9]);
		equal(object.test(testArray), true);
		equal(kiso.array._unittest, true);
	});

	test('forEach', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		var object = new (kiso.Class({
			_acc: 0,
			addForEach: function(v,i,a) {this._acc+=v;if (v>10) a.push(v+10);},
			test: function(a) {kiso.array.forEach(a, this.addForEach, this);return this._acc;}
		}))();

		expect(4);
		kiso.array.forEach(testArray, function(v, i, a) {a[i] = v + 4;});
		deepEqual(testArray, [5,6,7,8,9,10,11,12,13]);
		equal(object.test(testArray), 81);
		deepEqual(testArray, [5,6,7,8,9,10,11,12,13,21,22,23]);
		equal(kiso.array._unittest, true);
	});

	test('(last)indexOf', function() {
		var testArray = [1,2,3,3,3,6,7,8,9,3,0,0,0];

		expect(3);
		equal(kiso.array.indexOf(testArray, 3), 2);
		equal(kiso.array.lastIndexOf(testArray, 3, -5), 4);
		equal(kiso.array._unittest, true);
	});

	test('map', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		var object = new (kiso.Class({
			_acc: 0,
			map: function(v,i,a) {return v+10;},
			test: function(a) {return kiso.array.map(a, this.map, this);}
		}))();

		expect(3);
		deepEqual(
			kiso.array.map(testArray, function(v, i, a) {if (v>6) a.push(v+20);return v+10;}),
			[11,12,13,14,15,16,17,18,19]
		);
		deepEqual(object.test(testArray), [11,12,13,14,15,16,17,18,19,37,38,39]);
		equal(kiso.array._unittest, true);
	});

	test('reduce(Right)', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];

		expect(4);
		equal(
			kiso.array.reduce(testArray, function(p, c, i, a) { return p+(c%2 ? -c : c); }),
			-3
		);
		deepEqual(
			kiso.array.reduce(testArray,
				function(p, c, i, a) { (i==0 ? p[i]=c : p[i] = p[i-1] + c); return p; },
				[]
			),
			[1,3,6,10,15,21,28,36,45]
		);
		deepEqual(
			kiso.array.reduceRight(testArray,
				function(p, c, i, a) { p[0] += c; p[i+1] = a[i]+i; return p; },
				[1]
			),
			[46,1,3,5,7,9,11,13,15,17]
		);
		equal(kiso.array._unittest, true);
	});

	test('some', function() {
		var testArray = [1,2,3,4,5,6,7,8,9];
		var object = new (kiso.Class({
			_acc: 0,
			addCompare: function(v,i,a) {this._acc+=v; return v>4;},
			test: function(a) {return kiso.array.some(a, this.addCompare, this) && (this._acc==15);}
		}))();

		expect(3);
		equal(kiso.array.some(testArray, function(v, i, a) {
			return (v > 6);
		}), true);
		equal(object.test(testArray), true);
		equal(kiso.array._unittest, true);
	});

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
};
