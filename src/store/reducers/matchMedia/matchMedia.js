export default function matchMediaReducer(state = false,action) {
    if(action.type === 'SET_CURR_DIMENSION'){
        return action.val;
    }
    return state;
}