kiso.geom.SimplePolySimplifyDP = kiso.Class(
	{
		interfaces: kiso.geom.IPolyApproximator
	},
	{
		_simplePoly: null,
		_subSections: null,
		_stopTolerance: null,
		_stopToleranceSquared: null,
		_iterator: null,

		initialize: function(simplePoly) {
			this.setPoints(simplePoly);
		},

		setPoints: function(simplePoly) {
			var section = this._newSection();
			section.firstPoint = 0;
			section.lastPoint = simplePoly.length-1;
			this._simplePoly = simplePoly.map(function(point) {return point.clone();});
			this._subSections = new kiso.data.LinkedList();
			this._subSections.addFirst(section);
		},

		simplify: function() {
			this._iterator = new kiso.data.ListIterator(this._subSections);
			var doNext = true;
			while(doNext) {
				this._simplifyCurrentSection();
				doNext = this._iterator.hasNext();
				if (doNext) this._iterator.gotoNext();
			}
		},

		_simplifyCurrentSection: function() {
			var section = this._iterator.getData();
			while (section.distanceSquared == null) {
				this._findFarthestInCurrentSection();
				if (section.distanceSquared > this._stopToleranceSquared) {
					this._seperateCurrentSection();
				}
				section = this._iterator.getData();
			}
		},

		_seperateCurrentSection: function() {
			var sectionLeft = this._iterator.getData();
			if (sectionLeft.lastPoint - sectionLeft.firstPoint == 2) {
				sectionLeft.status = kiso.geom.SimplePolySimplifyDP._3POINTS_DIVIDED;
			} else {
				var sectionRight = this._newSection();
				sectionRight.firstPoint = sectionLeft.farthestPoint;
				sectionRight.lastPoint = sectionLeft.lastPoint;
				this._updateSectionStatus(sectionRight);
				sectionLeft.lastPoint = sectionLeft.farthestPoint;
				sectionLeft.farthestPoint = null;
				sectionLeft.distanceSquared = null;
				this._updateSectionStatus(sectionLeft);
				this._iterator.addAfter(sectionRight);
			}
		},

		_findFarthestInCurrentSection: function() {
			var section = this._iterator.getData();
			var point0 = this._simplePoly[section.firstPoint];
			var point1 = this._simplePoly[section.lastPoint];
			var deltaX = point1.getX() - point0.getX();
			var deltaY = point1.getY() - point0.getY();
			var numeratorMax = 0;
			var numerator, indexMax;
			for (var index = section.firstPoint+1; index < section.lastPoint; index++) {
				numerator = Math.abs(
					(deltaX * (point0.getY() - this._simplePoly[index].getY())) +
					(deltaY * (point0.getX() - this._simplePoly[index].getX()))
				);
				if (numerator > numeratorMax) {
					numeratorMax = numerator;
					indexMax = index;
				}
			}
			section.farthestPoint = indexMax;
			section.distanceSquared = numeratorMax*numeratorMax /
				Math.sqrt(deltaX*deltaX + deltaY+deltaY);
		},

		_newSection: function() {
			return {
				firstPoint: null,
				lastPoint: null,
				farthestPoint: null,
				distanceSquared: null
			};
		},

		setTolerance: function(tolerance) {
			this._stopTolerance = tolerance;
			this._stopToleranceSquared = tolerance*tolerance;
		},

		getTolerance: function() {
			return this._stopTolerance;
		},

		getIndexes: function() {
			var iterator = new kiso.data.ListIterator(this._subSections);
			var doNext = true;
			var sectionArray = [];
			while(doNext) {
				sectionArray.push(iterator.getData().firstPoint);
				doNext = iterator.hasNext();
				if (doNext) iterator.gotoNext();
			}
			sectionArray.push(iterator.getData().lastPoint);
			return sectionArray;
		}
	}
);
