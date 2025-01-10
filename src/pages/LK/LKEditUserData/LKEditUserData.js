import {Text, ScrollView, View, Pressable, StyleSheet} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {domain} from "../../../constants/constants";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import TextInputStylish from "../../../ui/TextInput/TextInputStylish";
import Button from "../../../ui/Button/Button";

import PageHeader from "../../../components/PageHeader/PageHeader";
import NavBar from "../../../components/NavBar/NavBar";
import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";
import SubmitModal from "../../../components/SubmitModal/SubmitModal";

import Key from "../../../../assets/lk/key.svg";
import LogOutIcon from "../../../../assets/lk/exit.svg";
import Trash from "../../../../assets/lk/trash.svg";

import {getUser, queryPost} from "../../../query/query";

import {setUser} from "../../../store/actions/user/user";
import {setToken} from "../../../store/actions/token/token";

export default function LKEditUserData({navigation}){
    const user = useSelector(store => store.user);
    const isTablet = useSelector(store => store.isTablet);
    const deviceToken = useSelector(store => store.deviceToken);

    const dispatch = useDispatch();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(user.name);
    const [nameAlert, setNameAlert] = useState(null);
    const [phone, setPhone] = useState(user.phone);

    const styles = useMemo(()=> stylish(isTablet), [isTablet])

    function editUserName() {
        if(name?.length > 0){
            setNameAlert(null);
            setIsLoading(true);

            let data = new FormData();
            data.append("name", name);

            queryPost(`${domain}/api/profile/update/name`, data)
                .then((result) => {
                    if(result.success){
                        getUser();
                        setIsLoading(false);
                    }else{
                        if(result.error === "unknown error"){
                            alertWithoutButtons("Произошла ошибка", "Пользователь с таким номером телефона не найден");
                        }
                    }
                })
        }else{
            setNameAlert({type: "error", text: "Заполните поле"});
        }
    }

    function logout() {
        setIsLoading(true);
        let data = new FormData();
        if(deviceToken){
            data.append("device_token", deviceToken)
        }

        queryPost(`${domain}/api/auth/logout`, data)
            .then((result) => {
                if(result.success){
                    setIsLoading(false);
                    dispatch(setUser(false));
                    dispatch(setToken(false))
                }else{
                    if(result.error === "unknown error"){
                        alertWithoutButtons("Произошла ошибка", "Попробуйте позже");
                    }
                }
            })
    }

    function deleteAccount() {
        setIsLoading(true);

        let data = new FormData();

        queryPost(`${domain}/api/profile/delete`, data)
            .then((result) => {
                if(result.success){
                    setIsLoading(false);
                    dispatch(setUser(false));
                    dispatch(setToken(false))
                }else{
                    if(result.error === "unknown error"){
                        alertWithoutButtons("Произошла ошибка", "Попробуйте позже");
                    }
                }
            })
    }

    return (
        <>
            <PageHeader label={"Профиль"}/>
            <ScrollView bounces={false} style={[styles.contentWrapper]} contentContainerStyle={[styles.content ,bootstrapStyles.container, bootstrapStyles.flexGrow1]}>
                <View style={styles.form}>
                    <TextInputStylish inputProps={{
                        value: name,
                        placeholder: "Имя",
                        placeholderTextColor: "#6b6b6b",
                        onChangeText: (text) => {setName(text);},
                        editable: !isLoading
                    }} label={"Имя"} alertProps={nameAlert}/>
                    <TextInputStylish
                        inputProps={{
                            value: phone,
                            placeholder: "Телефон",
                            placeholderTextColor: "#6b6b6b",
                            editable: false
                        }} label={"Телефон"}/>
                    <Button title={"Изменить пароль"} type={"second"} size={isTablet ? "l" : "s"} leftIcon={Key} onPress={() => navigation.push("LKEditPassword")} disabled={isLoading}/>
                    <Button title={"Сохранить"} type={"main"} size={isTablet ? "l" : "s"} onPress={editUserName} disabled={isLoading}/>
                </View>
                <View style={[styles.btns, bootstrapStyles.flexRow, bootstrapStyles.justifyContentStart]}>
                    <Pressable style={[styles.logOut, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} onPress={isLoading ? null : () => {setIsLogoutModalOpen(true)}}>
                        <LogOutIcon width={styles.logOutIcon.width} height={styles.logOutIcon.height}/>
                        <Text style={styles.logOutText}>Выйти</Text>
                    </Pressable>
                    <Pressable style={[styles.logOut, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} onPress={isLoading ? null : () => {setIsDeleteAccountModalOpen(true)}}>
                        <Trash width={styles.logOutIcon.width} height={styles.logOutIcon.height}/>
                        <Text style={styles.logOutText}>Удалить аккаунт</Text>
                    </Pressable>
                </View>
            </ScrollView>
            <NavBar/>
            <SubmitModal isLoading={isLoading} headerText={"Вы действительно хотите выйти?"} isOpen={isLogoutModalOpen} close={() => setIsLogoutModalOpen(false)} declineButtonText={"Нет, остаться"} acceptButtonText={"Выйти"} accept={logout}/>
            <SubmitModal isLoading={isLoading} headerText={"Вы действительно хотите удалить аккаунт?"} isOpen={isDeleteAccountModalOpen} close={() => setIsDeleteAccountModalOpen(false)} declineButtonText={"Нет, не удалять"} acceptButtonText={"Удалить"} accept={deleteAccount}/>
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
    },
    btns: {
        rowGap: 10,
        columnGap: 10,
        flexWrap: "wrap"
    }
});