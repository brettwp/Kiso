kiso.geom.ReducibleSimplePolyConvexHull = kiso.Class(
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
		
		_popHullPoint: function(atEnd) {
			this._operationStack.push({
				index: this.superclass._popHullPoint(atEnd),
				operation: 
					(atEnd == kiso.geom.ReducibleSimplePolyConvexHull._AT_HEAD) ?
					kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_HEAD :
					kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_TAIL
			});
		},
		
		_pushHullPoint: function(index) {
			this.superclass._pushHullPoint(index);
			this._operationStack.push({
				index: index,
				operation: kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION
			});
		},
		
		reduceTo: function(polyEndPoint) {
			var operationEndPoint = this._findPushOperation(polyEndPoint);
			this._reverseOperations(operationEndPoint);
			this._simplePoly.splice(polyEndPoint);
		},
		
		_findPushOperation: function(polyEndPoint) {
			var operationEndPoint = this._operationStack.length - 1;
			for (var i = operationEndPoint; i >= 0; i--) {
				if (this._operationStack[i].operation == 
						kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION) {
					if (this._operationStack[i].index >= polyEndPoint) {
						operationEndPoint = i;
					} else {
						break;
					}
				}
			}
			return operationEndPoint;
		},
		
		_reverseOperations: function(operationEndPoint) {
			var operation;
			for (var i = this._operationStack.length-1; i > operationEndPoint; i--) {
				operation = this._operationStack.pop();
				if (operation.operation == kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION) {
					this.superclass._popHullPoint(kiso.geom.ReducibleSimplePolyConvexHull._AT_HEAD);
					this.superclass._popHullPoint(kiso.geom.ReducibleSimplePolyConvexHull._AT_TAIL);
				} else if (operation.operation == 
						kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_HEAD) {
					this.superclass._pushHullPoint(
						operation.index, 
						kiso.geom.ReducibleSimplePolyConvexHull._AT_HEAD
					);
				} else if (operation.operation == 
						kiso.geom.ReducibleSimplePolyConvexHull._POP_OPERATION_AT_TAIL) {
					this.superclass._pushHullPoint(
						operation.index, 
						kiso.geom.ReducibleSimplePolyConvexHull._AT_TAIL
					);
				}
			}
		}
	}
);