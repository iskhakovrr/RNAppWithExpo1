import {StyleSheet, Text, View} from "react-native";
import React, {memo, useMemo} from "react";
import {useSelector} from "react-redux";
import {Image} from "expo-image";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import getSpacedPrice from "../../../hooks/getSpacedPrice";

import OpenURLButton from "../../../components/LinkOpener/LinkOpener";

import {domain} from "../../../constants/constants";

const Car = memo(function Car({item, index}){
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => styling(isTablet), [isTablet])

    return(
        <OpenURLButton url={item.link} key={index} style={[styles.newCarsCard, ((index % 2 === 0) ? {paddingRight: 5} : {paddingLeft: 5})]}>
            <Image source={`${domain}/storage/${item.image}`} style={{width: "100%", aspectRatio: "3/2"}} contentFit={"contain"}/>

            <View style={[styles.newCarsCardInfo, bootstrapStyles.justifyContentBetween]}>
                <View>
                    <Text style={styles.newCarsCardInfoName}>{item.name}</Text>
                    <Text style={styles.newCarsCardInfoDescription}>{item.description}</Text>
                </View>
                <View>
                    <Text style={styles.carCardInfoPrice}>от {getSpacedPrice(item.price)} ₽</Text>
                </View>
            </View>
        </OpenURLButton>
    )
})

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            newCarsCard:{
                width: "45%",
                maxWidth: "50%",
                backgroundColor: "#fff",
                flexGrow: 1
            },
            newCarsCardInfo:{
                padding: 10,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#F4F5F7",
                borderTopWidth: 0,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                overflow: "hidden",
                flexGrow: 1,
                rowGap: 6
            },
            carCardInfoHeader:{
                columnGap: 10
            },
            newCarsCardInfoName:{
                fontFamily: "Onest-Medium",
                fontSize: 14,
                lineHeight: 14 * 1.4,
                color: "#111"
            },
            newCarsCardInfoDescription:{
                fontFamily: "Onest-Regular",
                fontSize: 10,
                lineHeight: 10 * 1.3,
                color: "#111",
                opacity: .48
            },
            carCardInfoPrice:{
                fontFamily: "Onest-Medium",
                fontSize: 14,
                lineHeight: 14 * 1.4,
                color: "#111"
            }
        }
    )
}

export default Car