kiso.data.Deque = kiso.Class(
	kiso.data.AbstractList,
	{
		pushHead: function(data) {
			this._insertBefore(this._getNode(0), data);
		},

		pushTail: function(data) {
			this._insertAfter(this._getNode(this._size-1), data);
		},

		popHead: function() {
			return this._removeNode(this._getNode(0));
		},

		popTail: function() {
			return this._removeNode(this._getNode(this._size-1));
		},

		getHeadData: function(index) {
			return this._getNode(index).data;
		},

		getTailData: function(index) {
			return this._getNode(this._size-index-1).data;
		}
	}
);
