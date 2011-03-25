kiso.geom.SimplePolyApproximatorHS = kiso.Class(
	{
		parent: kiso.geom.SimplePolyApproximatorDP
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
			if (sectionSize > 6) {
				if (section.firstToLastHull) {
					section.firstToLastHull.reduceTo(sectionSize);
				} else {
					section.firstToLastHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint+1)
					);
					section.firstToLastHull.build();
				}
				if (section.lastToFirstHull) {
					section.lastToFirstHull.reduceTo(section.lastPoint - section.firstPoint);
				} else {
					section.lastToFirstHull = new kiso.geom.ReducibleSimplePolyConvexHull(
						this._simplePoly.slice(section.firstPoint, section.lastPoint+1),
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
			if ((section.lastPoint - section.firstPoint) > 6) {
				this._useHullToFindFarthest();
			} else {
				this.superclass._findFarthestInCurrentSection();
			}
		},

		_useHullToFindFarthest: function() {
			var section = this._iterator.getData();
			var point0 = this._simplePoly[section.firstPoint];
			var point1 = this._simplePoly[section.lastPoint];
			var hullData = {
				point0: point0,
				point1: point1,
				vectorX: point1.getX() - point0.getX(),
				vectorY: point1.getY() - point0.getY(),
				hullIndexes: section.firstToLastHull.getHullIndexes(),
				distanceSquared: null,
				farthestPoint: null
			};
			for (var i=0; i<hullData.hullIndexes.length; i++) {
				hullData.hullIndexes[i] += section.firstPoint;
			}
			this._bruteSearchHull(hullData);
			if (hullData.hullIndexes.length > 6) {
				this._binarySearchHull(hullData);
			} else {
				this._bruteSearchHull(hullData);
			}
			section.farthestPoint = hullData.farthestPoint;
			section.distanceSquared = hullData.distanceSquared;
		},

		_binarySearchHull: function(hullData) {
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
			this._compareFarthestCandidate(hullData, edgeFar1);
			this._compareFarthestCandidate(hullData, edgeFar2);
		},

		_computeSlopeSign: function(hullData, index0, index1) {
			var point0 = this._simplePoly[hullData.hullIndexes[index0]];
			var point1 = this._simplePoly[hullData.hullIndexes[index1]];
			var dotProd = hullData.vectorX*(point1.getX() - point0.getX()) +
				hullData.vectorY*(point1.getY() - point0.getY());
			return dotProd < 0 ? -1 : 1;
		},

		_bruteSearchHull: function(hullData) {
			for (var i=0; i<hullData.hullIndexes.length; i++) {
				this._compareFarthestCandidate(hullData, i);
			}
		},

		_compareFarthestCandidate: function(hullData, edgeIndex) {
			var distanceSquared = this._simplePoly[hullData.hullIndexes[edgeIndex]]
				.distanceSquaredToLine(hullData.point0, hullData.point1);
			if (hullData.distanceSquared == null ||
					(distanceSquared > hullData.distanceSquared) ||
					(
						(distanceSquared == hullData.distanceSquared) &&
						(hullData.hullIndexes[edgeIndex] < hullData.farthestPoint)
					)) {
				hullData.distanceSquared = distanceSquared;
				hullData.farthestPoint = hullData.hullIndexes[edgeIndex];
			}
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
