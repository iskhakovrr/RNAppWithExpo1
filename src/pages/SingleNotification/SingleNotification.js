import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import FitImage from "react-native-fit-image";

import bootstrapStyles from "../../ui/bootstrapStyles";

import PageHeader from "../../components/PageHeader/PageHeader";
import Loader from "../../ui/Loader/Loader";

import {queryPost} from "../../query/query";

import {domain} from "../../constants/constants";

export default function SingleNotification({route, navigation}) {
    const isTablet = useSelector(store => store.isTablet);
    const user = useSelector(store => store.user);

    const [notification, setNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function getNotification() {
        let data = new FormData();

        if(route?.params?.id){
            data.append("id", route.params.id)
        }else{
            navigation.navigate("Notifications");
        }

        if (user) {
            queryPost(`${domain}/api/notifications/single`, data)
                .then(result => {
                    // console.log(result);
                    setNotification(result);
                    setIsLoading(false);
                });
        } else {
            fetch(`${domain}/api/notifications/single`, {method: "post"})
                .then(response => response.json())
                .then(result => {
                    // console.log(result);
                    setNotification(result);
                    setIsLoading(false);
                });
        }
    }

    useEffect(() => {
        getNotification();
    }, [user])

    const styles = useMemo(() => contentStylish(isTablet), [isTablet]);

    return (
        <>
            <PageHeader label={notification?.title ?? "Уведомление"}/>
            <ScrollView bounces={false} style={[styles.content]}
                        contentContainerStyle={[bootstrapStyles.container, bootstrapStyles.flexGrow1]}>
                {
                    isLoading
                        ? <Loader/>
                        : notification
                        ? <View style={styles.notification}>
                            {notification?.image && <View style={styles.notificationImage}><FitImage source={{uri: `${domain}/storage/${notification.image}`}}/></View>}
                            {notification?.specialLabel && <Text style={styles.notificationSpecialLabel}>{notification.specialLabel}</Text>}
                            {notification?.title && <Text style={styles.notificationTitle}>{notification.title}</Text>}
                            {(notification?.description || notification?.body) && <Text style={styles.notificationDescription}>{notification?.description || notification?.body}</Text>}
                        </View>
                        : <Text>Произошла ошибка</Text>
                }
            </ScrollView>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    content: {
        backgroundColor: "#fff"
    },
    notification: {
        rowGap: isTablet ? 26 : 16
    },
    notificationImage: {
        borderRadius: 20,
        overflow: "hidden"
    },
    notificationSpecialLabel: {
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 16 : 12,
        lineHeight: (isTablet ? 16 : 12) * 1.3,
        color: "#111",
        opacity: .48
    },
    notificationTitle: {
        fontFamily: "Onest-Bold",
        fontSize: isTablet ? 28 : 18,
        lineHeight: (isTablet ? 28 : 18) * 1.2,
        color: "#111"
    },
    notificationDescription: {
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 16 : 12,
        lineHeight: (isTablet ? 16 : 12) * 1.3,
        color: "#111"
    }
});