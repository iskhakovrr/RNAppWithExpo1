import {ScrollView, View, StyleSheet} from "react-native";
import {useMemo, useState} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import Button from "../../../ui/Button/Button";
import PasswordInputStylish from "../../../ui/TextInput/PasswordInputStylish";

import PageHeader from "../../../components/PageHeader/PageHeader";
import NavBar from "../../../components/NavBar/NavBar";
import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";

import {queryPost} from "../../../query/query";

import {domain} from "../../../constants/constants";

export default function LKEditPassword({navigation}){
    const isTablet = useSelector(store => store.isTablet)

    const [isLoading, setIsLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState(null);
    const [oldPasswordAlert, setOldPasswordAlert] = useState(null);

    const [newPassword, setNewPassword] = useState(null);
    const [newPasswordAlert, setNewPasswordAlert] = useState(null);

    const [repeatNewPassword, setRepeatNewPassword] = useState(null);
    const [repeatNewPasswordAlert, setRepeatNewPasswordAlert] = useState(null);

    const styles = useMemo(()=> stylish(isTablet), [isTablet])

    function changePassword() {
        setOldPasswordAlert(null);
        setNewPasswordAlert(null);
        setRepeatNewPasswordAlert(null);

        if(oldPassword?.length > 0 && newPassword?.length > 0 && repeatNewPassword?.length > 0){
            if(newPassword === repeatNewPassword){
                setIsLoading(true);

                let data = new FormData();
                data.append("old_password", oldPassword);
                data.append("password", newPassword);

                queryPost(`${domain}/api/profile/update/password`, data)
                    .then((result) => {
                        if(result.success){
                            setOldPassword(null);
                            setNewPassword(null);
                            setRepeatNewPassword(null);
                            alertWithoutButtons("Пароль успешно изменен");
                        }else{
                            if(result?.error === "The password is not found"){
                                setOldPasswordAlert({type: "error", text: "Наверный пароль"});
                                setIsLoading(false);
                            }
                        }
                    })
            }else{
                setNewPasswordAlert({type: "error", text: "Пароли не совпадают"});
                setRepeatNewPasswordAlert({type: "error", text: "Пароли не совпадают"});
            }
        }else{
            if(oldPassword?.length === 0){setOldPasswordAlert({type: "error", text: "Заполните поле"})}
            if(newPassword?.length === 0){setNewPasswordAlert({type: "error", text: "Заполните поле"})}
            if(repeatNewPassword?.length === 0){setRepeatNewPasswordAlert({type: "error", text: "Заполните поле"})}
        }
    }

    return (
        <>
            <PageHeader label={"Профиль"}/>
            <ScrollView bounces={false} style={[styles.contentWrapper]} contentContainerStyle={[styles.content ,bootstrapStyles.container, bootstrapStyles.flexGrow1]}>
                <View style={styles.form}>
                    <PasswordInputStylish inputProps={{
                        value: oldPassword,
                        placeholder: "Старый пароль",
                        placeholderTextColor: "#6b6b6b",
                        onChangeText: setOldPassword,
                        keyboardType: 'default'
                    }} alertProps={oldPasswordAlert}  label={"Старый пароль"}/>
                    <PasswordInputStylish inputProps={{
                        value: newPassword,
                        placeholder: "Новый пароль",
                        placeholderTextColor: "#6b6b6b",
                        onChangeText: setNewPassword,
                        keyboardType: 'default'
                    }} alertProps={newPasswordAlert}  label={"Новый пароль"}/>
                    <PasswordInputStylish inputProps={{
                        value: repeatNewPassword,
                        placeholder: "Повторите новый пароль",
                        placeholderTextColor: "#6b6b6b",
                        onChangeText: setRepeatNewPassword,
                        keyboardType: 'default'
                    }} alertProps={repeatNewPasswordAlert}  label={"Повторите новый пароль"}/>
                    <Button title={"Сохранить"} type={"main"} size={isTablet ? "l" : "s"} disabled={isLoading ?? !(oldPassword?.length && newPassword?.length && repeatNewPassword?.length)} onPress={changePassword}/>
                </View>
            </ScrollView>
            <NavBar/>
        </>
    )
}

const stylish = (isTablet) => StyleSheet.create({
    contentWrapper: {
        backgroundColor: "#fff",
    },
    content: {
        rowGap: 50
    },
    logOut: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#F1F1F1",
        borderRadius: 4,
        columnGap: 6
    },
    logOutText: {
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 18 : 14,
        lineHeight: (isTablet ? 18 : 14) * 1.4,
        color: "#DB524E"
    },
    logOutIcon: {
        width: isTablet ? 24 : 18,
        height: isTablet ? 24 : 18
    },
    form: {
        rowGap: 20
    }
});