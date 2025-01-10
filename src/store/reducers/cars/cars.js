export default function setCars(state = false,action) {
    if(action.type === 'SET_CARS'){
        return action.val;
    }
    return state;
}