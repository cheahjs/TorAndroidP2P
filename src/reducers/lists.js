const lists = (state=[], action) => {
    switch (action.type) {
        case 'ADD_LIST':
        case 'MODIFY_LIST':
        case 'DELETE_LIST':
        default:
            return state;
    }
}

export default lists;