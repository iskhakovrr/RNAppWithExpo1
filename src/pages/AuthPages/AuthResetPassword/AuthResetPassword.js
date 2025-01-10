import {ScrollView, StyleSheet, View, Text, KeyboardAvoidingView, Platform} from "react-native";
import {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import PageHeader from "../../../components/PageHeader/PageHeader";
import PasswordInputStylish from "../../../ui/TextInput/PasswordInputStylish";
import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";
import Button from "../../../ui/Button/Button";

import {setToken} from "../../../store/actions/token/token";

import {getUser} from "../../../query/query";

import {domain} from "../../../constants/constants";

export default function AuthResetPassword({route, navigation}){
    const isTablet = useSelector(store => store.isTablet)
    const deviceToken = useSelector(store => store.deviceToken)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false);

    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [passwordAlert, setPasswordAlert] = useState(null);
    const [confirmPasswordAlert, setConfirmPasswordAlert] = useState(null);

    function submit() {
        if(password === confirmPassword){
            setPasswordAlert(null);
            setConfirmPasswordAlert(null);
            setIsLoading(true);

            let data = new FormData();
            data.append("phone", route.params.phone)
            data.append("password", password);
            if(deviceToken){
                data.append("device_token", deviceToken)
            }

            fetch(`${domain}/api/profile/reset/new`, {
                method: "post",
                body: data
            }).then((resp) => {
                if(resp.status === 200){
                    return resp.json()
                }
            }).then((result) => {
                if(result.success){
                    new Promise((resolve, reject) => {
                        dispatch(setToken({access_token: result.access_token, refresh_token: result.refresh_token}))
                        resolve()
                    }).then(() => {
                        getUser(() => navigation.reset({index: 0, routes: [{ name: 'LKMain' }]}));
                    }).catch((error) => {throw error;})
                }
                // if(result.success){
                //     dispatch(setToken({access_token: result.access_token, refresh_token: result.refresh_token}))
                //     navigation.reset({index: 0, routes: [{ name: 'LKMain' }]})
                // }
            })
                .catch(() => {
                    setIsLoading(false);
                    alertWithoutButtons("Произошла ошибка", "Попробуйте снова")
                })
        }else{
            setPasswordAlert({type: "error", text:"Пароли не совпадают"})
            setConfirmPasswordAlert({type: "error", text:"Пароли не совпадают"})
        }
    }

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <>
            <PageHeader canGoBack={false} close={() => navigation.reset({index: 0, routes: [{ name: 'AuthIntro' }]})}/>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.flexGrow1]}>
                <ScrollView bounces={false} style={[bootstrapStyles.container, styles.contentWrapper]} contentContainerStyle={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                    <View style={[styles.content, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                        <View style={[styles.contentText, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]}>
                            <Text style={styles.title}>Восстановление пароля</Text>
                        </View>

                        <View style={[styles.fields, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                            <PasswordInputStylish inputProps={{
                                value: password,
                                placeholder: "Новый пароль",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: setPassword,
                                keyboardType: 'default',
                                editable: !isLoading
                            }} alertProps={passwordAlert}/>
                            <PasswordInputStylish inputProps={{
                                value: confirmPassword,
                                placeholder: "Повторите новый пароль",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: setConfirmPassword,
                                keyboardType: 'default',
                                editable: !isLoading
                            }} alertProps={confirmPasswordAlert}/>
                        </View>

                        <Button title="Сохранить изменения" onPress={submit} disabled={isLoading}/>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        contentWrapper: {
            backgroundColor: "#fff"
        },
        content: {
            rowGap: isTablet ? 26: 20,
            maxWidth: isTablet ? 382 : 280,
            width: "100%"
        },
        contentText: {
            rowGap: isTablet ? 16: 10,
        },
        title: {
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 20,
            lineHeight: (isTablet ? 32 : 20) * 1.2,
            color: "#111",
            textAlign: "center"
        },
        fields: {
            rowGap: isTablet ? 20 : 14
        },
        fieldWrapper: {
            rowGap: 8
        },
        field: {
            borderRadius: 4,
            borderWidth: 1,
            borderColor: "#b6b6b6",
            paddingVertical: isTablet ? 13 : 7.5,
            paddingHorizontal: isTablet ? 16 : 10,
            color: "#111",
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 18 : 14,
            lineHeight: (isTablet ? 18 : 14) * 1.2
        },
        fieldAlertMessage: {
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.3,
            color: "#DB524E",
            textAlign: "start"
        },
    })
}