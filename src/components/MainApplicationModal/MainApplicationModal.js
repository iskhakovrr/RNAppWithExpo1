import {StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";

import TextInputStylish from "../../ui/TextInput/TextInputStylish";
import Button from "../../ui/Button/Button";
import SidebarModal from "../SidebarModal/SidebarModal";
import mainModalToggle from "../../store/actions/mainModal/mainModalToggle";
import alertWithoutButtons from "../AlertWithoutBtns/AlertWithoutBtns";
import successModal from "../../store/actions/successModal/successModal";

export default function MainApplicationModal() {
    const isOpen = useSelector(store => store.mainModalIsOpen);
    const isTablet = useSelector(store => store.isTablet);
    const user = useSelector(store => store.user);

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(user.name ?? null);
    const [phone, setPhone] = useState(user.phone ?? null);
    const [phoneAlert, setPhoneAlert] = useState(null);

    function sendApplication() {
        setIsLoading(true);
        setPhoneAlert(null);
        if(phone.split(/[-_()^\s*$]+/).join('').length === 11){
            let data = new FormData();
            data.append("target", isOpen?.title ?? "Заявка с моб. приложения");
            if(name?.length > 0){
                data.append("name", name)
            }
            data.append("phone", phone)
            fetch(`${domain}/api/application`, {
                method: "post",
                body: data
            })
                .then(response => {return response.json();})
                .then(result => {
                    if(result?.status === "ok"){
                        setIsLoading(false);
                        dispatch(mainModalToggle(false));
                        dispatch(successModal(true))
                    }else{
                        alertWithoutButtons("Произошла ошибка", "Попробуйте позже");
                        setIsLoading(false);
                    }
                })
                .catch(() => {
                    alertWithoutButtons("Произошла ошибка", "Попробуйте позже");
                    setIsLoading(false);
                })
        }else{
            setPhoneAlert({type: "error", text: "Заполните поле"});
            setIsLoading(false);
        }
    }

    const styles = useMemo(() => contentStylish(isTablet), [isTablet]);

    useEffect(() => {
        if(isOpen){
            setName(user.name ?? null);
            setPhone(user.phone ?? null);
        }
    }, [isOpen])

    return (
        <SidebarModal title={"Оставить заявку"} close={() => {dispatch(mainModalToggle(false))}} isOpen={!!isOpen} withSubmitButton={false}>
            <View style={[styles.application]}>
                <Text style={styles.applicationDescription}>{isOpen?.title ?? "Оставьте заявку и мы вам скоро перезвоним"}</Text>
                <TextInputStylish
                    inputProps={{
                        value: name,
                        onChangeText: (text) => {setName(text)},
                        placeholder: "Имя",
                        placeholderTextColor: "#6b6b6b",
                        editable: !isLoading
                    }}
                />
                <TextInputStylish
                    inputProps={{
                        value: phone,
                        onChangeText: (text) => {setPhone(text)},
                        placeholder: "Телефон",
                        placeholderTextColor: "#6b6b6b",
                        inputMode: "tel",
                        autoComplete: "tel",
                        editable: !isLoading
                    }}
                    mask={[/\d/, " ", "(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/,  " ", /\d/, /\d/]}
                    alertProps={phoneAlert}
                />
                <Button title={"Отправить заявку"} type={"main"} disabled={isLoading} onPress={sendApplication} size={isTablet ? "l" : "s"}/>
            </View>
        </SidebarModal>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    application:{
        rowGap: 16
    },
    applicationDescription:{
        fontFamily: "Onest-Regular",
        color: "#111",
        fontSize: (isTablet ? 16 : 12),
        lineHeight: (isTablet ? 16 : 12) * 1.3
    }
});