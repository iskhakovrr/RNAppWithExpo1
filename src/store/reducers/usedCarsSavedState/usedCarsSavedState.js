export default function usedCarsSavedState(state = false,action) {
    if(action.type === 'SET_USED_CARS_DATA'){
        return action.val;
    }
    return state;
}