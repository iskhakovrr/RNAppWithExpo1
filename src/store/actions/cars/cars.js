export function setCars(data) {
    return (dispatch) => {
        dispatch({type: 'SET_CARS', val: data})
    }
}