export default function setStatusBar(state = {height: 20, color: "#2F3140"}, action) {
    if(action.type === 'SET_STATUSBAR'){
        return action.val;
    }
    return state;
}