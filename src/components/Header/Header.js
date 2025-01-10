import {View, StyleSheet, Pressable} from "react-native";
import {Link, useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";

import bootstrapStyles from "../../ui/bootstrapStyles";

import Logo from "../../../assets/header/logo.svg";
import NotificationIcon from "../../../assets/header/notification.svg";

export default function Header({backgroundColor = "#2F3140"}){
    const navigation = useNavigation();

    return (
        <View style={[styles.header, {backgroundColor: backgroundColor}]}>
            <View style={bootstrapStyles.container}>
                <View style={[bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentBetween]}>
                    <Logo width={styles.logo.width} height={styles.logo.height}/>
                    <Pressable onPress={() => navigation.navigate('Notifications')}>
                        <View style={[styles.notificationIconWrapper, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                            <NotificationIcon width={styles.notificationIcon.width} height={styles.notificationIcon.height} style={styles.notificationIcon}/>
                        </View>
                    </Pressable>
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
    notificationIconWrapper: {
        padding: 8,
        position: "relative"
    },
    notificationIcon: {
        width: 24,
        height: 24,
    },
    logo: {
        width: 176,
        height: 16
    }
});