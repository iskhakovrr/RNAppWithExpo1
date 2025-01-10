import React, {useEffect, useRef, useState} from "react";
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YaMap from 'react-native-yamap';
import {Provider} from "react-redux";

import store from './src/store/state';

import Screens from "./Screens";

YaMap.init('4a880ea4-1d01-45a4-ace5-402e326f30ca');

export default function App() {
    const [isSplashScreen, setIsSplashScreen] = useState(true);
    const [initialScreen, setInitialScreen] = useState(false);

    const [fontsLoaded, fontError] = useFonts({
        'Onest-Thin': require('./assets/fonts/Onest/Onest-Thin.ttf'),               // 100
        'Onest-ExtraLight': require('./assets/fonts/Onest/Onest-ExtraLight.ttf'),   // 200
        'Onest-Light': require('./assets/fonts/Onest/Onest-Light.ttf'),             // 300
        'Onest-Regular': require('./assets/fonts/Onest/Onest-Regular.ttf'),         // 400
        'Onest-Medium': require('./assets/fonts/Onest/Onest-Medium.ttf'),           // 500
        'Onest-SemiBold': require('./assets/fonts/Onest/Onest-SemiBold.ttf'),       // 600
        'Onest-Bold': require('./assets/fonts/Onest/Onest-Bold.ttf'),               // 700
        'Onest-ExtraBold': require('./assets/fonts/Onest/Onest-ExtraBold.ttf'),     // 800
        'Onest-Black': require('./assets/fonts/Onest/Onest-Black.ttf'),             // 900
    });

    // store.subscribe(() => {
    //     console.log('Изменение', store.getState());
    // });

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('isIntro');
            if (value !== null) {
                setInitialScreen("Main");
            }else{
                setInitialScreen("IntroScreen");
            }
        } catch (e) {
            setInitialScreen("IntroScreen");
        }
    };

    useEffect(() => {
        if (fontsLoaded && initialScreen) {
            setIsSplashScreen(false);
        }
    }, [fontsLoaded, initialScreen])

    useEffect(() => {
        getData();
    }, [])

    return (
        <Provider store={store}>
            <Screens initialScreen={initialScreen} isSplashScreen={isSplashScreen}/>
        </Provider>
    )
}