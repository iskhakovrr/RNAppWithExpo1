import {useCallback} from "react";
import {Linking, Pressable} from "react-native";

export default function OpenURLButton ({url, children, style}){
    const handlePress = useCallback(async () => {
        // const supported = await Linking.canOpenURL(url);
        //
        // console.log(supported)
        //
        // if (supported) {
            await Linking.openURL(url);
        // }
    }, [url]);

    return <Pressable style={style} onPress={handlePress}>{children}</Pressable>;
};