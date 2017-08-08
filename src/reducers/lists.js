const lists = (state=[], action) => {
    switch (action.type) {
        case 'ADD_LIST':
            return [
                ...state,
                {
                    id: action.id,
                    title: action.title,
                    created_at: action.created_at
                }
            ];
        case 'MODIFY_LIST':
            return state.map(list => {
                if (list.id == action.id) {
                    return Object.assign({}, list, {
                        title: action.title
                    });
                }
                return list;
            });
        case 'DELETE_LIST':
            return state.filter(list => list.id != action.id);
        default:
            return state;
    }
}

export default lists;