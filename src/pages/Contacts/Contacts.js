import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";

import NavBar from "../../components/NavBar/NavBar";
import Loader from "../../ui/Loader/Loader";
import WhiteHeader from "../../components/WhiteHeader/WhiteHeader";
import OpenURLButton from "../../components/LinkOpener/LinkOpener";
import SidebarModal from "../../components/SidebarModal/SidebarModal";

import Arrow from "../../../assets/contacts/arrow-right.svg"
import Filter from "../../../assets/uiIcons/filter.svg"

import bootstrapStyles from "../../ui/bootstrapStyles";

import CheckBoxGroup from "../../ui/CheckBoxGroup/CheckBoxGroup";
import RadioButtonGroup from "../../ui/RadioButtonGroup/RadioButtonGroup";
import Button from "../../ui/Button/Button";

import {domain} from "../../constants/constants";

export default function Contacts({navigation}) {
    const [isLoading, setIsLoading] = useState(true);

    const [contacts, setContacts] = useState(null);
    const [currContacts, setCurrContacts] = useState(null);

    const [cities, setCities] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);

    const [services, setServices] = useState([]);
    const [currService, setCurrService] = useState(null);

    const [brands, setBrands] = useState([]);
    const [currBrandsToView, setCurrBrandsToView] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState(null);

    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

    function getContacts() {
        let date = new Date();

        fetch(`${domain}/mobAppData/contacts.json?v=${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}`)
            .then(response => response.json())
            .then(result => {
                setContacts(result);
                setCurrContacts(result);
                setIsLoading(false)
            });
    }

    useEffect(() => {
        getContacts();
    }, [])

    useEffect(() => {
        if (contacts?.length) {
            setCities(['Все', ...new Set(contacts.map(item => item.city).filter(item => !!item))]);
            setServices(['Все', ...new Set(contacts.map(item => item.services).flat().filter(item => !!item))]);

            let checkboxItems = [...new Set(contacts.map(item => item.brand).filter(item => !!item))].map((item, index) => {
                return {id: index, name: item}
            });
            setBrands(checkboxItems);
            setCurrBrandsToView(checkboxItems);
        }
    }, [contacts])

    useEffect(() => {
        if (cities?.length) {
            setCurrentCity(cities[0]);
        }
    }, [cities])

    useEffect(() => {
        if (services?.length) {
            setCurrService(services[0]);
        }
    }, [services])

    useEffect(() => {
        if (currentCity || selectedBrands) {
            let newContacts = [...contacts];

            if (currentCity !== 'Все') {
                newContacts = newContacts.filter(item => !item?.city || item.city === currentCity);
            }

            if (currService !== 'Все') {
                newContacts = newContacts.filter(item => item?.services && item.services.includes(currService));
            }

            if (selectedBrands?.length) {
                let newSelectedBrands = selectedBrands.map(item => item.name);
                newContacts = newContacts.filter(item => newSelectedBrands.includes(item.brand));
            }
            setCurrContacts(newContacts);
        } else {
            setCurrContacts(contacts);
        }
    }, [currentCity, selectedBrands, currService])


    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => contentStylish(isTablet), [isTablet])

    return (
        <>
            <WhiteHeader text={"Центры и контакты"}/>
            <ScrollView bounces={false} style={{backgroundColor: "#fff"}}
                        contentContainerStyle={[bootstrapStyles.container, styles.container]}>
                {
                    isLoading
                        ? <Loader/>
                        : currContacts?.length
                        ? <>
                            <View style={[bootstrapStyles.flexRow]}><Button title={"Фильтры"} leftIcon={Filter}
                                                                            type={'second'} size={"s"}
                                                                            onPress={() => setSidebarIsOpen(true)}/></View>
                            <View style={styles.contactsList}>
                                {
                                    currContacts.map(({id, background, name, description, address, phoneLink}, index) => (
                                        <View key={index} style={styles.contact}>
                                            <Pressable style={styles.contactHeaderAndDescriptionWrapper} onPress={() => navigation.navigate("Contact", {data: currContacts[index]})}>
                                                <View style={[styles.contactHeaderWrapper, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart, bootstrapStyles.justifyContentBetween]}>
                                                    <Text style={styles.contactHeader}>{name}</Text>
                                                    <Arrow width={styles.contactHeaderArrow.width} height={styles.contactHeaderArrow.height}/>
                                                </View>
                                                {description && <Text style={styles.contactHeaderDescription}>{description}</Text>}
                                            </Pressable>
                                            {address && <Text style={styles.contactAddress}>{address}</Text>}
                                            {/*{phoneLink && <OpenURLButton url={`tel:${phoneLink.includes("+") ? phoneLink.trim().substr(1) : phoneLink}`}><Text style={styles.contactCall}>Позвонить</Text></OpenURLButton>}*/}
                                            {phoneLink && <OpenURLButton url={`tel:${phoneLink}`}><Text
                                                style={styles.contactCall}>Позвонить</Text></OpenURLButton>}
                                        </View>
                                    ))
                                }
                            </View>
                            <SidebarModal isOpen={sidebarIsOpen} close={() => setSidebarIsOpen(false)} title={"Фильтры"} submitButtonOnPress={() => setSidebarIsOpen(false)} submitButtonText={"Применить"}>
                                <View style={styles.filtersWrapper}>
                                    <View style={styles.filterGroup}>
                                        <Text style={styles.filterGroupHeader}>Город</Text>
                                        <RadioButtonGroup items={cities} value={currentCity} onChange={setCurrentCity}/>
                                    </View>
                                    <View style={styles.filterGroup}>
                                        <Text style={styles.filterGroupHeader}>Бренд</Text>
                                        <CheckBoxGroup items={currBrandsToView} value={selectedBrands} onChange={setSelectedBrands} getItemLabel={(item) => item.name}/>
                                    </View>
                                    <View style={styles.filterGroup}>
                                        <Text style={styles.filterGroupHeader}>Услуга</Text>
                                        <RadioButtonGroup items={services} value={currService} onChange={setCurrService}/>
                                    </View>
                                </View>
                            </SidebarModal>
                        </>
                        : <View><Text>Ничего не найдено</Text></View>
                }
            </ScrollView>
            <NavBar/>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    container:{
        rowGap: 15,
        paddingBottom: 10
    },
    contactsList: {
        rowGap: 8
    },
    contact: {
        backgroundColor: "#F4F5F7",
        rowGap: 8,
        padding: 12,
        borderRadius: 14
    },
    contactHeaderAndDescriptionWrapper: {
        rowGap: 2
    },
    contactHeaderWrapper: {
        columnGap: 4
    },
    contactHeader: {
        maxWidth: isTablet ? 260 : null,
        fontFamily: "Onest-Medium",
        fontSize: 14,
        lineHeight: 14 * 1.4,
        color: "#111111"
    },
    contactHeaderArrow: {
        width: 15,
        height: 15
    },
    contactAddress: {
        fontFamily: "Onest-Regular",
        fontSize: 9,
        lineHeight: 9 * 1.3,
        color: "#111111"
    },
    contactCall: {
        fontFamily: "Onest-Regular",
        fontSize: 9,
        lineHeight: 9 * 1.4,
        color: "#111111"
    },
    contactHeaderDescription: {
        fontFamily: "Onest-Regular",
        fontSize: 9,
        lineHeight: 9 * 1.3,
        color: "#6B6B6B"
    },
    filtersWrapper: {
        rowGap: 20,
        position: "relative"
    },
    filterGroup: {
        rowGap: 10
    },
    filterGroupHeader: {
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 24 : 14,
        lineHeight: (isTablet ? 24 : 14) * 1.4,
        color: "#111111"
    }
})