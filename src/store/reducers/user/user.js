export default function setUser(state = false,action) {
    if(action.type === 'SET_USER'){
        return action.val;
    }
    return state;
}