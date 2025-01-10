import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {View, Text, Pressable, StyleSheet, FlatList} from "react-native";

import FunnelIcon from "../../../assets/uiIcons/funnel.svg"
import SortIcon from "../../../assets/uiIcons/sortIcon.svg"

import {debounce} from "../../hooks/debounce";
import {usedCarsSavedState} from "../../store/actions/usedCarsSavedState/usedCarsSavedState";

import SidebarModal from "../../components/SidebarModal/SidebarModal";
import TextInputStylish from "../../ui/TextInput/TextInputStylish";

import bootstrapStyles from "../../ui/bootstrapStyles";
import Button from "../../ui/Button/Button";
import SliderStylish from "../../ui/SliderStylish/SliderStylish";
import CheckBoxGroup from "../../ui/CheckBoxGroup/CheckBoxGroup";
import RadioButtonGroup from "../../ui/RadioButtonGroup/RadioButtonGroup";
import BottomModal from "../../components/BottomModal/BottomModal";
import Car from "./Car/Car";
import SelectInputStylish from "../../ui/SelectInput/SelectInputStylish";
import ModalFields from "../../components/ModalFields/ModalFields";
import successModal from "../../store/actions/successModal/successModal";

export default function RentCatalog({carsList}) {
    const dispatch = useDispatch();

    const [carsListToRender, setCarsListToRender] = useState(carsList);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currCarToModal, setCurrCarToModal] = useState(null);
    const [fieldsApplication, setFieldsApplication] = useState([
        {
            type: "text",
            name: "name",
            placeholder: "Имя"
        },
        {
            type: "phone",
            name: "phone",
            placeholder: "Телефон",
            required: 1
        }
    ]);

    const isTablet = useSelector(store => store.isTablet)
    const styles = useMemo(() => styling(isTablet), [isTablet])
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

    const [currSort, setCurrSort] = useState(sortTypes[0]);

    const [isOpen, setIsOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const [priceMinMax, setPriceMinMax] = useState(null);
    const [priceRangeValue, setPriceRangeValue] = useState(null);
    const [minPriceFieldValue, setMinPriceFieldValue] = useState(null);
    const [maxPriceFieldValue, setMaxPriceFieldValue] = useState(null);

    const [years, setYears] = useState([]);
    const [yearsFrom, setYearsFrom] = useState(null);
    const [yearsTo, setYearsTo] = useState(null);

    const [brands, setBrands] = useState([]);
    const [currBrands, setCurrBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState( null);
    const [isBrandsCollapsed, setIsBrandsCollapsed] = useState(true);

    const [gearboxes, setGearboxes] = useState([]);
    const [selectedGearboxes, setSelectedGearboxes] = useState(null);

    const [gas, setGas] = useState([]);
    const [selectedGas, setSelectedGas] = useState(null);

    function renderItem({item, index}){
        return(<Car item={item} index={index} onPress={() => {setCurrCarToModal(item); setIsOpenModal(true);}}/>)
    }

    function checkPriceFilter(){
        let prices = carsList.map((car) => car?.price).filter(Boolean);
        let min = Math.min(...prices);
        let max = Math.max(...prices)

        if((min && max) && (min !== max)){
            setPriceMinMax({min, max});
        }
    }

    function checkYearFilter(){
        let years = new Set(carsList.map((car) => car?.year).filter(Boolean));
        if(years.size > 0){
            let toFinal = [...years].map((item, i) => {return {value: item, label: String(item)}})
            setYears(toFinal);
        }
    }

    function checkBrandFilter(){
        let brands = new Set(carsList.map((car) => car?.brand).filter(Boolean));
        if(brands.size > 0){
            let toFinal = [...brands].map((item, i) => {return{id: i, label: item}})
            setBrands(toFinal);
            setCurrBrands(toFinal.slice(0, 6));
        }
    }

    function checkGearboxFilter(){
        let gearboxes = new Set(carsList.map((car) => car?.gearbox).filter(Boolean));
        if(gearboxes.size > 0){
            let toFinal = [...gearboxes].map((item, i) => {return{id: i, label: item}})
            setGearboxes(toFinal);
        }
    }

    function checkGasFilter(){
        let gas = new Set(carsList.map((car) => car?.gas).filter(Boolean));
        if(gas.size > 0){
            let toFinal = [...gas].map((item, i) => {return{id: i, label: item}})
            setGas(toFinal);
        }
    }

    function changeTextFieldValue(left, right, setLeft, setRight, min, max, setSliderValue) {
        if (left >= right) {
            if (left > max) {
                setSliderValue([Number(max), Number(max)])
                setLeft(max);
                setRight(max);
            } else {
                setSliderValue([Number(left), Number(left)])
                setLeft(left);
                setRight(left);
            }
        } else if (left < min) {
            setSliderValue([Number(min), Number(right)])
            setLeft(min);
            setRight(right);
        } else if (right > max) {
            setSliderValue([Number(left), Number(max)])
            setLeft(left);
            setRight(max);
        } else {
            setSliderValue([Number(left), Number(right)])
            setLeft(left);
            setRight(right);
        }
    }

    useEffect(() => {
        checkPriceFilter();
        checkYearFilter();
        checkBrandFilter();
        checkGearboxFilter();
        checkGasFilter();
    }, [])

    useEffect(() => {
        let cars = [...carsList];
        let selectedBrandsNames = selectedBrands?.length ? selectedBrands.map(item => item.label) : [];
        let selectedGearboxesNames = selectedGearboxes?.length ? selectedGearboxes.map(item => item.label) : [];
        let selectedGasNames = selectedGas?.length ? selectedGas.map(item => item.label) : [];

        if(priceRangeValue?.length > 0){
            cars = cars.filter(item => {
                if(item?.price){
                    return item?.price < priceRangeValue[1] && item?.price > priceRangeValue[0];
                }else{
                    return true;
                }
            })
        }

        if(yearsFrom?.value){
            cars = cars.filter(item => {
                if(item?.year){
                    return item.year >= yearsFrom?.value;
                }else{
                    return true;
                }
            })
        }

        if(yearsTo?.value){
            cars = cars.filter(item => {
                if(item?.year){
                    return  item.year <= yearsTo?.value;
                }else{
                    return true;
                }
            })
        }

        if(selectedBrandsNames?.length > 0){
            cars = cars.filter(item => {
                if(item?.brand){
                    return selectedBrandsNames.includes(item.brand);
                }else{
                    return true;
                }
            })
        }

        if(selectedGearboxesNames?.length > 0){
            cars = cars.filter(item => {
                if(item?.gearbox){
                    return selectedGearboxesNames.includes(item.gearbox);
                }else{
                    return true;
                }
            })
        }

        if(selectedGasNames?.length > 0){
            cars = cars.filter(item => {
                if(item?.gas){
                    return selectedGasNames.includes(item.gas);
                }else{
                    return true;
                }
            })
        }

        if(currSort?.sortBy && currSort?.order){
            if(currSort?.order === "asc"){
                cars.sort((a, b) => {
                    if(a?.price && b?.price){
                        return a.price - b.price;
                    }else{
                        return 0;
                    }
                })
            }else if(currSort?.order === "desc"){
                cars.sort((a, b) => {
                    if(a?.price && b?.price){
                        return b.price - a.price;
                    }else{
                        return 0;
                    }
                })
            }
        }

        setCarsListToRender(cars);
    }, [priceRangeValue, yearsFrom, yearsTo, selectedBrands, selectedGearboxes, selectedGas, currSort]);

    return (
        <>
            <SidebarModal isOpen={isOpen}
                          close={() => {setIsOpen(false)}}
                          title={"Фильтры"}
                          submitButtonText={"Применить"}
                          submitButtonOnPress={() => {setIsOpen(false)}}>
                <View style={styles.filtersWrapper}>
                    {
                        priceMinMax &&
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Цена в сутки, руб</Text>
                            <SliderStylish
                                min={priceMinMax.min}
                                max={priceMinMax.max}
                                value={priceRangeValue ?? [priceMinMax.min, priceMinMax.max]}
                                enabled={true}
                                onChange={(value) => {
                                    setPriceRangeValue(value);
                                    setMinPriceFieldValue(value[0]);
                                    setMaxPriceFieldValue(value[1])
                                }}/>
                            <View style={[styles.filterSliderInputs, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                                <View style={[styles.filterSliderInput]}>
                                    <TextInputStylish
                                        type="number"
                                        onChange={(text) => {
                                            setMinPriceFieldValue(text)
                                        }}
                                        inputProps={{
                                            value: String(minPriceFieldValue < priceMinMax.min ? priceMinMax.min : minPriceFieldValue),
                                            // onChangeText: (text) => {setMinPriceFieldValue(text)},
                                            placeholder: "от",
                                            placeholderTextColor: "#6b6b6b",
                                            inputMode: "numeric",
                                            editable: true,
                                            min: priceMinMax.min,
                                            max: priceMinMax.max,
                                            onBlur: () => changeTextFieldValue(minPriceFieldValue, maxPriceFieldValue, setMinPriceFieldValue, setMaxPriceFieldValue, priceMinMax.min, priceMinMax.max, setPriceRangeValue)
                                        }}/>
                                </View>
                                <View style={[styles.filterSliderInput]}>
                                    <TextInputStylish
                                        type="number"
                                        onChange={(text) => {
                                            setMaxPriceFieldValue(text)
                                        }}
                                        inputProps={{
                                            value: String(maxPriceFieldValue < priceMinMax.min ? priceMinMax.max : maxPriceFieldValue),
                                            // onChangeText: (text) => {setMaxPriceFieldValue(text)},
                                            placeholder: "до",
                                            placeholderTextColor: "#6b6b6b",
                                            inputMode: "numeric",
                                            editable: true,
                                            min: priceMinMax.min,
                                            max: priceMinMax.max,
                                            onBlur: () => changeTextFieldValue(minPriceFieldValue, maxPriceFieldValue, setMinPriceFieldValue, setMaxPriceFieldValue, priceMinMax.min, priceMinMax.max, setPriceRangeValue)
                                            // onKeyPress: e => e.charCode === 13 && changeTextFieldValue(minPriceFieldValue, maxPriceFieldValue, setMinPriceFieldValue, setMaxPriceFieldValue, filterList.price.min, filterList.price.max, setPriceRangeValue)
                                        }}/>
                                </View>
                            </View>
                            {
                                priceRangeValue?.[0] > priceMinMax.min || priceRangeValue?.[1] < priceMinMax.max &&
                                <Pressable onPress={() => {
                                    setPriceRangeValue([priceMinMax.min, priceMinMax.max]);
                                    setMinPriceFieldValue(priceMinMax.min);
                                    setMaxPriceFieldValue(priceMinMax.max)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                    }
                    {
                        years &&
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Год</Text>
                            <View style={[styles.filterSliderInputs, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                                <View style={[styles.filterSliderInput]}>
                                    <SelectInputStylish onChange={setYearsFrom}
                                                        value={yearsFrom}
                                                        placeholder={"от"}
                                                        items={yearsTo ? years.filter(item => {return item?.value <= yearsTo?.value}) : years}/>
                                </View>
                                <View style={[styles.filterSliderInput]}>
                                    <SelectInputStylish onChange={(value) => setYearsTo(value)}
                                                        value={yearsTo}
                                                        placeholder={"до"}
                                                        items={yearsFrom ? years.filter(item => {return item?.value >= yearsFrom?.value}) : years}/>
                                </View>
                            </View>
                            {
                                yearsFrom || yearsTo
                                    ? <Pressable onPress={() => {
                                        setYearsFrom(null);
                                        setYearsTo(null);
                                    }}>
                                        <Text style={styles.filterReset}>Сбросить все</Text>
                                    </Pressable>
                                    : false
                            }
                        </View>
                    }
                    {
                        currBrands?.length > 0 &&
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Марка</Text>
                            <CheckBoxGroup items={currBrands}
                                           value={selectedBrands}
                                           getItemLabel={(item) => item.label}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedBrands}/>
                            {
                                (brands?.length > 6) &&
                                <Pressable onPress={() => setIsBrandsCollapsed(!isBrandsCollapsed)}>
                                    <Text style={styles.filterShowAll}>{isBrandsCollapsed ? "Показать все" : "Скрыть"}</Text>
                                </Pressable>
                            }
                            {
                                selectedBrands?.length > 0 &&
                                <Pressable onPress={() => {
                                    setSelectedBrands(null)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                    }
                    {
                        gas?.length > 0 &&
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Тип топлива</Text>
                            <CheckBoxGroup items={gas}
                                           value={selectedGas}
                                           getItemLabel={(item) => item.label}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedGas}/>
                            {
                                selectedGas &&
                                <Pressable onPress={() => {setSelectedGas(null)}}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                    }
                    {
                        gearboxes?.length > 0 &&
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Коробка</Text>
                            <CheckBoxGroup items={gearboxes}
                                           value={selectedGearboxes}
                                           getItemLabel={(item) => item.label}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedGearboxes}/>
                            {
                                selectedGearboxes &&
                                <Pressable onPress={() => {setSelectedGearboxes(null)}}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                    }
                </View>
            </SidebarModal>

            <BottomModal isOpen={isSortOpen} close={() => setIsSortOpen(false)} headerText={"Сортировать по"}>
                <RadioButtonGroup items={sortTypes} getItemLabel={item => item.label} value={currSort} onChange={setCurrSort}/>
            </BottomModal>

            <View>
                <View style={bootstrapStyles.container}>
                    <View style={styles.usedCars}>
                        <View style={[bootstrapStyles.flexRow, styles.filtersRowWrapper]}>
                            <Button type={"second"} size={isTablet ? "l" : "s"}
                                    leftIcon={SortIcon} onlyIcon={true}
                                    onPress={() => setIsSortOpen(true)}/>
                            <Button title={"Фильтры"} type={"second"} size={isTablet ? "l" : "s"}
                                    leftIcon={FunnelIcon}
                                    onPress={() => setIsOpen(true)}/>
                        </View>
                        {
                            carsListToRender?.length
                                ? <FlatList data={carsListToRender}
                                            horizontal={false}
                                            numColumns={isTablet ? 2 : 1}
                                            removeClippedSubviews={true}
                                            bounces={false}
                                            viewabilityConfig={{
                                                waitForInteraction: true,
                                                viewAreaCoveragePercentThreshold: 10
                                            }}
                                            renderItem={renderItem}
                                            keyExtractor={(item, i) => i}
                                            windowSize={4}
                                            key={isTablet}
                                            style={styles.carsList}/>
                                : <View><Text>Ничего не найдено</Text></View>
                        }
                    </View>
                </View>
            </View>

            <SidebarModal isOpen={isOpenModal} close={() => {setIsOpenModal(false); setCurrCarToModal(null)}} title={"Заявка на аренду"} withSubmitButton={false}>
                <View style={styles.callbackFormModalContent}>
                    {currCarToModal && <Text style={styles.callbackFormModalDescription}>Оставьте заявку на аренду {`${currCarToModal.name}`}</Text>}
                    <ModalFields endpoint={`${domain}/api/application`} fields={fieldsApplication} buttonText={"Оставить заявку"}
                                 successfully={()=>{
                                     setIsOpen(false);
                                     setTimeout(() => {
                                         dispatch(successModal(true));
                                     }, 1000)
                                 }} target={currCarToModal ? `Оставьте заявку на аренду ${currCarToModal.name}` : "Заявка на аренду"}/>
                </View>
            </SidebarModal>
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
            filter: {
                rowGap: 8
            },
            filterLabel: {
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 24 : 14,
                lineHeight: (isTablet ? 24 : 14) * 1.3,
                color: "#111"
            },
            filterInputs: {
                columnGap: 12
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
            usedCars: {
                rowGap: 17
            },
            callbackFormModalContent: {
                rowGap: 16
            },
            carsList:{
                rowGap: isTablet ? 10 : 16,
                columnGap: 20,
                width: "100%",
                paddingVertical: 20
            }
        }
    )
}