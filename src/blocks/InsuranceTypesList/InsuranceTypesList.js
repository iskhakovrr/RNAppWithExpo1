import {useSelector} from "react-redux";
import React, {useMemo} from "react";
import {StyleSheet, Text, View} from "react-native";

import bootstrapStyles from "../../ui/bootstrapStyles";

export default function InsuranceTypesList({title, value}){
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    if(value?.length > 0){
        return(
            <View style={styles.InsuranceTypesListWrapper}>
                <View style={bootstrapStyles.container}>
                    <View style={styles.InsuranceTypesList}>
                        {title && <Text style={styles.InsuranceTypesListTitle}>{title}</Text>}
                        <View style={styles.InsuranceTypesListList}>
                            {
                                value.map((item, i) => {
                                    return(
                                        <View style={styles.InsuranceTypesListItem} key={i}>
                                            <View style={styles.InsuranceTypesListItemMarker}/>
                                            <Text style={styles.InsuranceTypesListItemText}>{item}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }else{
        return null;
    }
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        InsuranceTypesListWrapper: {
            paddingVertical: isTablet ? 30 : 25
        },
        InsuranceTypesList: {
            backgroundColor: "#FAFAFA",
            borderRadius: 14,
            paddingVertical: isTablet ? 40 : 30,
            paddingHorizontal: isTablet ? 30 : 20,
            rowGap: 14
        },
        InsuranceTypesListTitle: {
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 24 : 18,
            lineHeight: (isTablet ? 24 : 18) * 1.2,
            color: "#111"
        },
        InsuranceTypesListList: {
            rowGap: 10
        },
        InsuranceTypesListItem: {
            paddingLeft: isTablet ? 20 : 15,
            position: "relative"
        },
        InsuranceTypesListItemText: {
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 18 : 14,
            lineHeight: (isTablet ? 18 : 14) * 1.4,
            color: "#111"
        },
        InsuranceTypesListItemMarker: {
            width: isTablet ? 6 : 3,
            height: isTablet ? 6 : 3,
            backgroundColor: "#111",
            borderRadius: 100,
            position: "absolute",
            top: isTablet ? 9 : 8,
            left: 5
        }
    })
}