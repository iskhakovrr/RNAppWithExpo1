import {useMemo, useRef} from "react";
import {StyleSheet, Text, View} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SwiperStylish from "../../ui/SwiperStylish";

import Button from "../../ui/Button/Button";

import CarFront from "./Images/car-front.svg";
import CarSide from "./Images/car-side.svg";
import Notification from "./Images/notifications.svg";
import {useSelector} from "react-redux";
import bootstrapStyles from "../../ui/bootstrapStyles";

export default function IntroScreen({ navigation }) {
    const swiper = useRef(null);

    const isTablet = useSelector(store => store.isTablet);

    const storeData = async () => {
        try {
            await AsyncStorage.setItem('isIntro', "1");
        } catch (e) {
            // saving error
        }
    };

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <View style={styles.container}>
            <SwiperStylish showsButtons={false}
                    autoplay={false}
                    loop={false}
                    dotColor={"#D4D4D4"}
                    activeDotColor={"#2F3140"}
                    ref={swiper}
                    paginationStyle={styles.pagination}>
                <View style={[styles.slideWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.justifyContentCenter]}>
                    <View style={[styles.slide, bootstrapStyles.dFlex, bootstrapStyles.flexGrow1, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                        <View style={[styles.slideContent, bootstrapStyles.dFlex, bootstrapStyles.flexGrow1, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                            <CarFront width={108}/>
                            <View style={styles.slideText}>
                                <Text style={styles.slideHeader}>Добро пожаловать</Text>
                                <Text style={styles.slideDescription}>Добавляйте свой автопарк, смотрите историю посещений центров, заказов автозапчастей</Text>
                            </View>
                        </View>
                        <Button onPress={() => swiper.current?.scrollBy(1)} title={"Далее"} style={{width: "100%"}}/>
                    </View>
                </View>
                <View style={[styles.slideWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.justifyContentCenter]}>
                    <View style={[styles.slide, bootstrapStyles.dFlex, bootstrapStyles.flexGrow1, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                        <View style={[styles.slideContent, bootstrapStyles.dFlex, bootstrapStyles.flexGrow1, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                            <CarSide width={108}/>
                            <View style={styles.slideText}>
                                <Text style={styles.slideHeader}>Покупайте новые авто{"\n"}и авто с пробегом</Text>
                                <Text style={styles.slideDescription}>Выгодно и быстро от официального дилера</Text>
                            </View>
                        </View>
                        <Button onPress={() => swiper.current?.scrollBy(1)} title={"Далее"} style={{width: "100%"}}/>
                    </View>
                </View>
                <View style={[styles.slideWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexRow, bootstrapStyles.justifyContentCenter]}>
                    <View style={[styles.slide, bootstrapStyles.dFlex, bootstrapStyles.flexGrow1, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                        <View style={[styles.slideContent, bootstrapStyles.dFlex, bootstrapStyles.flexGrow1, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                            <Notification width={108}/>
                            <View style={styles.slideText}>
                                <Text style={styles.slideHeader}>Получайте выгодные предложения на сервис и покупку</Text>
                                <Text style={styles.slideDescription}>Включите уведомления, чтобы не пропускать выгоды</Text>
                            </View>
                        </View>
                        <Button onPress={() => {storeData();navigation.navigate("Main", {url: "/main-page"})}} title={"Далее"} style={{width: "100%"}}/>
                    </View>
                </View>
            </SwiperStylish>
        </View>
    );
}

const stylish = (isTablet) => StyleSheet.create({
    container:{
        height: "100%",
        position: "relative"
    },
    pagination:{
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
        position: "absolute",
        bottom: 40
    },
    slideWrapper: {
        backgroundColor: "#fff",
        paddingTop: 40,
        paddingBottom: isTablet ? 120 : 75,
        height: "100%"
    },
    slide: {
        maxWidth: isTablet ? 560 : 235,
    },
    slideContent: {
        rowGap: 70,
    },
    slideText:{
        rowGap: 16,
        flexDirection: 'column'
    },
    slideHeader:{
        fontFamily: 'Onest-Medium',
        textAlign: "center",
        fontSize: 18,
        lineHeight: 18 * 1.2,
        color: "#111"
    },
    slideDescription:{
        fontFamily: 'Onest-Regular',
        textAlign: "center",
        color: "#6B6B6B",
        fontSize: 12,
        lineHeight: 12 * 1.3
    }
});