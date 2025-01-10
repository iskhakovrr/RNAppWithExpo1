import {StyleSheet, Text, View} from "react-native";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Dropdown} from "react-native-element-dropdown";

export default function SelectInputStylish({value, items, onChange, label, alertProps, placeholder = '', disabled}) {
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => styling(alertProps, isTablet), [isTablet, alertProps]);
    const pickerSelectStylesWrap = useMemo(() => pickerSelectStyles(isTablet, disabled), [isTablet, disabled]);

    return (
        <View style={[styles.fieldWrapper]}>
            <View style={styles.fieldContent}>
                { label && <Text style={styles.label}>{label}</Text> }
                <Dropdown
                        onChange={onChange}
                        data={items}
                        labelField="label"
                        valueField="value"
                        placeholder={placeholder}
                        placeholderStyle={pickerSelectStylesWrap.placeholderStyle}
                        style={pickerSelectStylesWrap.container}
                        selectedTextStyle={pickerSelectStylesWrap.selectedTextStyle}
                        value={value}
                />
            </View>
            {
                alertProps && <Text style={styles.fieldAlertMessage}>{alertProps.text}</Text>
            }
        </View>
    )
}

const styling = (alertProps, isTablet) => {

    let currentColor = () =>{
        switch (alertProps?.type){
            case "error":
                return "#DB524E"
            case "attention":
                return "#E09C00"
            default: return null;
        }
    }

    return StyleSheet.create(
        {
            label: {
                fontFamily: "Onest-Regular",
                fontSize: isTablet ? 18 : 14,
                lineHeight: (isTablet ? 18 : 14) * 1.2,
                color: "#111"
            },
            fieldWrapper: {
                rowGap: 8
            },
            fieldContent: {
                rowGap: 8
            },
            fieldAlertMessage: {
                fontFamily: "Onest-Regular",
                fontSize: isTablet ? 16 : 12,
                lineHeight: (isTablet ? 16 : 12) * 1.3,
                color: currentColor(),
                textAlign: "start"
            },
        }
    )
}

const pickerSelectStyles = (isTablet, disabled) => StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: isTablet ? 13 : 7.5,
        paddingHorizontal: isTablet ? 16 : 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#b6b6b6",
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        color: "#6B6B6B",
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 18 : 14,
        lineHeight: (isTablet ? 18 : 14) * 1.2
    },
    selectedTextStyle: {
        color: "#111",
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 18 : 14,
        lineHeight: (isTablet ? 18 : 14) * 1.2
    },
});