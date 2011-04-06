kiso.data.ListIterator = kiso.Class(
  {
    constants: /** @lends kiso.data.ListIterator */ {
      /** @constant */
      STARTATFIRST: 0,
      /** @constant */
      STARTATLAST: 1
    }
  },
  /** @lends kiso.data.ListIterator.prototype */
  {
    _list: null,
    _currentNode: null,
    _index: null,

    /**
     * @constructs
     * @description Creates a new iterator for the given list and in the specified direction.
     * @param {List} list The list to iterator over.
     * @param {STARTATFIRST|STARTATLAST} direction Which end of the list to start from.
     * @returns {ListIterator} A new list iterator.
     */
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

    /**
     * @description Adds a new element to the list after the current element.
     * @param data The data of the new element.
     */
    addAfter: function(data) {
      this._list._addAfter(this._currentNode, data);
    },

    /**
     * @description Adds a new element to the list before the current element.
     * @param data The data of the new element.
     */
    addBefore: function(data) {
      this._list._addBefore(this._currentNode, data);
      this._index++;
    },

    /**
     * @description Returns whether there is a next element.
     * @returns True if the current element has an element after it.
     */
    hasNext: function() {
      return (this._currentNode._next != this._list._last);
    },

    /**
     * @description Returns whether there is a previous element.
     * @returns True if the current element has an element before it.
     */
    hasPrevious: function() {
      return (this._currentNode._prev != this._list._first);
    },

    /**
     * @description Get the index of the current element.
     * @returns The zero based index from the front of the list of the current element.
     */
    getIndex: function() {
      return this._index;
    },

    /**
     * @description Moves the ListIterator to the next element in the list.
     * @throws An error if there is no next element.
     */
    gotoNext: function() {
      if (this.hasNext()) {
        this._currentNode = this._currentNode._next;
        this._index++;
      } else {
        throw new Error('No such element');
      }
    },

    /**
     * @description Moves the ListIterator to the previous element in the list.
     * @throws An error if there is no previous element.
     */
    gotoPrevious: function() {
      if (this.hasPrevious()) {
        this._currentNode = this._currentNode._prev;
        this._index--;
      } else {
        throw new Error('No such element');
      }
    },

    /**
     * @description Removes the current element from the list.
     */
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

    /**
     * @description Gets the data of the current element without altering the list.
     * @returns The data for the current element.
     */
    getData: function() {
      return this._currentNode._data;
    },

    /**
     * @description Sets the data of the current element.
     * @param data The new data for the current element.
     */
    setData: function(data) {
      this._currentNode._data = data;
    }
  }
);