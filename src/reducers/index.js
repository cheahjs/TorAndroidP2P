import { combineReducers } from 'redux'
import documents from './documents'
import lists from './lists'
import contacts from './contacts'
import name from './name'

const todoApp = combineReducers({
    documents,
    lists,
    contacts,
    name
});

export default todoApp;