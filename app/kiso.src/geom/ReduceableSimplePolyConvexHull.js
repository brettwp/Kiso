kiso.geom.ReduceableSimplePolyConvexHull = kiso.Class(
	{
		parent: kiso.geom.SimplePolyConvexHull,
		constants: {
			_POP_OPERATION_AT_HEAD: 10,
			_POP_OPERATION_AT_TAIL: 11,
			_PUSH_OPERATION: 12
		}
	},
	{
		_operationStack: [],
		
		build: function() {
			this._operationStack = [];
			this.superclass.build();
		},
		
		getOperationStack: function() {
			return this._operationStack;
		},
		
		reduceTo: function(endPointIndex) {
			// @TODO
		},
		
		_popHullPoint: function(atEnd) {
			this._operationStack.push({
				index: this.superclass._popHullPoint(atEnd),
				operation: 
					(atEnd == kiso.geom.ReduceableSimplePolyConvexHull._AT_HEAD) ?
					kiso.geom.ReduceableSimplePolyConvexHull._POP_OPERATION_AT_HEAD :
					kiso.geom.ReduceableSimplePolyConvexHull._POP_OPERATION_AT_TAIL
			});
		},
		
		_pushHullPoint: function(index) {
			this.superclass._pushHullPoint(index);
			this._operationStack.push({
				index: index,
				operation: kiso.geom.ReduceableSimplePolyConvexHull._PUSH_OPERATION
			});
		}
	}
);