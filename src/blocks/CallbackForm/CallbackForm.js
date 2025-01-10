import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Image} from "expo-image";

import bootstrapStyles from "../../ui/bootstrapStyles";
import Button from "../../ui/Button/Button";
import SidebarModal from "../../components/SidebarModal/SidebarModal";
import ModalFields from "../../components/ModalFields/ModalFields";
import successModal from "../../store/actions/successModal/successModal";
import {domain} from "../../constants/constants";

export default function CallbackForm ({ title, description, image, imageResizeMode, buttonText, fields, background, endpoint, target, modalTitle, modalDescription }){
    const isTablet = useSelector(store => store.isTablet);
    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();

    const isSuccessOpen = useSelector(store => store.successModalIsOpen);

    useEffect(()=>{
        if(isSuccessOpen){
            setIsOpen(false);
        }
    }, [isSuccessOpen])

    return (
        <>
            <View style={styles.callbackFormWrapper}>
                <View style={bootstrapStyles.container}>
                    <View style={[styles.callbackForm, background === 'dark' ? styles.callbackFormDark : styles.callbackFormLight]}>
                        <View style={styles.callbackFormContent}>
                            <View style={styles.callbackFormContentText}>
                                {title && <Text style={[styles.callbackFormTitle, background === 'dark' ? styles.callbackFormTitleDark : styles.callbackFormTitleLight]}>{title}</Text>}
                                {description && <Text style={[styles.callbackFormDescription, background === 'dark' ? styles.callbackFormDescriptionDark : styles.callbackFormDescriptionLight]}>{description}</Text>}
                            </View>
                            <Button onPress={() => setIsOpen(true)} type={background === 'dark' ? 'second' : 'main'} title={buttonText} size={isTablet ? 'l' : 's'}/>
                        </View>
                        {image && <View style={styles.callbackFormImageWrapper}><Image source={{uri: `${domain}${image}`}} style={styles.callbackFormImage} contentFit={imageResizeMode ?? 'cover'} contentPosition={"center"}/></View>}
                    </View>
                </View>
            </View>

            <SidebarModal isOpen={isOpen} close={() => {setIsOpen(false)}} title={modalTitle ?? "Оставить заявку"} withSubmitButton={false}>
                <View style={styles.callbackFormModalContent}>
                    {modalDescription && <Text style={styles.callbackFormModalDescription}>{modalDescription}</Text>}
                    <ModalFields endpoint={endpoint} fields={fields} buttonText={buttonText}
                                 successfully={()=>{
                                     setIsOpen(false);
                                     setTimeout(() => {
                                         dispatch(successModal(true));
                                     }, 1000)
                                 }}
                                 target={target}/>
                </View>
            </SidebarModal>
        </>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        callbackFormWrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        callbackForm:{
            paddingVertical: 30,
            paddingHorizontal: 20,
            rowGap: 20,
            borderRadius: 20
        },
        callbackFormDark:{
            backgroundColor: "#2F3140"
        },
        callbackFormLight:{
            backgroundColor: "#F2F3F6"
        },
        callbackFormContent:{
            rowGap: 20
        },
        callbackFormContentText:{
            rowGap: 10
        },
        callbackFormTitle:{
            fontSize: isTablet ? 32 : 16,
            lineHeight: (isTablet ? 32 : 16) * 1.2,
            fontFamily: "Onest-Medium",
        },
        callbackFormTitleDark:{
            color: "#fff"
        },
        callbackFormTitleLight:{
            color: "#111"
        },
        callbackFormDescription:{
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.3,
            fontFamily: "Onest-Regular",
            color: "#111"
        },
        callbackFormDescriptionDark:{
            color: "#fff"
        },
        callbackFormDescriptionLight:{
            color: "#111"
        },
        callbackFormImageWrapper:{
            width: '100%',
            aspectRatio: 1.7,
            borderRadius: 20,
            overflow: "hidden"
        },
        callbackFormImage:{
            width: '100%',
            height: '100%'
        },
        callbackFormModalContent:{
            rowGap: 16
        },
        callbackFormModalDescription:{
            fontFamily: "Onest-Regular",
            color: "#111",
            fontSize: (isTablet ? 16 : 12),
            lineHeight: (isTablet ? 16 : 12) * 1.3
        }
    })
}