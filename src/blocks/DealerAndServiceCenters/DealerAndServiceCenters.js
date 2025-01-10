import {Dimensions, Pressable, StyleSheet, Text, View} from "react-native";
import {useSelector} from "react-redux";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";
import {SwiperFlatList} from "react-native-swiper-flatlist/index";
import {Image} from "expo-image";

import bootstrapStyles from "../../ui/bootstrapStyles";
import Button from "../../ui/Button/Button";
import Filter from "../../../assets/uiIcons/filter.svg";
import Loader from "../../ui/Loader/Loader";
import SidebarModal from "../../components/SidebarModal/SidebarModal";
import RadioButtonGroup from "../../ui/RadioButtonGroup/RadioButtonGroup";
import TextInputStylish from "../../ui/TextInput/TextInputStylish";
import CheckBoxGroup from "../../ui/CheckBoxGroup/CheckBoxGroup";
import Pagination from "../../ui/Pagination/Pagination";
import {useNavigation} from "@react-navigation/native";
import {domain} from "../../constants/constants";

export default function DealerAndServiceCenters({title}){
    const navigation = useNavigation();

    const width = Dimensions.get('window').width - 20;
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet), [isTablet]);
    const [contacts, setContacts] = useState(null);
    const [currContacts, setCurrContacts] = useState(null);

    const [choiceItems, setChoiceItems] = useState([]);
    const [choiceValue, setChoiceValue] = useState(null);

    const [checkboxGroupItems, setCheckboxGroupItems] = useState([]);
    const [currCheckboxGroupItems, setCurrCheckboxGroupItems] = useState([]);
    const [checkboxGroupValue, setCheckboxGroupValue] = useState(null);

    const [brandSearchValue, setBrandSearchValue] = useState(null);

    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

    function getContacts() {
        let date = new Date();

        fetch(`${domain}/data/contacts.json?v=${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}`)
            .then(response=> response.json())
            .then(result => {setContacts(result); setCurrContacts(result);});
    }

    useEffect(() => {
        getContacts();
    }, [])

    useEffect(() => {
        if(contacts?.length){
            setChoiceItems([{id: 0, name: 'Все'}, ...[...new Set(contacts.map(item => item.city))].map((item, i) => {return {id: i + 1, name: item}})]);

            let checkboxItems = [...new Set(contacts.map(item => item.brand).filter(item=> !!item))].map((item, index) => {return {name: item}});
            setCheckboxGroupItems(checkboxItems);
            setCurrCheckboxGroupItems(checkboxItems);
        }
    }, [contacts])

    useEffect(() => {
        if(choiceItems?.length){
            setChoiceValue(choiceItems[0]);
        }
    }, [choiceItems])

    useEffect(() => {
        if(choiceValue || checkboxGroupValue){
            let newContacts = [...contacts];

            if(choiceValue.name !== 'Все'){
                newContacts = newContacts.filter(item => item.city === choiceValue.name);
            }

            if(checkboxGroupValue?.length){
                let selectedBrands = checkboxGroupValue.map(item => item.label);
                newContacts = newContacts.filter(item => selectedBrands.includes(item.brand));
            }
            setCurrContacts(newContacts);
        }else{
            setCurrContacts(contacts);
        }
    }, [choiceValue, checkboxGroupValue])

    useEffect(() => {
        if(brandSearchValue){
            setCurrCheckboxGroupItems(checkboxGroupItems.filter(item => item.name.toLowerCase().includes(brandSearchValue.toLowerCase())));
        }else{
            setCurrCheckboxGroupItems(checkboxGroupItems);
        }
    }, [brandSearchValue])

    if(currContacts?.length){
        return(
            <>
                <View style={[styles.wrapper]}>
                    <View style={bootstrapStyles.container}>
                        <View style={[styles.centers]}>
                            <View style={[styles.centersTitleWrapper, bootstrapStyles.flexRow, bootstrapStyles.flexWrap, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentBetween]}>
                                <Text style={styles.centersTitle}>{title}</Text>
                                <Button title={"Фильтр"} leftIcon={Filter} type={"second"} onPress={() => {setSidebarIsOpen(true)}}/>
                            </View>
                            <SwiperFlatList showPagination
                                            renderAll={true}
                                            style={styles.centersSwiper}
                                            paginationDefaultColor={"#D4D4D4"}
                                            paginationActiveColor={"#2F3140"}
                                            PaginationComponent={(props) => <Pagination {...props} perViewCount={2}/>}>
                                {
                                    currContacts?.length && currContacts.map(({ id, background, name, description }, index) => (
                                        <Pressable onPress={() => navigation.navigate("Contact", {data: currContacts[index]})} style={[{width: isTablet ? (width/2) : width, paddingRight: 5}, bootstrapStyles.alignItemsStart, bootstrapStyles.justifyContentStart]} key={index}>
                                            <View style={styles.centersCard}>
                                                <Image style={styles.centersCardImg}
                                                       source={`${domain}/${background}`}
                                                       contentFit="cover"
                                                       transition={300}/>
                                                <LinearGradient style={[styles.centersCardTextWrapper]} colors={['#1E203200','#1D1F31ff', '#1D1F31ff']} locations={[0, 0.75, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                                                    <View style={[styles.centersCardText]}>
                                                        <Text style={styles.centersCardTitle}>{name}</Text>
                                                        <Text style={styles.centersCardDescription}>{description}</Text>
                                                    </View>
                                                </LinearGradient>
                                            </View>
                                        </Pressable>
                                    ))
                                }
                            </SwiperFlatList>
                        </View>
                    </View>
                </View>
                <SidebarModal isOpen={sidebarIsOpen} close={() => {setSidebarIsOpen(false)}} title={"Фильтры"} submitButtonText={"Применить"} submitButtonOnPress={() => {setSidebarIsOpen(false)}}>
                    <View style={styles.filtersWrapper}>
                        {
                            choiceItems &&
                            <View style={styles.filterGroup}>
                                <Text style={styles.filterGroupHeader}>Выберите тип услуги</Text>
                                <RadioButtonGroup items={choiceItems}
                                                  getItemLabel={item => item.name}
                                                  value={choiceValue}
                                                  onChange={setChoiceValue}/>
                            </View>
                        }
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterGroupHeader}>Выберите бренд</Text>
                            <TextInputStylish inputProps={{
                                value: brandSearchValue,
                                placeholder: "Поиск по названию",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: (text) => {setBrandSearchValue(text);},
                            }}/>
                            <CheckBoxGroup items={currCheckboxGroupItems} value={checkboxGroupValue} onChange={setCheckboxGroupValue} getItemLabel={(item) => item.name}/>
                            {
                                checkboxGroupValue &&
                                <Pressable onPress={() => {setCheckboxGroupValue(null)}}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                    </View>
                </SidebarModal>
            </>
        )
    }else{
        return <Loader/>
    }
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        filtersWrapper: {
            rowGap: 20,
            position: "relative"
        },
        filterGroup: {
            rowGap: 14
        },
        filterGroupHeader: {
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 24 : 14,
            lineHeight: (isTablet ? 24 : 14) * 1.4,
            color: "#111111"
        },
        filterReset: {
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 16 : 12,
            lineHeight: (isTablet ? 16 : 12) * 1.4,
            color: "#2F3140"
        },
        wrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        centers:{
            rowGap: 16
        },
        centersTitleWrapper:{
            columnGap: 16,
            rowGap: 16
        },
        centersTitle:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.2,
            color: "#111"
        },
        centersSwiper: {
            overflow:"visible",
            height: 290,
            paddingBottom: 10
        },
        centersCard: {
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 20,
            overflow: "hidden"
        },
        centersCardImg: {
            height: "100%",
            width: "100%",
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            top: 0
        },
        centersCardTextWrapper:{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            zIndex: 1,
        },
        centersCardText:{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            rowGap: 2,
            paddingVertical: 24,
            paddingHorizontal: 20,
            zIndex: 2
        },
        centersCardTitle:{
            fontFamily: "Onest-Medium",
            fontSize: 20,
            lineHeight: 20 * 1.2,
            color: "#fff"
        },
        centersCardDescription: {
            fontFamily: "Onest-Regular",
            fontSize: 14,
            lineHeight: 14 * 1.2,
            color: "#fff"
        },
        pagination:{
            display: "flex",
            justifyContent: 'center',
            alignItems: "center",
            position: "absolute",
            bottom: -50,
            rowGap: 10,
        },
    })
}