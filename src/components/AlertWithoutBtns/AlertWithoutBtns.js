const {Alert} = require("react-native");

export default function alertWithoutButtons (title, message){
    const emptyArrayButtons = [];
    const alertOptions = {
        cancelable: true,
    };

    Alert.alert(title, message, emptyArrayButtons, alertOptions);
};