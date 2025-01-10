import {Animated, Easing, Pressable, StyleSheet, Text, View} from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../bootstrapStyles";

import ArrDown from "../../../assets/collapsible/arrow-down.svg";

export default function Collapsible({header, withBorderBottom = false, content}){
    const isTablet = useSelector(store => store.isTablet)

    const heightValue = useRef(new Animated.Value(0)).current;
    const arrowValue = useRef(new Animated.Value(0)).current;

    const [isOpen, setIsOpen] = useState(false);
    const [isInit, setIsInit] = useState(false);

    const heightRef = useRef(0);

    const styles = useMemo(() => styling(isTablet), [isTablet]);

    const arrow = arrowValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    })
    const height = heightValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, heightRef.current]
    })

    useEffect(() => {
        if(isOpen){
            Animated.timing(arrowValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();
            Animated.timing(heightValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
                easing: Easing.linear
            }).start();
        }else{
            Animated.timing(arrowValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.linear
            }).start();
            Animated.timing(heightValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
                easing: Easing.linear
            }).start();
        }
    }, [isOpen])

    return(
        <View style={[styles.wrapper, withBorderBottom && styles.bb, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
            <Pressable style={[styles.header, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]} onPress={() => setIsOpen(prevState => !prevState)}>
                <Text style={styles.headerText}>{header}</Text>
                <Animated.View style={{transform: [{rotateZ: arrow}]}}>
                    <ArrDown style={styles.headerIcon}/>
                </Animated.View>
            </Pressable>
            <Animated.View style={[styles.contentWrapper, isInit && {height: height}]}>
                <View styles={styles.content} onLayout={!isInit ? e => {heightRef.current = e.nativeEvent.layout.height; setIsInit(true)} : null}>
                    {content.map((item, index) => <Text key={index}>{item}</Text>)}
                </View>
            </Animated.View>
        </View>
    )
}

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            wrapper: {
                rowGap: 4
            },
            bb: {
                paddingBottom: 10,
                borderBottomColor: "#F1F1F1",
                borderBottomWidth: 1,
                borderBottomStyle: "solid"
            },
            header: {
                columnGap: 20
            },
            headerText: {
                fontFamily: "Onest-Medium",
                fontSize: 12,
                lineHeight: 12 * 1.4
            },
            headerIcon: {
                width: 24,
                height: 24
            },
            contentWrapper: {
                overflow: "hidden"
            },
            content: {
                rowGap: 2
            },
            contentText: {
                fontFamily: "Onest-Regular",
                fontSize: 12,
                lineHeight: 12 * 1.3
            },
        }
    )
}