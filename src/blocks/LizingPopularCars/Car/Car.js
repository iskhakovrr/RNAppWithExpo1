import {Pressable, StyleSheet, Text, View} from "react-native";
import React, {memo, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import FitImage from "react-native-fit-image";

import mainModalToggle from "../../../store/actions/mainModal/mainModalToggle";
import Info from "../../../../assets/uiIcons/info-circle.svg"
import bootstrapStyles from "../../../ui/bootstrapStyles";
import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";

const Car = memo(function Car({item, index}){
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => styling(isTablet), [isTablet])

    const dispatch = useDispatch();

    return(
        <Pressable key={index} style={[styles.lizingCardWrapper, (index % 2 === 0) ? {paddingRight: 5} : {paddingLeft: 5}]} onPress={() => dispatch(mainModalToggle(true))}>
            <View style={styles.lizingCard}>
                <FitImage source={{uri: `${domain}${item.image}`}} resizeMode="contain"/>
                {
                    ((isTablet) && item?.badges?.length > 0) &&
                        <View style={[styles.lizingCardInfoBadges, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart, isTablet ? bootstrapStyles.justifyContentEnd : bootstrapStyles.justifyContentStart, bootstrapStyles.flexWrap]}>
                            {
                                item.badges.map((item, i) =>{
                                    return(
                                        <View key={i} style={styles.lizingCardInfoBadgesEl}><Text style={styles.lizingCardInfoBadgesElText}>{item}</Text></View>
                                    )
                                })
                            }
                        </View>
                }
                <View style={[styles.lizingCardInfo]}>
                    <View style={styles.lizingCardInfoHeader}>
                        {item?.title && <Text style={styles.lizingCardInfoHeaderName}>{item.title}</Text>}
                        {item?.price && <Text style={styles.lizingCardInfoHeaderPrice}>{item.price}</Text>}
                    </View>
                    {
                        item?.pay &&
                        <View style={styles.lizingCardInfoPay}>
                            <Text style={styles.lizingCardInfoPayLabel}>{isTablet ? "Минимальный платеж" : "Мин. платеж"}</Text>
                            <View style={[styles.lizingCardInfoPayValueWrapper, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]}>
                                <Text style={styles.lizingCardInfoPayValue}>{item.pay}</Text>
                                <Pressable onPress={() => alertWithoutButtons("Внимание", "Это примерная сумма платежа. Точная цена рассчитывается при формировании предложения.")}><Info style={styles.lizingCardInfoPayValueIcon}/></Pressable>
                            </View>
                        </View>
                    }
                    {
                        ((!isTablet) && item?.badges?.length > 0) &&
                            <View style={[styles.lizingCardInfoBadges, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart, isTablet ? bootstrapStyles.justifyContentEnd : bootstrapStyles.justifyContentStart, bootstrapStyles.flexWrap]}>
                                {
                                    item.badges.map((item, i) =>{
                                        return(
                                            <View key={i} style={styles.lizingCardInfoBadgesEl}><Text style={styles.lizingCardInfoBadgesElText}>{item}</Text></View>
                                        )
                                    })
                                }
                            </View>
                    }
                </View>
            </View>
        </Pressable>
    )
})

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            lizingCardWrapper:{
                width: "45%",
                flexGrow: 1,
            },
            lizingCard:{
                backgroundColor: "#F4F5F7",
                borderRadius: isTablet ? 20 : 14,
                overflow: "hidden",
                position: "relative"
            },
            lizingCardInfo:{
                padding: 10,
                flexGrow: 1,
                rowGap: 6,
                position: "unset"
            },
            lizingCardInfoHeader:{
                rowGap: 3
            },
            lizingCardInfoHeaderName:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 18 : 14,
                lineHeight: (isTablet ? 18 : 14) * 1.4,
                color: "#111"
            },
            lizingCardInfoHeaderPrice:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 14 : 12,
                lineHeight: (isTablet ? 14 : 12) * 1.4,
                color: "#513FC6"
            },
            lizingCardInfoPay:{
                rowGap: 3
            },
            lizingCardInfoPayLabel:{
                fontFamily: "Onest-Regular",
                fontSize: 12,
                lineHeight: 12 * 1.3,
                color: "#111",
                opacity: .48
            },
            lizingCardInfoPayValue:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 18 : 14,
                lineHeight: (isTablet ? 18 : 14) * 1.4,
                color: "#111"
            },
            lizingCardInfoPayValueIcon:{
                width: 20,
                height: 20
            },
            lizingCardInfoPayValueWrapper:{
                columnGap: 8
            },
            lizingCardInfoBadges:{
                columnGap: isTablet ? 10 : 5,
                rowGap: 3,
                position: isTablet ? "absolute" : null,
                top: isTablet ? 12 : null,
                right: isTablet ? 12 : null,
                left: isTablet ? 12 : null
            },
            lizingCardInfoBadgesEl:{
                paddingVertical: 2,
                paddingHorizontal: 6,
                backgroundColor: "#513FC6",
                borderRadius: 4,
            },
            lizingCardInfoBadgesElText:{
                fontFamily: "Onest-Regular",
                fontSize: 10,
                lineHeight: 10 * 1.3,
                color: "#fff",
            }
        }
    )
}

export default Car