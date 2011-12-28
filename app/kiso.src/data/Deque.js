/**
 * @class
 * @description A double ended queue
 * @augments kiso.data.AbstractList
 * @implements kiso.data.IDeque
 */
kiso.data.Deque = kiso.Class(
  {
    parent: kiso.data.AbstractList,
    interfaces: kiso.data.IDeque
  },
  /** @lends kiso.data.Deque.prototype */
  {
    /**
     * @description Push a new element on to the head of the list.
     * @param data The data for the new element.
     */
    pushHead: function(data) {
      this._addBefore(this._last, data);
    },

    /**
     * @description Push a new element on to the tail of the list.
     * @param data The data for the new element.
     */
    pushTail: function(data) {
      this._addAfter(this._first, data);
    },

    /**
     * @description Pop the last element off the head of the list.
     * @returns The data of the last element.
     * @throws A error when the list is empty.
     */
    popHead: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot pop head on empty Deque');
      }
      return this._removeNode(this._last._prev);
    },

    /**
     * @description Pop the last element off the tail of the list.
     * @returns The data of the last element.
     * @throws A error when the list is empty.
     */
    popTail: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot pop tail on empty Deque');
      }
      return this._removeNode(this._first._next);
    },

    /**
     * @description Retrieves the data of the indexed element starting at the head of the list.  Does not alter the list.
     * @param {integer} index The element index (zero based) from the head of the list.
     * @returns The data from the specified element.
     *
     */
    getHeadData: function(index) {
      return this._getNode(this._size-index-1)._data;
    },

    /**
     * @description Retrieves the data of the indexed element starting at the tail of the list.  Does not alter the list.
     * @param {integer} index The element index (zero based) from the head of the list.
     * @returns The data from the specified element.
     *
     */
    getTailData: function(index) {
      return this._getNode(index)._data;
    }
  }
);
