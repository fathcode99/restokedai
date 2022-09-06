const initial_state = {
    history: []
}

const historyReducer = (state = initial_state, action) => {
    switch (action.type) {
        case 'HISTORY_UPDATE':
            return {
                ...state,
                history: action.payload
            }
        default:
            return state
    }
}

export default historyReducer