import {Text, View, StyleSheet, FlatList} from "react-native";
import React, {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";

import HistoryItem from "./HistoryItem/HistoryItem";
import NavBar from "../../../components/NavBar/NavBar";
import WhiteHeader from "../../../components/WhiteHeader/WhiteHeader";
import HeaderComponent from "./HeaderComponent/HeaderComponent";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import {getCars, getUser, queryPost} from "../../../query/query";

import {domain} from "../../../constants/constants";

export default function LKMain() {
    const isTablet = useSelector(store => store.isTablet)
    const cars = useSelector(store => store.cars)

    const contentStyles = useMemo(() => contentStylish(isTablet), [isTablet])

    const [historyList, setHistoryList] = useState(null);
    const [currPagination, setCurrPagination] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    function getHistory(pagination = 1, loadMore = true) {
        if(currPagination !== pagination){
            setCurrPagination(pagination);
            setIsLoading(true);
            queryPost(`${domain}/api/history${pagination && pagination !== 1 ? `?page=${pagination}` : ''}`, new FormData)
                .then(result => {
                    if (loadMore) {
                        let newResult = Object.assign({}, result);
                        newResult.data = [...combineResultItems(result.data, historyList?.data ?? [])];
                        setHistoryList(newResult);
                    } else {
                        setHistoryList(Object.assign({}, result));
                    }
                    setIsLoading(false);
                })
        }
    }

    function combineResultItems(newItems, prevData){
        let combinedItems = [...prevData];
        newItems.forEach((newItem) => {
            let findedIndex = combinedItems.findIndex(item => {return((item?.Numberdoc === newItem?.Numberdoc) && (item?.Dtdoc === newItem?.Dtdoc))})
            let findCar = cars.find(item => item.VIN === newItem.VIN)

            if(findedIndex !== -1){
                combinedItems[findedIndex] = {
                    Dtdoc: combinedItems[findedIndex].Dtdoc,
                    Probeg: newItem?.Probeg,
                    Numberdoc: combinedItems[findedIndex].Numberdoc,
                    Rabota: [...combinedItems[findedIndex].Rabota, newItem.Rabota],
                    Rekomend: [...combinedItems[findedIndex].Rekomend, newItem.Rekomend],
                    Summa: Number(combinedItems[findedIndex].Summa) + Number(newItem.Summa),
                    SummaRabota: Number(combinedItems[findedIndex].SummaRabota) + Number(newItem.SummaRabota),
                    SummaTovar: Number(combinedItems[findedIndex].SummaTovar) + Number(newItem.SummaTovar),
                    Tovar: [...combinedItems[findedIndex].Tovar, newItem.Tovar],
                    VIN: findCar ? `${findCar?.stamp ?? ''} ${findCar?.model ?? ''} ${findCar?.stateNumber ?? ''}` : combinedItems[findedIndex].VIN,
                }
            }else{
                combinedItems.push(
                    {
                        Dtdoc: newItem.Dtdoc,
                        Probeg: newItem?.Probeg,
                        Numberdoc: newItem.Numberdoc,
                        Rabota: [newItem.Rabota],
                        Rekomend: [newItem.Rekomend],
                        Summa: [newItem.Summa],
                        SummaRabota: [newItem.SummaRabota],
                        SummaTovar: [newItem.SummaTovar],
                        Tovar: [newItem.Tovar],
                        VIN: findCar ? `${findCar?.stamp ?? ''} ${findCar?.model ?? ''} ${findCar?.stateNumber ?? ''}` : newItem.VIN,
                    }
                )
            }
        })

        return combinedItems;
    }

    function renderItem({item, index}) {
        return (<HistoryItem item={item} index={index}/>)
    }

    function loadMore() {
        if (!isLoading) {
            if (historyList.meta?.current_page < historyList.meta?.last_page) {
                getHistory(historyList.meta.current_page + 1);
            }
        }
    }

    useEffect(() => {
        getUser();
        getCars(() => {getHistory(1, false);})
    }, [])

    return (
        <>
            <WhiteHeader text={"Личный кабинет"}/>
            {
                (isLoading && !historyList)
                    ? <View style={[contentStyles.content, bootstrapStyles.container, bootstrapStyles.flexGrow1]}><HeaderComponent history={historyList} isLoading={isLoading}/></View>
                    : <FlatList data={historyList.data}
                                ListHeaderComponent={<HeaderComponent history={historyList} isLoading={isLoading}/>}
                                ListFooterComponent={historyList?.data?.length > 0 ? null : <View style={[contentStyles.content, bootstrapStyles.container, bootstrapStyles.flexGrow1]}><Text>Ничего не найдено</Text></View>}
                                horizontal={false}
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
                                ItemSeparatorComponent={<View style={{height: 10}}/>}
                                style={[contentStyles.content, bootstrapStyles.container, bootstrapStyles.flexGrow1]}/>
            }
            <NavBar/>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    content: {
        backgroundColor: "#fff"
    },
    gridWrapper: {
        rowGap: 10,
        paddingBottom: 15,
    },
    gridItemDescription: {
        fontFamily: 'Onest-Medium',
        fontSize: isTablet ? 18 : 14,
        lineHeight: (isTablet ? 18 : 14) * 1.4,
        color: "#2F3140",
        zIndex: 1
    },
    gridItemIcon: {
        width: 24,
        height: 24
    },
    gridItem: {
        padding: 14,
        borderRadius: 14,
        // height: 100,
        backgroundColor: "#F4F5F7",
        flex: 1,
        position: 'relative',
        overflow: "hidden"
    },
    gridItemGradient:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    gridRow: {
        columnGap: 10
    },
    bonusesCount: {
        fontFamily: 'Onest-Medium',
        fontSize: isTablet ? 32 : 28,
        lineHeight: (isTablet ? 32 : 28) * 1.2,
        color: "#fff",
        zIndex: 1
    },
    bonusesDescription: {
        color: "#fff"
    },
    wrapper:{
        paddingVertical: 15,
        rowGap: 16
    },
    header:{
        fontFamily: "Onest-Medium",
        fontSize: 16,
        lineHeight: 16 * 1.4
    },
    item:{
        rowGap: 10,
        width: "100%",
        padding: 18,
        shadowColor: '#000',
        backgroundColor: "#fff",
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.05,
        shadowRadius: 16,
        borderRadius: 14,
        elevation: 1
    },
    itemText:{
        rowGap: 6,
        paddingBottom: 10,
        borderBottomColor: "#F1F1F1",
        borderBottomWidth: 1,
        borderBottomStyle: "solid"
    },
    itemCarAndDate: {
        columnGap: 8,
    },
    itemPriceAndNumber:{
        columnGap: 10,
    },
    itemHeader:{
        color: "#000",
        fontFamily: "Onest-Medium",
        fontSize: 14,
        lineHeight: 14 * 1.4,
        whiteSpace: "nowrap",
        textAlign: 'start',
    },
    itemDescription:{
        color: "#6B6B6B",
        fontFamily: "Onest-Regular",
        fontSize: 12,
        lineHeight: 12 * 1.3,
        whiteSpace: "nowrap",
        textAlign: 'start'
    },
    itemPrice:{
        textAlign: 'end'
    },
});