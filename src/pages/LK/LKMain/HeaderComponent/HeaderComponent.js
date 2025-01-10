import {Pressable, StyleSheet, Text, View} from "react-native";
import bootstrapStyles from "../../../../ui/bootstrapStyles";
import {LinearGradient} from "expo-linear-gradient";
import Car from "../../../../../assets/lk/car.svg";
import Settings from "../../../../../assets/lk/settings.svg";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import Loader from "../../../../ui/Loader/Loader";
import {useNavigation} from "@react-navigation/native";

export default function HeaderComponent({history, isLoading}){
    const user = useSelector(store => store.user)
    const isTablet = useSelector(store => store.isTablet)

    const navigation = useNavigation();

    const contentStyles = useMemo(() => contentStylish(isTablet), [isTablet])

    return(
        <View style={{paddingBottom: 10}}>
            <View style={contentStyles.gridWrapper}>
                {
                    user?.bonuses >= 0
                        ? <View style={[contentStyles.gridItem, bootstrapStyles.justifyContentBetween]}>
                            <LinearGradient colors={['rgb(47, 49, 64)', 'rgb(76, 80, 120)', 'rgb(67, 69, 84)']}
                                            locations={[.15, .5, .85]} start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                            style={contentStyles.gridItemGradient}/>
                            <Text style={contentStyles.bonusesCount}>{user.bonuses}</Text>
                            <Text style={[contentStyles.gridItemDescription, contentStyles.bonusesDescription]}>Мои бонусы</Text>
                        </View>
                        : null
                }
                <View style={[contentStyles.gridRow, bootstrapStyles.flexRow]}>
                    <Pressable style={[contentStyles.gridItem, bootstrapStyles.justifyContentBetween]}
                               onPress={() => navigation.navigate("LKListOfCars")}>
                        <Car/>
                        <Text style={contentStyles.gridItemDescription}>Мой автопарк</Text>
                    </Pressable>
                    <Pressable style={[contentStyles.gridItem, bootstrapStyles.justifyContentBetween]}
                               onPress={() => navigation.navigate("LKEditUserData")}>
                        <Settings/>
                        <Text style={contentStyles.gridItemDescription}>Профиль</Text>
                    </Pressable>
                </View>
            </View>
            <Text style={contentStyles.header}>История посещений</Text>
            {
                !history && isLoading
                    ? <View style={{height: 300}}>
                        <Loader/>
                    </View>
                    : null
            }
        </View>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    content: {
        backgroundColor: "#fff"
    },
    gridWrapper: {
        rowGap: 10,
        paddingBottom: 15,
    },
    gridItemDescription: {
        fontFamily: 'Onest-Medium',
        fontSize: isTablet ? 18 : 14,
        lineHeight: (isTablet ? 18 : 14) * 1.4,
        color: "#2F3140",
        zIndex: 1
    },
    gridItemIcon: {
        width: 24,
        height: 24
    },
    gridItem: {
        padding: 14,
        borderRadius: 14,
        // height: 100,
        backgroundColor: "#F4F5F7",
        flex: 1,
        position: 'relative',
        overflow: "hidden"
    },
    gridItemGradient:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    gridRow: {
        columnGap: 10
    },
    bonusesCount: {
        fontFamily: 'Onest-Medium',
        fontSize: isTablet ? 32 : 28,
        lineHeight: (isTablet ? 32 : 28) * 1.2,
        color: "#fff",
        zIndex: 1
    },
    bonusesDescription: {
        color: "#fff"
    },
    wrapper:{
        paddingVertical: 15,
        rowGap: 16
    },
    header:{
        fontFamily: "Onest-Medium",
        fontSize: 16,
        lineHeight: 16 * 1.4
    },
});