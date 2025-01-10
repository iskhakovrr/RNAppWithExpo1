import {View, Text, StyleSheet, Pressable} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Image} from 'expo-image';
import {useMemo, useState} from "react";

import bootstrapStyles from "../../ui/bootstrapStyles";

import SidebarModal from "../../components/SidebarModal/SidebarModal";
import ModalFields from "../../components/ModalFields/ModalFields";
import OpenURLButton from "../../components/LinkOpener/LinkOpener";

import successModal from "../../store/actions/successModal/successModal";
import mainModalToggle from "../../store/actions/mainModal/mainModalToggle";
import {domain} from "../../constants/constants";

export default function TypesOfJobs ({ title, typesList, modal }){
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    const [localModal, setLocalModal] = useState({isOpen: false, title: "Оставить заявку"});

    const dispatch = useDispatch();

    const openModal = (title = "Оставить заявку") => {
        if(modal){
            setLocalModal({isOpen: true, title: title});
        }else{
            dispatch(mainModalToggle({title: title}));
        }
    }

    const close = () => {setLocalModal(({title}) => {return({isOpen: false, title})})}

    return (
        <View style={styles.typesOfJobWrapper}>
            <View style={bootstrapStyles.container}>
                <View style={[styles.typesOfJob]}>
                    <Text style={[styles.typesOfJobTitle]}>{title}</Text>
                    <View style={[styles.typesOfJobCards, bootstrapStyles.flexRow, bootstrapStyles.flexWrap]}>
                        {
                            typesList.map(({ image, title, href, modalTitle }, index) => {
                                if(href){
                                    if(href === 'openmodal') {
                                        return (
                                            <Pressable key={index} onPress={() => {modalTitle ? openModal(modalTitle) : openModal()}} style={styles.typesOfJobCard}>
                                                <Text style={styles.typesOfJobCardTitle}>{title}</Text>
                                                <Image source={`${domain}/${image}`}
                                                       style={styles.typesOfJobCardImage}
                                                       width={styles.typesOfJobCardImage.width}
                                                       height={styles.typesOfJobCardImage.height}
                                                       contentFit="cover"/>
                                            </Pressable>
                                        )
                                    }else{
                                        return (
                                            <OpenURLButton url={href} key={index} style={styles.typesOfJobCard}>
                                                <Text style={styles.typesOfJobCardTitle}>{title}</Text>
                                                <Image source={`${domain}/${image}`}
                                                       style={styles.typesOfJobCardImage}
                                                       width={styles.typesOfJobCardImage.width}
                                                       height={styles.typesOfJobCardImage.height}
                                                       contentFit="cover"/>
                                            </OpenURLButton>
                                        )
                                    }
                                }else {
                                    return (
                                        <View style={styles.typesOfJobCard} key={index}>
                                            <Text style={styles.typesOfJobCardTitle}>{title}</Text>
                                            <Image source={`${domain}/${image}`}
                                                   style={styles.typesOfJobCardImage}
                                                   width={styles.typesOfJobCardImage.width}
                                                   height={styles.typesOfJobCardImage.height} contentFit="cover"/>
                                        </View>
                                    )
                                }
                            })
                        }
                    </View>
                </View>
            </View>
            {
                modal &&
                <>
                    <SidebarModal isOpen={localModal?.isOpen} title={localModal?.title} withSubmitButton={false} close={close}>
                        <View style={[styles.application]}>
                            <Text style={styles.applicationDescription}>{modal?.description ?? "Оставьте заявку и мы вам скоро перезвоним"}</Text>
                            {
                                modal?.fields &&
                                <ModalFields endpoint={modal.endpoint}
                                             fields={modal.fields}
                                             buttonText={modal.buttonText}
                                             successfully={() => {
                                                 close();
                                                 setTimeout(() => {
                                                     dispatch(successModal(true));
                                                 }, 1000)
                                             }}
                                             target={localModal?.title}/>
                            }
                        </View>
                    </SidebarModal>
                </>
            }
        </View>
    )
}


const stylish = (isTablet) => {
    return StyleSheet.create({
        typesOfJobWrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        typesOfJob:{
            rowGap: isTablet ? 30 : 16
        },
        typesOfJobTitle:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.2,
            color: "#111"
        },
        typesOfJobCards:{
            rowGap: 10,
            columnGap: 10
        },
        typesOfJobCard:{
            padding: isTablet ? 26 : 16,
            backgroundColor: "#F1F1F1",
            borderRadius: isTablet ? 20 : 14,
            overflow: "hidden",
            position: "relative",
            flexGrow: 1,
            width: isTablet ? "30%" : "45%",
            minHeight: isTablet ? 260 : 140
        },
        typesOfJobCardTitle:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 24 : 12,
            lineHeight: (isTablet ? 24 : 12) * 1.3,
            color: "#111"
        },
        typesOfJobCardImage:{
            position: "absolute",
            right: 0,
            bottom: -1,
            // zIndex: -1,
            width: isTablet ? 192 : 103,
            height: isTablet ? 216 : 115
        },
        application: {
            rowGap: 16
        }
    })
}