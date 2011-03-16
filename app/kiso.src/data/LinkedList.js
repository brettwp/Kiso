kiso.data.LinkedList = kiso.Class(
	{
		parent: kiso.data.AbstractList,
		interfaces: kiso.data.ILinkedList
	},
	{
		addFirst: function(data) {
			this._insertAfter(this._first, data);
		},

		addLast: function(data) {
			this._insertBefore(this._last, data);
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
			if (this.isEmpty()) {
				throw new Error('Cannot remove first from empty LinkedList');
			}
			return this._removeNode(this._first._next);
		},

		removeLast: function() {
			if (this.isEmpty()) {
				throw new Error('Cannot remove last from empty LinkedList');
			}
			return this._removeNode(this._last._prev);
		},

		getData: function(index) {
			return this._getNode(index)._data;
		}
	}
);
