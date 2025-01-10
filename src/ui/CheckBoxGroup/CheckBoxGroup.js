import {useSelector} from "react-redux";
import {useMemo} from "react";
import {Pressable, StyleSheet, View, Text, TouchableWithoutFeedback} from "react-native";
import bootstrapStyles from "../bootstrapStyles";
import {Touchable} from "react-native-web";

export default function CheckBoxGroup({items, value, onChange, getItemLabel}){
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => stylish(isTablet), [isTablet])

    function onItemPress(item){
        let newValue = value ? [...value] : [];
        let itemIndex = newValue.findIndex((valueItem) => {return valueItem?.id ? valueItem.id === item.id : valueItem === item});

        if(itemIndex !== -1){
            newValue.splice(itemIndex, 1)
        }else{
            newValue.push(item);
        }
        onChange(newValue)
    }

    return(
        <View style={styles.wrapper}>
            {
                items.map( (item, index) => {
                    return(
                        <TouchableWithoutFeedback onPress={() => onItemPress(item)} key={index}>
                            <View style={[styles.checkBoxWrapper, index === 0 && styles.checkBoxWrapperFirst, index === (items.length-1) && styles.checkBoxWrapperLast, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentStart]}>
                                <View style={[styles.checkBoxSquare, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentStart, !!(value?.length && value.find(valItem => valItem?.id ? valItem.id === item.id : valItem === item)) && styles.checkBoxSquareActive]}>
                                    {!!(value?.length && value.find(valItem => valItem?.id ? valItem.id === item.id : valItem === item)) && <View style={styles.checkBoxSquareCheck}/>}
                                </View>
                                <Text>{getItemLabel(item)}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })
            }
        </View>
    )
}

const stylish = (isTablet) => StyleSheet.create({
    wrapper:{
    },
    checkBoxWrapper:{
        columnGap: 8,
        paddingVertical: 7
    },
    checkBoxWrapperFirst:{
        paddingTop: 0
    },
    checkBoxWrapperLast:{
        paddingBottom: 0
    },
    checkBoxSquare:{
        width: isTablet ? 16 : 14,
        height: isTablet ? 16 : 14,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#B6B6B6",
        backgroundColor: "#fff"
    },
    checkBoxSquareActive:{
        backgroundColor: "#2F3140",
        borderColor: "#2F3140",
    },
    checkBoxSquareCheck:{
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: "#fff",
        width: "50%",
        height: "70%",
        transform: [
            {rotate: "40deg"},
        ]
    }
})