import Automerge from 'automerge'
import store from 'react-native-simple-store'

class Store {
    getLists() {
        return [
            { key: 'Inbox' },
            { key: 'Work' },
            { key: 'Groceries' },
            { key: 'Housekeeping' },
            { key: 'Bills' }
        ];
    }
}

export default new Store();