/*
 * Copyright 2017 Jun Siang Cheah
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import Automerge from 'automerge'

const documents = (state = [], action) => {
    switch (action.type) {
        case 'ADD_LIST':
            let amState = Automerge.init();
            amState = Automerge.changeset(amState, "Init list", doc => {
                doc.id = action.id;
                doc.title = action.title,
                    doc.created_at = action.created_at,
                    doc.last_modified = action.created_at,
                    doc.todos = [],
                    doc.peers = []
            });
            return [
                ...state,
                amState
            ];
        case 'MODIFY_LIST':
            return state.map(list => {
                if (list.id == action.id) {
                    return Automerge.changeset(list, "Change title", doc => {
                        doc.title = action.title;
                    });
                }
                return list;
            });
        case 'DELETE_LIST':
            return state.filter(list => list.id != action.id);
        case 'ADD_TODO':
            return state.map(list => {
                if (list.id == action.listId) {
                    return Automerge.changeset(list, "Add todo", doc => {
                        doc.todos.push({
                            id: action.id,
                            listId: action.listId,
                            title: action.title,
                            starred: action.starred,
                            created_at: action.created_at,
                            completed_at: null
                        });
                        doc.last_modified = action.time;
                    })
                }
                return list;
            });
        case 'TOGGLE_COMPLETE_TODO':
            return state.map(list => {
                if (list.id == action.listId) {
                    return Automerge.changeset(list, "Toggle complete todo", doc => {
                        for (todo of doc.todos) {
                            if (todo.id == action.id) {
                                todo.completed_at = !todo.completed_at ? action.time : null;
                            }
                        }
                    });
                }
                return list;
            });
        case 'TOGGLE_STARRED_TODO':
            return state.map(list => {
                if (list.id == action.listId) {
                    return Automerge.changeset(list, "Toggle starred todo", doc => {
                        for (todo of doc.todos) {
                            if (todo.id == action.id) {
                                todo.starred = !todo.starred
                            }
                        }
                        doc.last_modified = action.time;
                    })
                }
                return list;
            });
        case 'MODIFY_TODO':
            return state.map(list => {
                if (list.id == action.listId) {
                    return Automerge.changeset(list, "Modify todo", doc => {
                        for (todo of doc.todos) {
                            if (todo.id == action.id) {
                                todo.title = action.title;
                            }
                        }
                        doc.last_modified = action.time;
                    })
                }
                return list;
            });
        case 'DELETE_TODO':
            return state.map(list => {
                if (list.id == action.listId) {
                    return Automerge.changeset(list, "Modify todo", doc => {
                        Object.keys(list.todos).forEach(key => {
                            let todo = list.todos[key];
                            if (todo.id == action.id)
                                delete list.todos[key];
                        })
                        doc.last_modified = action.time;
                    });
                }
                return list;
            });
        default:
            return state;
    }
}

export default documents;