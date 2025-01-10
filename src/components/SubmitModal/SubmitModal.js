import {Modal, StyleSheet, View, Pressable, Text} from "react-native";
import {useMemo} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../../ui/bootstrapStyles";

import Button from "../../ui/Button/Button";

export default function SubmitModal({isOpen, close, accept, declineButtonText, acceptButtonText, isLoading, headerText, descriptionText}){
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => contentStylish(isTablet), [isTablet])

    return (
        <Modal animationType="fade"
               transparent={true}
               visible={isOpen}>
            <View style={[bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter, bootstrapStyles.flexGrow1]}>
                <Pressable style={styles.modalBckg} onPress={close}/>
                <View style={styles.modalContent}>
                    <View style={[styles.modalContentText, bootstrapStyles.alignItemsCenter]}>
                        <Text style={styles.modalContentHeader}>{headerText}</Text>
                        {descriptionText && <Text style={styles.modalContentDescription}>{descriptionText}</Text>}
                    </View>
                    <View style={[styles.modalsContentBtns, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                        <Button title={declineButtonText} type={"second"} size={isTablet ? "l" : 's'} onPress={close} disabled={isLoading}/>
                        <Button title={acceptButtonText} type={"red"} size={isTablet ? "l" : 's'} onPress={accept} disabled={isLoading}/>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
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
    modalContent:{
        padding: 20,
        backgroundColor: "#fff",
        elevation: 2,
        rowGap: 16,
        borderRadius: 14,
        maxWidth: isTablet ? 382 : 300
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