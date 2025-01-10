import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {View, Text, StyleSheet, Dimensions, Pressable, FlatList} from "react-native";
import {Image} from "expo-image";

import FunnelIcon from "../../../assets/uiIcons/funnel.svg"
import SortIcon from "../../../assets/uiIcons/sortIcon.svg"
import Done from "../../../assets/uiIcons/done.svg"

import bootstrapStyles from "../../ui/bootstrapStyles";

import Button from "../../ui/Button/Button";
import Loader from "../../ui/Loader/Loader";
import SliderStylish from "../../ui/SliderStylish/SliderStylish";
import CheckBoxGroup from "../../ui/CheckBoxGroup/CheckBoxGroup";
import RadioButtonGroup from "../../ui/RadioButtonGroup/RadioButtonGroup";
import BottomModal from "../../components/BottomModal/BottomModal";
import SidebarModal from "../../components/SidebarModal/SidebarModal";
import TextInputStylish from "../../ui/TextInput/TextInputStylish";

import Car from "./Car/Car";

import {domain} from "../../constants/constants";

export default function NewCars() {
    const isTablet = useSelector(store => store.isTablet)
    const sortTypes = [
        {
            id: 1,
            sortBy: null,
            order: null,
            label: "По умолчанию"
        },
        {
            id: 2,
            sortBy: "price",
            order: "asc",
            label: "Минимальной цене: по возрастанию"
        },
        {
            id: 3,
            sortBy: "price",
            order: "desc",
            label: "Минимальной цене: по убыванию"
        }
    ];

    const styles = useMemo(() => styling(isTablet), [isTablet])

    const [isLoading, setIsLoading] = useState(true);
    const [filterList, setFilterList] = useState(null);

    const [priceRangeValue, setPriceRangeValue] = useState(null);
    const [minPriceFieldValue, setMinPriceFieldValue] = useState(null);
    const [maxPriceFieldValue, setMaxPriceFieldValue] = useState(null);

    const [carsList, setCarsList] = useState(null);

    const [brands, setBrands] = useState([]);
    const [currBrands, setCurrBrands] = useState([]);
    const [searchBrands, setSearchBrands] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState(null);
    const [isBrandsCollapsed, setIsBrandsCollapsed] = useState(true);

    const [bodies, setBodies] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const [currSort, setCurrSort] = useState(sortTypes[0]);

    function getFilters() {
        fetch(`${domain}/api/cars/new/filters`)
            .then((resp) => {
                if (resp.status === 200) {
                    return resp.json()
                }
            })
            .then(result => setFilterList(result))
    }

    function getCars(withFilters = false, pagination = 1, loadMore = true) {
        let filters = new FormData();

        if (withFilters) {
            if (selectedBrands?.length > 0) {
                filters.append('brand', JSON.stringify(selectedBrands.map(item => item.id)));
            }
            if (priceRangeValue) {
                if (priceRangeValue[0] !== filterList?.price?.min || priceRangeValue[1] !== filterList?.price?.max) {
                    filters.append('price', JSON.stringify([...priceRangeValue]));
                }
            }
            if(bodies){
                if (bodies.filter(body => body.active).length) {
                    filters.append('carBody', JSON.stringify(bodies.filter(body => body.active).map(filteredBody => filteredBody.id)));
                }
            }
        }

        if(currSort?.sortBy && currSort?.order){
            filters.append("sortBy", currSort.sortBy)
            filters.append("order", currSort.order)
        }

        fetch(`${domain}/api/cars/new/show${pagination && pagination !== 1 ? `?page=${pagination}` : ''}`, {
            method: 'POST',
            body: filters["_parts"]?.length ? filters : null
        })
            .then((resp) => {
                if (resp.status === 200) {
                    return resp.json()
                }
            })
            .then(result => {
                if (loadMore) {
                    let newResult = Object.assign({}, result);
                    newResult.data = [...(carsList?.data ?? []), ...result.data];
                    setCarsList(newResult);
                } else {
                    setCarsList(Object.assign({}, result));
                }
                setIsLoading(false);
            })
    }

    const toggleActive = (index) => {
        let newBodies = [...bodies];
        newBodies[index]?.active === 1 ? newBodies[index].active = 0 : newBodies[index].active = 1
        setBodies(newBodies);
    }

    const changeTextFieldValue = () => {
        if (minPriceFieldValue >= maxPriceFieldValue) {
            if (minPriceFieldValue > filterList.price.max) {
                setPriceRangeValue([Number(filterList.price.max), Number(filterList.price.max)])
                setMinPriceFieldValue(filterList.price.max);
                setMaxPriceFieldValue(filterList.price.max);
            } else {
                setPriceRangeValue([Number(minPriceFieldValue), Number(minPriceFieldValue)])
                setMinPriceFieldValue(minPriceFieldValue);
                setMaxPriceFieldValue(minPriceFieldValue);
            }
        } else if (minPriceFieldValue < filterList.price.min) {
            setPriceRangeValue([Number(filterList.price.min), Number(maxPriceFieldValue)])
            setMinPriceFieldValue(filterList.price.min);
            setMaxPriceFieldValue(maxPriceFieldValue);
        } else if (maxPriceFieldValue > filterList.price.max) {
            setPriceRangeValue([Number(minPriceFieldValue), Number(filterList.price.max)])
            setMinPriceFieldValue(minPriceFieldValue);
            setMaxPriceFieldValue(filterList.price.max);
        } else {
            setPriceRangeValue([Number(minPriceFieldValue), Number(maxPriceFieldValue)])
            setMinPriceFieldValue(minPriceFieldValue);
            setMaxPriceFieldValue(maxPriceFieldValue);
        }
    }

    function renderItem({item, index}){
        return(<Car item={item} index={index}/>)
    }

    function loadMore(){
        if (!isLoading) {
            if(carsList.meta?.current_page < carsList.meta?.last_page){
                getCars(true, carsList.meta.current_page +1);
            }
        }
    }

    useEffect(() => {
        getFilters();
        getCars(true, false, false);
    }, []);

    useEffect(() => {
        if (filterList) {
            setBodies(filterList.carBody)

            setBrands(filterList.brands);
            setCurrBrands(filterList.brands.slice(0, 6));

            setPriceRangeValue([filterList.price.min, filterList.price.max]);
            setMinPriceFieldValue(filterList.price.min);
            setMaxPriceFieldValue(filterList.price.max);
        }
    }, [filterList]);

    useEffect(() => {
        if (currSort) {
            getCars(true, false, false);
        }
    }, [currSort]);

    useEffect(() => {
        if (searchBrands) {
            setCurrBrands(brands.filter(item => item.name.toLowerCase().includes(searchBrands.toLowerCase())));
        } else {
            setCurrBrands(brands);
        }
    }, [searchBrands])

    useEffect(() => {
        if (isBrandsCollapsed) {
            setCurrBrands(brands.slice(0, 6));
        } else {
            setCurrBrands(brands);
        }
    }, [isBrandsCollapsed])

    return (
        <>
            <SidebarModal isOpen={isOpen}
                          close={() => {setIsOpen(false)}}
                          title={"Фильтры"}
                          submitButtonText={"Применить"}
                          submitButtonOnPress={() => {setIsOpen(false); getCars(true, false, false)}}>
                {
                    filterList &&
                    <View style={styles.filtersWrapper}>
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Минимальная цена, руб</Text>
                            <SliderStylish min={filterList.price.min}
                                           max={filterList.price.max}
                                           value={priceRangeValue ?? [filterList.price.min, filterList.price.max]}
                                           enabled={!isLoading}
                                           onChange={(value) => {
                                               setPriceRangeValue(value);
                                               setMinPriceFieldValue(value[0]);
                                               setMaxPriceFieldValue(value[1]);
                                           }}/>
                            <View style={[styles.filterSliderInputs, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                                <View style={[styles.filterSliderInput]}>
                                    <TextInputStylish
                                        type="number"
                                        onChange={(text) => {
                                            setMinPriceFieldValue(text)
                                        }}
                                        inputProps={{
                                            value: String(minPriceFieldValue < filterList.price.min ? filterList.price.min : minPriceFieldValue),
                                            // onChangeText: (text) => {setMinPriceFieldValue(text)},
                                            placeholder: "от",
                                            placeholderTextColor: "#6b6b6b",
                                            inputMode: "numeric",
                                            editable: !isLoading,
                                            min: filterList.price.min,
                                            max: filterList.price.max,
                                            onBlur: () => changeTextFieldValue(minPriceFieldValue, maxPriceFieldValue, setMinPriceFieldValue, setMaxPriceFieldValue, filterList.price.min, filterList.price.max, setPriceRangeValue)
                                        }}/>
                                </View>
                                <View style={[styles.filterSliderInput]}>
                                    <TextInputStylish
                                        type="number"
                                        onChange={(text) => {
                                            setMaxPriceFieldValue(text)
                                        }}
                                        inputProps={{
                                            value: String(maxPriceFieldValue < filterList.price.min ? filterList.price.max : maxPriceFieldValue),
                                            // onChangeText: (text) => {setMaxPriceFieldValue(text)},
                                            placeholder: "до",
                                            placeholderTextColor: "#6b6b6b",
                                            inputMode: "numeric",
                                            editable: !isLoading,
                                            min: filterList.price.min,
                                            max: filterList.price.max,
                                            onBlur: () => changeTextFieldValue(minPriceFieldValue, maxPriceFieldValue, setMinPriceFieldValue, setMaxPriceFieldValue, filterList.price.min, filterList.price.max, setPriceRangeValue)
                                            // onKeyPress: e => e.charCode === 13 && changeTextFieldValue(minPriceFieldValue, maxPriceFieldValue, setMinPriceFieldValue, setMaxPriceFieldValue, filterList.price.min, filterList.price.max, setPriceRangeValue)
                                        }}/>
                                </View>
                            </View>
                            {
                                priceRangeValue?.[0] > filterList.price.min || priceRangeValue?.[1] < filterList.price.max &&
                                <Pressable onPress={() => {
                                    setPriceRangeValue([filterList.price.min, filterList.price.max]);
                                    setMinPriceFieldValue(filterList.price.min);
                                    setMaxPriceFieldValue(filterList.price.max)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                        {
                            bodies?.length
                            && <View style={styles.filter}>
                                <Text style={styles.filterLabel}>Кузов</Text>
                                <View style={styles.filterCards}>
                                    {
                                        bodies.map(({image, name, active}, index) => (
                                            <Pressable key={index} onPress={() => toggleActive(index)}
                                                       style={[styles.filterCardsCard, active && styles.filterCardsCardActive, bootstrapStyles.alignItemsCenter]}>
                                                <Image source={`${domain}/storage/${image}`}
                                                       style={styles.filterCardsCardImage}
                                                       contentFit="cover"/>
                                                <Text style={styles.filterCardsCardName}>{name}</Text>
                                                <Done width={styles.filterCardsCardDone.width}
                                                      height={styles.filterCardsCardDone.height}
                                                      style={[styles.filterCardsCardDone, active && styles.filterCardsCardDoneActive]}/>
                                            </Pressable>
                                        ))
                                    }
                                </View>
                            </View>
                        }
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Выберите бренд</Text>
                            <CheckBoxGroup items={currBrands}
                                           value={selectedBrands}
                                           getItemLabel={(item) => item.name}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedBrands}/>
                            <Pressable onPress={() => setIsBrandsCollapsed(!isBrandsCollapsed)}>
                                <Text style={styles.filterShowAll}>{isBrandsCollapsed ? "Показать все" : "Скрыть"}</Text>
                            </Pressable>
                            {
                                selectedBrands &&
                                <Pressable onPress={() => {setSelectedBrands(null)}}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                    </View>
                }
            </SidebarModal>

            <BottomModal isOpen={isSortOpen} close={() => setIsSortOpen(false)} headerText={"Сортировать по"}>
                <RadioButtonGroup items={sortTypes} getItemLabel={item => item.label} value={currSort} onChange={setCurrSort}/>
            </BottomModal>

            <View>
                <View style={bootstrapStyles.container}>
                    {
                        (isLoading && !(carsList?.data?.length))
                            ? <View style={[bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}><Loader/></View>
                            : <View style={styles.newCars}>
                                {
                                    filterList &&
                                    <View style={[bootstrapStyles.flexRow, styles.filtersRowWrapper]}>
                                        <Button type={"second"} size={isTablet ? "l" : "s"}
                                                leftIcon={SortIcon} onlyIcon={true}
                                                onPress={() => setIsSortOpen(true)}/>
                                        <Button title={"Фильтры"} type={"second"} size={isTablet ? "l" : "s"}
                                                leftIcon={FunnelIcon}
                                                onPress={() => setIsOpen(true)}/>
                                    </View>
                                }
                                {
                                    carsList?.data?.length > 0
                                        ? <FlatList data={carsList.data}
                                                    horizontal={false}
                                                    numColumns={2}
                                                    removeClippedSubviews={true}
                                                    bounces={false}
                                                    viewabilityConfig={{
                                                        waitForInteraction: true,
                                                        viewAreaCoveragePercentThreshold: 10
                                                    }}
                                                    onEndReachedThreshold={0.7}
                                                    onEndReached={loadMore}
                                                    renderItem={renderItem}
                                                    keyExtractor={(item, i) => i}
                                                    windowSize={4}
                                                    style={styles.newCarsCards}/>
                                        : <View><Text>Ничего не найдено</Text></View>
                                }
                            </View>
                    }
                </View>
            </View>
        </>
    )
}

const styling = (isTablet) => {
    return StyleSheet.create(
        {
            filtersRowWrapper:{
                columnGap: 10
            },
            filtersWrapper:{
                rowGap: isTablet ? 24 : 20
            },
            filterCards:{
                rowGap: isTablet ? 10 : 6,
                columnGap: isTablet ? 10 : 6,
                flexWrap: "wrap",
                flexDirection: "row"
            },
            filterCardsCard:{
                padding: isTablet ? 10 : 8,
                width: isTablet ? "20%" : "30%",
                rowGap: 2,
                borderWidth: 2,
                position: "relative",
                borderColor: "transparent",
                borderRadius: 6,
                borderStyle: "solid"
            },
            filterCardsCardActive:{
                borderColor: "#2F3140",
            },
            filterCardsCardImage:{
                width: isTablet ? 159 : 80,
                height: isTablet ? 71 : 36
            },
            filterCardsCardName:{
                textAlign: "center",
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 14 : 10,
                lineHeight: (isTablet ? 14 : 10) * 1.4,
            },
            filterCardsCardDone: {
                width: 16,
                height: 16,
                position: "absolute",
                top: -8,
                right: -8,
                display: "none"
            },
            filterCardsCardDoneActive: {
                display: "flex"
            },
            filter: {
                rowGap: 8
            },
            filterLabel: {
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 24 : 14,
                lineHeight: (isTablet ? 24 : 14) * 1.3,
                color: "#111"
            },
            filterSliderInputs: {
                columnGap: 12
            },
            filterSliderInput: {
                flexGrow: 1,
                width: "45%"
            },
            filterReset: {
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 16 : 12,
                lineHeight: (isTablet ? 16 : 12) * 1.4,
                color: "#2F3140"
            },
            filterShowAll: {
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 16 : 14,
                lineHeight: (isTablet ? 16 : 14) * 1.4,
                color: "#2F3140"
            },
            newCars:{
                rowGap: 17,
                paddingBottom: 20
            },
            newCarsCards: {
                columnGap: 10,
                rowGap: isTablet ? 10 : 16,
                width: "100%",
                paddingVertical: 20
            }
        }
    )
}