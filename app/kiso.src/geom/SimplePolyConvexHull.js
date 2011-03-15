kiso.geom.SimplePolyConvexHull = kiso.Class(
	{
		interfaces: kiso.geom.IConvexHull,
		constants: {
			AT_HEAD: 0,
			AT_TAIL: 1
		}
	},
	{
		_simplePoly: null,
		_hullIndexes: null,
		
		initialize: function(simplePoly) {
			this.setPoints(simplePoly);
		},
		
		setPoints: function(simplePoly) {
			this._simplePoly = simplePoly;
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
			this._hullIndexes = new kiso.data.IndexedDoubleEndedQueue();
			var indexes = [2, 1, 0, 2];
			if (this._simplePoly[2].isLeftOfVector(this._simplePoly[0], this._simplePoly[1])) {
				indexes = [2, 0, 1, 2];
			}
			for (var i = 0; i < 4; i++) {
				this._hullIndexes.pushHead(indexes[i]);
			}
		},
		
		_expandHull: function() {
			for (var index = 3; index < this._simplePoly.length; index++) {
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull.AT_HEAD);
				this._maintainConvexity(index, kiso.geom.SimplePolyConvexHull.AT_TAIL);
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
				this._hullIndexes.pushHead(index);
				this._hullIndexes.pushTail(index);
			}
		},
		
		_isPointLeftOfVector: function(index, atEnd) {
			var atHead = (atEnd == kiso.geom.SimplePolyConvexHull.AT_HEAD);
			var index0 = atHead ? this._hullIndexes.getHeadData(1) : this._hullIndexes.getTailData(0);
			var index1 = atHead ? this._hullIndexes.getHeadData(0) : this._hullIndexes.getTailData(1);
			return !this._simplePoly[index].isLeftOfVector(
				this._simplePoly[index0], this._simplePoly[index1]
			);
		},
		
		_popHullPoint: function(atEnd) {
			if (atEnd == kiso.geom.SimplePolyConvexHull.AT_HEAD) {
				this._hullIndexes.popHead()
			}	else {
				this._hullIndexes.popTail();
			}
		}
	}
);
