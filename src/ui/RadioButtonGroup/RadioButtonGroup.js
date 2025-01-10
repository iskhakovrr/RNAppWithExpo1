import {useSelector} from "react-redux";
import {useMemo} from "react";
import {Pressable, StyleSheet, View, Text} from "react-native";
import bootstrapStyles from "../bootstrapStyles";

export default function RadioButtonGroup({items, value, onChange, getItemLabel}){
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => stylish(isTablet), [isTablet])

    return(
        <View style={styles.wrapper}>
            {
                items.map( (item, index) => {
                    if(getItemLabel ? getItemLabel(item) : item){
                        return(
                            <Pressable style={[styles.checkBoxWrapper, index === 0 && styles.checkBoxWrapperFirst, index === (items.length-1) && styles.checkBoxWrapperLast, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentStart]} onPress={() => onChange(item)} key={index}>
                                <View style={[styles.checkBoxCircle, (value?.id  === item?.id) && styles.checkBoxCircleActive, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}>
                                    {(value?.id  === item?.id) && <View style={styles.checkBoxCircleCheck}/>}
                                </View>
                                <Text>{getItemLabel ? getItemLabel(item) : item}</Text>
                            </Pressable>
                        )
                    }else{
                        return null;
                    }
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
    checkBoxCircle:{
        width: isTablet ? 16 : 14,
        height: isTablet ? 16 : 14,
        borderRadius: isTablet ? 16 : 14,
        borderWidth: 1,
        borderColor: "#B6B6B6",
        backgroundColor: "#fff"
    },
    checkBoxCircleActive:{
        borderColor: "#2F3140",
    },
    checkBoxCircleCheck:{
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: "#2F3140"
    }
})