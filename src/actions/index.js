export const addTodo = (id, list_id, title, starred) => ({
    type: 'ADD_TODO',
    id,
    list_id,
    title,
    starred,
    created_at: Date.now()
})

export const toggleCompleteTodo = (id) => ({
    type: 'TOGGLE_COMPLETE_TODO',
    id,
    time: Date.now()
})

export const toggleStarredTodo = (id) => ({
    type: 'TOGGLE_STARRED_TODO',
    id,
    time: Date.now()
})

export const modifyTodo = (id, title) => ({
    type: 'MODIFY_TODO',
    id,
    title,
    time: Date.now()
})

export const deleteTodo = (id) => ({
    type: 'DELETE_TODO',
    id
})


export const addList = (id, title) => ({
    type: 'ADD_LIST',
    id,
    title,
    created_at: Date.now()
})

export const deleteList = (id) => ({
    type: 'DELETE_LIST',
    id
})

export const modifyList = (id) => ({
    type: 'MODIFY_LIST',
    id, 
    time: Date.now()
})