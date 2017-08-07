import Automerge from 'automerge';
import store from 'react-native-simple-store';

/**
 * Data store that is initialized on start
 * Format:
 * *  main_list: Dictionary of List
 * *  main_list_order: Ordering of keys to display
 */
class Store {
    constructor() {
        this.receivers = [];
        this.cache = {
            main_list: {},
            main_list_order: []
        };
        this.readyCache();
    }

    setReceiver(handler) {
        this.receivers.push(handler);
    }

    removeReceiver(handler) {
        this.receivers = this.receivers.filter(x => x !== handler);
    }

    readyCache() {
        this.ready = false;
        this._getLists().then(() => {
            return this._getListsOrder();
        }).then(() => {
            this.ready = true;
            console.log('cache ready');
            console.log(this.cache);
        });
    }

    _getLists() {
        return store.get('main_list')
            .then(res => {
                if (res == null ||
                    (res.constructor === Array && res.length == 0))
                    res = {};
                this.cache.main_list = res;
                for (var key in this.cache.main_list) {
                    if (this.cache.main_list.hasOwnProperty(key)) {
                        var element = this.cache.main_list[key];
                        var list = new List();
                        this.cache.main_list[key] = Object.assign(list, element);
                    }
                }
                return res;
            });
    }

    _getListsOrder() {
        return store.get('main_list_order')
            .then(res => {
                if (res == null)
                    res = [];
                this.cache.main_list_order = res;
                return res;
            });
    }

    getLists() {
        console.log(this);
        if (!this.ready)
            return {};
        return this.cache.main_list;
    }

    getListsOrder() {
        if (!this.ready)
            return [];
        return this.cache.main_list_order;
    }

    addListItem(key, title) {
        if (key in this.cache.main_list) {
            this.cache.main_list[key] = Object.assign({}, this.cache.main_list[key]);
            this.cache.main_list[key].title = title;
            console.log('updating ' + key);
        } else {
            this.cache.main_list[key] = new List(key, title);
            console.log('creating new list: ' + key);
        }
        this.flushCache();
    }

    deleteListItem(key) {
        if (key in this.cache.main_list) {
            delete this.cache.main_list[key];
            this.flushCache();
        }
    }

    getListItem(key) {
        if (!this.ready)
            return {};
        return this.cache.main_list[key];
    }

    addListTodo(key, title, starred = false) {
        let position = this.getListTodos(key).length;
        let todo = new Todo(title, position, starred);
        this.cache.main_list[key].todos.push(todo);
        this.flushCache();
    }

    getListTodo(list_key, todo_key) {
        return Object.assign(new Todo(),
                this.cache.main_list[list_key].todos.find(x => x.id == todo_key));
    }

    getListTodos(key) {
        if (!this.ready)
            return [];
        return this.cache.main_list[key].todos.map(x => Object.assign(new Todo(), x));
    }

    setLists(data) {
        this.cache.main_list = data;
        this.flushCache();
    }

    setListsOrder(data) {
        this.cache.main_list_order = data;
        this.flushCache();
    }

    flushCache() {
        this._triggerReceivers();
        return store.save('main_list', this.cache.main_list)
                    .then(() => {
                        return store.save('main_list_order', this.cache.main_list_order);
                    });
    }

    toggleStarred(list_key, todo_key) {
        let todo = this.getListTodo(list_key, todo_key);
        todo.toggleStarred();
        let index = this.cache.main_list[list_key].todos.findIndex(x => x.id == todo_key);
        this.cache.main_list[list_key].todos[index] = todo;
        this.flushCache();
    }

    toggleComplete(list_key, todo_key) {
        let todo = this.getListTodo(list_key, todo_key);
        todo.toggleComplete();
        let index = this.cache.main_list[list_key].todos.findIndex(x => x.id == todo_key);
        this.cache.main_list[list_key].todos[index] = todo;
        this.flushCache();
    }

    hasListChanged(a, b) {
        if (a !== b)
            return true;
        if (a.title != b.title)
            return true;
        if (a.todos != b.todos)
            return true;
        if (a.todos.length != b.todos.length)
            return true;
        for (var todo of a.todos) {
            let bFind = b.todos.find(x => x.id == todo.id);
            if (bFind === undefined)
                return true;
            if (bFind != todo)
                return true;
        }
        return false;
    }

    _triggerReceivers() {
        this.receivers.forEach(function (receiver) {
            receiver();
        });
    }

    clearData() {
        return store.delete('main_list')
            .then(store.delete('main_list_order'))
            .then(this.readyCache());
    }
}

class Todo {
    constructor(title, position, starred=false) {
        this.id = Date.now();
        this.title = title;
        this.position = position;
        this.starred = starred;
        this.created_at = Date.now();
    }

    get complete() {
        return !!this.completed_at;
    }

    toggleStarred() {
        this.starred = !this.starred;
    }

    toggleComplete() {
        if (!!this.completed_at) {
            this.completed_at = null;
        } else {
            this.completed_at = Date.now();
        }
    }
}

class List {
    constructor(key, title) {
        this.key = key;
        this.title = title;
        this.todos = [];
        this.created_at = Date.now();
        this.last_modified = Date.now();
    }

    get length() {
        return this.todos.length;
    }

    get incompleteLength() {
        return this.todos.filter(x => !x.completed_at).length;
    }
}

export default new Store();
export { Todo, List };