import {Pressable, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";

import bootstrapStyles from "../../ui/bootstrapStyles";
import NotificationIcon from "../../../assets/header/notification_b.svg";

export default function WhiteHeader({text}){
    const navigation = useNavigation();

    return (
        <View style={headerStyles.header}>
            <View style={bootstrapStyles.container}>
                <View style={[bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentBetween]}>
                    <Text style={headerStyles.headerText}>{text}</Text>
                    <Pressable onPress={() => navigation.navigate("Notifications")}>
                        <View style={headerStyles.notificationIconWrapper}>
                            <NotificationIcon style={headerStyles.notificationIcon}/>
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const headerStyles = StyleSheet.create({
    header: {
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: "#fff"
    },
    headerText: {
        color: "#111111",
        fontFamily: 'Onest-Medium',
        fontSize: 16,
        lineHeight: 16 * 1.4
    },
    notificationIconWrapper: {
        backgroundColor: "transparent",
        padding: 8
    },
    notificationIcon: {
        width: 24,
        height: 24
    }
});