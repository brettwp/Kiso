kiso.geom.SimplePolyApproximatorHS = kiso.Class(
	{
		interfaces: kiso.geom.IPolyApproximator
	},
	{
		_simplePoly: null,
		_subSections: null,
		_stopTolerance: null,
		_stopToleranceSquared: null,

		initialize: function(simplePoly) {
			this.setPoints(simplePoly);
		},

		setPoints: function(simplePoly) {
			this._simplePoly = simplePoly.map(function(point) {return point.clone();});
		},

		build: function() {
			while (this._currentToleranceSquared > this._stopTolerance) {
				this.simplifyOnce();
			}
		},

		_initializeSections: function() {
			var section = this._newSection();
			section.firstPoint = 0;
			section.lastPoint = simplePoly.length-1;
			section.firstToLastHull = new kiso.geom.ReducibleSimplePolyConvexHull(simplePoly);
			section.lastToFirstHull = new kiso.geom.ReducibleSimplePolyConvexHull(
				simplePoly,
				kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST
			);
			this._subSections = new kiso.data.LinkedList();
			this._subSections.addFirst(section);
		},

		simplifyOnce: function() {
			for (var index=0; index<this._subSections.getSize(); index++) {
				this._simplifyCurrentSection(index);
			}
		},

		_simplifyCurrentSection: function(index) {
			if (this._subSections.getData(index).distanceSquared > this._stopToleranceSquared) {
				this._seperateCurrentSection(index);
			}
		},

		_seperateCurrentSection: function(index) {
			var sectionLeft = this._subSections.getData(index);
			var sectionRight = this._newSection();
			sectionRight.firstPoint = sectionLeft.farthestPoint;
			sectionRight.lastPoint = sectionLeft.lastPoint;
			sectionRight.lastToFirstHull = sectionLeft.lastToFirstHull;
			this._reduceAndUpdateSection(sectionRight);
			sectionLeft.lastPoint = sectionLeft.farthestPoint;
			sectionLeft.farthestPoint = null;
			sectionRight.lastToFirstHull = null;
			this._reduceAndUpdateSection(sectionRight);
		},

		_reduceAndUpdateSection: function(section) {
			if (section.firstToLastHull) {
				section.firstToLastHull.reduceTo(section.lastPoint - section.firstPoint);
			} else {
				section.firstToLastHull = new kiso.geom.ReducibleSimplePolyConvexHull(
					this._simplePoly.slice(section.firstPoint, section.lastPoint)
				);
			}
			if (section.lastToFirstHull) {
				section.lastToFirstHull.reduceTo(section.lastPoint - section.firstPoint);
			} else {
				section.lastToFirstHull = new kiso.geom.ReducibleSimplePolyConvexHull(
					this._simplePoly.slice(section.firstPoint, section.lastPoint),
					kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST
				);
			}
		},

		_newSection: function(simplePoly) {
			return {
				firstPoint: null,
				lastPoint: null,
				farthestPoint: null,
				distanceSquared: null,
				firstToLastHull: null,
				lastToFirstHull: null
			};
		},

		setStopTolerance: function(tolerance) {
			this._stopTolerance = tolerance;
			this._stopToleranceSquared = tolerance*tolerance;
		},

		getStopTolerance: function() {
			return this._stopTolerance;
		},

		getCurrentTolerance: function() {
			return Math.sqrt(this._currentToleranceSquared);
		}
	}
);
