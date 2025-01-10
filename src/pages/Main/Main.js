import React, {useEffect, useState} from "react";
import {FlatList, Text, View} from 'react-native';

import NavBar from "../../components/NavBar/NavBar";
import Header from "../../components/Header/Header";
import PageHeader from "../../components/PageHeader/PageHeader";

import MainServices from "../../blocks/MainServices/MainServices";
import LogoGrid from "../../blocks/LogoGrid/LogoGrid";
import SpecialOffers from "../../blocks/SpecialOffers/SpecialOffers";
import PromoSlider from "../../blocks/PromoSlider/PromoSlider";
import UsedCars from "../../blocks/UsedCars/UsedCars";
import NewCars from "../../blocks/NewCars/NewCars";
import UsedCar from "../../blocks/UsedCar/UsedCar";
import TypesOfJobs from "../../blocks/TypesOfJobs/TypesOfJobs";
import LoyaltyProgram from "../../blocks/LoyaltyProgram/LoyaltyProgram";
import DealerAndServiceCenters from "../../blocks/DealerAndServiceCenters/DealerAndServiceCenters";
import OurWorksBodyRepair from "../../blocks/OurWorksBodyRepair/OurWorksBodyRepair";
import OurWorksDetailing from "../../blocks/OurWorksDetailing/OurWorksDetailing";
import TypesOfInsurance from "../../blocks/TypesOfInsurance/TypesOfInsurance";
import MoreInfo from "../../blocks/MoreInfo/MoreInfo";
import CallbackForm from "../../blocks/CallbackForm/CallbackForm";
import LizingPopularCars from "../../blocks/LizingPopularCars/LizingPopularCars";
import RentCatalog from "../../blocks/RentCatalog/RentCatalog";
import ChargersMap from "../../blocks/ChargersMap/ChargersMap";
import InsuranceTypesList from "../../blocks/InsuranceTypesList/InsuranceTypesList";

import bootstrapStyles from "../../ui/bootstrapStyles";

import Button from "../../ui/Button/Button";
import Loader from "../../ui/Loader/Loader";

import {domain} from "../../constants/constants";

export default function Main({route}) {
    const [header, setHeader] = useState(null);
    const [headerSource, setHeaderSource] = useState(null);
    const [headerLabel, setHeaderLabel] = useState(null);

    const [footer, setFooter] = useState(<NavBar/>);

    const [blocks, setBlocks] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [result, setResult] = useState(false);

    function getBlocks() {
        setBlocks(null);
        setIsLoading(true);
        setIsError(false);
        setResult(false);

        let clearCache = new Date();

        fetch(`${domain}/mobAppData${route?.params?.url}.json?v=${clearCache.getDate()}${clearCache.getMonth()}${clearCache.getFullYear()}${clearCache.getHours()}`)
            .then(response => {
                // setResult(response);
                return response.json()
            }, () => {
                // setResult(response);
                setIsError(true);
            })
            .then(result => {
                if(result?.header){
                    setHeaderSource(result.header);
                }
                setBlocks(result?.blocks ?? result)
                setIsLoading(false);
            }, () => {
                setIsError(true);
            })
    }

    useEffect(() => {
        getBlocks();
    }, [route?.params?.url])

    const renderBlocks = ({item: block}) =>{
        switch (block.alias) {
            case 'InsuranceTypesList':
                return <InsuranceTypesList title={block?.title} value={block?.value}/>
            case 'EnergyStation':
                return <ChargersMap title={block?.title} values={block?.values} centerScreen={block?.centerScreen}/>
            case 'RentCatalog':
                return <RentCatalog carsList={block.value}/>
            case 'UsedCars':
                return <UsedCars setTitle={setHeaderLabel}/>
            case 'UsedCar':
                return <UsedCar setTitle={setHeaderLabel} setFooter={setFooter}/>
            case 'NewCars':
                return <NewCars setTitle={setHeaderLabel}/>
            case 'MainServices':
                return <MainServices mainServicesList={block.value} setTitle={setHeaderLabel}/>
            case 'PromoSlider':
                return <PromoSlider bannerList={block.value} setTitle={setHeaderLabel}/>
            case 'LogoGrid':
                return <LogoGrid title={block?.title}
                                 viewTabs={block?.viewTabs}
                                 logos={block?.value}
                                 modal={block?.modal}
                                 defaultTabLabel={block?.defaultTabLabel}
                                 defaultTabLabelMob={block?.defaultTabLabelMob} setTitle={setHeaderLabel}/>
            case 'SpecialOffers':
                return <SpecialOffers title={block.title}
                                      titleMobile={block.titleMobile}
                                      offers={block.value} setTitle={setHeaderLabel}/>
            case 'TypesOfJobs':
                return <TypesOfJobs title={block?.title}
                                    modal={block?.modal}
                                    typesList={block?.value}/>
            case 'TypesOfInsurance':
                return <TypesOfInsurance title={block.title}
                                         typesList={block.value}/>
            case 'DealerAndServiceCenters':
                return <DealerAndServiceCenters title={block.title}/>
            case 'OurWorksBodyRepair':
                return <OurWorksBodyRepair title={block.title} images={block?.value}/>
            case 'OurWorksDetailing':
                return <OurWorksDetailing title={block.title} images={block?.value}/>
            case 'LizingPopularCars':
                return <LizingPopularCars title={block.title} cars={block?.cars}/>
            case 'MoreInfo':
                return <MoreInfo title={block?.title}
                                 buttonTitle={block?.buttonTitle}
                                 link={block?.link}
                                 toScreen={block?.toScreen}/>
            case 'CallbackForm':
                return <CallbackForm title={block?.title}
                                     description={block?.description}
                                     buttonText={block?.buttonText}
                                     image={block?.image}
                                     endpoint={block?.endpoint}
                                     target={block?.target}
                                     fields={block?.fields}
                                     modalTitle={block?.modalTitle}
                                     imageResizeMode={block?.imageResizeMode}
                                     modalDescription={block?.modalDescription}
                                     background={block?.background}/>
            case 'LoyaltyProgram':
                return <LoyaltyProgram title={block.title}
                                       bonusSystem={block.bonusSystem}
                                       li1={block.li1}
                                       li2={block.li2}
                                       li3={block.li3}
                                       btnText={block.btnText}
                                       smallBtnText={block.smallBtnText}
                                       image={block.image}/>
        }
    }

    const renderHeader = ({alias, title}) =>{
        switch (alias) {
            case 'Header':
                return setHeader(<Header/>)
            case 'PageHeader':
                return setHeader(<PageHeader label={headerLabel ?? title}/>)
        }
    }

    useEffect(()=>{
        if(headerSource){
            renderHeader(headerSource);
        }
    }, [headerLabel, headerSource])

    if(isLoading){
        if(isError){
            return(
                <View style={[{height: 1000}, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                    <Text>Произошла ошибка попробуйте снова</Text>
                    {result && <Text>{JSON.stringify(result)}</Text>}
                    <Button title={"Обновить"} onPress={getBlocks}/>
                </View>
            )
        }else{
            return (
                <View style={{height: 300}}>
                    <Loader/>
                </View>
            );
        }
    }else{
        if(blocks) {
            return <>
                {header}
                <FlatList data={blocks ?? []}
                          bounces={false}
                          renderItem={renderBlocks}
                          keyExtractor={(item, i) => i}
                          style={{backgroundColor: "#fff"}}/>
                {footer}
            </>
        }else{
            return(
                <View style={[{height: 300}, bootstrapStyles.justifyContentCenter]}>
                    <Text>Страница не найдена</Text>
                </View>
            )
        }
    }
}