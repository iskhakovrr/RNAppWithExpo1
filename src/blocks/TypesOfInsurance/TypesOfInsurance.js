import {useDispatch, useSelector} from "react-redux";
import {View, Text, StyleSheet, Pressable} from "react-native";
import React, {useMemo, useState} from "react";
import {Image} from "expo-image";
import {useNavigation} from "@react-navigation/native";

import Button from "../../ui/Button/Button";
import bootstrapStyles from "../../ui/bootstrapStyles";
import mainModalToggle from "../../store/actions/mainModal/mainModalToggle";
import OpenURLButton from "../../components/LinkOpener/LinkOpener";
import SidebarModal from "../../components/SidebarModal/SidebarModal";
import ModalFields from "../../components/ModalFields/ModalFields";
import successModal from "../../store/actions/successModal/successModal";
import {domain} from "../../constants/constants";

export default function TypesOfInsurance({title, typesList, modal}) {
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [localModal, setLocalModal] = useState({isOpen: true, title: "Оставить заявку"});

    const openModal = (title = "Оставить заявку") => {
        if(modal){
            setLocalModal({isOpen: true, title: title});
        }else{
            dispatch(mainModalToggle({title: title}));
        }
    }

    return (
        <>
            <View style={styles.typesOfInsuranceWrapper}>
                <View style={bootstrapStyles.container}>
                    <View style={styles.typesOfInsurance}>
                        {title && <Text style={styles.typesOfInsuranceTitle}>{title}</Text>}
                        <View style={styles.typesOfInsuranceList}>
                            {
                                typesList.map(({image, title, description, button, link, toScreen, screenProps}, index) => {
                                    return (
                                        <View style={[styles.typesOfInsuranceEl, isTablet ? bootstrapStyles.flexRowReverse : null, isTablet ? bootstrapStyles.alignItemsCenter : null]}
                                              key={index}>
                                            {
                                                image &&
                                                <View style={[bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                                                    <Image source={`${domain}${image}`}
                                                           style={styles.typesOfInsuranceElImage}
                                                           contentFit={"contain"}/>
                                                </View>
                                            }
                                            <View style={[styles.typesOfInsuranceElContent, bootstrapStyles.flexGrow1]}>
                                                <View style={styles.typesOfInsuranceElTextWrapper}>
                                                    {title && <Text style={styles.typesOfInsuranceElHeader}>{title}</Text>}
                                                    {description && <Text style={styles.typesOfInsuranceElDescription}>{description}</Text>}
                                                </View>
                                                {
                                                    button
                                                        ? link
                                                        ? link === 'openmodal'
                                                            ? <Button title={button} type={"main"} size={isTablet ? "l" : "s"} onPress={() => {title ? openModal(title) : openModal()}}/>
                                                            : <OpenURLButton url={link}><Button title={button} type={"main"} size={isTablet ? "l" : "s"}/></OpenURLButton>
                                                        : toScreen
                                                            ? <Button title={button} type={"main"} size={isTablet ? "l" : "s"} onPress={() => {navigation.push(toScreen, screenProps ?? null)}}/>
                                                            : null
                                                        : null
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </View>
            {
                modal &&
                <SidebarModal isOpen={localModal?.isOpen} title={localModal?.title} withSubmitButton={false} close={() => {setLocalModal(({title}) => {return({isOpen: false, title})})}}>
                    <View style={[styles.application]}>
                        <Text style={styles.applicationDescription}>{modal?.description ?? "Оставьте заявку и мы вам скоро перезвоним"}</Text>
                        {
                            modal?.fields &&
                            <ModalFields endpoint={modal.endpoint}
                                         fields={modal.fields}
                                         buttonText={modal.buttonText}
                                         successfully={() => {
                                             setLocalModal(({title}) => {return({isOpen: false, title})});
                                             setTimeout(() => {
                                                 dispatch(successModal(true));
                                             }, 1000)
                                         }}
                                         target={localModal?.title}/>
                        }
                    </View>
                </SidebarModal>
            }
        </>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        typesOfInsuranceWrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        typesOfInsurance:{
            rowGap: isTablet ? 30 : 16
        },
        typesOfInsuranceTitle:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 24 : 12,
            lineHeight: (isTablet ? 24 : 12) * 1.3,
            color: "#111"
        },
        typesOfInsuranceList:{
            rowGap: 20,
            flexShrink: 1
        },
        typesOfInsuranceEl:{
            padding: isTablet ? 30 : 20,
            backgroundColor: "#FAFAFA",
            borderRadius: isTablet ? 20 : 14,
            gap: isTablet ? 20 : 10
        },
        typesOfInsuranceElContent:{
            rowGap: isTablet ? 16 : 8,
            flex: 1
        },
        typesOfInsuranceElImage:{
            width: isTablet ? 206 : 220,
            height: isTablet ? 200 : 140
        },
        typesOfInsuranceElTextWrapper:{
            rowGap: isTablet ? 10 : 4,
            alignItems: "start"
        },
        typesOfInsuranceElHeader:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 24 : 14,
            lineHeight: (isTablet ? 24 : 14) * 1.3,
            color: "#111",
            display: "flex",
            flexShrink:1,
            flexWrap: 'wrap'
        },
        typesOfInsuranceElDescription:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 14 : 12,
            lineHeight: (isTablet ? 14 : 12) * 1.3,
            color: "#111",
            opacity: .48,
            display: "flex",
            flexShrink:1,
            flexWrap: 'wrap'
        }
    })
}