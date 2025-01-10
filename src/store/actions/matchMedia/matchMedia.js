import {Dimensions} from "react-native";

export function matchMedia() {
    return (dispatch) => {
        dispatch({type: 'SET_CURR_DIMENSION', val: Dimensions.get("window").width >= 768})
    }
}