import {View, Text, StyleSheet} from "react-native";
import {useSelector} from "react-redux";
import {useMemo} from "react";
import {Image} from "expo-image";
import bootstrapStyles from "../../ui/bootstrapStyles";
import Button from "../../ui/Button/Button";
import {useNavigation} from "@react-navigation/native";
import {domain} from "../../constants/constants";

export default function LoyaltyProgram ({ title, bonusSystem, li1, li2, li3, btnText, image }){
    const user = useSelector(store => store.user);

    const isTablet = useSelector(store => store.isTablet);

    const navigation = useNavigation();

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    if(user){
        return null;
    }else{
        return (
            <View style={styles.loyaltyWrapper}>
                <View style={styles.loyalty}>
                    <View style={[styles.loyaltyInfo, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                        <View style={styles.loyaltyInfoBlock}>
                            <Text style={styles.loyaltyInfoBlockTitle}>{title}</Text>
                            {bonusSystem && <View style={[bootstrapStyles.alignItemsStart, bootstrapStyles.justifyContentStart, bootstrapStyles.flexRow]}><View style={styles.loyaltyInfoBlockBonuses}><Text style={styles.loyaltyInfoBlockBonusesText}>{bonusSystem}</Text></View></View>}
                            <View style={styles.loyaltyInfoBlockFavs}>
                                <Text style={styles.loyaltyInfoBlockFavsTitle}>Вы сможете:</Text>
                                <View style={styles.loyaltyInfoBlockFavsList}>
                                    {li1 &&
                                    <View style={[styles.loyaltyInfoBlockFavsListEl, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart]}>
                                        <View style={[styles.loyaltyInfoBlockFavsListElDotWrapper, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                                            <View style={styles.loyaltyInfoBlockFavsListElDot}/>
                                        </View>
                                        <Text style={styles.loyaltyInfoBlockFavsListElText}>{li1}</Text>
                                    </View>
                                    }
                                    {li2 &&
                                    <View style={[styles.loyaltyInfoBlockFavsListEl, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart]}>
                                        <View style={[styles.loyaltyInfoBlockFavsListElDotWrapper, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                                            <View style={styles.loyaltyInfoBlockFavsListElDot}/>
                                        </View>
                                        <Text style={styles.loyaltyInfoBlockFavsListElText}>{li2}</Text>
                                    </View>
                                    }
                                    {li3 &&
                                    <View style={[styles.loyaltyInfoBlockFavsListEl, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart]}>
                                        <View style={[styles.loyaltyInfoBlockFavsListElDotWrapper, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                                            <View style={styles.loyaltyInfoBlockFavsListElDot}/>
                                        </View>
                                        <Text style={styles.loyaltyInfoBlockFavsListElText}>{li3}</Text>
                                    </View>
                                    }
                                </View>
                            </View>
                            {
                                btnText &&
                                <View style={isTablet ? bootstrapStyles.alignItemsStart : null}>
                                    <Button title={btnText} type='second' size={isTablet ? "m" : "s"} onPress={() => {navigation.push("AuthIntro")}}/>
                                </View>
                            }
                        </View>
                        {image && <Image source={`${domain}${image}`} style={styles.loyaltyImage} contentFit={"contain"}/>}
                    </View>
                </View>
            </View>
        )
    }
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        loyaltyWrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        loyalty:{
            borderRadius: 20,
            backgroundColor: "#2F3140",
            paddingVertical: isTablet ? 40 : 30,
            paddingHorizontal: isTablet ? 30 : 20
        },
        loyaltyInfo:{
            rowGap: isTablet ? 30 : 24
        },
        loyaltyInfoBlock:{
            rowGap: isTablet ? 20 : 16
        },
        loyaltyInfoBlockTitle:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.2,
            color: "#fff"
        },
        loyaltyInfoBlockBonuses:{
            paddingVertical: 10,
            paddingHorizontal: 24,
            borderWidth: 2,
            borderColor: "#fff",
            borderStyle: "solid",
            borderRadius: 100
        },
        loyaltyInfoBlockBonusesText:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 18 : 14,
            lineHeight: (isTablet ? 18 : 14) * 1.4,
            color: "#fff"
        },
        loyaltyInfoBlockFavs: {
            rowGap: isTablet ? 20 : 16
        },
        loyaltyInfoBlockFavsTitle: {
            fontFamily: "Onest-Bold",
            fontSize: isTablet ? 16 : 14,
            lineHeight: (isTablet ? 16 : 14) * 1.4,
            color: "#fff"
        },
        loyaltyInfoBlockFavsList:{
            rowGap: isTablet ? 20 : 16
        },
        loyaltyInfoBlockFavsListEl:{
            columnGap: 5
        },
        loyaltyInfoBlockFavsListElDotWrapper:{
            paddingTop: 5,
            paddingHorizontal: 5
        },
        loyaltyInfoBlockFavsListElDot:{
            width: 3,
            height: 3,
            borderRadius: 10,
            backgroundColor: "#fff"
        },
        loyaltyInfoBlockFavsListElText:{
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 16 : 14,
            lineHeight: (isTablet ? 16 : 14) * 1.4,
            color: "#fff"
        },
        loyaltyImage:{
            width: "100%",
            height: isTablet ? 650 : 260
        }
    })
}
