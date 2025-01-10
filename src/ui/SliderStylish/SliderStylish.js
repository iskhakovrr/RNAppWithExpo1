import {StyleSheet, Text, TextInput, View} from "react-native";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import Slider from "./SliderFromLibrary/index";
import Thumb from "./AdditionalItems/Thumb";
import Rail from "./AdditionalItems/Rail";
// import Notch from "./AdditionalItems/Notch";
import RailSelected from "./AdditionalItems/RailSelected";
// import Label from "./AdditionalItems/Label";
// import MultiSlider from "@ptomasroos/react-native-multi-slider";

export default function SliderStylish({min, max, step = 1, alertProps, value, onChange, label, enabled = true}) {
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => styling(isTablet), [isTablet])

    const renderThumb = useCallback(() => <Thumb/>, []);
    const renderRail = useCallback(() => <Rail/>, []);
    const renderRailSelected = useCallback(() => <RailSelected/>, []);
    // const renderLabel = useCallback(value => <Label text={value}/>, []);
    // const renderNotch = useCallback(() => <Notch/>, []);
    const handleValueChange = useCallback((low, high, byUser) => {
        if((value[0] !== low) || (value[1] !== high)) {
            onChange([low, high])
        }
    }, []);

    return (
        <View style={[styles.fieldWrapper]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.fieldContent}>
                <Slider
                    style={styles.slider}
                    min={min}
                    max={max}
                    low={value[0]}
                    high={value[1]}
                    step={step}
                    disabled={!enabled}
                    floatingLabel={true}
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    // renderLabel={renderLabel}
                    // renderNotch={renderNotch}
                    onSliderTouchEnd={handleValueChange}/>
            </View>
            {
                alertProps && <Text style={styles.fieldAlertMessage}>{alertProps.text}</Text>
            }
        </View>
    )
}

const styling = (alertProps, isTablet) => {
    return StyleSheet.create(
        {
            label: {
                fontFamily: "Onest-Regular",
                fontSize: isTablet ? 18 : 14,
                lineHeight: (isTablet ? 18 : 14) * 1.2,
                color: "#111",
            },
            fieldWrapper: {
                rowGap: 8
            },
            fieldContent: {
                rowGap: isTablet ? 8 : 4,
                position: "relative",
                // paddingHorizontal: 8
            },
        }
    )
}