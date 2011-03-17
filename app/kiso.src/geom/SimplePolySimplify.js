kiso.geom.SimplePolySimplify = kiso.Class(
	{
		interfaces: kiso.geom.IPolyReduce
	},
	{
		_simplePoly: null,
		_subSections: null,
		_stopTolerance: null,
		_currentTolerance: null,
		
		initialize: function(simplePoly) {
			this.setPoints(simplePoly);
		},
		
		setPoints: function(simplePoly) {
			this._simplePoly = simplePoly;
			this._subSection = [{
					firstPoint: 0,
					lastPoint: simplePoly.length-1,
					farthestPoint: null,
					firstToLastHull: new kiso.geom.ReducibleSimplePolyConvexHull(simplePoly),
					lastToFirstHull: new kiso.geom.ReducibleSimplePolyConvexHull(
						simplePoly,
						kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST
					)
			}];
			this._currentTolerance = null;
		},
		
		simplify: function() {
			while (this._currentTolerance > this._stopTolerance) {
				this.simplifyOnce();
			}
		},
		
		simplifyOnce: function() {
			for (var i=0; i<this._subSection.length-1; i++) {
				this._simplifySection
			}
		},
		
		setStopTolerance: function(tolerance) {
			this._stopTolerance = tolerance;
		},
		
		getStopTolerance: function() {
			return this._stopTolerance;
		},
		
		getCurrentTolerance: function() {
			return this._getCurrentTolerance;
		}
	}
);
