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