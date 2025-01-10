import {Pressable, StyleSheet, Text, View} from "react-native";
import {useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";

import bootstrapStyles from "../../../../ui/bootstrapStyles";

import CarIcon from "../../../../../assets/lk/carSide.svg"

import SubmitModal from "../../../../components/SubmitModal/SubmitModal";
import alertWithoutButtons from "../../../../components/AlertWithoutBtns/AlertWithoutBtns";

import {queryPost} from "../../../../query/query";

import {domain} from "../../../../constants/constants";

export default function Car({car, refreshCarsList}){
    const isTablet = useSelector(store => store.isTablet);
    const navigation = useNavigation();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const styles = useMemo(() => contentStylish(isTablet), [isTablet]);

    function deleteCar() {
        setIsLoading(true);

        let data = new FormData();
        data.append("auto_id",  car.id)

        queryPost(`${domain}/api/profile/auto/remove`, data)
            .then((result) => {
                if(result.success){
                    refreshCarsList()
                }else{
                    alertWithoutButtons("Произошла ошибка", "Попробуйте снова");
                    setIsLoading(false)
                }
            })
    }
    
    return (
        <>
            <View style={styles.carsListItem}>
                <View style={[styles.carsListItemHeader, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween, bootstrapStyles.alignItemsCenter]}>
                    <Text style={styles.carsListItemName}>{car?.stamp} {car?.model}</Text>
                    <CarIcon width={styles.carsListItemIcon.width} height={styles.carsListItemIcon.height}/>
                </View>
                <View style={[styles.carsListItemDescription, bootstrapStyles.flexRow, bootstrapStyles.justifyContentStart, bootstrapStyles.alignItemsCenter, bootstrapStyles.flexWrap]}>
                    <Text style={styles.carsListItemText}>VIN {car?.VIN}</Text>
                    {
                        car?.year &&
                        <>
                            <View style={styles.carsListItemDelimiter}/>
                            <Text style={styles.carsListItemText}>{car.year}</Text>
                        </>
                    }
                    {
                        car?.stateNumber &&
                        <>
                            <View style={styles.carsListItemDelimiter}/>
                            <Text style={styles.carsListItemText}>{car.stateNumber}</Text>
                        </>
                    }
                    {
                        car?.color &&
                        <>
                            <View style={styles.carsListItemDelimiter}/>
                            <Text style={styles.carsListItemText}>{car.color}</Text>
                        </>
                    }
                </View>
                <View
                    style={[styles.carsListItemControls, bootstrapStyles.flexRow, bootstrapStyles.justifyContentStart, bootstrapStyles.alignItemsCenter]}>
                    <Pressable onPress={() => navigation.navigate("LKAddOrEditCar", {data: car})}>
                        <Text style={[styles.carsListItemControlsEl]}>Редактировать</Text>
                    </Pressable>
                    <Pressable onPress={() => setIsDeleteModalOpen(true)}>
                        <Text style={[styles.carsListItemControlsEl, styles.carsListItemControlsElRed]}>Удалить</Text>
                    </Pressable>
                </View>
            </View>
            <SubmitModal isOpen={isDeleteModalOpen}
                         close={() => setIsDeleteModalOpen(false)}
                         declineButtonText={"Нет, оставить"}
                         acceptButtonText={"Да, удалить"}
                         headerText={"Вы действительно хотите удалить автомобиль?"}
                         descriptionText={"Его нельзя будет восстановить"}
                         isLoading={isLoading}
                         accept={deleteCar}/>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    carsListItem:{
        rowGap: 14,
        padding: 18,
        shadowColor: '#000',
        backgroundColor: "#fff",
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.05,
        shadowRadius: 16,
        borderRadius: 14,
        elevation: 1,
    },
    carsListItemHeader:{
        columnGap: 14
    },
    carsListItemDescription:{
        columnGap: 10
    },
    carsListItemDelimiter:{
        width: 4,
        height: 4,
        backgroundColor: "#6b6b6b",
        borderRadius: 4
    },
    carsListItemText:{
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 16 : 12,
        lineHeight: (isTablet ? 16 : 12) * 1.3,
        color: "#6b6b6b"
    },
    carsListItemName:{
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 20 : 16,
        lineHeight: (isTablet ? 20 : 16) * 1.4,
        color: "#000"
    },
    carsListItemIcon:{
        width: 31,
        height: 17
    },
    carsListItemControls:{
        columnGap: 20
    },
    carsListItemControlsEl:{
        fontFamily: "Onest-Medium",
        color: "#2F3140",
        fontSize: isTablet ? 14 : 12,
        lineHeight: (isTablet ? 14 : 12) * 1.4
    },
    carsListItemControlsElRed:{
        color: "#DB524E"
    },
});