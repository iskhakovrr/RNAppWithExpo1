import {ScrollView, StyleSheet, Platform, KeyboardAvoidingView, View} from "react-native";
import React, {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";

import {queryPost} from "../../../query/query";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import Button from "../../../ui/Button/Button";
import SelectInputStylish from "../../../ui/SelectInput/SelectInputStylish";
import Loader from "../../../ui/Loader/Loader";
import TextInputStylish from "../../../ui/TextInput/TextInputStylish";

import alertWithoutButtons from "../../../components/AlertWithoutBtns/AlertWithoutBtns";
import PageHeader from "../../../components/PageHeader/PageHeader";

import {domain} from "../../../constants/constants";

export default function LKAddOrEditCar({navigation, route}) {
    const isTablet = useSelector(store => store.isTablet)

    const [isCanSend, setIsCanSend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [brands, setBrands] = useState(null);
    const [brandsIsLoading, setBrandsIsLoading] = useState(true);

    const [brand, setBrand] = useState(null);
    const [brandAlert, setBrandAlert] = useState(null);
    const [model, setModel] = useState(route?.params?.data?.model ?? null);
    const [modelAlert, setModelAlert] = useState(null);
    const [year, setYear] = useState(route?.params?.data?.year ?? null);
    const [yearAlert, setYearAlert] = useState(null);
    const [vin, setVin] = useState(route?.params?.data?.VIN ?? null);
    const [vinAlert, setVinAlert] = useState(null);
    const [gosNumber, setGosNumber] = useState(route?.params?.data?.stateNumber ?? null);
    const [gosNumberAlert, setGosNumberAlert] = useState(null);
    const [color, setColor] = useState(route?.params?.data?.color ?? null);

    const contentStyles = useMemo(() => contentStylish(isTablet), [isTablet])

    function send() {
        if (brand?.value && model?.length > 0 && year?.length > 0 && vin?.length > 0 && gosNumber?.length > 0) {
            setIsLoading(true);

            let data = new FormData();
            data.append("stamp", brand.value);
            data.append("model", model);
            data.append("year", year);
            data.append("vin", vin);
            data.append("stateNumber", gosNumber);
            if (color?.length > 0) {
                data.append("color", color);
            }
            if (route?.params?.data) {
                data.append("auto_id", route?.params?.data?.id);
            }

            queryPost(`${domain}${route?.params?.data ? "/api/profile/auto/update" : "/api/profile/auto/set"}`, data)
                .then(result => {
                    console.log(result)
                    if (result.success) {
                        setIsLoading(false);
                        navigation.reset({index: 1, routes: [{name: 'LKMain'}, {name: 'LKListOfCars'}]});
                    }else{
                        alertWithoutButtons("Произошла ошибка", "Попробуйте позже");
                        setIsLoading(false);
                    }
                }, ()=>{
                    alertWithoutButtons("Произошла ошибка, попробуйте позже");
                    setIsLoading(false);
                })
                .catch(()=>{
                    alertWithoutButtons("Произошла ошибка, попробуйте позже");
                    setIsLoading(false);
                })
        } else {
            if (!(brand?.value)) {
                setBrandAlert({type: "error", text: "Выберите бренд"})
            }
            if (!(model?.length > 0)) {
                setModelAlert({type: "error", text: "Заполните поле"})
            }
            if (!(year?.length > 0)) {
                setYearAlert({type: "error", text: "Заполните поле"})
            }
            if (!(vin?.length > 0)) {
                setVinAlert({type: "error", text: "Заполните поле"})
            }
            if (!(gosNumber?.length > 0)) {
                setGosNumberAlert({type: "error", text: "Заполните поле"})
            }
        }
    }

    function getBrands() {
        setBrandsIsLoading(true);
        fetch(`${domain}/api/brands`)
            .then(resp => {
                return resp.json()
            })
            .then(result => {
                if(route?.params?.data?.stamp){
                    let findBrand = result.find(item => item?.name === route.params.data.stamp)
                    if(findBrand){
                        setBrand({
                            label: findBrand?.name,
                            value: findBrand
                        })
                    }
                }

                setBrands(result);
                setBrandsIsLoading(false);
            })
    }

    useEffect(() => {
        if (brand?.length > 0 && model?.length > 0 && year?.length > 0 && vin?.length > 0 && gosNumber?.length > 0) {
            setIsCanSend(true);
        } else {
            setIsCanSend(false);
        }
    }, [brand, model, year, vin, gosNumber])

    useEffect(() => {
        getBrands();
    }, [])

    useEffect(() => {
        if(route?.params?.data?.stamp){
            if(brands?.length > 0){
                let findBrand = brands.find(item => item.name === route.params.data.stamp);
                if(findBrand){
                    setBrand(
                        {
                            label: findBrand?.name,
                            value: findBrand.name
                        }
                    )
                }
            }
        }
    }, [brands])

    return (
        <>
            <PageHeader canGoBack={false}
                        label={route?.params?.data ? "Редактирование автомобиля" : "Добавление автомобиля"}
                        alignLeft={true}
                        close={() => navigation.reset({index: 1, routes: [{name: 'LKMain'}, {name: 'LKListOfCars'}]})}/>
            {
                brandsIsLoading
                    ? <View
                        style={[contentStyles.content, bootstrapStyles.container, bootstrapStyles.flexGrow1]}><Loader/></View>
                    : <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                                            style={[bootstrapStyles.flexGrow1]}>
                        <ScrollView bounces={false} style={[contentStyles.content]}
                                    contentContainerStyle={[contentStyles.contentWrapper, bootstrapStyles.container, bootstrapStyles.flexGrow1]}>
                            <SelectInputStylish value={brand} onChange={setBrand}
                                                items={
                                                    brands.map((item, i) => {
                                                        return {
                                                            label: item?.name,
                                                            value: item.name
                                                        }
                                                    })
                                                }
                                                alertProps={(brandAlert?.text && brandAlert?.type) ? brandAlert : null}
                                                placeholder={"Марка"}
                                                label={"Марка*"}
                                                disabled={false}/>
                            <TextInputStylish inputProps={{
                                value: model,
                                placeholder: "Модель",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: (text) => {
                                    setModel(text);
                                },
                                editable: !isLoading
                            }} label={"Модель*"} alertProps={modelAlert}/>
                            <TextInputStylish inputProps={{
                                value: year,
                                placeholder: "Год",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: (text) => {
                                    setYear(text);
                                },
                                editable: !isLoading
                            }} mask={[/\d/, /\d/, /\d/, /\d/]} label={"Год*"} alertProps={yearAlert}/>
                            <TextInputStylish inputProps={{
                                value: vin,
                                placeholder: "VIN/Номер шасси",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: (text) => {
                                    setVin(text.toUpperCase());
                                },
                                editable: !isLoading
                            }} label={"VIN/Номер шасси*"} alertProps={vinAlert} mask={Array(17).fill(/[a-zA-Z0-9]/)}/>
                            <TextInputStylish inputProps={{
                                value: gosNumber,
                                placeholder: "Х 000 ХХ 000",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: (text) => {
                                    setGosNumber(text.toUpperCase());
                                },
                                editable: !isLoading
                            }} label={"Гос. номер*"} alertProps={gosNumberAlert}
                                              mask={[/[а-яА-Я]/, ' ', /\d/, /\d/, /\d/, " ", /[а-яА-Я]/, /[а-яА-Я]/, " ", /\d/, /\d/, /\d/]}/>
                            <TextInputStylish inputProps={{
                                value: color,
                                placeholder: "Цвет",
                                placeholderTextColor: "#6b6b6b",
                                onChangeText: (text) => {
                                    setColor(text);
                                },
                                editable: !isLoading
                            }} label={"Цвет"}/>
                            <Button title={"Сохранить"} type={isCanSend ? "main" : "second"} size={"s"}
                                    disabled={isLoading ?? !isCanSend} onPress={send}/>
                        </ScrollView>
                    </KeyboardAvoidingView>
            }
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    content: {
        backgroundColor: "#fff",
        flex: 1,
    },
    contentWrapper: {
        rowGap: 16,
        paddingVertical: 10
    },
});