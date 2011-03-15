kiso.data.IndexedDoubleEndedQueue = kiso.Class(
	kiso.data.DoubleEndedQueue,
	{
		_nodeCursor: null,
		
		getHeadData: function(index) {
			if (this.isEmpty()) {
				return null;
			} else {
				return this._getIndexedData(index, -1);
			}
		},
		
		getTailData: function(index) {
			if (this.isEmpty()) {
				return null;
			} else {
				return this._getIndexedData(index, 1);
			}
		},
		
		_getIndexedData: function(index, direction) {
			var node = (direction == 1) ? this._tail._next : this._head._prev;
			while (index > 0 && node != null) {
				node = (direction == 1) ? node._next : node._prev;
				index--;
			}
			if (node == null || node == this._tail) {
				return null;
			} else {
				return node._data;
			}
		},
		
		toArray: function() {
			var arrayOut = new Array();
			var node = this._tail._next;
			while (node != this._head) {
				arrayOut.push(node._data);
				node = node._next;
			}
			return arrayOut;
		}
	}
);
