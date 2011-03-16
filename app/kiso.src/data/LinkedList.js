kiso.data.LinkedList = kiso.Class(
	kiso.data.AbstractList,
	{
		addFirst: function(data) {
			this._insertBefore(this._getNode(0), data);
		},

		addLast: function(data) {
			this._insertAfter(this._getNode(this._size-1), data);
		},

		addBefore: function(index, data) {
			this._insertBefore(this._getNode(index), data);
		},

		addAfter: function(index, data) {
			this._insertAfter(this._getNode(index), data);
		},

		remove: function(index) {
			return this._removeNode(this._getNode(index));
		},

		removeFirst: function() {
			return this._removeNode(this._getNode(0));
		},

		removeLast: function() {
			return this._removeNode(this._getNode(this._size-1));
		},

		getData: function(index) {
			return this._getNode(index).data;
		}
	}
);
