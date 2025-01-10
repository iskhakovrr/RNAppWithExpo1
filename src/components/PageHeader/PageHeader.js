import {View, StyleSheet, Pressable, Text} from "react-native";
import {useNavigation} from "@react-navigation/native";

import bootstrapStyles from "../../ui/bootstrapStyles";

import Close from "../../../assets/pageHeader/close.svg";
import ArrowLeft from "../../../assets/pageHeader/arrow-left.svg";

export default function PageHeader({backgroundColor = "#fff", back, label, close, canGoBack = true, alignLeft = false}){
    const navigation = useNavigation();

    return (
        <View style={[styles.header, {backgroundColor: backgroundColor}]}>
            <View style={bootstrapStyles.container}>
                <View style={[bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentBetween]}>
                    {
                        canGoBack
                            ? <Pressable onPress={() => {back ? back() : navigation.goBack()}}>
                                <View style={styles.notificationIconWrapper}>
                                    <ArrowLeft style={styles.icon}/>
                                </View>
                            </Pressable>
                            : !alignLeft && <View/>
                    }
                    <Text style={styles.label}>{label ?? ''}</Text>
                    {
                        close
                            ? <Pressable style={styles.notificationIconWrapper} onPress={close}>
                                <Close style={styles.icon}/>
                            </Pressable>
                            : <View style={styles.notificationIconWrapper}/>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 12,
        paddingBottom: 12
    },
    label: {
        fontFamily: "Onest-Medium",
        fontSize: 16,
        lineHeight: 16 * 1.4
    },
    notificationIconWrapper: {
        width: 40,
        backgroundColor: "transparent",
        padding: 8
    },
    icon: {
        width: 24,
        height: 24
    }
});