import {View, StyleSheet, Pressable, Text} from "react-native";
import {useSelector} from "react-redux";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import bootstrapStyles from "../../ui/bootstrapStyles";

import Home from "../../../assets/navbar/home.svg";
import Service from "../../../assets/navbar/service.svg";
import Location from "../../../assets/navbar/location.svg";
import User from "../../../assets/navbar/user.svg";

export default function NavBar(){
    const isTablet = useSelector(store => store.isTablet)
    const user = useSelector(store => store.user)
    const navigation = useNavigation();

    const {name: routeName} = useRoute();

    return (
        <View style={styles.navbar}>
            <View style={bootstrapStyles.container}>
                <View style={[bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, isTablet ? bootstrapStyles.justifyContentAround : bootstrapStyles.justifyContentBetween]}>
                    <Pressable style={[styles.navbarEl, routeName === "Main" && styles.navbarElActive, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]} onPress={()=>{navigation.navigate("Main", {url: "/main-page"})}}>
                        <Home width={styles.navbarElIcon.width} height={styles.navbarElIcon.height}/>
                        <Text>Главная</Text>
                    </Pressable>
                    <Pressable style={[styles.navbarEl, (routeName.includes("Services")) && styles.navbarElActive, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]} onPress={()=>{navigation.navigate("Services")}}>
                        <Service width={styles.navbarElIcon.width} height={styles.navbarElIcon.height}/>
                        <Text>Услуги</Text>
                    </Pressable>
                    <Pressable style={[styles.navbarEl, (routeName.includes("Contact")) && styles.navbarElActive, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]} onPress={()=>{navigation.navigate("Contacts")}}>
                        <Location width={styles.navbarElIcon.width} height={styles.navbarElIcon.height}/>
                        <Text>Контакты</Text>
                    </Pressable>
                    <Pressable style={[styles.navbarEl, (routeName.includes("Auth") || routeName.includes('LK')) && styles.navbarElActive, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]}
                               onPress={user ? ()=>{navigation.navigate("LKMain")} : ()=>{navigation.navigate("AuthIntro")}}>
                        <User width={styles.navbarElIcon.width} height={styles.navbarElIcon.height}/>
                        <Text>Кабинет</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    navbar:{
        backgroundColor: "#F4F5F7",
        paddingTop: 10,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: "#f1f1f1",
        borderStyle: "solid"
    },
    navbarEl:{
        rowGap: 5,
        opacity: .3
    },
    navbarElActive:{
        opacity: 1
    },
    navbarElIcon:{
        width: 22,
        height: 22,
        tintColor: "#b6b6b6"
    },
    navbarElText:{
        fontFamily: "Onest-Medium",
        fontSize: 11,
        lineHeight: 11 * 1.4,
        color: "#b6b6b6",
    }
});