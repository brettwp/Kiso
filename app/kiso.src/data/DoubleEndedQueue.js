kiso.data.DoubleEndedQueue = kiso.Class({
	_head: null,
	_tail: null,
	
	initialize: function() {
		this._head = this._newNode();
		this._tail = this._newNode();
		this._head._prev = this._tail;
		this._tail._next = this._head;
	},
	
	pushHead: function(data) {
		var node = this._newNode(data);
		node._prev = this._head._prev;
		node._next = this._head;
		this._head._prev._next = node;
		this._head._prev = node;
	},

	pushTail: function(data) {
		var node = this._newNode(data);
		node._prev = this._tail;
		node._next = this._tail._next;
		this._tail._next._prev = node;
		this._tail._next = node;
	},
	
	_newNode: function(nodeData) {
		return {
			_data: nodeData,
			_next: null,
			_prev: null
		};
	},
	
	popHead: function() {
		if (this.isEmpty()) {
			throw new Error('Cannot popHead on empty DoubleEndedQueue');
		} else {
			var node = this._head._prev;
			node._prev._next = this._head;
			this._head._prev = node._prev;
			return node._data;
		}
	},
	
	popTail: function() {
		if (this.isEmpty()) {
			throw new Error('Cannot popTail on empty DoubleEndedQueue');
		} else {
			var node = this._tail._next;
			node._next._prev = this._tail;
			this._tail._next = node._next;
			return node._data;	
		}
	},
	
	isEmpty: function() {
		return (this._tail._next == this._head);
	}
});