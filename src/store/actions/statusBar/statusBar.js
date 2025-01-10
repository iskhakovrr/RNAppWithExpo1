export function setStatusBar(height, color) {
    return (dispatch) => {
        dispatch({type: 'SET_STATUSBAR', val: {height: height, color: color}})
    }
}