import { combineReducers } from 'redux'
import todos from './todos'
import lists from './lists'
import contacts from './contacts'
import name from './name'

const todoApp = combineReducers({
    todos,
    lists,
    contacts,
    name
});

export default todoApp;