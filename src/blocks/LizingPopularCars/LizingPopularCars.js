import React, {useMemo} from "react";
import {View, Text, StyleSheet, FlatList} from "react-native";
import {useSelector} from "react-redux";
import bootstrapStyles from "../../ui/bootstrapStyles";
import Car from "./Car/Car";

export default function LizingPopularCars({title, cars}){
    const isTablet = useSelector(store => store.isTablet)
    const styles = useMemo(() => styling(isTablet), [isTablet])

    function renderItem({item, index}){
        return(<Car item={item} index={index}/>)
    }

    return(
        <View style={styles.lizingPopularsWrapper}>
            <View style={bootstrapStyles.container}>
                <View style={styles.lizingPopulars}>
                    {title && <Text style={styles.lizingPopularsTitle}>{title}</Text>}
                    {
                        cars?.length > 0 &&
                            <FlatList data={cars}
                                      horizontal={false}
                                      numColumns={2}
                                      removeClippedSubviews={true}
                                      bounces={false}
                                      viewabilityConfig={{
                                          waitForInteraction: true,
                                          viewAreaCoveragePercentThreshold: 10
                                      }}
                                      renderItem={renderItem}
                                      keyExtractor={(item, i) => i}
                                      windowSize={4}
                                      style={styles.lizingPopularsCards}/>
                    }
                </View>
            </View>
        </View>
    )
}

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            lizingPopularsWrapper:{
                paddingVertical: isTablet ? 30 : 25
            },
            lizingPopulars:{
                rowGap: 16
            },
            lizingPopularsTitle:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 28 : 18,
                lineHeight: (isTablet ? 28 : 18) * 1.3,
                color: "#111",
                textAlign: "start"
            },
            lizingPopularsCards: {
                columnGap: 10,
                rowGap: isTablet ? 20 : 16,
                width: "100%",
            }
        }
    )
}