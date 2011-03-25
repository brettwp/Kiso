kiso.geom.Point = kiso.Class({
	_x: 0,
	_y: 0,
	
	initialize: function(xOrPoint, y) {
		if (arguments.length == 2) {
			this.setXY(xOrPoint, y);
		} else if (arguments.length == 1) {
			this.setXY(xOrPoint._x, xOrPoint._y);
		} else {
			this.setXY(0, 0);
		}
	},
	
	setXY: function(x, y) {
		this._x = x;
		this._y = y;
	},
	
	getX: function() {
		return this._x;
	},
	
	getY: function() {
		return this._y;
	},
	
	clone: function() {
		return new kiso.geom.Point(this);
	},
	
	equals: function(point) {
		return (this._x === point._x & this._y === point._y);
	},
	
	isLeftOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) >= 
			(point1._x - this._x)*(point0._y - this._y)
		);
	},
	
	//TODO: Check formulas for point being on line (add flag to include/exclude case?)
	
	isRightOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) <=
			(point1._x - this._x)*(point0._y - this._y)
		);
	},
		
	slopeTo: function(point) {
		return (point._y - this._y)/(point._x - this._x);
	},

	distanceSquaredTo: function(point) {
		return (point._x - this._x)*(point._x - this._x) + (point._y - this._y)*(point._y - this._y);
	},
	
	distanceTo: function(point) {
		return Math.sqrt(this.distanceSquaredTo(point));
	},
	
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
	
	distanceToLine: function(point0, point1) {
		return Math.sqrt(this.distanceSquaredToLine(point0, point1));
	}
});