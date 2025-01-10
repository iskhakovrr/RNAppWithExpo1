import {Dimensions, StyleSheet, Text, View} from "react-native";
import {useMemo} from "react";
import {useSelector} from "react-redux";
import {Image} from "expo-image";
import {SwiperFlatList} from "react-native-swiper-flatlist/index";

import bootstrapStyles from "../../ui/bootstrapStyles";
import Pagination from "../../ui/Pagination/Pagination";
import {domain} from "../../constants/constants";

export default function OurWorksBodyRepair({ title, images }){
    const width = Dimensions.get('window').width;

    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet, width), [isTablet, width]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.content}>
                <View style={bootstrapStyles.container}>
                    {
                        title &&
                        <Text style={styles.title}>{title}</Text>
                    }
                </View>
                {
                    images?.length &&
                    <SwiperFlatList showPagination
                                    style={{width: width, overflow:"visible", paddingBottom: 10}}
                                    autoplay={true}
                                    autoplayDelay={7}
                                    autoplayLoopKeepAnimation={true}
                                    autoplayLoop={true}
                                    paginationDefaultColor={"#D4D4D4"}
                                    paginationActiveColor={"#2F3140"}
                                    PaginationComponent={(props) => <Pagination {...props}/>}>
                        {
                            images.map(({image}, index) => {
                                return (
                                    <View key={index} style={[styles.photoWrapper, {width: width}]}>
                                        <Image source={`${domain}${image}`}
                                               style={styles.photo}
                                               contentFit={"cover"}
                                               transition={300}/>
                                    </View>
                                )
                            })
                        }
                    </SwiperFlatList>
                }
            </View>
        </View>
    )
}

const stylish = (isTablet, width) => {
    return StyleSheet.create({
        wrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        content:{
            rowGap: isTablet ? 30 : 16
        },
        choiceGroupWrapper:{
            columnGap: 10
        },
        photoWrapper:{
            // height: 109,
            width: "100%",
            paddingHorizontal: 10
        },
        photo:{
            height: width/3,
            borderRadius: 20,
            overflow: "hidden"
        },
        title:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.2,
            color: "#111",
            textAlign: isTablet ? "start" : "center"
        },
        slider: {
            height: '100%',
        },
        slideWrapper: {
        },
        slideImage: {
            width: '100%',
            height: undefined,
            aspectRatio: 1,
            borderRadius: 20,
            overflow: "hidden"
        },
    })
}