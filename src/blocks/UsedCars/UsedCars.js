import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions, FlatList,
} from "react-native";

import FunnelIcon from "../../../assets/uiIcons/funnel.svg"
import SortIcon from "../../../assets/uiIcons/sortIcon.svg"

import {debounce} from "../../hooks/debounce";
import {usedCarsSavedState} from "../../store/actions/usedCarsSavedState/usedCarsSavedState";

import SidebarModal from "../../components/SidebarModal/SidebarModal";
import TextInputStylish from "../../ui/TextInput/TextInputStylish";

import bootstrapStyles from "../../ui/bootstrapStyles";
import Button from "../../ui/Button/Button";
import Loader from "../../ui/Loader/Loader";
import SliderStylish from "../../ui/SliderStylish/SliderStylish";
import CheckBoxGroup from "../../ui/CheckBoxGroup/CheckBoxGroup";
import RadioButtonGroup from "../../ui/RadioButtonGroup/RadioButtonGroup";
import BottomModal from "../../components/BottomModal/BottomModal";
import Car from "./Car/Car";
import SelectInputStylish from "../../ui/SelectInput/SelectInputStylish";

export default function UsedCars() {
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

    const dispatch = useDispatch();
    const savedFilters = useSelector(store => store.usedCarsSavedState)

    const [isLoading, setIsLoading] = useState(true);

    const [filterList, setFilterList] = useState(null);

    const [priceRangeValue, setPriceRangeValue] = useState(savedFilters?.filters?.priceRangeValue ?? null);
    const [minPriceFieldValue, setMinPriceFieldValue] = useState(savedFilters?.filters?.priceRangeValue?.[0] ?? null);
    const [maxPriceFieldValue, setMaxPriceFieldValue] = useState(savedFilters?.filters?.priceRangeValue?.[1] ?? null);

    const [mileageRangeValue, setMileageRangeValue] = useState(savedFilters?.filters?.mileageRangeValue ?? null);
    const [minMileageFieldValue, setMinMileageFieldValue] = useState(savedFilters?.filters?.mileageRangeValue?.[0] ?? null);
    const [maxMileageFieldValue, setMaxMileageFieldValue] = useState(savedFilters?.filters?.mileageRangeValue?.[1] ?? null);

    const [years, setYears] = useState([]);
    const [yearsFrom, setYearsFrom] = useState(savedFilters?.filters?.selectedYears?.[0] ?? null);
    const [yearsTo, setYearsTo] = useState(savedFilters?.filters?.selectedYears?.[1] ?? null);

    const [brands, setBrands] = useState([]);
    const [currBrands, setCurrBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState(savedFilters?.filters?.selectedBrands ?? null);
    const [isBrandsCollapsed, setIsBrandsCollapsed] = useState(true);

    const [carBodies, setCarBodies] = useState([]);
    const [selectedCarBodies, setSelectedCarBodies] = useState(savedFilters?.filters?.selectedCarBodies ?? null);

    const [owners, setOwners] = useState([]);
    const [currentOwners, setCurrentOwners] = useState(savedFilters?.filters?.currentOwners ?? null);

    const [driveTypes, setDriveTypes] = useState([]);
    const [selectedDriveTypes, setSelectedDriveTypes] = useState(savedFilters?.filters?.selectedDriveTypes ?? null);

    const [gearboxes, setGearboxes] = useState([]);
    const [selectedGearboxes, setSelectedGearboxes] = useState(savedFilters?.filters?.selectedGearboxes ?? null);

    const [carsList, setCarsList] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const getCarsDebounceRef = useRef();
    const topOfComponent = useRef();

    function getFilters() {
        fetch(`${domain}/api/cars/used/filters`)
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
            let filtersToSave = {};

            if (selectedBrands) {
                filters.append('brands', JSON.stringify(selectedBrands.map(item => item.id)));
                filtersToSave.selectedBrands = selectedBrands ? [...selectedBrands] : null;
            }
            if (selectedCarBodies?.length) {
                filters.append('carBody', JSON.stringify(selectedCarBodies.map(item => item.id)));
                filtersToSave.selectedCarBodies = selectedCarBodies ? [...selectedCarBodies] : null;
            }
            if (selectedDriveTypes) {
                filters.append('driveType', JSON.stringify(selectedDriveTypes.map(item => item.id)));
                filtersToSave.selectedDriveTypes = selectedDriveTypes ? [...selectedDriveTypes] : null;
            }
            if (selectedGearboxes) {
                filters.append('kpp', JSON.stringify(selectedGearboxes.map(item => item.id)));
                filtersToSave.selectedGearboxes = selectedGearboxes ? [...selectedGearboxes] : null;
            }
            if (mileageRangeValue) {
                if ((!(mileageRangeValue[0] < 0) && (mileageRangeValue[0] !== filterList?.mileage?.min)) || (!(mileageRangeValue[1] < 0) && (mileageRangeValue[1] !== filterList?.mileage?.max))) {
                    filters.append('mileage', JSON.stringify([...mileageRangeValue]));
                    filtersToSave.mileageRangeValue = [...mileageRangeValue];
                }
            }
            if (currentOwners) {
                filters.append('owners', currentOwners.id);
                filtersToSave.currentOwners = Object.assign({}, currentOwners);
            }
            if (priceRangeValue) {
                if ((!(priceRangeValue[0] < 0) && (priceRangeValue[0] !== filterList?.price?.min)) || (!(priceRangeValue[1] < 0) && (priceRangeValue[1] !== filterList?.price?.max))) {
                    filters.append('price', JSON.stringify([...priceRangeValue]));
                    filtersToSave.priceRangeValue = [...priceRangeValue];
                }
            }
            if (yearsFrom || yearsTo) {
                filters.append('year', JSON.stringify([yearsFrom?.value, yearsTo?.value]));
                filtersToSave.selectedYears = [yearsFrom, yearsTo];
            }

            dispatch(usedCarsSavedState({filters: filtersToSave, page: pagination}))
        } else {
            dispatch(usedCarsSavedState({filters: {}, page: pagination}))
        }

        if (currSort?.sortBy && currSort?.order) {
            filters.append("sortBy", currSort.sortBy)
            filters.append("order", currSort.order)
        }

        fetch(`${domain}/api/cars/used/show${pagination && pagination !== 1 ? `?page=${pagination}` : ''}`, {
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

    function getCarsWrapperToDebounce() {
        getCars(true, false, false)
    }

    useEffect(() => {
        if (filterList) {
            setYears(filterList.year);

            setBrands(filterList.brands);
            setCurrBrands(filterList.brands.slice(0, 6));

            setCarBodies(filterList.carBody);

            setOwners(filterList.owners);

            setDriveTypes(filterList.driveType);

            setGearboxes(filterList.kpp);

            getCars(true, savedFilters?.page ?? 1);
        }
    }, [filterList]);

    useEffect(() => {
        getFilters();
    }, []);

    useEffect(() => {
        if (isBrandsCollapsed) {
            setCurrBrands(brands.slice(0, 6));
        } else {
            setCurrBrands(brands);
        }
    }, [isBrandsCollapsed])

    useEffect(() => {
        debounce(getCarsWrapperToDebounce, 1000, getCarsDebounceRef);
    }, [priceRangeValue, mileageRangeValue, yearsFrom, yearsTo, selectedBrands, selectedCarBodies, currentOwners, selectedDriveTypes, selectedGearboxes, currSort])

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

    function loadMore(){
        if (!isLoading) {
            if (carsList.meta?.current_page < carsList.meta?.last_page) {
                getCars(true, carsList.meta.current_page + 1);
            }
        }
    }

    function renderItem({item, index}){
        return(<Car item={item} index={index}/>)
    }

    return (
        <>
            <SidebarModal isOpen={isOpen}
                          close={() => {
                              setIsOpen(false)
                          }}
                          title={"Фильтры"}
                          submitButtonText={"Применить"}
                          submitButtonOnPress={() => {
                              setIsOpen(false)
                          }}>
                {
                    filterList &&
                    <View style={styles.filtersWrapper}>
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Цена, руб</Text>
                            <SliderStylish
                                min={filterList.price.min}
                                max={filterList.price.max}
                                value={priceRangeValue ?? [filterList.price.min, filterList.price.max]}
                                enabled={!isLoading}
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
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Пробег, км</Text>
                            <SliderStylish min={filterList.mileage.min}
                                           max={filterList.mileage.max}
                                           value={mileageRangeValue ?? [filterList.mileage.min, filterList.mileage.max]}
                                           enabled={!isLoading}
                                           onChange={(value) => {
                                               setMileageRangeValue(value);
                                               setMinMileageFieldValue(value[0]);
                                               setMaxMileageFieldValue(value[1])
                                           }}/>
                            <View
                                style={[styles.filterSliderInputs, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                                <View style={[styles.filterSliderInput]}>
                                    <TextInputStylish
                                        type="number"
                                        onChange={(text) => {
                                            setMinMileageFieldValue(text)
                                        }}
                                        inputProps={{
                                            value: String(minMileageFieldValue < filterList.mileage.min ? filterList.mileage.min : minMileageFieldValue),
                                            // onChangeText: (text) => {setMinPriceFieldValue(text)},
                                            placeholder: "от",
                                            placeholderTextColor: "#6b6b6b",
                                            inputMode: "numeric",
                                            editable: !isLoading,
                                            min: filterList.mileage.min,
                                            max: filterList.mileage.max,
                                            onBlur: () => changeTextFieldValue(minMileageFieldValue, maxMileageFieldValue, setMinMileageFieldValue, setMaxMileageFieldValue, filterList.mileage.min, filterList.mileage.max, setMileageRangeValue)
                                        }}/>
                                </View>
                                <View style={[styles.filterSliderInput]}>
                                    <TextInputStylish
                                        type="number"
                                        onChange={(text) => {
                                            setMaxMileageFieldValue(text)
                                        }}
                                        inputProps={{
                                            value: String(maxMileageFieldValue < filterList.mileage.min ? filterList.mileage.max : maxMileageFieldValue),
                                            // onChangeText: (text) => {setMaxPriceFieldValue(text)},
                                            placeholder: "до",
                                            placeholderTextColor: "#6b6b6b",
                                            inputMode: "numeric",
                                            editable: !isLoading,
                                            min: filterList.mileage.min,
                                            max: filterList.mileage.max,
                                            onBlur: () => changeTextFieldValue(minMileageFieldValue, maxMileageFieldValue, setMinMileageFieldValue, setMaxMileageFieldValue, filterList.mileage.min, filterList.mileage.max, setMileageRangeValue)
                                            // onKeyPress: e => e.charCode === 13 && changeTextFieldValue(minPriceFieldValue, maxPriceFieldValue, setMinPriceFieldValue, setMaxPriceFieldValue, filterList.price.min, filterList.price.max, setPriceRangeValue)
                                        }}/>
                                </View>
                            </View>
                            {
                                priceRangeValue?.[0] > filterList.mileage.min || priceRangeValue?.[1] < filterList.mileage.max &&
                                <Pressable onPress={() => {
                                    setMileageRangeValue([filterList.mileage.min, filterList.mileage.max]);
                                    setMinMileageFieldValue(filterList.mileage.min);
                                    setMaxMileageFieldValue(filterList.mileage.max)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Год</Text>
                            <View
                                style={[styles.filterSliderInputs, bootstrapStyles.flexRow, bootstrapStyles.justifyContentBetween]}>
                                <View style={[styles.filterSliderInput]}>
                                    <SelectInputStylish onChange={(value) => {
                                        setYearsFrom(value)
                                    }}
                                                        value={yearsFrom}
                                                        placeholder={"от"}
                                                        items={
                                                            years.filter(item => yearsTo ? (item <= yearsTo?.value) : true).map((item, i) => {
                                                                return {
                                                                    label: String(item),
                                                                    value: item,
                                                                }
                                                            })
                                                        }/>
                                </View>
                                <View style={[styles.filterSliderInput]}>
                                    <SelectInputStylish onChange={(value) => setYearsTo(value)}
                                                        value={yearsTo}
                                                        placeholder={"до"}
                                                        items={
                                                            years.filter(item => yearsFrom ? (item >= yearsFrom?.value) : true).map((item, i) => {
                                                                return {
                                                                    label: String(item),
                                                                    value: item
                                                                }
                                                            })
                                                        }/>
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
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Марка</Text>
                            <CheckBoxGroup items={currBrands}
                                           value={selectedBrands}
                                           getItemLabel={(item) => item.name}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedBrands}/>
                            {
                                (brands?.length > 6) &&
                                    <Pressable onPress={() => setIsBrandsCollapsed(!isBrandsCollapsed)}>
                                        <Text style={styles.filterShowAll}>{isBrandsCollapsed ? "Показать все" : "Скрыть"}</Text>
                                    </Pressable>
                            }
                            {
                                selectedBrands &&
                                <Pressable onPress={() => {
                                    setSelectedBrands(null)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Кузов</Text>
                            <CheckBoxGroup items={carBodies}
                                           value={selectedCarBodies}
                                           getItemLabel={(item) => item.name}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedCarBodies}/>
                            {
                                selectedCarBodies &&
                                <Pressable onPress={() => {
                                    setSelectedCarBodies(null)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Количество владельцев</Text>
                            <RadioButtonGroup items={owners}
                                              value={currentOwners}
                                              getItemLabel={(item) => item.name}
                                              getItemDisabled={item => item.disabled}
                                              onChange={setCurrentOwners}/>
                            {
                                currentOwners &&
                                <Pressable onPress={() => {
                                    setCurrentOwners(null)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Привод</Text>
                            <CheckBoxGroup items={driveTypes}
                                           value={selectedDriveTypes}
                                           getItemLabel={(item) => item.name}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedDriveTypes}/>
                            {
                                selectedDriveTypes &&
                                <Pressable onPress={() => {
                                    setSelectedDriveTypes(null)
                                }}>
                                    <Text style={styles.filterReset}>Сбросить все</Text>
                                </Pressable>
                            }
                        </View>
                        <View style={styles.filter}>
                            <Text style={styles.filterLabel}>Коробка</Text>
                            <CheckBoxGroup items={gearboxes}
                                           value={selectedGearboxes}
                                           getItemLabel={(item) => item.name}
                                           getItemDisabled={item => item.disabled}
                                           onChange={setSelectedGearboxes}/>
                            {
                                selectedGearboxes &&
                                <Pressable onPress={() => {
                                    setSelectedGearboxes(null)
                                }}>
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

            <View ref={topOfComponent}>
                <View style={bootstrapStyles.container}>
                    <View style={styles.usedCars}>
                        {
                            (isLoading && !(carsList?.data?.length))
                                ? <View style={[bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}><Loader/></View>
                                : <>
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
                                        carsList?.data?.length
                                            ? <>
                                                <FlatList data={carsList.data}
                                                          horizontal={false}
                                                          numColumns={isTablet ? 2 : 1}
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
                                                          key={isTablet}
                                                          style={styles.carsList}/>
                                            </>
                                            : <View><Text>Ничего не найдено</Text></View>
                                    }
                                </>
                        }
                    </View>
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
            carsList:{
                rowGap: isTablet ? 10 : 16,
                columnGap: 20,
                width: "100%",
                paddingVertical: 20
            }
        }
    )
}