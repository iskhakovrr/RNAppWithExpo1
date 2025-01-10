import {Dimensions, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import bootstrapStyles from "../../../ui/bootstrapStyles";
import {memo, useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import getNoun from "../../../hooks/getNoun";
import getSpacedPrice from "../../../hooks/getSpacedPrice";
import {BlurView} from "expo-blur";

const Car = memo(function Car({item, index}){
    const navigation = useNavigation();
    const isTablet = useSelector(store => store.isTablet);
    const styles = useMemo(() => styling(isTablet), [isTablet])

    return(
        <Pressable onPress={item?.id ? () => navigation.push("Main", {url: "/used-car", carId: item.id}) : null} style={[styles.carCard, isTablet && ((index % 2 === 0) ? {paddingRight: 5} : {paddingLeft: 5})]}>
            <View style={styles.carCardPhotoWrapper}>
                <View style={styles.carCardPhoto}>
                    {
                        Platform.OS === 'ios'
                            ? <Image style={styles.carCardPhotoBckg}
                                       source={item.image}
                                       contentFit="cover"
                                       transition={300}>
                                <BlurView intensity={4} style={styles.carCardPhotoBckgBlur} />
                            </Image>
                            : <Image style={styles.carCardPhotoBckg}
                                     source={item.image}
                                     contentFit="cover"
                                     blurRadius={4}
                                       transition={300}/>
                    }
                    {/*<Image style={styles.carCardPhotoBckg}*/}
                    {/*       source={item.image}*/}
                    {/*       contentFit="cover"*/}
                    {/*       transition={300}>*/}
                    {/*    <BlurView intensity={4} style={styles.carCardPhotoBckgBlur} />*/}
                    {/*</Image>*/}
                    <Image style={styles.carCardPhotoImg}
                           source={item.image}
                           contentFit="contain"
                           transition={300}/>
                </View>
            </View>
            <View style={[styles.carCardInfo, bootstrapStyles.justifyContentBetween]}>
                <View style={[styles.carCardInfoHeader, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]}>
                    <Text style={styles.carCardInfoName}>{item.name}</Text>
                    <Text style={styles.carCardInfoYear}>{item.year}</Text>
                </View>
                {
                    item.info?.length &&
                        <View style={[styles.carCardInfoLabels, bootstrapStyles.flexWrap]}>
                            {
                                item.info.map((item, i) => {
                                    switch (item.type) {
                                        case "owners": {
                                            return (
                                                <View style={[styles.carCardInfoLabel, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} key={i}>
                                                    <Text>{item.value} {getNoun(item.value, ['владельцев', 'владелец', 'владельца'])}</Text>
                                                </View>
                                            )
                                        }
                                        case "mileage": {
                                            return (
                                                <View style={[styles.carCardInfoLabel, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} key={i}>
                                                    <Text>{getSpacedPrice(item.value)} км</Text>
                                                </View>
                                            )
                                        }
                                        default: {
                                            return (
                                                <View style={[styles.carCardInfoLabel, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} key={i}>
                                                    <Text>{item.value}</Text>
                                                </View>
                                            )
                                        }
                                    }
                                })
                            }
                        </View>
                }
                <Text style={styles.carCardInfoPrice}>{getSpacedPrice(item.price)} ₽</Text>
            </View>
        </Pressable>
    )
})

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            carCard:{
                width: isTablet ? "45%" : "100%",
                maxWidth: isTablet ? "50%" : "100%",
                backgroundColor: "#fff",
                flexGrow: 1
            },
            carCardPhotoWrapper:{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: "hidden"
            },
            carCardPhoto:{
                // height: Dimensions.get("window").width * ( isTablet ? 0.3 : 0.4),
                // minHeight: isTablet ? 211 : 140,
                width: "100%",
                aspectRatio: 4/3
            },
            carCardPhotoBckg:{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            carCardPhotoBckgBlur:{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            carCardPhotoImg:{
                width: "100%",
                height: "100%"
            },
            carCardInfo:{
                padding: 10,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#F4F5F7",
                borderTopWidth: 0,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                overflow: "hidden",
                rowGap: 6
            },
            carCardInfoHeader:{
                columnGap: 10
            },
            carCardInfoName:{
                fontFamily: "Onest-Medium",
                fontSize: 14,
                lineHeight: 14 * 1.4,
                color: "#111"
            },
            carCardInfoYear:{
                fontFamily: "Onest-Medium",
                fontSize: 12,
                lineHeight: 12 * 1.3,
                color: "#111",
                opacity: .45
            },
            carCardInfoLabels:{
                flexWrap: "wrap",
                flexDirection: "row",
                gap: 6
            },
            carCardInfoLabel:{
                paddingVertical: 2,
                paddingHorizontal: 5,
                borderRadius: 4,
                backgroundColor: "#F4F5F7",
                fontSize: 10,
                lineHeight: 10 * 1.3,
                fontFamily: "Onest-Regular",
                color: "#111"
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