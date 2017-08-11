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

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    listId: action.listId,
                    title: action.title,
                    starred: action.starred,
                    created_at: action.created_at,
                    completed_at: undefined
                }
            ];
        case 'TOGGLE_COMPLETE_TODO':
            return state.map(todo => {
                if (todo.id == action.id) {
                    return Object.assign({}, todo, {
                        completed_at: !todo.completed_at ? action.time : undefined
                    });
                }
                return todo;
            });
        case 'TOGGLE_STARRED_TODO':
            return state.map(todo => {
                if (todo.id == action.id) {
                    return Object.assign({}, todo, {
                        starred: !todo.starred
                    });
                }
                return todo;
            });
        case 'MODIFY_TODO':
            return state.map(todo => {
                if (todo.id == action.id) {
                    return Object.assign({}, todo, {
                        title: action.title
                    });
                }
                return todo;
            });
        case 'DELETE_TODO':
            return state.filter(todo => todo.id != action.id);
        case 'DELETE_LIST':
            return state.filter(todo => todo.listId != action.id);
        default:
            return state;
    }
}

export default todos;