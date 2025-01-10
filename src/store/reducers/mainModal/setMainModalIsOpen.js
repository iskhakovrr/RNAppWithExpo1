export default function setMainModalIsOpen(state = false, action) {
    if(action.type === 'SET_MAIN_MODAL_IS_OPEN'){
        return action.val;
    }
    return state;
}