import {StyleSheet, View, Text, ImageBackground, Pressable} from "react-native";
import {useMemo} from "react";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";

import bootstrapStyles from "../../ui/bootstrapStyles";
import {domain} from "../../constants/constants";

export default function MainServices ({ mainServicesList }) {
    const isTablet = useSelector(store => store.isTablet);
    const navigation = useNavigation();
    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <View style={styles.mainServicesWrapper}>
            <View style={styles.mainServices}>
                <View style={bootstrapStyles.container}>
                    <View style={styles.mainServicesCards}>
                        {
                            mainServicesList.map(({path, title, text, imgPath}, index) => {
                                return (
                                    <Pressable key={index} style={[styles.cardWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsEnd]} onPress={ () => navigation.push( "Main", {url: path})}>
                                        <View style={[styles.card, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                                            <Text style={styles.cardTitle}>{title}</Text>
                                            {isTablet && <Text style={styles.cardText}>{text}</Text>}
                                        </View>
                                        <ImageBackground source={{uri: `${domain}/${imgPath}`}} alt="" style={styles.cardImg} />
                                    </Pressable>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        mainServicesWrapper:{
            paddingBottom: isTablet ? 30 : 25
        },
        mainServices: {
            backgroundColor: "#2F3140",
            paddingBottom: isTablet ? 60 : 20
        },
        mainServicesCards: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            rowGap: 10,
            columnGap: 10
        },
        cardWrapper: {
            width: "45%",
            backgroundColor: "#fff",
            borderRadius: isTablet ? 20 : 14,
            flexGrow: 1,
            height: isTablet ? 130 : 90,
            position: "relative",
            overflow: "hidden"
        },
        card: {
            paddingTop: isTablet ? 20 : 12,
            paddingLeft: isTablet ? 20 : 12,
            paddingRight: isTablet ? 20 : 12,
            width: "100%",
            rowGap: 6
        },
        cardTitle: {
            fontFamily: 'Onest-Medium',
            fontSize: isTablet ? 20 : 12,
            lineHeight: isTablet ? 20 * 1.2 : 12 * 1.2,
        },
        cardText: {
            fontFamily: 'Onest-Regular',
            fontSize: 14,
            lineHeight: 14 * 1.2,
            color: "#111",
            opacity: .48,
            maxWidth: 130
        },
        cardImg: {
            height: isTablet ? 71.5 : 62,
            width: isTablet ? 152 : 116,
            resizeMode: 'contain',
            position: "absolute",
            objectPosition: "start",
            bottom: 0,
            right: 0,
            zIndex: -1
        }
    })
}