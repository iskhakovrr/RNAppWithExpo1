import {StyleSheet, View} from 'react-native';
import Logo from "../../../assets/logo.svg";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {matchMedia} from "../../store/actions/matchMedia/matchMedia";
import {StatusBar} from "expo-status-bar/src/StatusBar";
import {useLinkTo} from "@react-navigation/native";

export default function SplashScreen({navigation, isSplashScreen, initialScreen}) {
    const dispatch = useDispatch();
    const linkTo = useLinkTo();

    useEffect(()=>{
        dispatch(matchMedia());
    }, [])

    useEffect(()=>{
        if(initialScreen){
            if(!isSplashScreen){
                navigation.reset({index: 0, routes: [{ name: initialScreen, params: {url: "/main-page"}}]})
            }
        }
    }, [initialScreen, isSplashScreen])

    return (
        <>
            <StatusBar backgroundColor={"#2F3140"}/>
            <View style={styles.container}>
                <View style={styles.imageWrapper}>
                    <Logo width={165}/>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2F3140',
        height: '100%',
        width: '100%',
    },
    image: {
        // backgroundColor: "#fff",
        // width: '100%',
        resizeMethod: 'contain',
    },
    imageWrapper: {
        // width: 165,
    },
});