import AsyncStorage from "@react-native-async-storage/async-storage";

export function setToken(data) {
    AsyncStorage.setItem('tokens', JSON.stringify(data));

    return (dispatch) => {
        dispatch({type: 'SET_TOKEN', val: data})
    }
}