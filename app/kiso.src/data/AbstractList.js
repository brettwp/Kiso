kiso.data.AbstractList = kiso.Class({
	_last: null,
	_first: null,
	_size: 0,
	
	initialize: function() {
		this._last = this._newNode();
		this._first = this._newNode();
		this._last._prev = this._first;
		this._first._next = this._last;
		this._size = 0;
	},
	
	getSize: function() {
		return this._size;
	},
	
	isEmpty: function() {
		return (this._size == 0);
	},
	
	toArray: function() {
		var arrayOut = new Array();
		var node = this._first._next;
		while (node != this._last) {
			arrayOut.push(node._data);
			node = node._next;
		}
		return arrayOut;
	},
	
	_addBefore: function(node, data) {
		var newNode = this._newNode(data);
		newNode._prev = node._prev;
		node._prev = newNode;
		newNode._next = node;
		newNode._prev._next = newNode;
		this._size++;		
	},
	
	_addAfter: function(node, data) {
		var newNode = this._newNode(data);
		newNode._next = node._next;
		node._next = newNode;
		newNode._prev = node;
		newNode._next._prev = newNode;
		this._size++;
	},
	
	_removeNode: function(node) {
		node._prev._next = node._next;
		node._next._prev = node._prev;
		this._size--;
		return node._data;
	},
	
	_getNode: function(index) {
		if (index < 0 || index >= this._size) {
			throw new Error('Index out of bounds.');
		}
		var direction = (index*2 > this._size) ? -1 : 1;
		var node = (direction == 1) ? this._first._next : this._last._prev;
		var offset = (direction == 1) ? index : (this._size - index - 1);
		while (offset > 0) {
			node = (direction == 1) ? node._next : node._prev;
			offset--;
		}
		return node;
	},

	_newNode: function(nodeData) {
		return {
			_data: nodeData,
			_next: null,
			_prev: null
		};
	}
});
