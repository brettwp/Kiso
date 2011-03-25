kiso.geom.SimplePolyApproximatorHS = kiso.Class(
	{
		parent: kiso.geom.SimplePolyApproximatorDP
		//interfaces: kiso.geom.IPolyApproximator
	},
	{
		_initializeSections: function() {
			this.superclass._initializeSections();
			var section = this._subSections.getData();
			this._updateSectionHulls(section);
		},

		_seperateCurrentSection: function() {
			this.superclass._seperateCurrentSection();
			var sectionLeft, sectionRight;
			sectionLeft = this._iterator.getData();
			this._iterator.gotoNext();
			sectionRight = this._iterator.getData();
			this._iterator.gotoPrevious();
			sectionRight.lastToFirstHull = sectionLeft.lastToFirstHull;
			sectionLeft.lastToFirstHull = null;
			this._updateSectionHulls(sectionLeft);
			this._updateSectionHulls(sectionRight);
		},

		_updateSectionHulls: function(section) {
			var sectionSize = section.lastPoint - section.firstPoint;
			if (sectionSize > 3) {
				if (section.firstToLastHull) {
					section.firstToLastHull.reduceTo(sectionSize);
				} else {
					section.firstToLastHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint)
					);
					section.firstToLastHull.build();
				}
				if (section.lastToFirstHull) {
					section.lastToFirstHull.reduceTo(section.lastPoint - section.firstPoint);
				} else {
					section.lastToFirstHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint),
						kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST
					);
					section.lastToFirstHull.build();
				}
			} else {
				section.lastToFirstHull = null;
				section.firstToLastHull = null;
			}
		},

		_findFarthestInCurrentSection: function() {
			var section = this._iterator.getData();
			if ((section.lastPoint - section.firstPoint) <=3) {
				this.superclass._findFarthestInCurrentSection();
			} else {
				this._useHullToFindFarthest();
			}
		},

		_useHullToFindFarthest: function() {
			var section = this._iterator.getData();
			var point0 = this._simplePoly[section.firstPoint];
			var point1 = this._simplePoly[section.lastPoint];
			var hullData = {
				vectorX: point1.getX() - point0.getX(),
				vectorY: point1.getY() - point0.getY(),
				hullIndexes: section.firstToLastHull.getHullIndexes()
			};
			var edgeLow, edgeHigh, edgeMid, edgeFar1, edgeFar2, slopeSignBase, slopeSignBreak;
			edgeLow = 0;
			edgeHigh = hullData.hullIndexes.length-1;
			slopeSignBase = this._computeSlopeSign(hullData, edgeLow, edgeLow+1);
			do {
				edgeMid = Math.floor((edgeLow + edgeHigh)/2);
				slopeSignBreak = this._computeSlopeSign(hullData, edgeMid, edgeMid+1);
				if (slopeSignBase == slopeSignBreak) {
					if (slopeSignBase == this._computeSlopeSign(hullData, edgeLow, edgeMid+1)) {
						edgeLow = edgeMid + 1;
					} else {
						edgeHigh = edgeMid;
					}
				}
			} while (slopeSignBase == slopeSignBreak);
			edgeFar1 = edgeMid;
			edgeFar2 = edgeMid;
			while (edgeLow < edgeFar1) {
				edgeMid = Math.floor((edgeLow + edgeFar1)/2);
				if (slopeSignBase == this._computeSlopeSign(hullData, edgeMid, edgeMid+1)) {
					edgeLow = edgeMid + 1;
				} else {
					edgeFar1 = edgeMid;
				}
			}
			while (edgeFar2 < edgeHigh) {
				edgeMid = Math.floor((edgeFar2 + edgeHigh)/2);
				if (slopeSignBase == this._computeSlopeSign(hullData, edgeMid, edgeMid+1)) {
					edgeHigh = edgeMid;
				} else {
					edgeFar2 = edgeMid + 1;
				}
			}
			edgeFar2--;
			var distanceSquared1 = this._simplePoly[hullData.hullIndexes[edgeFar1]]
				.distanceSquaredToLine(point0, point1);
			var distanceSquared2 = this._simplePoly[hullData.hullIndexes[edgeFar2]]
				.distanceSquaredToLine(point0, point1);
			if (distanceSquared1 > distanceSquared2) {
				section.distanceSquared = distanceSquared1;
				section.farthestPoint = hullData.hullIndexes[edgeFar1];
			} else {
				section.distanceSquared = distanceSquared2;
				section.farthestPoint = hullData.hullIndexes[edgeFar2];
			}
		},

		_computeSlopeSign: function(hullData, index0, index1) {
			var point0 = this._simplePoly[hullData.hullIndexes[index0]];
			var point1 = this._simplePoly[hullData.hullIndexes[index1]];
			var dotProd = hullData.vectorX*(point1.getX() - point0.getX()) +
				hullData.vectorY*(point1.getY() - point0.getY());
			return dotProd < 0 ? -1 : 1;
		},

		_newSection: function() {
			return {
				firstPoint: null,
				lastPoint: null,
				farthestPoint: null,
				distanceSquared: null,
				firstToLastHull: null,
				lastToFirstHull: null
			};
		}
	}
);
