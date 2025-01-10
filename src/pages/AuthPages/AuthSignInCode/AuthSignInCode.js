import {ScrollView, StyleSheet, View, Text, Pressable, KeyboardAvoidingView, Platform} from "react-native";
import {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Button from "../../../ui/Button/Button";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import TextInputStylish from "../../../ui/TextInput/TextInputStylish";
import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";
import PageHeader from "../../../components/PageHeader/PageHeader";

import {setToken} from "../../../store/actions/token/token";

import {getUser} from "../../../query/query";

export default function AuthSignInCode({navigation}){
    const isTablet = useSelector(store => store.isTablet)
    const deviceToken = useSelector(store => store.deviceToken)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false);

    const [phone, setPhone] = useState(null);
    const [rawPhone, setRawPhone] = useState(null);
    const [phoneAlert, setPhoneAlert] = useState(null);

    function submit() {
        if(rawPhone?.length === 11){
            setPhoneAlert(null);
            setIsLoading(true);

            let data = new FormData();
            data.append("phone", phone)

            fetch(`${domain}/api/auth/login/phone`, {
                method: "post",
                body: data
            }).then((resp) => {
                if(resp.status === 200){
                    return resp.json()
                }else if(resp.status === 400){
                    setPhoneAlert({type: "error", text: "Номер не верны"});
                    setIsLoading(false);
                }
            })
                .then((result) => {
                    if(result.success){
                        navigation.navigate("AuthConfirmCode", {phone: phone, nextStep: (result) => {
                                new Promise((resolve, reject) => {
                                    dispatch(setToken({access_token: result.access_token, refresh_token: result.refresh_token}))
                                    resolve()
                                }).then(() => {
                                    getUser(() => navigation.reset({index: 0, routes: [{ name: 'LKMain' }]}));
                                }).catch((error) => {throw error;})
                            } , endpoint: '/api/auth/login/code', getNewCodeEndpoint:"/api/auth/login/phone", sendWithData: deviceToken ? {name:"device_token", value: deviceToken} : null})
                    }else{
                        if(result?.error === "The number is not found"){
                            setIsLoading(false);
                            setPhoneAlert({type: "error", text: "Номер на найден"})
                        }
                    }
                })
                .catch((error) => {setIsLoading(false);alertWithoutButtons("Произошла ошибка", "Попробуйте снова");})
        }else{
            setPhoneAlert({type: "error", text: "Заполните поле"})
        }
    }

    const styles = useMemo(()=> stylish(isTablet), [isTablet]);

    return (
        <>
            <PageHeader close={() => navigation.reset({index: 0, routes: [{ name: 'AuthIntro' }]})}/>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.flexGrow1]}>
                <ScrollView bounces={false} style={[bootstrapStyles.container, styles.contentWrapper]} contentContainerStyle={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                    <View style={[styles.content, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                        <View style={[styles.contentText, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]}>
                            <Text style={styles.title}>Вход в личный кабинет</Text>
                            <Text style={styles.description}>Добавьте свой автопарк, копите бонусы, расплачивайтесь ими и смотрите историю посещений центров</Text>
                        </View>

                        <View style={[styles.fields, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                            <TextInputStylish
                                inputProps={{
                                    value: phone,
                                    onChangeText: (text, rawText) => {setPhone(text);setRawPhone(rawText);},
                                    placeholder: "Телефон",
                                    placeholderTextColor: "#6b6b6b",
                                    inputMode: "tel",
                                    autoComplete: "tel",
                                    editable: !isLoading
                                }}
                                alertProps={phoneAlert}
                                mask={[/\d/, " ", "(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/,  " ", /\d/, /\d/]}
                            />
                            <View style={[bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentBetween]}>
                                <Pressable onPress={()=> navigation.navigate("AuthSignIn")}><Text style={styles.alternativeAuth}>Вход по паролю</Text></Pressable>
                            </View>
                        </View>

                        <Button title="Войти" onPress={submit} disabled={isLoading}/>

                        <View style={[bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                            <Text style={styles.regText}>Нет аккаунта? </Text>
                            <Pressable onPress={()=> navigation.reset({index: 0, routes: [{ name: 'AuthIntro'}, { name: 'SignUp'}]})}><Text style={styles.regTextLink}>Зарегистрируйтесь</Text></Pressable>
                        </View>
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
            width: "100%",
            maxWidth: isTablet ? 382 : 280
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
        description: {
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 18 : 12,
            lineHeight: (isTablet ? 18 : 12) * 1.3,
            color: "#6B6B6B",
            textAlign: "center"
        },
        fields: {
            rowGap: isTablet ? 20 : 14
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
        regText: {
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.3,
            color: "#6b6b6b"
        },
        regTextLink: {
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.3,
            color: "#2F3140",
            textDecorationColor: "#2F3140",
            textDecorationLine: "underline"
        },
        alternativeAuth: {
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.3,
            color: "#2F3140"
        },
    })
}