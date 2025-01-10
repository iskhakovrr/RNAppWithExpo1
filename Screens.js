import {Dimensions, Platform, StyleSheet} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useRef, useState} from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {useDispatch, useSelector} from "react-redux";

import {matchMedia} from "./src/store/actions/matchMedia/matchMedia"

import Main from "./src/pages/Main/Main";
import IntroScreen from "./src/pages/IntroScreen/IntroScreen";
import MyStatusBar from "./src/components/MyStatusBar/MyStatusBar";
import AuthIntro from "./src/pages/AuthPages/AuthIntro/AuthIntro";
import AuthSignIn from "./src/pages/AuthPages/AuthSignIn/AuthSignIn";
import AuthForgotPass from "./src/pages/AuthPages/AuthForgotPass/AuthForgotPass";
import AuthConfirmCode from "./src/pages/AuthPages/AuthConfirmCode/AuthConfirmCode";
import AuthResetPassword from "./src/pages/AuthPages/AuthResetPassword/AuthResetPassword";
import AuthSignInCode from "./src/pages/AuthPages/AuthSignInCode/AuthSignInCode";
import SignUpCreatePass from "./src/pages/AuthPages/SignUpCreatePass/SignUpCreatePass";
import SignUp from "./src/pages/AuthPages/SignUp/SignUp";
import LKMain from "./src/pages/LK/LKMain/LKMain";
import LKListOfCars from "./src/pages/LK/LKListOfCars/LKListOfCars";
import LKAddOrEditCar from "./src/pages/LK/LKAddOrEditCar/LKAddOrEditCar";
import LKEditUserData from "./src/pages/LK/LKEditUserData/LKEditUserData";
import LKEditPassword from "./src/pages/LK/LKEditPassword/LKEditPassword";
import NotificationsList from "./src/pages/Notifications/Notifications";

import {setDeviceToken} from "./src/store/actions/deviceToken/deviceToken";
import {setToken} from "./src/store/actions/token/token";
import {getCars, getUser} from "./src/query/query";

import { navigationRef, navigate as RootNavigationNavigate } from './RootNavigation';

import SplashScreen from "./src/components/SplashScreen/SplashScreen";
import Services from "./src/pages/Services/Services";
import Contact from "./src/pages/Contact/Contact";
import Contacts from "./src/pages/Contacts/Contacts";
import SingleNotification from "./src/pages/SingleNotification/SingleNotification";

import MainApplicationModal from "./src/components/MainApplicationModal/MainApplicationModal";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import ModalSuccess from "./src/components/ModalSuccess/ModalSuccess";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            // console.log(pushTokenString);
            return pushTokenString;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export default function Screens({initialScreen, isSplashScreen}) {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [expoPushTokenIsSended, setExpoPushTokenIsSended] = useState(false);
    const [notification, setNotification] = useState(undefined);
    const notificationListener = useRef();
    const responseListener = useRef();

    const lastNotificationResponse = Notifications.useLastNotificationResponse();

    const [initialScreenState, setInitialScreenState] = useState(null);

    const user = useSelector(store => store.user);

    const dispatch = useDispatch();

    const getTokens = async () => {
        try {
            const value = await AsyncStorage.getItem('tokens');
            if (value !== null) {
                let parsedValue = JSON.parse(value);

                new Promise((resolve, reject) => {
                    dispatch(setToken({access_token: parsedValue.access_token, refresh_token: parsedValue.refresh_token}))
                    resolve()
                }).then(() => {
                    getUser();
                    getCars()
                }).catch((error) => {throw error;})

            }
        } catch (e) {
            // console.log("cannot get asyncStorage")
        }
    };

    useEffect(()=>{
        getTokens();

        const subscription = Dimensions.addEventListener("change", () => {dispatch(matchMedia())});
        return () => subscription?.remove();
    }, [])

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // console.log(response);
        });

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        }
    }, []);

    useEffect(() => {
        if (lastNotificationResponse) {
            const route = lastNotificationResponse?.notification?.request?.content?.data?.route;

            if(route){
                if(navigationRef.isReady()){
                    if(route.includes("LK")){
                        if(user){
                            RootNavigationNavigate(route);
                        }else{
                            RootNavigationNavigate("AuthIntro");
                        }
                    }else{
                        RootNavigationNavigate(route);
                    }
                }else{
                    if(route.includes("LK")){
                        if(user){
                            setInitialScreenState(route);
                        }else{
                            setInitialScreenState("AuthIntro");
                        }
                    }else{
                        setInitialScreenState(route);
                    }
                }
            }else{
                if(navigationRef.isReady()){
                    RootNavigationNavigate("Notifications");
                }else{
                    setInitialScreenState("Notifications");
                }
            }
        }
    }, [lastNotificationResponse]);

    const sendDeviceToken = (token) => {
        setExpoPushTokenIsSended(true);

        let data = new FormData();

        data.append("device_token", token);

        fetch(`${domain}/api/expo/save`, {
            method: "post",
            body: data
        })
    };

    useEffect(() =>{
        if(!expoPushTokenIsSended && expoPushToken){
            dispatch(setDeviceToken(expoPushToken))
            sendDeviceToken(expoPushToken)
        }
    }, [expoPushToken]);

    return (
        <>
            <MyStatusBar/>
            <SafeAreaView style={styles.container}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheetModalProvider>
                        <NavigationContainer ref={navigationRef}>
                            <Stack.Navigator screenOptions={{headerShown: false}}
                                             initialRouteName={"SplashScreen"} >
                                <Stack.Screen name="SplashScreen">
                                    {props => <SplashScreen {...props} isSplashScreen={isSplashScreen} initialScreen={initialScreenState ?? initialScreen}/>}
                                </Stack.Screen>
                                <Stack.Screen name="IntroScreen" component={IntroScreen}/>
                                <Stack.Screen name="Main" component={Main}/>
                                <Stack.Screen name="Notifications" component={NotificationsList}/>
                                <Stack.Screen name="SingleNotification" component={SingleNotification}/>
                                <Stack.Screen name="Contacts" component={Contacts}/>
                                <Stack.Screen name="Contact" component={Contact}/>
                                <Stack.Screen name="Services" component={Services}/>
                                {
                                    user
                                        ? (
                                            <Stack.Group>
                                                <Stack.Screen name="LKMain" component={LKMain}/>
                                                <Stack.Screen name="LKListOfCars" component={LKListOfCars}/>
                                                <Stack.Screen name="LKAddOrEditCar" component={LKAddOrEditCar}/>
                                                <Stack.Screen name="LKEditUserData" component={LKEditUserData}/>
                                                <Stack.Screen name="LKEditPassword" component={LKEditPassword}/>
                                            </Stack.Group>
                                        )
                                        : (
                                            <Stack.Group>
                                                <Stack.Screen name="AuthIntro" component={AuthIntro}/>{/* Экран выбора Входа / Регистрации */}
                                                <Stack.Screen name="AuthSignIn" component={AuthSignIn}/>{/* Экран входа */}
                                                <Stack.Screen name="AuthSignInCode" component={AuthSignInCode}/>{/* Экран входа по коду */}
                                                <Stack.Screen name="AuthForgotPass" component={AuthForgotPass}/>{/* Экран восстановлении пароля */}
                                                <Stack.Screen name="AuthConfirmCode" component={AuthConfirmCode}/>{/* Экран подтверждения кодом (универсальный) */}
                                                <Stack.Screen name="AuthResetPassword" component={AuthResetPassword}/>{/* Экран установки пароля при восстановлении пароля */}
                                                <Stack.Screen name="SignUp" component={SignUp}/>{/* Экран регистрации */}
                                                <Stack.Screen name="SignUpCreatePass" component={SignUpCreatePass}/>{/* Экран установки пароля при регистрации */}
                                            </Stack.Group>
                                        )
                                }
                            </Stack.Navigator>
                            <MainApplicationModal/>
                            <ModalSuccess/>
                        </NavigationContainer>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
        flexGrow: 1
    },
});