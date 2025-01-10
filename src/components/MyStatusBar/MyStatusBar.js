import {SafeAreaView, View, StyleSheet, NativeModules} from "react-native";
import {StatusBar} from "expo-status-bar/src/StatusBar";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Constants from 'expo-constants';

import {setStatusBar} from "../../store/actions/statusBar/statusBar";

export default function MyStatusBar(){
    const statusBar = useSelector(store => store.statusBar);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setStatusBar(Constants.statusBarHeight, statusBar.color))
    }, [])

    return (
        <View style={[styles.statusBar, { backgroundColor: statusBar.color }]}>
            <SafeAreaView>
                <StatusBar translucent backgroundColor={statusBar.color} style={"light"}/>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    statusBar: {
        height: Constants.statusBarHeight,
    },
});