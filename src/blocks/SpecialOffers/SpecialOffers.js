import {Dimensions, StyleSheet, Text, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {SwiperFlatList} from "react-native-swiper-flatlist/index";
import {Image} from "expo-image"

import bootstrapStyles from "../../ui/bootstrapStyles";
import Button from "../../ui/Button/Button";
import Filter from "../../../assets/uiIcons/filter.svg"
import ChoiceGroup from "../../ui/ChoiceGroup/ChoiceGroup";
import OpenURLButton from "../../components/LinkOpener/LinkOpener";
import SidebarModal from "../../components/SidebarModal/SidebarModal";
import RadioButtonGroup from "../../ui/RadioButtonGroup/RadioButtonGroup";
import CheckBoxGroup from "../../ui/CheckBoxGroup/CheckBoxGroup";
import TextInputStylish from "../../ui/TextInput/TextInputStylish";
import Pagination from "../../ui/Pagination/Pagination";
import {domain} from "../../constants/constants";

export default function SpecialOffers({ title, titleMobile, offers }){
    const width = Dimensions.get('window').width;

    const isTablet = useSelector(store => store.isTablet);

    const [currOffers, setCurrOffers] = useState(offers);

    const [brand, setBrand] = useState(null);
    const [brandSearchValue, setBrandSearchValue] = useState(null);
    const [brands, setBrands] = useState([]);
    const [currBrands, setCurrBrands] = useState([]);

    const [type, setType] = useState(null);
    const [types, setTypes] = useState([]);

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if(type || brand){
            let newOffers = [...offers];

            if(type !== 'Все'){
                newOffers = newOffers.filter(item => item.type.includes(type));
            }
            if(brand?.length){
                let selectedBrands = brand.map(item => item.name);
                newOffers = newOffers.filter(item => !item?.brand || item.brand.every(onestBrand => selectedBrands.includes(onestBrand)));
            }
            setCurrOffers(newOffers);
        }else{
            setCurrOffers(offers);
        }
    }, [type, brand])

    useEffect(() => {
        if(offers?.length){
            setTypes(['Все', ...new Set(offers.map(item => item.type).flat())]);

            let checkboxItems = [...new Set(offers.map(item => item.brand).flat().filter(item=> !!item))].map((item, index) => {return {name: item}});

            setBrands(checkboxItems);
            setCurrBrands(checkboxItems);
        }
    }, [offers])

    useEffect(() => {
        if(types?.length){
            setType(types[0]);
        }
    }, [types])

    useEffect(() => {
        if(brands?.length){
            if(brandSearchValue){
                setCurrBrands(brands.filter(item => item.name.toLowerCase().includes(brandSearchValue.toLowerCase())));
            }else{
                setCurrBrands(brands);
            }
        }
    }, [brandSearchValue])

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <View style={styles.wrapper}>
                <View style={styles.content}>
                    <View style={bootstrapStyles.container}>
                        <View style={[styles.titleWrapper, !isTablet && bootstrapStyles.flexRow, !isTablet && bootstrapStyles.alignItemsCenter, !isTablet && bootstrapStyles.justifyContentBetween]}>
                            {
                                (title || titleMobile) &&
                                    <Text style={styles.title}>
                                        {
                                            isTablet
                                                ? title ?? titleMobile
                                                : titleMobile ?? title
                                        }
                                    </Text>
                            }
                            <View style={[styles.choiceGroupWrapper, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentBetween]}>
                                {
                                    isTablet
                                        && <ChoiceGroup value={type}
                                                        onChange={setType}
                                                        items={types}
                                                        getItemLabel={(item) => item}
                                                        size="l"/>
                                }
                                <Button title={isTablet ? "Бренд" : "Фильтр"} leftIcon={Filter} type={"second"} onPress={() => {setIsOpen(true)}}/>
                            </View>
                        </View>
                    </View>
                    <View>
                        <SwiperFlatList showPagination
                                        style={{width: width, overflow:"visible", minHeight: (width/2)}}
                                        autoplay={true}
                                        autoplayLoopKeepAnimation={true}
                                        autoplayLoop={true}
                                        paginationDefaultColor={"#D4D4D4"}
                                        paginationActiveColor={"#2F3140"}
                                        PaginationComponent={(props) => <Pagination {...props} perViewCount={2}/>}>
                            {
                                currOffers?.length && currOffers.map(({image, link}, index) => {
                                    return (
                                        <OpenURLButton key={index} url={link} style={[{width: isTablet ? (width/2) : width, paddingHorizontal: 5}, styles.slideWrapper, bootstrapStyles.alignItemsStart, bootstrapStyles.justifyContentStart]}>
                                            <Image style={styles.slideImage}
                                                   source={`${domain}${image}`}
                                                   contentFit="cover"
                                                   transition={300}/>
                                        </OpenURLButton>
                                    )
                                })
                            }
                        </SwiperFlatList>
                    </View>
            </View>
            <SidebarModal isOpen={isOpen} close={() => {setIsOpen(false)}} title={"Фильтры"} submitButtonText={"Применить"} submitButtonOnPress={() => {setIsOpen(false)}}>
                <View style={styles.filtersWrapper}>
                    {
                        (!isTablet) &&
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterGroupHeader}>Выберите тип услуги</Text>
                            <RadioButtonGroup items={types} value={type} onChange={setType}/>
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
                        <CheckBoxGroup items={currBrands} value={brand} onChange={setBrand} getItemLabel={(item) => item.name}/>
                    </View>
                </View>
            </SidebarModal>
        </View>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        wrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        content:{
            rowGap: isTablet ? 20 : 16
        },
        titleWrapper:{
            gap: isTablet ? 30 : 10
        },
        choiceGroupWrapper:{
            columnGap: 10
        },
        title:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.2
        },
        pagination:{
            display: "flex",
            justifyContent: 'center',
            alignItems: "center",
            position: "absolute",
            bottom: -40,
            rowGap: 10,
        },
        slider: {
            height: '100%',
        },
        slideWrapper: {
        },
        slideImage: {
            // flex: 1,
            // width: "100%",
            // resizeMode: 'contain'
            width: '100%',
            height: undefined,
            aspectRatio: 1,
            borderRadius: 20,
            overflow: "hidden"
        },
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
        }
    })
}