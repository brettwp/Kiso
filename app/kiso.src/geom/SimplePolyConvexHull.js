kiso.geom.SimplePolyConvexHull = kiso.Class(
	{
		interfaces: kiso.geom.IConvexHull,
		constants: {
			_AT_HEAD: 0,
			_AT_TAIL: 1,
			FIRST2LAST: 2,
			LAST2FIRST: 3
		}
	},
	{
		_simplePoly: null,
		_hullIndexes: null,
		_direction: null,

		initialize: function(simplePoly, direction) {
			this.setPoints(simplePoly);
			this.setDirection(direction);
		},

		setPoints: function(simplePoly) {
			this._simplePoly = simplePoly.map(function(point) { return point.clone(); });
			this._hullIndexes = null;
		},

		getPoints: function() {
			return this._simplePoly;
		},

		setDirection: function(direction) {
			this._direction =
				(direction == kiso.geom.SimplePolyConvexHull.LAST2FIRST) ?
				kiso.geom.SimplePolyConvexHull.LAST2FIRST :
				kiso.geom.SimplePolyConvexHull.FIRST2LAST;
		},

		getHullIndexes: function() {
			return (this._hullIndexes) ? this._hullIndexes.toArray() : null;
		},

		build: function() {
			if (this._simplePoly && this._simplePoly.length >= 3) {
				this._initializeHullIndexes();
				this._expandHull();
			}
		},

		_initializeHullIndexes: function() {
			this._hullIndexes = new kiso.data.Deque();
			var indexes, point0, point1, point2;
			if (this._direction == kiso.geom.SimplePolyConvexHull.LAST2FIRST) {
				point0 = this._simplePoly.length-1;
				point1 = point0-1;
				point2 = point1-1;
			} else {
				point0 = 0;
				point1 = 1;
				point2 = 2;
			}
			if (this._simplePoly[point2].isLeftOfVector(
					this._simplePoly[point0], this._simplePoly[point1]
				)) {
				indexes = [point2, point0, point1, point2];
			} else {
				indexes = [point2, point1, point0, point2];
			}
			for (var i = 0; i < 4; i++) {
				this._hullIndexes.pushHead(indexes[i]);
			}
		},

		_expandHull: function() {
			var index, increment;
			if (this._direction == kiso.geom.SimplePolyConvexHull.LAST2FIRST) {
				index = this._simplePoly.length-4;
				increment = -1;
			} else {
				index = 3;
				increment = 1;
			}
			for (; (0 <= index && index < this._simplePoly.length); index += increment) {
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull._AT_HEAD);
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull._AT_TAIL);
			}
		},

		_maintainConvexity: function(index, atEnd) {
			var pushCurrentPoint = false;
			var popHullPoint = true;
			while (popHullPoint) {
				popHullPoint = this._isPointLeftOfVector(index, atEnd);
				if (popHullPoint) {
					this._popHullPoint(atEnd);
					pushCurrentPoint = true;
				}
			}
			if (pushCurrentPoint) {
				this._pushHullPoint(index);
			}
		},

		_isPointLeftOfVector: function(index, atEnd) {
			var atHead = (atEnd == kiso.geom.SimplePolyConvexHull._AT_HEAD);
			var index0 = atHead ? this._hullIndexes.getHeadData(1) : this._hullIndexes.getTailData(0);
			var index1 = atHead ? this._hullIndexes.getHeadData(0) : this._hullIndexes.getTailData(1);
			return !this._simplePoly[index].isLeftOfVector(
				this._simplePoly[index0], this._simplePoly[index1]
			);
		},

		_popHullPoint: function(atEnd) {
			if (atEnd == kiso.geom.SimplePolyConvexHull._AT_HEAD) {
				return this._hullIndexes.popHead()
			}	else {
				return this._hullIndexes.popTail();
			}
		},

		_pushHullPoint: function(index, atEnd) {
			if (atEnd != kiso.geom.SimplePolyConvexHull._AT_HEAD) this._hullIndexes.pushTail(index);
			if (atEnd != kiso.geom.SimplePolyConvexHull._AT_TAIL) this._hullIndexes.pushHead(index);
		}
	}
);
