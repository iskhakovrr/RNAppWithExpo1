import {ScrollView, StyleSheet, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform} from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";
import MaskInput from "react-native-mask-input/src/MaskInput";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import PageHeader from "../../../components/PageHeader/PageHeader";
import Button from "../../../ui/Button/Button";
import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";

import {domain} from "../../../constants/constants";

export default function AuthConfirmCode({route, navigation}){
    const isTablet = useSelector(store => store.isTablet)

    const [code, setCode] = useState(null); // значение поля ввода одноразового кода
    const [seconds, setSeconds] = useState(60); // текущее отображаемое значение таймера
    const [isLoading, setIsLoading] = useState(false); // значение ожидания ответа от сервера на подтверждение одноразового кода
    const [isError, setIsError] = useState(false); // значение ожидания ответа от сервера на подтверждение одноразового кода

    const codeInputRef = useRef(); // ссылка на скрытое поле вода кода

    const [isCanGetCodeAgain, setIsCanGetCodeAgain] = useState(false); // значение можно ли запрашивать новый код
    const intervalRef = useRef(); // ссылка хранящая id интервала
    const secondsRef = useRef(60); // ссылка хранящая текущее значение таймера

    function submit() {
        codeInputRef.current.blur();
        setIsLoading(true);

        let data = new FormData();
        data.append('code', code);
        data.append('phone', route.params.phone);
        if(route?.params?.sendWithData){
            data.append(route.params.sendWithData.name, route.params.sendWithData.value);
        }

        fetch(`${domain}${route.params.endpoint}`, {
            method: "post",
            body: data
        }).then((resp) => {
            switch (resp.status){
                case 201: {
                    if(route?.params?.nextScreen){
                        navigation.navigate(route.params.nextScreen, {phone: route.params.phone});
                    }
                    if(route?.params?.nextStep){
                        return resp.json()
                    }
                }break;
                case 404: {
                    setIsLoading(false);
                    setIsError("Неверный код");
                }break;
                default:{
                    setIsLoading(false);
                    alertWithoutButtons("Произошла ошибка", "Попробуйте снова")
                }
            }
        })
            .then(result => {
                if(route?.params?.nextStep){
                    route.params.nextStep(result);
                }
            })
            .catch((error) => {setIsLoading(false); alertWithoutButtons("Произошла ошибка", "Попробуйте снова")})
    }

    function getNewCode() {
        setIsCanGetCodeAgain(false)
        setIsLoading(true);

        secondsRef.current = 60;
        setSeconds(60);

        let data = new FormData();
        data.append('phone', route.params.phone);
        data.append('repeat', true);

        fetch(`${domain}${route.params.getNewCodeEndpoint}`, {
            method: "post",
            body: data
        }).then((response) => {setIsLoading(false)})
        decrementTimer();
    }

    useEffect(() => {
        if(code?.length === 4){
            submit();
        }
    },[code])

    function decrementTimer() {
        intervalRef.current = setInterval(() => {
            if(secondsRef.current > 0){
                secondsRef.current = secondsRef.current -1;
                setSeconds(secondsRef.current);
            }else{
                clearInterval(intervalRef.current);
                setIsCanGetCodeAgain(true)
            }
        }, 1000)
    }

    useEffect(() => {
        decrementTimer();
        setTimeout(()=>{codeInputRef.current.focus()}, 250)

        return () => clearInterval(intervalRef.current);
    },[])

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <>
            <PageHeader close={() => navigation.reset({index: 0, routes: [{ name: 'AuthIntro' }]})}/>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} style={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.flexGrow1]}>
                <ScrollView bounces={false} style={[bootstrapStyles.container, styles.contentWrapper]} contentContainerStyle={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                    <View style={[styles.content, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                        <View style={[styles.contentText, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]}>
                            <Text style={styles.title}>Вам поступит звонок</Text>
                            <Text style={styles.description}><Text style={styles.description}>Введите в поле последние 4 цифры номера, с которого вам позвонят{"\n"}+7 (ХХХ) ХХХ </Text><Text style={styles.descriptionPhoneDigits}>12 34</Text></Text>
                        </View>
                        <View style={[styles.fieldsWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter]}>
                            <View style={[styles.fields, bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.justifyContentCenter]}>
                                <Pressable onPress={()=>{codeInputRef.current.focus();}}><Text style={[styles.field, styles.fieldActive]}>{code?.[0] ?? ''}</Text></Pressable>
                                <Pressable onPress={()=>{codeInputRef.current.focus();}}><Text style={[styles.field, code?.length >= 1 && styles.fieldActive]}>{code?.[1] ?? ''}</Text></Pressable>
                                <Pressable onPress={()=>{codeInputRef.current.focus();}}><Text style={[styles.field, code?.length >= 2 && styles.fieldActive]}>{code?.[2] ?? ''}</Text></Pressable>
                                <Pressable onPress={()=>{codeInputRef.current.focus();}}><Text style={[styles.field, code?.length >= 3 && styles.fieldActive]}>{code?.[3] ?? ''}</Text></Pressable>
                                <MaskInput
                                    ref={codeInputRef}
                                    maxLength={4}
                                    mask={[/\d/, /\d/, /\d/, /\d/]}
                                    value={code}
                                    editable={!isLoading}
                                    onChangeText={(text) => {setCode(text);}}
                                    inputType={"numeric"}
                                    style={styles.hiddenField}
                                />
                            </View>
                            {
                                isError
                                    ? <Text style={[styles.errorCode, styles.codeStatus]}>{isError}</Text>
                                    : isLoading && <Text style={[styles.loadingCode, styles.codeStatus]}>Проверяем код...</Text>
                            }
                        </View>
                        <Button title={seconds ? `Получить новый код через ${seconds} сек.` : "Запросить код повторно"} type={isCanGetCodeAgain ? "main" : "second"} disabled={(!isCanGetCodeAgain || isLoading)} onPress={getNewCode}/>
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
            textAlign: "center",
            textAlignVertical: "center"
        },
        descriptionPhoneDigits: {
            fontFamily: "Onest-Bold",
            fontSize: isTablet ? 18 : 12,
            lineHeight: (isTablet ? 18 : 12) * 1.3,
            color: "#2F3140",
            textAlign: "center"
        },
        fields: {
            columnGap: isTablet ? 20 : 14
        },
        fieldsWrapper: {
            rowGap: 8
        },
        field: {
            width: isTablet ? 70 : 40,
            height: isTablet ? 80 : 60,
            textAlign: "center",
            textAlignVertical: "center",
            borderRadius: 4,
            borderWidth: 1,
            borderColor: "#b6b6b6",
            color: "#111",
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 32 : 24,
            // lineHeight: (isTablet ? 32 : 24) * 1.3
            lineHeight: isTablet ? 80 : 60
        },
        fieldActive: {
            borderColor: "#2F3140",
        },
        hiddenField: {
            position: 'absolute',
            opacity: 0,
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
        },
        codeStatus:{
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.3,
            textAlign: "center",
        },
        loadingCode: {
            color: "#2F3140"
        },
        errorCode: {
            color: "#DB524E"
        },
    })
}