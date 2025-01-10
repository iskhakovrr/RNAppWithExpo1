import {StyleSheet, View, Text, Pressable} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useMemo, useState} from "react";
import { SvgUri } from 'react-native-svg';
import { Image } from 'expo-image';

import bootstrapStyles from "../../ui/bootstrapStyles";

import ChoiceGroup from "../../ui/ChoiceGroup/ChoiceGroup";
import OpenURLButton from "../../components/LinkOpener/LinkOpener";
import mainModalToggle from "../../store/actions/mainModal/mainModalToggle";
import SidebarModal from "../../components/SidebarModal/SidebarModal";
import ModalFields from "../../components/ModalFields/ModalFields";
import successModal from "../../store/actions/successModal/successModal";
import ChargersMap from "../ChargersMap/ChargersMap";
import {domain} from "../../constants/constants";

export default function LogoGrid ({ title, logos, viewTabs, defaultTabLabel, defaultTabLabelMob, modal }) {
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    const [types, setTypes] = useState([]);
    const [currType, setCurrType] = useState(null);
    const [currLogos, setCurrLogos] = useState(logos);

    const [localModal, setLocalModal] = useState({isOpen: false, title: "Оставить заявку"});

    const dispatch = useDispatch();

    useEffect(() => {
        if(viewTabs){
            let toTypes = [...new Set(logos.map(logo => logo.filters).flat(1))];
            if(defaultTabLabel){
                setTypes([isTablet ? defaultTabLabel : defaultTabLabelMob, ...toTypes]);
            }else{
                setTypes(toTypes);
            }
        }
    }, [logos]);

    useEffect(() => {
        if(currType){
            if(currType === defaultTabLabel || currType === defaultTabLabelMob){
                setCurrLogos(logos);
            }else{
                setCurrLogos(logos.filter(logo => logo.filters.includes(currType)));
            }
        }
    }, [currType]);

    useEffect(() =>{
        setCurrType(types[0]);
    },[types]);

    const openModal = (title = "Оставить заявку") => {
        if(modal){
            setLocalModal({isOpen: true, title: title});
        }else{
            dispatch(mainModalToggle({title: title}));
        }
    }

    return (
        <>
            <View style={styles.logoGridWrapper}>
            <View style={bootstrapStyles.container}>
                <View style={styles.logoGrid}>
                    <View style={styles.logoGridTitleWrapper}>
                        {title && <Text style={styles.logoGridTitle}>{title}</Text>}
                        {
                            viewTabs &&
                            <View>
                                <ChoiceGroup value={currType}
                                             items={types}
                                             onChange={setCurrType}
                                             getItemLabel={(item) => item}
                                             size="l"/>
                            </View>
                        }
                    </View>
                    {
                        currLogos?.length
                            ? <View style={[styles.logoGridCards, bootstrapStyles.flexRow, bootstrapStyles.flexWrap, bootstrapStyles.justifyContentStart]}>
                                {
                                    currLogos.map(({ href, target, image, modalTitle }, index) => {
                                        if(href){
                                            if(href === 'openmodal'){
                                                return (
                                                    <Pressable key={index} onPress={() => {modalTitle ? openModal(modalTitle) : openModal()}} style={[styles.logoGridCard, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                                                        {
                                                            image.slice(-3) === 'svg'
                                                                ? <SvgUri
                                                                    width={styles.logoGridCardImage.maxWidth}
                                                                    height={styles.logoGridCardImage.maxHeight}
                                                                    uri={`${domain}${image}`}
                                                                />
                                                                : <Image source={`${domain}${image}`} alt="" style={styles.logoGridCardImage} contentFit={"contain"}/>
                                                        }
                                                    </Pressable>
                                                )
                                            }else{
                                                return (
                                                    <OpenURLButton url={href} key={index} style={[styles.logoGridCard, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                                                        {
                                                            image.slice(-3) === 'svg'
                                                                ? <SvgUri
                                                                    width={styles.logoGridCardImage.maxWidth}
                                                                    height={styles.logoGridCardImage.maxHeight}
                                                                    uri={`${domain}${image}`}
                                                                />
                                                                : <Image source={`${domain}${image}`} alt="" style={styles.logoGridCardImage} contentFit={"contain"}/>
                                                        }
                                                    </OpenURLButton>
                                                )
                                            }
                                        }else{
                                            return (
                                                <View key={index} style={[styles.logoGridCard, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                                                    {
                                                        image.slice(-3) === 'svg'
                                                            ? <SvgUri
                                                                width={styles.logoGridCardImage.maxWidth}
                                                                height={styles.logoGridCardImage.maxHeight}
                                                                uri={`${domain}${image}`}
                                                            />
                                                            : <Image source={`${domain}${image}`} alt="" style={styles.logoGridCardImage} contentFit={"contain"}/>
                                                    }
                                                </View>
                                            )
                                        }
                                    })
                                }
                            </View>
                            : null
                    }
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
        logoGridWrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        logoGrid:{
            rowGap: isTablet ? 30 : 16
        },
        logoGridTitleWrapper:{
            rowGap: isTablet ? 30 : 16
        },
        logoGridTitle:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.2
        },
        logoGridCards:{
            gap: 10,
        },
        logoGridCard:{
            backgroundColor: "#fafafa",
            paddingVertical: 5,
            borderRadius: 5,
            width: isTablet ? "22%" : "31.5%",
            maxWidth: isTablet ? "22%" : "31.5%",
            height: isTablet ? 80 : 45
        },
        logoGridCardImage:{
            width: "100%",
            height: "100%",
            maxHeight: isTablet ? 50 : 29,
            maxWidth: isTablet ? 130 : 90,
        },
        application:{
            rowGap: 16
        },
        applicationDescription:{
            fontFamily: "Onest-Regular",
            color: "#111",
            fontSize: (isTablet ? 16 : 12),
            lineHeight: (isTablet ? 16 : 12) * 1.3
        }
    })
}