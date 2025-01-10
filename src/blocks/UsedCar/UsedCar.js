import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Text, StyleSheet, View, Dimensions, Platform, ScrollView, Pressable, Linking} from "react-native";
import {Image} from 'expo-image'
import {useRoute} from "@react-navigation/native";
import ImageView from "react-native-image-viewing";

import getSpacedPrice from "../../hooks/getSpacedPrice";
import getNoun from "../../hooks/getNoun";

import bootstrapStyles from "../../ui/bootstrapStyles";
import Loader from "../../ui/Loader/Loader";
import SwiperStylish from "../../ui/SwiperStylish";
import Button from "../../ui/Button/Button";

import OpenURLButton from "../../components/LinkOpener/LinkOpener";
import Car from "./Car/Car"

import Location from "../../../assets/uiIcons/location.svg";
import Ruble from "../../../assets/uiIcons/ruble-square.svg";
import Phone from "../../../assets/uiIcons/call.svg";
import Refresh from "../../../assets/uiIcons/refresh-2.svg";
import SidebarModal from "../../components/SidebarModal/SidebarModal";
import ModalFields from "../../components/ModalFields/ModalFields";
import successModal from "../../store/actions/successModal/successModal";
import {domain} from "../../constants/constants";

export default function UsedCar({setTitle, setFooter}) {
    const isTablet = useSelector(store => store.isTablet);
    const route = useRoute();

    const dispatch = useDispatch();

    const [fullScreenImageIsOpen, setFullScreenImageIsOpen] = useState(false);
    const [width, setWidth] = useState();

    const [bigSliderIndex, setBigSliderIndex] = useState(0);
    const smallSlider = useRef(null);
    const bigSlider = useRef(null);

    const styles = useMemo(() => styling(isTablet, width), [isTablet, width])

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

    const [applicationModalIsOpen, setApplicationModalIsOpen] = useState(false);
    const [tradeInModalIsOpen, setTradeInModalIsOpen] = useState(false);

    const [fieldsTradeIn, setFieldsTradeIn] = useState([
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
        },
        {
            type: "text",
            name: "traidin",
            placeholder: "Ваш автомобиль (марка и модель)"
        },
    ]);

    const [toModalCarItem, setToModalCarItem] = useState(null);

    const [carInfo, setCarInfo] = useState(false);

    function getCarInfo() {
        fetch(`${domain}/api/cars/used/show/${route?.params?.carId}`)
            .then((resp) => {
                if (resp.status === 200) {
                    return resp.json()
                }
            })
            .then(result => {
                setCarInfo(result)
                if(result?.name){
                    setTitle(result.name);
                }
                if(result?.phone){
                    setFieldsApplication((prevState) => {
                        return [
                            ...prevState,
                            {
                                type: "text",
                                name: "byPhone",
                                value: result.phone,
                                hidden: true
                            }
                        ]})
                    setFieldsTradeIn((prevState) => {
                        return [
                            ...prevState,
                            {
                                type: "text",
                                name: "byPhone",
                                value: result.phone,
                                hidden: true
                            }
                        ]
                    })
                }
                if(result?.address){
                    setFieldsApplication((prevState) => {
                        return [
                            ...prevState,
                            {
                                type: "text",
                                name: "byAddress",
                                value: result.address,
                                hidden: true
                            }
                        ]
                    })
                    setFieldsTradeIn((prevState) => {
                        return [
                            ...prevState,
                            {
                                type: "text",
                                name: "byAddress",
                                value: result.address,
                                hidden: true
                            }
                        ]
                    })
                }
                setFooter(
                    <View style={{backgroundColor: "#fff", paddingTop: 10, paddingBottom: 20}}>
                        <View style={bootstrapStyles.container}>
                            <View style={{rowGap: 10}}>
                                <Button title={"Оставить заявку"} size={isTablet ? "l" : "s"} onPress={() => {setApplicationModalIsOpen(true)}}/>
                                <View style={[bootstrapStyles.flexRow, {columnGap: 10}]}>
                                    <View style={[{width: result?.phone ? "45%" : "100%"}, bootstrapStyles.flexGrow1]}>
                                        <Button title={"Обменять"} leftIcon={Refresh} type="second" onPress={() => {setTradeInModalIsOpen(true)}}/>
                                    </View>
                                    {
                                        result?.phone &&
                                        <View style={[{width: "45%"}, bootstrapStyles.flexGrow1]}>
                                            <Button title={"Позвонить"} leftIcon={Phone} type="second" onPress={async () => {await Linking.openURL(`tel:${result?.phone.split(/[-_()^\s*$]+/).join("")}`)}}/>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                )
            })
    }

    function updateDimensions(){
        const {height: heightd, width: widthd} = Dimensions.get('window');
        const aspectRatio = heightd/widthd;

        if(Platform.OS === 'ios'){
            if(aspectRatio > 1.6) {
                setWidth(widthd);
            } else {
                setWidth(heightd);
            }
        } else {
            setWidth(widthd);
        }
    }

    useEffect(() => {
        if(carInfo){
            let carItem = {};
            let carItemInfo = [];
            if(carInfo?.image?.length > 0){
                carItem.image = carInfo.image[0];
            }
            if(carInfo?.info){
                let year = carInfo.info.findIndex(item => item.type === 'year');

                if(year !== -1){
                    carItem.year = carInfo.info[year].value
                }

                let mileage = carInfo.info.findIndex(item => item.type === 'mileage');
                let owners = carInfo.info.findIndex(item => item.type === 'owners');
                let driveType = carInfo.info.findIndex(item => item.type === 'driveType');
                let gearBox = carInfo.info.findIndex(item => item.type === 'gearBox');
                if(owners !== -1){
                    carItemInfo.push(carInfo.info[owners]);
                }
                if(mileage !== -1){
                    carItemInfo.push(carInfo.info[mileage]);
                }
                if(driveType !== -1){
                    carItemInfo.push(carInfo.info[driveType]);
                }
                if(gearBox !== -1){
                    carItemInfo.push(carInfo.info[gearBox]);
                }
                if(carItemInfo.length > 0){
                    carItem.info = carItemInfo;
                }
            }
            if(carInfo?.name){
                carItem.name = carInfo.name
            }
            if(carInfo?.price){
                carItem.price = carInfo.price
            }

            setToModalCarItem(carItem);
        }
    }, [carInfo]);

    useEffect(() => {
        if(route?.params?.carId){
            getCarInfo();
        }

        updateDimensions()
        let dimensionsHandler = Dimensions.addEventListener('change', updateDimensions)

        return () => {dimensionsHandler.remove();}
    }, [])

    useEffect(() => {
        if(smallSlider?.current){
            smallSlider.current.scrollTo({ x: styles.carImageSmallSlide.width * (bigSliderIndex), y: 0, animated: true })
        }
    }, [bigSliderIndex, smallSlider])

    const scrollToBigSlider = (index) => {
        if(bigSlider?.current){
            bigSlider.current.scrollBy(index, true);
        }
    }

    if (carInfo) {
        return (
            <>
                <View style={styles.car}>
                    <View style={[styles.carImageWrapper]}>
                        <ImageView
                            images={carInfo.image.map((image, i) => {return {uri: image}})}
                            imageIndex={bigSliderIndex}
                            visible={fullScreenImageIsOpen}
                            onRequestClose={() => setFullScreenImageIsOpen(false)}
                            presentationStyle={"fullScreen"}
                            FooterComponent={({imageIndex}) => <View style={[bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}><Text style={{color: "#fff"}}>{imageIndex + 1}/{carInfo.image.length}</Text></View>}/>
                        <View style={[bootstrapStyles.container]}>
                            <SwiperStylish onIndexChanged={(index) => {setBigSliderIndex(index)}}
                                           style={{height: styles.carImageBigSliderImage.height}}
                                           ref={bigSlider}
                                           loadMinimal={true}
                                           loadMinimalSize={3}
                                           showsPagination={false}>
                                {
                                    carInfo.image.map((image, index) => {
                                        return (
                                            <Pressable key={index} onPress={()=> setFullScreenImageIsOpen(true)}>
                                                <Image source={image} style={styles.carImageBigSliderImage} contentFit="cover" contentPosition={"center"}/>
                                            </Pressable>
                                        )
                                    })
                                }
                            </SwiperStylish>
                        </View>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} ref={smallSlider} bounces={false} contentContainerStyle={{paddingHorizontal: 10}}>
                            {
                                carInfo.image.map((image, index) => (
                                    <Pressable key={index} style={[styles.carImageSmallSlide]} onPress={() => {scrollToBigSlider(bigSliderIndex < index ? (index - bigSliderIndex) : -(bigSliderIndex - index))}}>
                                        <Image source={image} style={styles.carImageSmallSliderImage} contentFit="cover" contentPosition={"center"}/>
                                        {
                                            (index === bigSliderIndex)
                                            && <View style={styles.carImageSmallSlideActive}/>
                                        }
                                    </Pressable>
                                ))
                            }
                        </ScrollView>
                    </View>
                    <View style={bootstrapStyles.container}>
                        <View style={styles.carPrice}>
                            <Text style={styles.carInfoName}>{carInfo.name}</Text>
                            <View style={[styles.priceBlock, bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter]}>
                                <Text style={styles.priceBlockPrice}>{getSpacedPrice(carInfo.price)} ₽</Text>
                                <View style={styles.priceBlockCard}><Text style={styles.priceBlockCardText}>Хорошая цена</Text></View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.carTextWrapper, bootstrapStyles.container]}>
                        <View style={styles.carInfo}>
                            {
                                carInfo?.info &&
                                <View style={styles.carCharsWrapper}>
                                    <Text style={styles.carCharsTitle}>Основные характеристики</Text>
                                    <View style={styles.carCharsGrid}>
                                        {
                                            carInfo.info.map(({type, value, text}, index) => {
                                                switch (type) {
                                                    case "owners" : {
                                                        return <View style={[styles.carCharsGridRow, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart]} key={index}>
                                                            <View style={styles.carCharGridEl}>
                                                                <Text style={styles.carCharGridElText}>{text}</Text>
                                                            </View>
                                                            <View style={styles.carCharGridElValue}>
                                                                <Text style={styles.carCharGridElValueText}>{value} {getNoun(value, ['владельцев', 'владелец', 'владельца'])}</Text>
                                                            </View>
                                                        </View>
                                                    }
                                                    case "mileage" : {
                                                        return <View style={[styles.carCharsGridRow, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart]} key={index}>
                                                            <View style={styles.carCharGridEl}>
                                                                <Text style={styles.carCharGridElText}>{text}</Text>
                                                            </View>
                                                            <View style={styles.carCharGridElValue}>
                                                                <Text style={styles.carCharGridElValueText}>{getSpacedPrice(value)} км</Text>
                                                            </View>
                                                        </View>
                                                    }
                                                    default : {
                                                        return <View style={[styles.carCharsGridRow, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart]} key={index}>
                                                            <View style={styles.carCharGridEl}>
                                                                <Text style={styles.carCharGridElText}>{text}</Text>
                                                            </View>
                                                            <View style={styles.carCharGridElValue}>
                                                                <Text style={styles.carCharGridElValueText}>{value}</Text>
                                                            </View>
                                                        </View>
                                                    }
                                                }
                                            })
                                        }
                                    </View>
                                </View>
                            }
                        </View>
                        {/*<div className={cn([cl.cardReport, 'd-flex flex-column'])}>*/}
                        {/*	<h6 className={cn([cl.name, 'mb-0'])}>Отчет о проверке</h6>*/}
                        {/*	<div className={cn([cl.cards, 'd-flex'])}>*/}
                        {/*		{report.map(({ icon, text }) => (*/}
                        {/*			<div className={cn([cl.card, 'd-flex align-items-center'])}>*/}
                        {/*				<img src={icon} alt="" className={cl.icon} />*/}
                        {/*				<div className={cl.text}>{text}</div>*/}
                        {/*			</div>*/}
                        {/*		))}*/}
                        {/*	</div>*/}
                        {/*</div>*/}
                        {
                            carInfo?.comment &&
                            <View style={styles.carCharsWrapper}>
                                <Text style={styles.carCharsTitle}>Комментарий</Text>
                                <Text style={styles.carComment}>{carInfo.comment}</Text>
                            </View>
                        }
                        {
                            (carInfo?.address || carInfo?.phone) &&
                            <View style={styles.carCharsWrapper}>
                                <Text style={styles.carCharsTitle}>Адрес и контакты</Text>
                                <View style={[styles.carCharContacts, bootstrapStyles.flexRow, bootstrapStyles.alignItemsStart]}>
                                    <Location height={styles.carCharContactsIcon.height} width={styles.carCharContactsIcon.width}/>
                                    <View style={styles.carCharContactsTexts}>
                                        <Text style={styles.carCharContactsText}>{carInfo?.address && carInfo.address}</Text>
                                        {
                                            carInfo?.phone &&
                                            <OpenURLButton url={`tel:${carInfo.phone.split(/[-_()^\s*$]+/).join('')}`}><Text style={styles.carCharContactsText}>{carInfo?.phone}</Text></OpenURLButton>
                                        }
                                    </View>
                                </View>
                            </View>
                        }
                        {/*<div className={cn([cl.cardEquipment, 'd-flex flex-column'])}>*/}
                        {/*	<p className={cn([cl.cardEquipmentTitle])}>Комплектация</p>*/}
                        {/*	<div className={cl.collapses}>*/}
                        {/*		{equipment.map(({ title, description }, index) => (*/}
                        {/*			<Collapse*/}
                        {/*				className={cl.collapse}*/}
                        {/*				key={index}*/}
                        {/*				label={title}*/}
                        {/*				isOpen={openCollapseIndex === index} // Устанавливаем isOpen в true, если текущий Collapse должен быть открыт*/}
                        {/*				onClick={() => handleCollapseClick(index)} // Передаем индекс Collapse для обработки нажатия*/}
                        {/*				iconPosition="right"*/}
                        {/*				divider={true}*/}
                        {/*				icon={IconAdd}*/}
                        {/*				// closeIcon={IconRemove}*/}
                        {/*			>*/}
                        {/*				{description}*/}
                        {/*			</Collapse>*/}
                        {/*		))}*/}
                        {/*	</div>*/}
                        {/*</div>*/}
                        <View style={styles.carCharsWrapper}>
                            <Text style={styles.carCharsTitle}>Купите выгодно</Text>
                            <View style={[styles.carBenefitCards, bootstrapStyles.flexRow]}>
                                <View style={[styles.carBenefitCardsEl, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                                    <Ruble width={styles.carBenefitCardsElIcon.width} height={styles.carBenefitCardsElIcon.height}/>
                                    <Text style={styles.carBenefitCardsElText}>Выгодные ставки по автокредиту от 0,1 %</Text>
                                </View>
                                <View style={[styles.carBenefitCardsEl, bootstrapStyles.justifyContentCenter, bootstrapStyles.alignItemsCenter]}>
                                    <Refresh width={styles.carBenefitCardsElIcon.width} height={styles.carBenefitCardsElIcon.height}/>
                                    <Text style={styles.carBenefitCardsElText}>Обменяйте старый авто на новый</Text>
                                </View>
                            </View>
                            {/*    <Button label='Оставить заявку' size='s' width='full'*/}
                            {/*            onClick={() => setApplicationModalIsOpen(true)}/>*/}
                        </View>
                    </View>
                </View>

                <SidebarModal isOpen={applicationModalIsOpen} title={"Заявка"} withSubmitButton={false} close={() => {setApplicationModalIsOpen(false)}}>
                    <View style={[styles.application]}>
                        {
                            toModalCarItem &&
                                <Car item={toModalCarItem}/>
                        }
                        <View style={styles.applicationForm}>
                            <Text style={styles.applicationFormTitle}>Контактные данные</Text>
                            <ModalFields endpoint={`${domain}/api/application`}
                                         fields={fieldsApplication}
                                         buttonText={"Отправить заявку"}
                                         successfully={() => {
                                             setApplicationModalIsOpen(false);
                                             setTimeout(() => {
                                                 dispatch(successModal(true));
                                             }, 1000)
                                         }}
                                         target={"Заявка на б/у автомобиль с моб. приложения"}/>
                        </View>
                    </View>
                </SidebarModal>

                <SidebarModal isOpen={tradeInModalIsOpen} title={"Обменять"} withSubmitButton={false} close={() => {setTradeInModalIsOpen(false)}}>
                    <View style={[styles.application]}>
                        {
                            toModalCarItem &&
                            <Car item={toModalCarItem}/>
                        }
                        <View style={styles.applicationForm}>
                            <Text style={styles.applicationFormTitle}>Контактные данные</Text>
                            <ModalFields endpoint={`${domain}/api/application`}
                                         fields={fieldsTradeIn}
                                         buttonText={"Отправить заявку"}
                                         successfully={() => {
                                             setTradeInModalIsOpen(false);
                                             setTimeout(() => {
                                                 dispatch(successModal(true));
                                             }, 1000)
                                         }}
                                         target={"Заявка на trade-in на б/у автомобиль с моб. приложения"}/>
                        </View>
                    </View>
                </SidebarModal>
            </>
        )
    } else {
        return <View style={[bootstrapStyles.flexRow, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter]}><Loader/></View>
    }
}

const styling = (isTablet, width) => {
    return StyleSheet.create(
        {
            car:{
                rowGap: 20,
                paddingBottom: 50
            },
            carImageWrapper: {
                rowGap: 10,
                paddingVertical: 10
            },
            carTextWrapper: {
                rowGap: 26
            },
            carImageBigSliderImage: {
                height: width * (isTablet ? 0.6 : 0.4),
                borderRadius: 10,
                overflow: "hidden",
                width: "100%",
            },
            carImageSmallSlide: {
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                marginRight: 4,
                width: 57
            },
            carImageSmallSlideActive: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: "#2F3140",
                zIndex: 1,
                borderRadius: 4
            },
            carImageSmallSliderImage: {
                height: 40,
            },
            carInfo: {
                rowGap: 20
            },
            carInfoName: {
                fontSize: isTablet ? 32 : 24,
                lineHeight: (isTablet ? 32 : 24) * 1.2,
                fontFamily: "Onest-Medium",
                color: "#111"
            },
            carPrice: {
                rowGap: 8,
                paddingBottom: 20,
                borderBottomColor: "#D4D4D4",
                borderBottomWidth: 1,
                borderBottomStyle: "solid"
            },
            priceBlock: {
                columnGap: 14
            },
            priceBlockPrice: {
                fontSize: 20,
                lineHeight: 20 * 1.2,
                fontFamily: "Onest-Medium",
                color: "#111"
            },
            priceBlockCard: {
                paddingVertical: 2,
                paddingHorizontal: 10,
                backgroundColor: "#2A9D8F1F",
                borderRadius: 4
            },
            priceBlockCardText: {
                fontSize: 12,
                lineHeight: 12 * 1.4,
                fontFamily: "Onest-Medium",
                color: "#2A9D8F"
            },
            carCharsWrapper: {
                rowGap: 12
            },
            carCharsTitle: {
                fontSize: 20,
                lineHeight: 20 * 1.2,
                fontFamily: "Onest-Medium",
                color: "#111"
            },
            carCharsGrid: {
                rowGap: 12,
            },
            carCharsGridRow: {
                columnGap: 24,
            },
            carCharGridEl: {
                width: 100
            },
            carCharGridElText: {
                fontSize: 14,
                lineHeight: 14 * 1.4,
                fontFamily: "Onest-Regular",
                color: "#6B6B6B"
            },
            carCharGridElValue: {
                flexGrow: 1
            },
            carCharGridElValueText: {
                fontSize: 14,
                lineHeight: 14 * 1.4,
                fontFamily: "Onest-Medium",
                color: "#111"
            },
            carComment: {
                fontSize: 14,
                lineHeight: 14 * 1.4,
                fontFamily: "Onest-Regular",
                color: "#6B6B6B"
            },
            carCharContacts:{
                columnGap: 10
            },
            carCharContactsTexts: {
                rowGap: 6
            },
            carCharContactsText: {
                fontSize: 14,
                lineHeight: 14 * 1.2,
                fontFamily: "Onest-Regular",
                color: "#6B6B6B"
            },
            carCharContactsIcon:{
                width: 24,
                height: 24
            },
            carBenefitCards: {
                columnGap: 10
            },
            carBenefitCardsEl: {
                borderRadius: 10,
                paddingVertical: 20,
                paddingHorizontal: 10,
                backgroundColor: "#F4F5F7",
                rowGap: 10,
                flexGrow: 1,
                width: "45%"
            },
            carBenefitCardsElText: {
                fontSize: 14,
                lineHeight: 14 * 1.4,
                fontFamily: "Onest-Regular",
                textAlign: "center",
                color: "#2F3140"
            },
            carBenefitCardsElIcon: {
                width: 30,
                height: 30
            },
            application:{
                rowGap: 20
            },
            applicationForm:{
                rowGap: isTablet ? 16 : 10
            },
            applicationFormTitle:{
                fontSize: 16,
                lineHeight: 16 * 1.4,
                fontFamily: "Onest-Regular",
                textAlign: "start",
                color: "#111"
            }
        }
    )
}