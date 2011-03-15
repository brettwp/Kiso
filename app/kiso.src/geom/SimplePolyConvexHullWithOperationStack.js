kiso.geom.SimplePolyConvexHullWithOperationStack = kiso.Class(
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
		
		getReducedHull: function(endPointIndex) {
			
		},
		
		_popHullPoint: function(atEnd) {
			this._operationStack.push({
				index: this.superclass._popHullPoint(atEnd),
				operation: 
					(atEnd == kiso.geom.SimplePolyConvexHull._AT_HEAD) ?
					kiso.geom.SimplePolyConvexHullWithOperationStack._POP_OPERATION_AT_HEAD :
					kiso.geom.SimplePolyConvexHullWithOperationStack._POP_OPERATION_AT_TAIL
			});
		},
		
		_pushHullPoint: function(index) {
			this._operationStack.push({
				index: index,
				operation: kiso.geom.SimplePolyConvexHullWithOperationStack._PUSH_OPERATION
			});
			this.superclass._pushHullPoint(index);
		}
	}
);