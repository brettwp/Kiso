kiso.data.ListIterator = kiso.Class(
	{
		constants: {
			STARTATFIRST: 0,
			STARTATLAST: 1
		}
	},
	{
		_list: null,
		_currentNode: null,
		_index: null,

		initialize: function(list, direction) {
			if (list.isEmpty()) {
				throw new Error('Cannot iterate on empty list');
			}
			this._list = list;
			this._currentNode = (direction == kiso.data.ListIterator.STARTATLAST) ?
				this._list._last._prev : this._list._first._next;
			this._index = (direction == kiso.data.ListIterator.STARTATLAST) ?
				this._list._size - 1 : 0;
		},

		addAfter: function(data) {
			this._list._addAfter(this._currentNode, data);
		},

		addBefore: function(data) {
			this._list._addBefore(this._currentNode, data);
			this._index++;
		},

		hasNext: function() {
			return (this._currentNode._next != this._list._last);
		},

		hasPrevious: function() {
			return (this._currentNode._prev != this._list._first);
		},

		getIndex: function() {
			return this._index;
		},

		gotoNext: function() {
			if (this.hasNext()) {
				this._currentNode = this._currentNode._next;
				this._index++;
			} else {
				throw new Error('No such element');
			}
		},

		gotoPrevious: function() {
			if (this.hasPrevious()) {
				this._currentNode = this._currentNode._prev;
				this._index--;
			} else {
				throw new Error('No such element');
			}
		},

		remove: function() {
			var oldNode = this._currentNode;
			if (this.hasNext()) {
				this.gotoNext();
			} else if (this.hasPrevious()) {
				this.gotoPrevious();
			} else {
				this._currentNode = null;
			}
			this._list._removeNode(oldNode);
		},

		getData: function() {
			return this._currentNode._data;
		},

		setData: function(data) {
			this._currentNode._data = data;
		}
	}
);