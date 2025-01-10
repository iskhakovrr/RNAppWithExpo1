export default function successModal(val){
    return (dispatch) => {
        dispatch({type: 'SET_SUCCESS_MODAL_IS_OPEN', val: val})
    }
}