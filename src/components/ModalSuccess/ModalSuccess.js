import {useDispatch, useSelector} from "react-redux";
import {useMemo} from "react";
import {StyleSheet, Modal, View, Pressable, Text} from "react-native";

import bootstrapStyles from "../../ui/bootstrapStyles";

import successModal from "../../store/actions/successModal/successModal";

import SuccessIcon from "../../../assets/uiIcons/clipboard-tick.svg";
import CloseIcon from "../../../assets/uiIcons/close-grey.svg";

export default function ModalSuccess() {
    const isOpen = useSelector(store => store.successModalIsOpen);
    const statusBar = useSelector(store => store.statusBar);
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet, statusBar), [isTablet, statusBar]);

    const dispatch = useDispatch();

    return (
        <Modal animationType="fade"
               transparent={true}
               visible={isOpen}>
            <View style={[bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter, bootstrapStyles.flexGrow1]}>
                <Pressable style={styles.modalBckg} onPress={() => dispatch(successModal(false))}/>
                <View style={[styles.modalContent, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                    <Pressable style={styles.modalContentCloseWrapper} onPress={() => dispatch(successModal(false))}>
                        <CloseIcon style={styles.modalContentClose}/>
                    </Pressable>
                    <SuccessIcon style={styles.modalContentImage}/>
                    <Text style={styles.modalContentHeader}>Заявка успешно отправлена</Text>
                    <Text style={styles.modalContentDescription}>Мы скоро вам перезвоним</Text>
                </View>
            </View>
        </Modal>
    )
}

const stylish = (isTablet, statusBar) => {
    return StyleSheet.create({
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
        modalContentImage:{
            width: 44,
            height: 44,
        },
        modalContentClose:{
            width: 26,
            height: 26,
        },
        modalContentCloseWrapper:{
            position: "absolute",
            top: 10,
            right: 10
        },
        modalContentHeader:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 24 : 16,
            lineHeight: (isTablet ? 24 : 16) * 1.4,
            textAlign: "center"
        },
        modalContentDescription:{
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.3,
            color: "#111",
            textAlign: "center"
        },
    })
}