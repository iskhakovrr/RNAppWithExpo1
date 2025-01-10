import {ScrollView, StyleSheet, View, Text, KeyboardAvoidingView, Platform} from "react-native";
import {useMemo, useState} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import PageHeader from "../../../components/PageHeader/PageHeader";

import TextInputStylish from "../../../ui/TextInput/TextInputStylish";
import Button from "../../../ui/Button/Button";
import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";

import {domain} from "../../../constants/constants";

export default function AuthForgotPass({navigation}){
    const isTablet = useSelector(store => store.isTablet)

    const [isLoading, setIsLoading] = useState(false);

    const [phone, setPhone] = useState(null);
    const [rawPhone, setRawPhone] = useState(null);
    const [phoneAlert, setPhoneAlert] = useState(null);

    function submit() {
        if(rawPhone?.length === 11){
            setPhoneAlert(null);
            setIsLoading(true);

            let data = new FormData();
            data.append('phone', phone);

            fetch(`${domain}/api/profile/reset/phone`, {
                method: "post",
                body: data
            }).then((resp) => {
                return resp.json();
            })
                .then(result => {
                    if(result.success){
                        navigation.navigate("AuthConfirmCode", {phone: phone, nextScreen: 'AuthResetPassword' , endpoint: '/api/profile/reset/code', getNewCodeEndpoint:"/api/profile/reset/phone"})
                    }else{
                        if(result?.error === "The number is not found"){
                            setIsLoading(false);
                            setPhoneAlert({type: "error", text: "Номер на найден"})
                        }
                    }
                })
                .catch(() => {
                    setIsLoading(false);
                    alertWithoutButtons("Произошла ошибка", "Попробуйте снова")
                })
        }else{
            setPhoneAlert({type: "error", text: "Заполните поле"})
        }
    }

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <>
            <PageHeader close={() => navigation.reset({index: 0, routes: [{ name: 'AuthIntro' }]})}/>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.flexGrow1]}>
                <ScrollView bounces={false} style={[bootstrapStyles.container, styles.contentWrapper]} contentContainerStyle={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                    <View style={[styles.content, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                        <View style={[styles.contentText, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]}>
                            <Text style={styles.title}>Забыли пароль?</Text>
                            <Text style={styles.description}>Введите ваш номер телефона</Text>
                        </View>

                        <View style={[styles.fields, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                            <TextInputStylish
                                inputProps={{
                                    value: phone,
                                    onChangeText: (text, rawText) => {setPhone(text); setRawPhone(rawText)},
                                    placeholder: "Телефон",
                                    placeholderTextColor: "#6b6b6b",
                                    inputMode: "tel",
                                    autoComplete: "tel",
                                    editable: !isLoading
                                }}
                                mask={[/\d/, " ", "(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/,  " ", /\d/, /\d/]}
                                alertProps={phoneAlert}
                            />
                        </View>

                        <Button title="Продолжить" onPress={submit} disabled={isLoading}/>
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
    })
}