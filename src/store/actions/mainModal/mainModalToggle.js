export default function mainModalToggle(val){
    return (dispatch) => {
        dispatch({type: 'SET_MAIN_MODAL_IS_OPEN', val: val})
    }
}