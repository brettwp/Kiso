kiso.geom.Point = kiso.Class(/** @lends kiso.geom.Point.prototype */{
	_x: 0,
	_y: 0,

  /**
   * @constructs
   * @description Create a new <code>Point</code> from another <code>Point</code> or from XY coordinates.
   * @param {Number|Point} xOrPoint Either another <code>Point</code> or X coordinate
   * @param {Number} [y] Y coordinate
   * If a <code>Point</code> is specified then the X and Y are copied from it to the new point.
   * If both X and Y are specified then a new point is created with those coordinates.
   */
	initialize: function(xOrPoint, y) {
		if (arguments.length == 2) {
			this.setXY(xOrPoint, y);
		} else if (arguments.length == 1) {
			this.setXY(xOrPoint._x, xOrPoint._y);
		} else {
			this.setXY(0, 0);
		}
	},

  /**
   * @description Set the coordinates of the the point.
   * @param {Number} x The X coordinate
   * @param {Number} y The Y coordinate
   */
	setXY: function(x, y) {
		this._x = x;
		this._y = y;
	},

  /**
   * @description Get the X coordinate
   * @returns {Number} The X coordinate.
   */
	getX: function() {
		return this._x;
	},

  /**
   * @description Get the Y coordinate
   * @returns {Number} The Y coordinate.
   */
	getY: function() {
		return this._y;
	},

  /**
   * @description Creates a copy of the point
   * Clone creates a new point with the same X and Y coordinates.
   */
	clone: function() {
		return new kiso.geom.Point(this);
	},

  /**
   * @description Returns true if the given point has the same X and Y coordinates.
   * @returns {Boolean} True if the given point has the same X and Y coordinates.
   */
	equals: function(point) {
		return (this._x === point._x & this._y === point._y);
	},

  /**
   * @description Determines if the point is to the left of the vector from <code>point0</code>
   *   to <code>point1</code>, where the order of the points determines the direction of the
   *   vector.
   * @param {Point} point0 The starting point of the vector
   * @param {Point} point1 The end point of the vector
   * @returns {Boolean} True if the point is left of the vector from <code>point0</code>
   *   to <code>point1</code>.
   * @see kiso.geom.Point#isRightOfVector
   */
	isLeftOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) >=
			(point1._x - this._x)*(point0._y - this._y)
		);
	},

	//TODO: Check formulas for point being on line (add flag to include/exclude case?)
  /**
   * @description Determines if the point is to the right of the vector from <code>point0</code>
   *   to <code>point1</code>, where the order of the points determines the direction of the
   *   vector.
   * @param {Point} point0 The starting point of the vector
   * @param {Point} point1 The end point of the vector
   * @returns {Boolean} True if the point is right of the vector from <code>point0</code>
   *   to <code>point1</code>.
   * @see kiso.geom.Point#isLeftOfVector
   */
	isRightOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) <=
			(point1._x - this._x)*(point0._y - this._y)
		);
	},

  /**
   * @description Computes the slope of the line from the point to the given point.
   * @param {Point} point The ending point of the line to compute the slope of.
   * @returns {Number} The slope of the line from the point to the given point.
   * Note that if the line is vertical (i.e. both Xs are the same) the slope of the line will be
   * <code>Infinity</code>.
   */
	slopeTo: function(point) {
		return (point._y - this._y)/(point._x - this._x);
	},

  /**
   * @description Computes the square of the distance to the given point.
   * @param {Point} point The point to compute the distance to.
   * @returns {Number} The square of the distance to the given point.
   * @see kiso.geom.Point#distanceTo
   */
	distanceSquaredTo: function(point) {
		return (point._x - this._x)*(point._x - this._x) + (point._y - this._y)*(point._y - this._y);
	},

  /**
   * @description Computes the distance to the given point.
   * @param {Point} point The point to compute the distance to.
   * @returns {Number} The distance to the given point.
   * This function requires taking a square root and so is slower than computing the square of the
   * distance.
   * @see kiso.geom.Point#distanceSquaredTo
   */
	distanceTo: function(point) {
		return Math.sqrt(this.distanceSquaredTo(point));
	},

  /**
   * @description Computes the square of the shortest distance to the line connecting the two specified points.
   * @param {Point} point0 The first end point of the line
   * @param {Point} point1 The second endo point of the line
   * @returns {Number} The square of the distance to the line formed by the two specified points.
   * @see distanceToLine
   */
	distanceSquaredToLine: function(point0, point1) {
		var distance;
		if (point0._x == point1._x && point0._y == point1._y) {
			distance = this.distanceSquaredTo(point0);
		} else {
			distance = (point1._x - point0._x)*(point0._y - this._y) -
				(point0._x - this._x)*(point1._y - point0._y);
			distance = distance*distance/point0.distanceSquaredTo(point1);
		}
		return distance;
	},

  /**
   * @description Computes the shortest distance to the line connecting the two specified points.
   * @param {Point} point0 The first end point of the line
   * @param {Point} point1 The second endo point of the line
   * @returns {Number} The distance to the line formed by the two specified points.
   * Note that this function requres taking a square root.
   * @see distanceSquaredToLine
   */
	distanceToLine: function(point0, point1) {
		return Math.sqrt(this.distanceSquaredToLine(point0, point1));
	}
});