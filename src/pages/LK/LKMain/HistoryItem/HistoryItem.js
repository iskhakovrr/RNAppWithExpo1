import {StyleSheet, Text, View} from "react-native";
import bootstrapStyles from "../../../../ui/bootstrapStyles";
import Collapsible from "../../../../ui/Collapsible/Collapsible";
import React, {memo, useMemo} from "react";
import {useSelector} from "react-redux";

const HistoryItem = memo(function HistoryItem({item}){
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => stylish(isTablet), [isTablet])

    return(
        <View style={styles.item}>
            <View style={styles.itemText}>
                <View style={[styles.itemPriceAndNumber, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                    {
                        item?.Probeg
                            ? <Text style={styles.itemHeader}>Пробег {item.Probeg} км</Text>
                            : <Text style={styles.itemHeader}>Заказ №{item.Numberdoc}</Text>
                    }
                    {item?.Summa && <Text style={styles.itemHeader}>{item.Summa} ₽</Text>}
                </View>
                <View
                    style={[styles.itemCarAndDate, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                    {item.VIN && <Text style={styles.itemDescription}>{item.VIN}</Text>}
                    {item?.Dtdoc && <Text style={styles.itemDescription}>{item.Dtdoc}</Text>}
                </View>
                {
                    item?.Probeg && <View style={[styles.itemCarAndDate, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                        <Text style={styles.itemDescription}>Заказ №{item.Numberdoc}</Text>
                    </View>
                }
            </View>
            {
                item?.Rabota &&
                <Collapsible header={"Состав работ"}
                             withBorderBottom={true}
                             content={[item.Rabota]}/>
            }
            {
                item?.Rekomend &&
                <Collapsible header={"Рекомендации"}
                             withBorderBottom={true}
                             content={[item.Rekomend]}/>
            }
            {
                item?.Tovar &&
                    <Collapsible header={"Товары"}
                                 withBorderBottom={true}
                                 content={[item.Tovar]}/>
            }
        </View>
    )
})

export default HistoryItem;

const stylish = (isTablet) => StyleSheet.create({
    item:{
        rowGap: 10,
        width: "100%",
        padding: 18,
        shadowColor: '#000',
        backgroundColor: "#fff",
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.05,
        shadowRadius: 16,
        borderRadius: 14,
        elevation: 1
    },
    itemText:{
        rowGap: 6,
        paddingBottom: 10,
        borderBottomColor: "#F1F1F1",
        borderBottomWidth: 1,
        borderBottomStyle: "solid"
    },
    itemCarAndDate: {
        columnGap: 8,
    },
    itemPriceAndNumber:{
        columnGap: 10,
    },
    itemHeader:{
        color: "#000",
        fontFamily: "Onest-Medium",
        fontSize: 14,
        lineHeight: 14 * 1.4,
        whiteSpace: "nowrap",
        textAlign: 'start',
    },
    itemDescription:{
        color: "#6B6B6B",
        fontFamily: "Onest-Regular",
        fontSize: 12,
        lineHeight: 12 * 1.3,
        whiteSpace: "nowrap",
        textAlign: 'start'
    },
    itemPrice:{
        textAlign: 'end'
    },
});