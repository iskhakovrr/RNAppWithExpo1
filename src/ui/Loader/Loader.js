import {useEffect, useRef} from "react";
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';

export default function Loader() {
    const fadeAnimDot1 = useRef(new Animated.Value(1)).current;
    const fadeAnimDot2 = useRef(new Animated.Value(1)).current;

    useEffect(() => {
         Animated.loop(
             Animated.sequence([
                 Animated.timing(fadeAnimDot1, {
                     toValue: .5,
                     duration: 500,
                     useNativeDriver: true,
                     easing: Easing.linear
                 }),
                 Animated.timing(fadeAnimDot1, {
                     toValue: 1,
                     duration: 500,
                     useNativeDriver: true,
                     easing: Easing.linear
                 })
            ])
         ).start();
         setTimeout(() =>{
             Animated.loop(
                 Animated.sequence([
                     Animated.timing(fadeAnimDot2, {
                         toValue: .5,
                         duration: 500,
                         useNativeDriver: true,
                         easing: Easing.linear
                     }),
                     Animated.timing(fadeAnimDot2, {
                         toValue: 1,
                         duration: 500,
                         useNativeDriver: true,
                         easing: Easing.linear
                     })
                 ])
             ).start();
         }, 500)
     }, [])

    return (
        <View style={[styles.loaderContainer]}>
            <Animated.View style={[styles.dot, {transform: [{scale: fadeAnimDot1}]}]} />
            <Animated.View style={[styles.dot, {transform: [{scale: fadeAnimDot2}]}]} />
            <Animated.View style={[styles.dot, {transform: [{scale: fadeAnimDot1}]}]} />
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 5
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: "#2F3140",
        borderRadius: 10
    },
});
