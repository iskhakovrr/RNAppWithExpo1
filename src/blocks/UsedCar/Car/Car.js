import {Dimensions, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import {memo, useMemo} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import getNoun from "../../../hooks/getNoun";
import getSpacedPrice from "../../../hooks/getSpacedPrice";

import Owners from "../../../../assets/usedcar/profile-2user.svg"
import Speedometer from "../../../../assets/usedcar/speedometer.svg"
import Gearbox from "../../../../assets/usedcar/gearbox.svg"
import Wheel from "../../../../assets/usedcar/wheel.svg"

const Car = memo(function Car({item}){
    const isTablet = useSelector(store => store.isTablet);
    const styles = useMemo(() => styling(isTablet), [isTablet])

    return(
        <View style={[styles.carCard]}>
            <View style={styles.carCardPhotoWrapper}>
                <Image style={styles.carCardPhoto}
                       source={item.image}
                       contentFit="cover"
                       transition={300}/>
            </View>
            <View style={[styles.carCardInfo, bootstrapStyles.justifyContentBetween]}>
                <View style={[styles.carCardInfoHeader, isTablet ? bootstrapStyles.flexColumn : bootstrapStyles.flexRow, isTablet ? bootstrapStyles.alignItemsStart : bootstrapStyles.alignItemsCenter]}>
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
                                                <Owners style={styles.carCardInfoLabelIcon}/>
                                                <Text style={styles.carCardInfoLabelText}>{item.value} {getNoun(item.value, ['владельцев', 'владелец', 'владельца'])}</Text>
                                            </View>
                                        )
                                    }
                                    case "mileage": {
                                        return (
                                            <View style={[styles.carCardInfoLabel, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} key={i}>
                                                <Speedometer style={styles.carCardInfoLabelIcon}/>
                                                <Text style={styles.carCardInfoLabelText}>{getSpacedPrice(item.value)} км</Text>
                                            </View>
                                        )
                                    }
                                    case "driveType": {
                                        return (
                                            <View style={[styles.carCardInfoLabel, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} key={i}>
                                                <Wheel style={styles.carCardInfoLabelIcon}/>
                                                <Text style={styles.carCardInfoLabelText}>{item.value}</Text>
                                            </View>
                                        )
                                    }
                                    case "gearBox": {
                                        return (
                                            <View style={[styles.carCardInfoLabel, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]} key={i}>
                                                <Gearbox style={styles.carCardInfoLabelIcon}/>
                                                <Text style={styles.carCardInfoLabelText}>{item.value}</Text>
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
        </View>
    )
})

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            carCard:{
                width: "100%",
                backgroundColor: "#fff",
                flexGrow: 1
            },
            carCardPhotoWrapper:{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: "hidden"
            },
            carCardPhoto:{
                height: Dimensions.get("window").width * ( isTablet ? 0.4 : 0.3),
                minHeight: isTablet ? 211 : 140,
                width: "100%"
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
                rowGap: isTablet ? 14 : 6
            },
            carCardInfoHeader:{
                columnGap: 10,
                rowGap: 3
            },
            carCardInfoName:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 24 : 14,
                lineHeight: (isTablet ? 24 : 14) * 1.4,
                color: "#111"
            },
            carCardInfoYear:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 16 : 12,
                lineHeight: (isTablet ? 16 : 12) * 1.3,
                color: "#111",
                opacity: .45
            },
            carCardInfoLabels:{
                flexWrap: "wrap",
                flexDirection: "row",
                gap: 6
            },
            carCardInfoLabel:{
                paddingVertical: isTablet ? 4 : 2,
                paddingHorizontal: isTablet ? 7 : 5,
                borderRadius: 4,
                backgroundColor: "#F4F5F7",
                columnGap: 6
            },
            carCardInfoLabelText:{
                fontSize: isTablet ? 14 : 10,
                lineHeight: (isTablet ? 14 : 10) * 1.3,
                fontFamily: "Onest-Regular",
                color: "#111"
            },
            carCardInfoLabelIcon:{
                width: 24,
                height: 24
            },
            carCardInfoPrice:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 24 : 14,
                lineHeight: (isTablet ? 24 : 12) * 1.4,
                color: "#111"
            }
        }
    )
}

export default Car