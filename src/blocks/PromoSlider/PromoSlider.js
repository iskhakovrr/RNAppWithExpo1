import {Pressable, StyleSheet, View} from "react-native";
import {useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Image} from "expo-image";

import bootstrapStyles from "../../ui/bootstrapStyles";
import SwiperStylish from "../../ui/SwiperStylish";

import OpenURLButton from "../../components/LinkOpener/LinkOpener";

import mainModalToggle from "../../store/actions/mainModal/mainModalToggle";
import {domain} from "../../constants/constants";

export default function PromoSlider({ bannerList }) {
    const [height, setHeight] = useState(320);
    const swiper = useRef(null);
    const dispatch = useDispatch();

    const isTablet = useSelector(store => store.isTablet);
    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    // Функция для обновления высоты слайдера
    const handleImageLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height);
    };

    return (
        <View style={[bootstrapStyles.container, styles.wrapper]}>
            <SwiperStylish showsButtons={false}
                           autoplay={true}
                           delay={7000}
                           loop={true}
                           dotColor={"#D4D4D4"}
                           activeDotColor={"#2F3140"}
                           ref={swiper}
                           height={!!height ? height : 0}
                           paginationStyle={styles.pagination}>
                {
                    bannerList.map((banner, index) => {
                        if(banner?.link){
                            if(banner.link === 'openmodal'){
                                return(
                                    <Pressable key={index} onPress={()=>{dispatch(mainModalToggle(true))}}>
                                        <View onLayout={handleImageLayout}>
                                            <Image source={`${domain}${isTablet ? banner.bannerDesktop : banner.bannerTablet}`} style={[styles.slideImage]} />
                                        </View>
                                    </Pressable>
                                )
                            }else{
                                return(
                                    <OpenURLButton url={banner.link} key={index}>
                                        <View onLayout={handleImageLayout}>
                                            <Image source={`${domain}${isTablet ? banner.bannerDesktop : banner.bannerTablet}`} style={[styles.slideImage]}/>
                                        </View>
                                    </OpenURLButton>
                                )
                            }
                        }else{
                            return(
                                <View key={index} onLayout={handleImageLayout}>
                                    <Image source={`${domain}${isTablet ? banner.bannerDesktop : banner.bannerTablet}`} style={[styles.slideImage]}/>
                                </View>
                            )
                        }
                    })
                }
            </SwiperStylish>
        </View>
    )
}

const stylish = (isTablet) => StyleSheet.create({
    wrapper:{
        paddingVertical: isTablet ? 30 : 25,
        paddingBottom: 50,
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "start"
    },
    pagination:{
        display: "flex",
        justifyContent: 'center',
        alignItems: "center",
        position: "absolute",
        bottom: -20
    },
    slideImage: {
        borderRadius: 20,
        overflow: "hidden",
        aspectRatio: isTablet ? "160/51" : "45/23"
    },
});