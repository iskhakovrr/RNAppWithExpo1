export function setUser(data) {
    return (dispatch) => {
        dispatch({type: 'SET_USER', val: data})
    }
}