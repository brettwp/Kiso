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
	
	equals: function(point) {
		return (this._x === point._x & this._y === point._y);
	},
	
	isLeftOfVector: function(point0, point1) {
		return (
			(point0._x - this._x)*(point1._y - this._y) >= 
				(point1._x - this._x)*(point0._y - this._y)
		);
	},
	
	distanceSquaredTo: function(point) {
		return (point._x - this._x)*(point._x - this._x) + (point._y - this._y)*(point._y - this._y);
	},
	
	distanceTo: function(point) {
		return Math.sqrt(this.distanceSquaredTo(point));
	},
	
	slopeTo: function(point) {
		return (point._y - this._y)/(point._x - this._x);
	},
	
	distanceToLine: function(point0, point1) {
		var lineLength = point0.distanceTo(point1);
		return (lineLength == 0) ? 
			this.distanceTo(point0) :
			this.unscaledDistanceToLine(point0, point1)/lineLength;
	},
	
	unscaledDistanceToLine: function(point0, point1) {
		return Math.abs(
			(point1._x - point0._x)*(point0._y - this._y) - 
			(point0._x - this._x)*(point1._y - point0._y)
		);
	}
});