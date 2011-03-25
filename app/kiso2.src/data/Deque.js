kiso.data.Deque = kiso.Class(
	{
		parent: kiso.data.AbstractList,
		interfaces: kiso.data.IDeque
	},
	{
		pushHead: function(data) {
			this._addBefore(this._last, data);
		},

		pushTail: function(data) {
			this._addAfter(this._first, data);
		},

		popHead: function() {
			if (this.isEmpty()) {
				throw new Error('Cannot pop head on empty Deque');
			}
			return this._removeNode(this._last._prev);
		},

		popTail: function() {
			if (this.isEmpty()) {
				throw new Error('Cannot pop tail on empty Deque');
			}
			return this._removeNode(this._first._next);
		},

		getHeadData: function(index) {
			return this._getNode(this._size-index-1)._data;
		},

		getTailData: function(index) {
			return this._getNode(index)._data;
		}
	}
);
