/**
 * @class
 * @description A linked list.
 * @augments kiso.data.AbstractList
 * @implements kiso.data.ILinkedList
 */
kiso.data.LinkedList = kiso.Class(
  {
    parent: kiso.data.AbstractList,
    interfaces: kiso.data.ILinkedList
  },
  /** @lends kiso.data.LinkedList.prototype */
  {
    /**
     * @description Add a new element to the front of the list.
     * @param data The data for the new first element.
     */
    addFirst: function(data) {
      this._addAfter(this._first, data);
    },

    /**
     * @description Add a new element to the end of the list.
     * @param data The data for the new last element.
     */
    addLast: function(data) {
      this._addBefore(this._last, data);
    },

    /**
     * @description Add a new element just before the indexed element.
     * @param {Integer} index The zero based offset from the front of the list.
     * @param data The data for the new element.
     */
    addBefore: function(index, data) {
      this._addBefore(this._getNode(index), data);
    },

    /**
     * @description Add a new element just after the indexed element.
     * @param {Integer} index The zero based offset from the front of the list.
     * @param data The data for the new element.
     */
    addAfter: function(index, data) {
      this._addAfter(this._getNode(index), data);
    },

    /**
     * @description Remove the specfied element.
     * @param {Integer} index The zero based offset from the front of the list.
     * @throws A an error if the index is out of bounds.
     */
    remove: function(index) {
      return this._removeNode(this._getNode(index));
    },

    /**
     * @description Remove the first element in the list.
     * @throws A an error if the list is empty.
     */
    removeFirst: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot remove first from empty LinkedList');
      }
      return this._removeNode(this._first._next);
    },

    /**
     * @description Remove the last element in the list.
     * @throws A an error if the list is empty.
     */
    removeLast: function() {
      if (this.isEmpty()) {
        throw new Error('Cannot remove last from empty LinkedList');
      }
      return this._removeNode(this._last._prev);
    },

    /**
     * @description Get the data of an element without altering the list.
     * @param {Integer} index The zero base offset from the front of the list.
     * @returns The data from the specified element.
     * @throws A an error if the list is empty.
     */
    getData: function(index) {
      return this._getNode(index)._data;
    }
  }
);
