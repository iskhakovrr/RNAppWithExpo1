import {StyleSheet, Text, TextInput, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import MaskInput from "react-native-mask-input/src/MaskInput";
import {IMaskTextInput} from "react-native-imask";

import bootstrapStyles from "../bootstrapStyles";

export default function TextInputStylish({inputProps, alertProps, mask, label, type, onChange, onBlur}){
    const isTablet = useSelector(store => store.isTablet)

    const [isFocus, setIsFocus] = useState(null);

    const styles = useMemo(() => styling(alertProps, isTablet, isFocus, inputProps), [alertProps, isTablet, isFocus, inputProps])

    if(type === "number"){
        return (
            <View style={[styles.fieldWrapper]}>
                <View style={styles.fieldContent}>
                    { label && <Text style={styles.label}>{label}</Text> }
                    <IMaskTextInput
                        mask={Number}
                        scale={0}
                        thousandsSeparator=' '
                        unmask={true}
                        style={styles.field}
                        onAccept={(value, mask) => onChange(value)}
                        {...inputProps}
                    />
                </View>
                {
                    alertProps && <Text style={styles.fieldAlertMessage}>{alertProps.text}</Text>
                }
            </View>
        )
    }else{
        if(mask){
            return(
                <View style={[styles.fieldWrapper]}>
                    <View style={styles.fieldContent}>
                        { label && <Text style={styles.label}>{label}</Text> }
                        <MaskInput mask={mask} style={styles.field} {...inputProps} onBlur={ () => setIsFocus(false) } onFocus={ () => setIsFocus(true) }/>
                    </View>
                    {
                        alertProps && <Text style={styles.fieldAlertMessage}>{alertProps.text}</Text>
                    }
                </View>
            )
        }else{
            return(
                <View style={[styles.fieldWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                    <View style={styles.fieldContent}>
                        { label && <Text style={styles.label}>{label}</Text> }
                        <TextInput style={styles.field} {...inputProps} onBlur={ () => setIsFocus(false) } onFocus={ () => setIsFocus(true) }/>
                    </View>
                    {
                        alertProps && <Text style={styles.fieldAlertMessage}>{alertProps.text}</Text>
                    }
                </View>
            )
        }
    }
}

const styling = (alertProps, isTablet, isFocus, inputProps) => {

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
                color: "#111",
            },
            field: {
                borderRadius: 4,
                borderWidth: 1,
                borderColor: currentColor() ?? (isFocus ? "#2F3140" : "#b6b6b6"),
                paddingVertical: isTablet ? 13 : 7.5,
                paddingHorizontal: isTablet ? 16 : 10,
                color: inputProps.editable || (inputProps.editable === undefined) ? "#111" : "#b6b6b6",
                fontFamily: "Onest-Regular",
                fontSize: isTablet ? 18 : 14,
                lineHeight: (isTablet ? 18 : 14) * 1.2
            },
            fieldWrapper: {
                rowGap: 8
            },
            fieldContent: {
                rowGap: isTablet ? 8 : 4
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