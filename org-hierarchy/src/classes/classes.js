class Person {

    constructor() {
        this._id = 0;
        this._parent = 0;
        this._name = "";
        this._childlist = [];
        this._root = 0;
        this._height = 0;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get parent() {
        return this._parent;
    }

    set parent(parent) {
        this._parent = parent;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get root() {
        return this._root;
    }

    set root(root) {
        this._root = root;
    }

    get height() {
        return this._height;
    }

    set height(height) {
        this._height = height;
    }

    get childlist() {
        return this._childlist;
    }

    addchild(personid) {
      this._childlist[this._childlist.length] = personid;
    }

    removeChild(personid) {
        this._childlist = this._childlist.filter(item => item !== personid);
    }
}

module.exports = {
    Person
};