export function setDeviceToken(data) {
    return (dispatch) => {
        dispatch({type: 'SET_DEVICE_TOKEN', val: data})
    }
}