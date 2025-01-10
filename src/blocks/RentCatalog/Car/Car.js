import {Dimensions, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import bootstrapStyles from "../../../ui/bootstrapStyles";
import {memo, useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import getNoun from "../../../hooks/getNoun";
import getSpacedPrice from "../../../hooks/getSpacedPrice";
import {BlurView} from "expo-blur";

const Car = memo(function Car({item, index, onPress}){
    const isTablet = useSelector(store => store.isTablet);
    const styles = useMemo(() => styling(isTablet), [isTablet])

    return(
        <Pressable onPress={onPress} style={[styles.carCard, isTablet && ((index % 2 === 0) ? {paddingRight: 5} : {paddingLeft: 5})]}>
            <View style={styles.carCardPhotoWrapper}>
                {
                    Platform.OS === 'ios'
                        ? <Image style={styles.carCardPhotoBckg}
                                 source={`${domain}${item.image}`}
                                 contentFit="cover"
                                 transition={300}>
                            <BlurView intensity={4} style={styles.carCardPhotoBckgBlur} />
                        </Image>
                        : <Image style={styles.carCardPhotoBckg}
                                 source={`${domain}${item.image}`}
                                 contentFit="cover"
                                 blurRadius={4}
                                 transition={300}/>
                }
                <Image style={styles.carCardPhoto}
                       source={`${domain}${item.image}`}
                       contentFit="contain"
                       transition={300}/>
            </View>
            <View style={[styles.carCardInfo, bootstrapStyles.justifyContentBetween]}>
                <View style={[styles.carCardInfoHeader, bootstrapStyles.alignItemsStart]}>
                    <Text style={styles.carCardInfoName}>{item.name}</Text>
                    <Text style={styles.carCardInfoDescription}>{item.description}</Text>
                </View>
                {(item?.price && !isNaN(item.price) && (typeof item.price !== 'object')) && <Text style={styles.carCardInfoPrice}>от {getSpacedPrice(item.price)} ₽/сутки</Text>}
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
            carCardPhoto:{
                width: "100%",
                aspectRatio: 4/3
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
                rowGap: 0
            },
            carCardInfoName:{
                fontFamily: "Onest-Medium",
                fontSize: 14,
                lineHeight: 14 * 1.4,
                color: "#111"
            },
            carCardInfoDescription:{
                fontFamily: "Onest-Medium",
                fontSize: 12,
                lineHeight: 12 * 1.3,
                color: "#111",
                opacity: .45
            },
            carCardInfoPrice:{
                fontFamily: "Onest-Medium",
                fontSize: 12,
                lineHeight: 12 * 1.4,
                color: "#111"
            }
        }
    )
}

export default Car