import {Pressable, StyleSheet, Text, View} from "react-native";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../bootstrapStyles";

export default function ChoiceGroup({value, items, onChange, size}){
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => styling(isTablet), [isTablet]);

    return(
        <View style={[bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart, bootstrapStyles.justifyContentStart]}>
            <View style={[styles.wrapper]}>
                <View style={[styles.container, bootstrapStyles.flexRow, bootstrapStyles.justifyContentStart, bootstrapStyles.alignItemsCenter]}>
                    {
                        items.map((item, index) => {
                            return(
                                <React.Fragment key={index}>
                                    <Pressable style={[styles.item]} onPress={() => onChange(item)}>
                                        {
                                            item === value && <View style={styles.itemActive}/>
                                        }
                                        <Text style={[styles.itemText, item === value && styles.itemActiveText]}>{item}</Text>
                                    </Pressable>
                                    {
                                        (items.length - 1) !== index && <View style={styles.divider}/>
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                </View>
            </View>
        </View>
    )
}

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            wrapper: {
                borderRadius: 4,
                borderColor: "rgba(17, 17, 17, 0.48)",
                borderWidth: 1
            },
            container: {
                backgroundColor: "#fff",
                borderRadius: 4,
            },
            item: {
                paddingVertical: isTablet ? 9 : 6,
                paddingHorizontal: isTablet ? 12 : 20,
                backgroundColor: "#fff",
                borderRadius: 4,
                position: "relative"
            },
            itemText: {
                fontSize: isTablet ? 16 : 14,
                fontFamily: "Onest-Medium",
                lineHeight: (isTablet ? 16 : 14) * 1.4,
                color: "#2F3140"
            },
            itemActive: {
                backgroundColor: "#2F3140",
                position: "absolute",
                borderRadius: 4,
                top: -1,
                right: -1,
                left: -1,
                bottom: -1
            },
            itemActiveText: {
                color: "#fff"
            },
            divider: {
                height: "60%",
                width: 1,
                backgroundColor: "rgba(17, 17, 17, 0.48)"
            }
        }
    )
}