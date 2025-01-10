export default function setUser(state = false,action) {
    if(action.type === 'SET_TOKEN'){
        return action.val;
    }
    return state;
}