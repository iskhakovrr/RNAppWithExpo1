import {Text, ScrollView, View, Pressable, StyleSheet, Image} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";

import NavBar from "../../../components/NavBar/NavBar";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Button from "../../../ui/Button/Button";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import Plus from "../../../../assets/uiIcons/plus.svg"
import AddCar from "../../../../assets/lk/addCar.svg"
import {getCars} from "../../../query/query";
import Loader from "../../../ui/Loader/Loader";
import Car from "./Car/Car";

export default function LKListOfCars({navigation}) {
    const isTablet = useSelector(store => store.isTablet)
    const cars = useSelector(store => store.cars)

    const styles = useMemo(() => contentStylish(isTablet), [isTablet])

    useEffect(() => {
        getCars();
    }, [])

    return (
        <>
            <PageHeader label={"Мой автопарк"}/>
            <ScrollView bounces={false} style={[styles.content]}
                        contentContainerStyle={[bootstrapStyles.container, bootstrapStyles.flexGrow1]}>
                {
                    cars?.length
                        ? <View style={styles.carsList}>
                            {
                                cars.map((car, index) => {
                                    return(<Car car={car} refreshCarsList={getCars} key={index}/>)
                                })
                            }
                            <Pressable style={[styles.carsListAddNewCar, bootstrapStyles.alignItemsCenter]}
                                       onPress={() => navigation.navigate("LKAddOrEditCar")}>
                                <AddCar width={styles.carsListAddNewImage.width}
                                        height={styles.carsListAddNewImage.height}/>
                                <Text style={styles.carsListAddNewText}>Добавить автомобиль</Text>
                            </Pressable>
                        </View>
                        : <View style={[bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                            <View style={[styles.empty, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                                <Image source={require('../../../../assets/lk/listOfCarsEmpty.webp')} style={styles.emptyImage}/>
                                <Text style={styles.emptyText}>У вас пока нет автомобилей</Text>
                                <Button title={"Добавить авто"} leftIcon={Plus} size='s' onPress={() => navigation.navigate("LKAddOrEditCar")}/>
                            </View>
                        </View>
                }
            </ScrollView>
            <NavBar/>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    content: {
        backgroundColor: "#fff"
    },
    carsList:{
        rowGap: 16
    },
    carsListAddNewCar:{
        borderRadius: 14,
        rowGap: 12,
        padding: 20,
        backgroundColor: "#F4F5F7",
    },
    carsListAddNewImage:{
        width: 30,
        height: 30
    },
    carsListAddNewText:{
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 18 : 14,
        lineHeight: (isTablet ? 18 : 14) * 1.4
    },
    empty: {
        rowGap: 26,
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 30,
        shadowColor: '#000',
        backgroundColor: "#fff",
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.05,
        shadowRadius: 16,
        borderRadius: 20,
        elevation: 1,
        maxWidth: 510
    },
    emptyImage: {
        width: isTablet ? 295 : 180,
        height: isTablet ? 155 : 95
    },
    emptyText: {
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 20 : 16,
        lineHeight: (isTablet ? 20 : 16) * 1.4
    }
});