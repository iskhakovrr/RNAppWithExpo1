export default function setDeviceToken(state = false,action) {
    if(action.type === 'SET_DEVICE_TOKEN'){
        return action.val;
    }
    return state;
}