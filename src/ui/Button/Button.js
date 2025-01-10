import { Text, StyleSheet, Pressable, View } from 'react-native';
import {useSelector} from "react-redux";
import bootstrapStyles from "../bootstrapStyles";
import {useMemo} from "react";
import OpenURLButton from "../../components/LinkOpener/LinkOpener";

export default function Button({ onPress, title, style = null, type= "main", disabled, leftIcon = false, rightIcon = false, size = "L", url = false, onlyIcon = false}) {
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => styling(isTablet, type, disabled), [isTablet, type, disabled])

    if(url){
        return (
            <OpenURLButton style={[styles.button, styles[`button${size.toUpperCase()}`], bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, style]} url={url}>
                {leftIcon && <GetStyledIcon Icon={leftIcon} isTablet={isTablet}/>}
                { !onlyIcon && <Text style={[styles.text, styles[`text${size.toUpperCase()}`]]}>{title}</Text>}
                {rightIcon && <GetStyledIcon Icon={rightIcon} isTablet={isTablet}/>}
            </OpenURLButton>
        );
    }else{
        if(onPress){
            return (
                <Pressable style={[styles.button, styles[`button${size.toUpperCase()}`], bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, style]} onPress={disabled ? null : onPress}>
                    {leftIcon && <GetStyledIcon Icon={leftIcon} isTablet={isTablet}/>}
                    { !onlyIcon && <Text style={[styles.text, styles[`text${size.toUpperCase()}`]]}>{title}</Text>}
                    {rightIcon && <GetStyledIcon Icon={rightIcon} isTablet={isTablet}/>}
                </Pressable>
            );
        }else{
            return(
                <View style={[styles.button, styles[`button${size.toUpperCase()}`], bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, style]}>
                    {leftIcon && <GetStyledIcon Icon={leftIcon} isTablet={isTablet}/>}
                    { !onlyIcon && <Text style={[styles.text, styles[`text${size.toUpperCase()}`]]}>{title}</Text>}
                    {rightIcon && <GetStyledIcon Icon={rightIcon} isTablet={isTablet}/>}
                </View>
            )
        }
    }
}

function GetStyledIcon({Icon, isTablet}){
    return <View style={[bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
        <Icon width={isTablet ? 24 : 18} height={isTablet ? 24 : 18}/>
    </View>
}

const styling = (isTablet, type, disabled) => {
    const backgroundColor = () =>{
        switch (type){
            case "main":
                return "#2F3140"
            case "second":
                return "#F1F1F1"
            case "red":
                return "#DB524E"
        }
    }

    const color = () =>{
        switch (type){
            case "main":
                return "#fff"
            case "second":
                return disabled ? "#6B6B6B" : "#111"
            case "red":
                return disabled ? "#6B6B6B" : "#fff"
        }
    }

    return StyleSheet.create({
        button: {
            borderRadius: 4,
            backgroundColor: backgroundColor(),
            boxShadow: 'unset',
            columnGap: 6
        },
        buttonL: {
            paddingVertical: isTablet ? 11.5 : 6,
            paddingHorizontal: 12,
        },
        buttonM: {
            paddingVertical: isTablet ? 9 : 6,
            paddingHorizontal: isTablet ? 16 : 12,
        },
        buttonS: {
            paddingVertical: 6,
            paddingHorizontal: 12,
        },
        text: {
            fontFamily: 'Onest-Medium',
            color: color(),
        },
        textL: {
            fontSize: isTablet ? 18 : 14,
            lineHeight: (isTablet ? 18 : 14) * 1.4,
        },
        textS: {
            fontSize: 14,
            lineHeight: 14 * 1.4,
        },
    });
}