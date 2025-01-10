export function usedCarsSavedState(val) {
    return (dispatch) => {
        dispatch({type: 'SET_USED_CARS_DATA', val: val})
    }
}