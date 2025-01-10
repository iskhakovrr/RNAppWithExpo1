export default function setSuccessModalIsOpen(state = false, action) {
    if(action.type === 'SET_SUCCESS_MODAL_IS_OPEN'){
        return action.val;
    }
    return state;
}