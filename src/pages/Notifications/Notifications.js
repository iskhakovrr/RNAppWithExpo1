import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";

import bootstrapStyles from "../../ui/bootstrapStyles";

import PageHeader from "../../components/PageHeader/PageHeader";
import {queryPost} from "../../query/query";
import Loader from "../../ui/Loader/Loader";
import mainModalToggle from "../../store/actions/mainModal/mainModalToggle";

export default function Notifications({navigation}) {
    const isTablet = useSelector(store => store.isTablet);
    const user = useSelector(store => store.user);

    const dispatch = useDispatch();

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function getNotifications() {
        if(user){
            queryPost(`${domain}/api/notifications/all`, new FormData())
                .then(result => {
                    setNotifications(result);
                    setIsLoading(false);
                });
        }else{
            fetch(`${domain}/api/notifications/all`, {method: "post"})
                .then(response => response.json())
                .then(result => {
                    setNotifications(result);
                    setIsLoading(false);
                });
        }
    }

    function getNotifDate(dateString){
        if(dateString?.length){
            let months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

            let splitDateTime = dateString.split("T")
            let splitDate = splitDateTime[0].split("-");

            return `${splitDate[2]} ${months[Number(splitDate[1]) - 1]} ${splitDate[0]}`;
        }

        return false;
    }

    useEffect(() => {
        getNotifications();
    }, [user])

    const styles = useMemo(() => contentStylish(isTablet), [isTablet]);

    return (
        <>
            <PageHeader label={"Уведомления"} backgroundColor={"#F4F5F7"}/>
            <ScrollView bounces={false} style={[styles.content]} contentContainerStyle={[bootstrapStyles.container, bootstrapStyles.flexGrow1]}>
                {
                    isLoading
                        ? <Loader/>
                        : notifications?.length
                            ? <View style={styles.notificationsList}>
                                {
                                    notifications.map((notif, i) => {
                                        return (
                                            <Pressable key={i} onPress={notif?.id ? () => navigation.navigate("SingleNotification", {id: notif.id}) : null}>
                                                <View style={styles.notificationsListEl}>
                                                    <View style={[styles.notificationsListElHeaderWrapper, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]}>
                                                        <View style={styles.notificationsListElHeaderStatus}/>
                                                        <Text>{notif?.title ?? null}</Text>
                                                    </View>
                                                    {notif?.body && <Text style={styles.notificationsListElBody}>{notif?.body}</Text>}
                                                    {notif?.date && <Text style={styles.notificationsListElDate}>{getNotifDate(notif.date) ?? null}</Text>}
                                                </View>
                                            </Pressable>
                                        )
                                    })
                                }
                            </View>
                            : <Text>Уведомления пусты</Text>
                }
                {/*<Pressable onPress={() => {dispatch(mainModalToggle(true))}}><Text>open modal</Text></Pressable>*/}
            </ScrollView>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    content: {
        backgroundColor: "#F4F5F7"
    },
    notificationsList: {
        rowGap: 8
    },
    notificationsListEl: {
        backgroundColor: "#fff",
        borderRadius: isTablet ? 14 : 10,
        padding: 12,
        rowGap: 8
    },
    notificationsListElHeaderWrapper: {
        columnGap: 8,
    },
    notificationsListElHeader: {
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 16 : 14,
        lineHeight: (isTablet ? 16 : 14) * 1.3,
        color: "#111"
    },
    notificationsListElHeaderStatus: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: "#513FC6"
    },
    notificationsListElBody: {
        fontFamily: "Onest-Regular",
        fontSize: 12,
        lineHeight: 12 * 1.3,
        color: "#111"
    },
    notificationsListElDate: {
        fontFamily: "Onest-Regular",
        fontSize: 10,
        lineHeight: 10 * 1.2,
        color: "#111",
        opacity: .48
    }
});