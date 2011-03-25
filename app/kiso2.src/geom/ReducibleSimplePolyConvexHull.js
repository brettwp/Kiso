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

		_initializeHullIndexes: function() {
			this.superclass._initializeHullIndexes();
			this._operationStack.push({
				index: this._hullIndexes.getHeadData(0),
				operation: kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION
			});
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
			this._reduceSimplePoly(polyEndPoint);
		},

		_findPushOperation: function(polyEndPoint) {
			var operationEndPoint = this._operationStack.length - 1;
			for (var index = operationEndPoint; index >= 0; index--) {
				if (this._operationStack[index].operation ==
						kiso.geom.ReducibleSimplePolyConvexHull._PUSH_OPERATION) {
					operationEndPoint = index;
					if (this._indexOrderInDirectionOfHull(
							this._operationStack[index].index, polyEndPoint)) {
						break;
					}
				}
			}
			return operationEndPoint;
		},

		_indexOrderInDirectionOfHull: function(index0, index1) {
			return (
				(
					(this._direction == kiso.geom.ReducibleSimplePolyConvexHull.FIRST2LAST)
						&&
					(index1 >= index0)
				) || (
					(this._direction == kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST)
						&&
					(index1 <= index0)
				)
			);
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
		},

		_reduceSimplePoly: function(polyEndPoint) {
			if (this._direction == kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST) {
				this._simplePoly.splice(0, polyEndPoint);
				this._reindexHull(polyEndPoint);
			} else {
				this._simplePoly.splice(polyEndPoint+1);
			}
		},

		_reindexHull: function(polyEndPoint) {
			if (this._direction == kiso.geom.ReducibleSimplePolyConvexHull.LAST2FIRST) {
				var iterator = new kiso.data.ListIterator(this._hullIndexes);
				while(1) {
					iterator.setData(iterator.getData() - polyEndPoint);
					if (iterator.hasNext()) {
						iterator.gotoNext();
					} else {
						break;
					}
				}
			}
		}
	}
);