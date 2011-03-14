kiso.data.Tree = kiso.Class(
	{
		interfaces: kiso.data.ITree
	},
	{
		_data: null,
		_parentTree: null,
		_childTrees: null,

		initialize: function() {
			this._childTrees = new Array();
		},

		addChild: function(tree) {
			this._childTrees.push(tree);
			tree._parentTree = this;
		},

		getChildCount: function() {
			return this._childTrees.length;
		},

		getChild: function(index) {
			if (index < 0 || index >= this._childTrees.length) {
				throw new Error('Index out of bounds');
			} else {
				return this._childTrees[index];
			}
		},

		getParent: function() {
			return this._parentTree;
		},

		isLeaf: function() {
			return (this._childTrees.length == 0);
		},

		isRoot: function() {
			return (this._parentTree === null);
		},

		removeChild: function(indexOrTree) {
			if (indexOrTree instanceof kiso.data.Tree) {
				this._removeChildByTree(indexOrTree);
			} else {
				this._removeChildByIndex(indexOrTree);
			}
		},

		_removeChildByTree: function(tree) {
			for (var i=0; i<this._childTrees.length; i++) {
				if (tree == this._childTrees[i]) {
					this._removeChildByIndex(i);
				}
			}
		},

		_removeChildByIndex: function(index) {
			if (index < 0 || index >= this._childTrees.length) {
				throw new Error('Index out of bounds');
			} else {
				this._childTrees.splice(index,1);
			}
		},
		
		getData: function() {
			return this._data;
		},
		
		setData: function(data) {
			this._data = data;
		},
		
		purgeData: function() {
			this._data = null;
		},
		
		isEmpty: function() {
			return (this._data == null);
		}
	}
);
