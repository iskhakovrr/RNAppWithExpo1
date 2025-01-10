import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {useMemo, useState} from "react";
import {useSelector} from "react-redux";

import bootstrapStyles from "../bootstrapStyles";

import EyeOpen from "../../../../GedzaMobApp/assets/icons/eye.svg";
import EyeClose from "../../../../GedzaMobApp/assets/icons/eye-off.svg";

export default function PasswordInputStylish({inputProps, alertProps}){
    const isTablet = useSelector(store => store.isTablet);

    const [isFocus, setIsFocus] = useState(null);
    const [isHidden, setIsHidden] = useState(true);

    const styles = useMemo(() => styling(alertProps, isTablet, isFocus), [alertProps, isTablet, isFocus]);

    return(
        <View style={[styles.fieldWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
            <View style={[styles.fieldContent, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                <TextInput style={styles.field} {...inputProps} secureTextEntry={isHidden} onBlur={ () => setIsFocus(false) } onFocus={ () => setIsFocus(true) }/>
                <Pressable style={[styles.toggleIconWrapper, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.justifyContentCenter]} onPress={() => setIsHidden(prevState => !prevState)}>
                    {
                        isHidden
                            ? <EyeOpen style={styles.toggleIcon}/>
                            : <EyeClose style={styles.toggleIcon}/>
                    }
                </Pressable>
            </View>
            {
                alertProps && <Text style={styles.fieldAlertMessage}>{alertProps.text}</Text>
            }
        </View>
    )
}

const styling = (alertProps, isTablet, isFocus) => {
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
            field: {
                borderRadius: 4,
                borderWidth: 1,
                borderColor: currentColor() ?? (isFocus ? "#2F3140" : "#b6b6b6"),
                paddingVertical: isTablet ? 13 : 7.5,
                paddingHorizontal: isTablet ? 16 : 10,
                paddingRight: 35,
                color: "#111",
                fontFamily: "Onest-Regular",
                fontSize: isTablet ? 18 : 14,
                lineHeight: (isTablet ? 18 : 14) * 1.2
            },
            fieldWrapper: {
                rowGap: 8
            },
            fieldContent: {
                position: "relative"
            },
            toggleIconWrapper:{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                paddingRight: 10,
                elevation: 1
            },
            toggleIcon:{
                width: 24,
                height: 24
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