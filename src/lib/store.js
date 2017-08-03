import Automerge from 'automerge'
import store from 'react-native-simple-store'

class Store {
    constructor() {
        this.receivers = [];
    }

    setReceiver(handler) {
        this.receivers.push(handler);
    }

    getLists() {
        return store.get('main_list')
            .then(res => {
                return res;
            })
            .catch(error => {
                return {};
            });
    }

    getListsOrder() {
        return store.get('main_list_order')
            .then(res => {
                return res;
            })
            .catch(error => {
                return store.get('main_list')
                    .then(res => {
                        return Object.keys(res);
                    })
                    .catch(error => {
                        return [];
                    });
            });
    }

    addListItem(data) {
        console.log(data);
        return store.update('main_list', data)
            .then(() => {
                this.receivers.forEach(function (receiver) {
                    receiver();
                }, this);
                return store.get('main_list');
            })
            .then(res => {
                console.log(res);
                return res;
            });
    }

    setLists(data) {
        return store.save('main_list', data);
    }

    setListsOrder(data) {
        return store.save('main_list_order', data);
    }

    clearData() {
        store.delete('main_list')
            .then(() => store.delete('main_list_order'));
    }
}

export default new Store();