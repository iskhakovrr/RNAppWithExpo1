import {
    Modal,
    StyleSheet,
    View,
    Pressable,
    Text,
    ScrollView,
    Platform,
    Animated,
    Easing,
    Dimensions
} from "react-native";
import {useEffect, useMemo, useRef} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../../ui/bootstrapStyles";

import Button from "../../ui/Button/Button";
import PageHeader from "../PageHeader/PageHeader";

export default function SidebarModal({isOpen, close, title, children, submitButtonOnPress, submitButtonText, submitButtonType = 'main', withSubmitButton = true}){
    const isTablet = useSelector(store => store.isTablet);
    const statusBar = useSelector(store => store.statusBar);
    const width = Dimensions.get("window").width
    const styles = useMemo(() => contentStylish(isTablet, statusBar), [isTablet,statusBar, isOpen]);

    const sidebarValue = useRef(new Animated.Value(0)).current;

    const sidebar = sidebarValue.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0]
    })

    useEffect(() => {
        if(isOpen){
            Animated.timing(sidebarValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();
        }else{
            Animated.timing(sidebarValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();
        }
    }, [isOpen])

    return (
        <Modal animationType="fade"
               transparent={true}
               visible={isOpen}>
            <View style={[bootstrapStyles.flexGrow1, styles.modalWrapper]}>
                <Pressable style={[styles.modalBckg, {display: isOpen ? "flex" : "none"}]} onPress={close}/>
                <Animated.View style={[styles.modalContentWrapper, bootstrapStyles.flexGrow1, {transform: [{translateX: sidebar}]}]}>
                    <PageHeader canGoBack={false} label={title} close={close} alignLeft={true}/>
                    <ScrollView contentContainerStyle={[{paddingBottom: 80},bootstrapStyles.container, bootstrapStyles.flexGrow1]} bounces={false}>
                        {children}
                    </ScrollView>
                    {withSubmitButton && <Button title={submitButtonText} onPress={submitButtonOnPress} style={styles.submitButton} type={submitButtonType}/>}
                </Animated.View>
            </View>
        </Modal>
    )
}

const contentStylish = (isTablet, statusBar) => StyleSheet.create({
    modalBckg: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        opacity: .3,
        elevation: 1,
    },
    modalWrapper:{
        // position: "absolute",
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        paddingTop: Platform.OS === 'ios' ? (statusBar.height ?? 20) : null,
        // paddingTop: 20
    },
    modalContentWrapper:{
        backgroundColor: "#fff",
        elevation: 2,
        height: "100%",
        position: "relative"
    },
    submitButton:{
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10
    },
    modalContentText:{
        rowGap: 10
    },
    modalContentHeader:{
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 24 : 18,
        lineHeight: (isTablet ? 24 : 18) * 1.3,
        textAlign: "center"
    },
    modalContentDescription:{
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 16 : 12,
        lineHeight: (isTablet ? 16 : 12) * 1.3,
        color: "#111",
        opacity: .48
    },
    modalsContentBtns:{
        columnGap: 16
    },
});