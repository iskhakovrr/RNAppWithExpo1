import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {SvgUri} from "react-native-svg";

import NavBar from "../../components/NavBar/NavBar";
import WhiteHeader from "../../components/WhiteHeader/WhiteHeader";
import Loader from "../../ui/Loader/Loader";

import bootstrapStyles from "../../ui/bootstrapStyles";

import {domain} from "../../constants/constants";

export default function Services({navigation}) {
    const [isLoading, setIsLoading] = useState(true);

    const [services, setServices] = useState(null);

    function getServices() {
        let date = new Date();

        fetch(`${domain}/mobAppData/ServicesScreen.json?v=${date.getFullYear()}${date.getMonth()}${date.getDate()}`)
            .then(response => {return response.json();})
            .then(result => {
                setServices(result);
                setIsLoading(false)
            });
    }

    useEffect(() => {
        getServices();
    }, [])

    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => contentStylish(isTablet), [isTablet])

    return (
        <>
            <WhiteHeader text={"Наши услуги"}/>
            <ScrollView bounces={false} style={{backgroundColor: "#EEF0F3B2"}}
                        contentContainerStyle={[bootstrapStyles.container, styles.container]}>
                {
                    isLoading
                        ? <Loader/>
                            : services?.length
                            ? <View style={styles.servicesList}>
                                {
                                    services.map(({href, title, text, icon}, index) => (
                                        <Pressable onPress={ () => navigation.push( "Main", {url: href})} key={index} style={[styles.serviceWrapper, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart, bootstrapStyles.justifyContentBetween]}>
                                            <View style={styles.serviceText}>
                                                <Text style={styles.serviceHeader}>{title}</Text>
                                                <Text style={styles.serviceDescription}>{text}</Text>
                                            </View>
                                            <SvgUri width={styles.serviceImage.width}
                                                    height={styles.serviceImage.height}
                                                    uri={`${domain}${icon}`}/>
                                        </Pressable>
                                    ))
                                }
                            </View>
                        : <View><Text>Ничего не найдено</Text></View>
                }
            </ScrollView>
            <NavBar/>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    container:{
        paddingVertical: 20,
    },
    servicesList: {
        rowGap: 8,
    },
    serviceWrapper:{
        paddingVertical: 12,
        paddingHorizontal: 14,
        columnGap: 20,
        backgroundColor: "#fff",
        borderRadius: 14
    },
    serviceText: {
        rowGap: 6,
        flexShrink: 1
    },
    serviceDescription: {
        fontFamily: "Onest-Regular",
        fontSize: 12,
        lineHeight: 12 * 1.3,
        color: "#111111",
        opacity: .48,
        flex: 1,
        flexWrap: 'wrap',
        flexShrink: 1
    },
    serviceHeader: {
        fontFamily: "Onest-Medium",
        fontSize: 14,
        lineHeight: 14 * 1.3,
        color: "#111111",
        flex: 1,
        flexWrap: 'wrap',
        flexShrink: 1
    },
    serviceImage: {
        width: 20,
        height: 20
    }
})