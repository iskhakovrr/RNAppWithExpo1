import {StyleSheet, View, Text} from "react-native";
import {useSelector} from "react-redux";
import React, {useEffect, useMemo, useRef, useState} from "react";
import YaMap, {Marker} from "react-native-yamap";

import bootstrapStyles from "../../ui/bootstrapStyles";
import ChoiceGroup from "../../ui/ChoiceGroup/ChoiceGroup";

import Button from "../../ui/Button/Button";

export default function ChargersMap({ title, values, centerScreen }) {
    const isTablet = useSelector(store => store.isTablet);

    const defaultCenterScreen = {
        lat: 54.735152,
        lon: 55.958722,
        zoom: 7.95,
    }

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    const mapRef = useRef();
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const [types, setTypes] = useState([]);
    const [currType, setCurrType] = useState(null);

    const [activeStation, setActiveStation] = useState(null);
    const [filteredValues, setFilteredValues] = useState(values);

    const [height, setHeight] = useState(undefined);

    useEffect(() => {
        if(types.length > 0){
            setCurrType(types[0]);
        }
    }, [types]);

    useEffect(() => {
        if (values?.length) {
            const types = Array.from(
                new Set(values.map(station => station.type))
            ).filter(type => type);
            setTypes([
                'Все',
                ...types.map(type => (type.toString())),
            ]);

        }
    }, [values]);

    function handleSort(selectedType) {
        setActiveStation(null);

        if (selectedType !== "Все") {
            const newFilteredValues = values.filter(station => station.type === selectedType);
            setFilteredValues(newFilteredValues);



            if (isMapLoaded) {
                if (newFilteredValues.length === 1) {
                    const targetStation = newFilteredValues[0];
                    setActiveStation(targetStation);
                    mapRef.current.setCenter({lat: targetStation.coordinates[0] - (isTablet ? 0 : 0.005), lon: targetStation.coordinates[1] - (isTablet ? 0.005 : 0), zoom: 14});
                } else if (newFilteredValues.length > 1) {
                    mapRef.current.setCenter(centerScreen ?? defaultCenterScreen);
                }
            }
        } else {
            setFilteredValues(values);
            if (mapRef.current) {
                mapRef.current.setCenter(centerScreen ?? defaultCenterScreen);
            }
        }
    }

    return (
        <>
            <View style={styles.chargersMapWrapper}>
                <View style={bootstrapStyles.container}>
                    <View style={styles.chargersMap}>
                        <View style={styles.chargersMapTitleWrapper}>
                            {title && <Text style={styles.chargersMapTitle}>{title}</Text>}
                            <View>
                                <ChoiceGroup value={currType}
                                             items={types}
                                             onChange={(item) => {
                                                 handleSort(item)
                                                 setCurrType(item)
                                             }}
                                             getItemLabel={(item) => item}
                                             size="l"/>
                            </View>
                        </View>
                        <View style={styles.chargersMapMapWrapper}>
                            <YaMap initialRegion={centerScreen ?? defaultCenterScreen}
                                   onMapLoaded={() => setIsMapLoaded(true)}
                                   nightMode={true}
                                   ref={mapRef}
                                   mapStyle={JSON.stringify(mapStyle)}
                                   onMapPress={() => setActiveStation(null)}
                                   style={styles.chargersMapMap}>
                                {
                                    filteredValues.map((station, index) => (
                                        <Marker key={index}
                                                point={{lat: station.coordinates[0], lon: station.coordinates[1]}}
                                                source={require('../../../assets/location.png')}
                                                scale={0.7}
                                                anchor={{x: 0.48, y: 0.935}}
                                                onPress={() => {
                                                    setActiveStation(station);
                                                    if (mapRef.current && station.coordinates) {
                                                        mapRef.current.setCenter({lat: station.coordinates[0] - (isTablet ? 0 : 0.005), lon: station.coordinates[1], zoom: 14});
                                                    }
                                                }}
                                        />
                                    ))
                                }
                            </YaMap>
                            {
                                activeStation &&
                                    <View style={[styles.chargersMapInfoWrapper, height && {height: height + 40}]}>
                                        <View style={styles.chargersMapInfo} onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
                                            <View style={styles.chargersMapInfoHeaderWrapper}>
                                                <Text style={styles.chargersMapInfoHeader}>{activeStation.title}</Text>
                                                {
                                                    activeStation?.description && <Text style={styles.chargersMapInfoLabel}>{activeStation.description}</Text>
                                                }
                                            </View>
                                            <View style={styles.chargersMapInfoDescriptionWrapper}>
                                                {
                                                    activeStation?.address &&
                                                    <View>
                                                        <Text style={styles.chargersMapInfoDescriptionAddress}>{activeStation.address}</Text>
                                                    </View>
                                                }
                                                {
                                                    activeStation?.graphics &&
                                                    <View>
                                                        <Text style={styles.chargersMapInfoDescriptionTime}>
                                                            {
                                                                activeStation.graphics
                                                                    .map(graphic => Object.entries(graphic)
                                                                        .map(([key, value]) => `${value}`)
                                                                        .join("<br>")
                                                                    )
                                                                    .join("\n")
                                                            }
                                                        </Text>
                                                    </View>
                                                }
                                                {
                                                    activeStation?.link &&
                                                        <View style={[bootstrapStyles.flexRow]}>
                                                            <Button size={isTablet ? "s" : "l"} title={"Как добраться"} url={activeStation.link}/>
                                                        </View>
                                                }
                                            </View>
                                        </View>
                                    </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        chargersMapWrapper:{
            paddingVertical: isTablet ? 30 : 25
        },
        chargersMap:{
            rowGap: isTablet ? 30 : 16
        },
        chargersMapTitleWrapper:{
            rowGap: isTablet ? 30 : 16
        },
        chargersMapTitle:{
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.2,
            color: "#000"
        },
        chargersMapMap:{
            flex: 1,
            height: isTablet ? 340 : 540,
        },
        chargersMapMapWrapper:{
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
        },
        chargersMapInfoWrapper:{
            position: "absolute",
            justifyContent: "center",
            left: isTablet ? 20 : 0,
            right: isTablet ? undefined : 0,
            bottom: isTablet ? undefined : 0,
            zIndex: 10,
            padding: 20,
            borderRadius: 14,
            shadowColor: '#000',
            backgroundColor: "#fff",
            shadowOffset: {width: 7, height: 4},
            shadowOpacity: 0.05,
            shadowRadius: 19,
            elevation: 3,
            maxWidth: isTablet ? 300 : undefined,
            maxHeight: 320,
        },
        chargersMapInfo:{
            rowGap: 22,
        },
        chargersMapInfoHeaderWrapper:{
            rowGap: 4,
        },
        chargersMapInfoHeader:{
            fontFamily: "Onest-Medium",
            fontSize: 24,
            lineHeight: 24 * 1.3,
            color: "#111",
        },
        chargersMapInfoLabel:{
            fontFamily: "Onest-Regular",
            fontSize: 14,
            lineHeight: 14 * 1.2,
            color: "#6B6B6B"
        },
        chargersMapInfoDescriptionWrapper:{
            rowGap: 12,
        },
        chargersMapInfoDescriptionAddress:{
            fontFamily: "Onest-Medium",
            fontSize: 16,
            lineHeight: 16 * 1.4,
            color: "#111",
        },
        chargersMapInfoDescriptionTime:{
            fontFamily: "Onest-Regular",
            fontSize: 14,
            lineHeight: 14 * 1.3,
            color: "#6B6B6B"
        },
    })
}

const mapStyle = [
    {
        "tags": "country",
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#8589ad"
            },
            {
                "zoom": 0,
                "opacity": 0.8
            },
            {
                "zoom": 1,
                "opacity": 0.8
            },
            {
                "zoom": 2,
                "opacity": 0.8
            },
            {
                "zoom": 3,
                "opacity": 0.8
            },
            {
                "zoom": 4,
                "opacity": 0.8
            },
            {
                "zoom": 5,
                "opacity": 1
            },
            {
                "zoom": 6,
                "opacity": 1
            },
            {
                "zoom": 7,
                "opacity": 1
            },
            {
                "zoom": 8,
                "opacity": 1
            },
            {
                "zoom": 9,
                "opacity": 1
            },
            {
                "zoom": 10,
                "opacity": 1
            },
            {
                "zoom": 11,
                "opacity": 1
            },
            {
                "zoom": 12,
                "opacity": 1
            },
            {
                "zoom": 13,
                "opacity": 1
            },
            {
                "zoom": 14,
                "opacity": 1
            },
            {
                "zoom": 15,
                "opacity": 1
            },
            {
                "zoom": 16,
                "opacity": 1
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": "country",
        "elements": "geometry.outline",
        "stylers": [
            {
                "color": "#c4c6d4"
            },
            {
                "zoom": 0,
                "opacity": 0.15
            },
            {
                "zoom": 1,
                "opacity": 0.15
            },
            {
                "zoom": 2,
                "opacity": 0.15
            },
            {
                "zoom": 3,
                "opacity": 0.15
            },
            {
                "zoom": 4,
                "opacity": 0.15
            },
            {
                "zoom": 5,
                "opacity": 0.15
            },
            {
                "zoom": 6,
                "opacity": 0.25
            },
            {
                "zoom": 7,
                "opacity": 0.5
            },
            {
                "zoom": 8,
                "opacity": 0.47
            },
            {
                "zoom": 9,
                "opacity": 0.44
            },
            {
                "zoom": 10,
                "opacity": 0.41
            },
            {
                "zoom": 11,
                "opacity": 0.38
            },
            {
                "zoom": 12,
                "opacity": 0.35
            },
            {
                "zoom": 13,
                "opacity": 0.33
            },
            {
                "zoom": 14,
                "opacity": 0.3
            },
            {
                "zoom": 15,
                "opacity": 0.28
            },
            {
                "zoom": 16,
                "opacity": 0.25
            },
            {
                "zoom": 17,
                "opacity": 0.25
            },
            {
                "zoom": 18,
                "opacity": 0.25
            },
            {
                "zoom": 19,
                "opacity": 0.25
            },
            {
                "zoom": 20,
                "opacity": 0.25
            },
            {
                "zoom": 21,
                "opacity": 0.25
            }
        ]
    },
    {
        "tags": "region",
        "elements": "geometry.fill",
        "stylers": [
            {
                "zoom": 0,
                "color": "#a3a6c2",
                "opacity": 0.5
            },
            {
                "zoom": 1,
                "color": "#a3a6c2",
                "opacity": 0.5
            },
            {
                "zoom": 2,
                "color": "#a3a6c2",
                "opacity": 0.5
            },
            {
                "zoom": 3,
                "color": "#a3a6c2",
                "opacity": 0.5
            },
            {
                "zoom": 4,
                "color": "#a3a6c2",
                "opacity": 0.5
            },
            {
                "zoom": 5,
                "color": "#a3a6c2",
                "opacity": 0.5
            },
            {
                "zoom": 6,
                "color": "#a3a6c2",
                "opacity": 1
            },
            {
                "zoom": 7,
                "color": "#a3a6c2",
                "opacity": 1
            },
            {
                "zoom": 8,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 9,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 10,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 11,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 12,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 13,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 14,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 15,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 16,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 17,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 18,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 19,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 20,
                "color": "#8589ad",
                "opacity": 1
            },
            {
                "zoom": 21,
                "color": "#8589ad",
                "opacity": 1
            }
        ]
    },
    {
        "tags": "region",
        "elements": "geometry.outline",
        "stylers": [
            {
                "color": "#c4c6d4"
            },
            {
                "zoom": 0,
                "opacity": 0.15
            },
            {
                "zoom": 1,
                "opacity": 0.15
            },
            {
                "zoom": 2,
                "opacity": 0.15
            },
            {
                "zoom": 3,
                "opacity": 0.15
            },
            {
                "zoom": 4,
                "opacity": 0.15
            },
            {
                "zoom": 5,
                "opacity": 0.15
            },
            {
                "zoom": 6,
                "opacity": 0.25
            },
            {
                "zoom": 7,
                "opacity": 0.5
            },
            {
                "zoom": 8,
                "opacity": 0.47
            },
            {
                "zoom": 9,
                "opacity": 0.44
            },
            {
                "zoom": 10,
                "opacity": 0.41
            },
            {
                "zoom": 11,
                "opacity": 0.38
            },
            {
                "zoom": 12,
                "opacity": 0.35
            },
            {
                "zoom": 13,
                "opacity": 0.33
            },
            {
                "zoom": 14,
                "opacity": 0.3
            },
            {
                "zoom": 15,
                "opacity": 0.28
            },
            {
                "zoom": 16,
                "opacity": 0.25
            },
            {
                "zoom": 17,
                "opacity": 0.25
            },
            {
                "zoom": 18,
                "opacity": 0.25
            },
            {
                "zoom": 19,
                "opacity": 0.25
            },
            {
                "zoom": 20,
                "opacity": 0.25
            },
            {
                "zoom": 21,
                "opacity": 0.25
            }
        ]
    },
    {
        "tags": {
            "any": "admin",
            "none": [
                "country",
                "region",
                "locality",
                "district",
                "address"
            ]
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#8589ad"
            },
            {
                "zoom": 0,
                "opacity": 0.5
            },
            {
                "zoom": 1,
                "opacity": 0.5
            },
            {
                "zoom": 2,
                "opacity": 0.5
            },
            {
                "zoom": 3,
                "opacity": 0.5
            },
            {
                "zoom": 4,
                "opacity": 0.5
            },
            {
                "zoom": 5,
                "opacity": 0.5
            },
            {
                "zoom": 6,
                "opacity": 1
            },
            {
                "zoom": 7,
                "opacity": 1
            },
            {
                "zoom": 8,
                "opacity": 1
            },
            {
                "zoom": 9,
                "opacity": 1
            },
            {
                "zoom": 10,
                "opacity": 1
            },
            {
                "zoom": 11,
                "opacity": 1
            },
            {
                "zoom": 12,
                "opacity": 1
            },
            {
                "zoom": 13,
                "opacity": 1
            },
            {
                "zoom": 14,
                "opacity": 1
            },
            {
                "zoom": 15,
                "opacity": 1
            },
            {
                "zoom": 16,
                "opacity": 1
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": {
            "any": "admin",
            "none": [
                "country",
                "region",
                "locality",
                "district",
                "address"
            ]
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "color": "#c4c6d4"
            },
            {
                "zoom": 0,
                "opacity": 0.15
            },
            {
                "zoom": 1,
                "opacity": 0.15
            },
            {
                "zoom": 2,
                "opacity": 0.15
            },
            {
                "zoom": 3,
                "opacity": 0.15
            },
            {
                "zoom": 4,
                "opacity": 0.15
            },
            {
                "zoom": 5,
                "opacity": 0.15
            },
            {
                "zoom": 6,
                "opacity": 0.25
            },
            {
                "zoom": 7,
                "opacity": 0.5
            },
            {
                "zoom": 8,
                "opacity": 0.47
            },
            {
                "zoom": 9,
                "opacity": 0.44
            },
            {
                "zoom": 10,
                "opacity": 0.41
            },
            {
                "zoom": 11,
                "opacity": 0.38
            },
            {
                "zoom": 12,
                "opacity": 0.35
            },
            {
                "zoom": 13,
                "opacity": 0.33
            },
            {
                "zoom": 14,
                "opacity": 0.3
            },
            {
                "zoom": 15,
                "opacity": 0.28
            },
            {
                "zoom": 16,
                "opacity": 0.25
            },
            {
                "zoom": 17,
                "opacity": 0.25
            },
            {
                "zoom": 18,
                "opacity": 0.25
            },
            {
                "zoom": 19,
                "opacity": 0.25
            },
            {
                "zoom": 20,
                "opacity": 0.25
            },
            {
                "zoom": 21,
                "opacity": 0.25
            }
        ]
    },
    {
        "tags": {
            "any": "landcover",
            "none": "vegetation"
        },
        "stylers": [
            {
                "hue": "#d9dae3"
            }
        ]
    },
    {
        "tags": "vegetation",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#bcbdcd",
                "opacity": 0.1
            },
            {
                "zoom": 1,
                "color": "#bcbdcd",
                "opacity": 0.1
            },
            {
                "zoom": 2,
                "color": "#bcbdcd",
                "opacity": 0.1
            },
            {
                "zoom": 3,
                "color": "#bcbdcd",
                "opacity": 0.1
            },
            {
                "zoom": 4,
                "color": "#bcbdcd",
                "opacity": 0.1
            },
            {
                "zoom": 5,
                "color": "#bcbdcd",
                "opacity": 0.1
            },
            {
                "zoom": 6,
                "color": "#bcbdcd",
                "opacity": 0.2
            },
            {
                "zoom": 7,
                "color": "#d9dae3",
                "opacity": 0.3
            },
            {
                "zoom": 8,
                "color": "#d9dae3",
                "opacity": 0.4
            },
            {
                "zoom": 9,
                "color": "#d9dae3",
                "opacity": 0.6
            },
            {
                "zoom": 10,
                "color": "#d9dae3",
                "opacity": 0.8
            },
            {
                "zoom": 11,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 12,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 13,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 14,
                "color": "#dfdfe7",
                "opacity": 1
            },
            {
                "zoom": 15,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 16,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 17,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 18,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 19,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 20,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 21,
                "color": "#e5e5eb",
                "opacity": 1
            }
        ]
    },
    {
        "tags": "park",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 1,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 2,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 3,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 4,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 5,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 6,
                "color": "#d9dae3",
                "opacity": 0.2
            },
            {
                "zoom": 7,
                "color": "#d9dae3",
                "opacity": 0.3
            },
            {
                "zoom": 8,
                "color": "#d9dae3",
                "opacity": 0.4
            },
            {
                "zoom": 9,
                "color": "#d9dae3",
                "opacity": 0.6
            },
            {
                "zoom": 10,
                "color": "#d9dae3",
                "opacity": 0.8
            },
            {
                "zoom": 11,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 12,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 13,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 14,
                "color": "#dfdfe7",
                "opacity": 1
            },
            {
                "zoom": 15,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 16,
                "color": "#e5e5eb",
                "opacity": 0.9
            },
            {
                "zoom": 17,
                "color": "#e5e5eb",
                "opacity": 0.8
            },
            {
                "zoom": 18,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 19,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 20,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 21,
                "color": "#e5e5eb",
                "opacity": 0.7
            }
        ]
    },
    {
        "tags": "national_park",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 1,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 2,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 3,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 4,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 5,
                "color": "#d9dae3",
                "opacity": 0.1
            },
            {
                "zoom": 6,
                "color": "#d9dae3",
                "opacity": 0.2
            },
            {
                "zoom": 7,
                "color": "#d9dae3",
                "opacity": 0.3
            },
            {
                "zoom": 8,
                "color": "#d9dae3",
                "opacity": 0.4
            },
            {
                "zoom": 9,
                "color": "#d9dae3",
                "opacity": 0.6
            },
            {
                "zoom": 10,
                "color": "#d9dae3",
                "opacity": 0.8
            },
            {
                "zoom": 11,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 12,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 13,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 14,
                "color": "#dfdfe7",
                "opacity": 1
            },
            {
                "zoom": 15,
                "color": "#e5e5eb",
                "opacity": 1
            },
            {
                "zoom": 16,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 17,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 18,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 19,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 20,
                "color": "#e5e5eb",
                "opacity": 0.7
            },
            {
                "zoom": 21,
                "color": "#e5e5eb",
                "opacity": 0.7
            }
        ]
    },
    {
        "tags": "cemetery",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#d9dae3"
            },
            {
                "zoom": 1,
                "color": "#d9dae3"
            },
            {
                "zoom": 2,
                "color": "#d9dae3"
            },
            {
                "zoom": 3,
                "color": "#d9dae3"
            },
            {
                "zoom": 4,
                "color": "#d9dae3"
            },
            {
                "zoom": 5,
                "color": "#d9dae3"
            },
            {
                "zoom": 6,
                "color": "#d9dae3"
            },
            {
                "zoom": 7,
                "color": "#d9dae3"
            },
            {
                "zoom": 8,
                "color": "#d9dae3"
            },
            {
                "zoom": 9,
                "color": "#d9dae3"
            },
            {
                "zoom": 10,
                "color": "#d9dae3"
            },
            {
                "zoom": 11,
                "color": "#d9dae3"
            },
            {
                "zoom": 12,
                "color": "#d9dae3"
            },
            {
                "zoom": 13,
                "color": "#d9dae3"
            },
            {
                "zoom": 14,
                "color": "#dfdfe7"
            },
            {
                "zoom": 15,
                "color": "#e5e5eb"
            },
            {
                "zoom": 16,
                "color": "#e5e5eb"
            },
            {
                "zoom": 17,
                "color": "#e5e5eb"
            },
            {
                "zoom": 18,
                "color": "#e5e5eb"
            },
            {
                "zoom": 19,
                "color": "#e5e5eb"
            },
            {
                "zoom": 20,
                "color": "#e5e5eb"
            },
            {
                "zoom": 21,
                "color": "#e5e5eb"
            }
        ]
    },
    {
        "tags": "sports_ground",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 1,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 2,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 3,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 4,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 5,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 6,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 7,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 8,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 9,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 10,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 11,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 12,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 13,
                "color": "#caccd8",
                "opacity": 0
            },
            {
                "zoom": 14,
                "color": "#d0d2dc",
                "opacity": 0
            },
            {
                "zoom": 15,
                "color": "#d6d8e1",
                "opacity": 0.5
            },
            {
                "zoom": 16,
                "color": "#d7d9e2",
                "opacity": 1
            },
            {
                "zoom": 17,
                "color": "#d8dae2",
                "opacity": 1
            },
            {
                "zoom": 18,
                "color": "#d9dae3",
                "opacity": 1
            },
            {
                "zoom": 19,
                "color": "#dadbe4",
                "opacity": 1
            },
            {
                "zoom": 20,
                "color": "#dbdce4",
                "opacity": 1
            },
            {
                "zoom": 21,
                "color": "#dcdde5",
                "opacity": 1
            }
        ]
    },
    {
        "tags": "terrain",
        "elements": "geometry",
        "stylers": [
            {
                "hue": "#e8e8ee"
            },
            {
                "zoom": 0,
                "opacity": 0.3
            },
            {
                "zoom": 1,
                "opacity": 0.3
            },
            {
                "zoom": 2,
                "opacity": 0.3
            },
            {
                "zoom": 3,
                "opacity": 0.3
            },
            {
                "zoom": 4,
                "opacity": 0.3
            },
            {
                "zoom": 5,
                "opacity": 0.35
            },
            {
                "zoom": 6,
                "opacity": 0.4
            },
            {
                "zoom": 7,
                "opacity": 0.6
            },
            {
                "zoom": 8,
                "opacity": 0.8
            },
            {
                "zoom": 9,
                "opacity": 0.9
            },
            {
                "zoom": 10,
                "opacity": 1
            },
            {
                "zoom": 11,
                "opacity": 1
            },
            {
                "zoom": 12,
                "opacity": 1
            },
            {
                "zoom": 13,
                "opacity": 1
            },
            {
                "zoom": 14,
                "opacity": 1
            },
            {
                "zoom": 15,
                "opacity": 1
            },
            {
                "zoom": 16,
                "opacity": 1
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": "geographic_line",
        "elements": "geometry",
        "stylers": [
            {
                "color": "#727297"
            }
        ]
    },
    {
        "tags": "land",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e8e8ed"
            },
            {
                "zoom": 1,
                "color": "#e8e8ed"
            },
            {
                "zoom": 2,
                "color": "#e8e8ed"
            },
            {
                "zoom": 3,
                "color": "#e8e8ed"
            },
            {
                "zoom": 4,
                "color": "#e8e8ed"
            },
            {
                "zoom": 5,
                "color": "#ebebef"
            },
            {
                "zoom": 6,
                "color": "#ededf1"
            },
            {
                "zoom": 7,
                "color": "#f0f0f4"
            },
            {
                "zoom": 8,
                "color": "#f3f3f6"
            },
            {
                "zoom": 9,
                "color": "#f3f3f6"
            },
            {
                "zoom": 10,
                "color": "#f3f3f6"
            },
            {
                "zoom": 11,
                "color": "#f3f3f6"
            },
            {
                "zoom": 12,
                "color": "#f3f3f6"
            },
            {
                "zoom": 13,
                "color": "#f3f3f6"
            },
            {
                "zoom": 14,
                "color": "#f6f6f8"
            },
            {
                "zoom": 15,
                "color": "#f9f9fb"
            },
            {
                "zoom": 16,
                "color": "#f9f9fb"
            },
            {
                "zoom": 17,
                "color": "#fafafc"
            },
            {
                "zoom": 18,
                "color": "#fafafc"
            },
            {
                "zoom": 19,
                "color": "#fbfbfc"
            },
            {
                "zoom": 20,
                "color": "#fbfbfd"
            },
            {
                "zoom": 21,
                "color": "#fcfcfd"
            }
        ]
    },
    {
        "tags": "residential",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 1,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 2,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 3,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 4,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 5,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 6,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 7,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 8,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 9,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 10,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 11,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 12,
                "color": "#e8e8ee",
                "opacity": 0.5
            },
            {
                "zoom": 13,
                "color": "#e8e8ee",
                "opacity": 1
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "opacity": 1
            },
            {
                "zoom": 15,
                "color": "#f3f3f6",
                "opacity": 1
            },
            {
                "zoom": 16,
                "color": "#f4f4f7",
                "opacity": 1
            },
            {
                "zoom": 17,
                "color": "#f5f5f8",
                "opacity": 1
            },
            {
                "zoom": 18,
                "color": "#f6f6f8",
                "opacity": 1
            },
            {
                "zoom": 19,
                "color": "#f7f7f9",
                "opacity": 1
            },
            {
                "zoom": 20,
                "color": "#f8f8fa",
                "opacity": 1
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "opacity": 1
            }
        ]
    },
    {
        "tags": "locality",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e8e8ee"
            },
            {
                "zoom": 1,
                "color": "#e8e8ee"
            },
            {
                "zoom": 2,
                "color": "#e8e8ee"
            },
            {
                "zoom": 3,
                "color": "#e8e8ee"
            },
            {
                "zoom": 4,
                "color": "#e8e8ee"
            },
            {
                "zoom": 5,
                "color": "#e8e8ee"
            },
            {
                "zoom": 6,
                "color": "#e8e8ee"
            },
            {
                "zoom": 7,
                "color": "#e8e8ee"
            },
            {
                "zoom": 8,
                "color": "#e8e8ee"
            },
            {
                "zoom": 9,
                "color": "#e8e8ee"
            },
            {
                "zoom": 10,
                "color": "#e8e8ee"
            },
            {
                "zoom": 11,
                "color": "#e8e8ee"
            },
            {
                "zoom": 12,
                "color": "#e8e8ee"
            },
            {
                "zoom": 13,
                "color": "#e8e8ee"
            },
            {
                "zoom": 14,
                "color": "#ededf2"
            },
            {
                "zoom": 15,
                "color": "#f3f3f6"
            },
            {
                "zoom": 16,
                "color": "#f4f4f7"
            },
            {
                "zoom": 17,
                "color": "#f5f5f8"
            },
            {
                "zoom": 18,
                "color": "#f6f6f8"
            },
            {
                "zoom": 19,
                "color": "#f7f7f9"
            },
            {
                "zoom": 20,
                "color": "#f8f8fa"
            },
            {
                "zoom": 21,
                "color": "#f9f9fb"
            }
        ]
    },
    {
        "tags": {
            "any": "structure",
            "none": [
                "building",
                "fence"
            ]
        },
        "elements": "geometry",
        "stylers": [
            {
                "opacity": 0.9
            },
            {
                "zoom": 0,
                "color": "#e8e8ee"
            },
            {
                "zoom": 1,
                "color": "#e8e8ee"
            },
            {
                "zoom": 2,
                "color": "#e8e8ee"
            },
            {
                "zoom": 3,
                "color": "#e8e8ee"
            },
            {
                "zoom": 4,
                "color": "#e8e8ee"
            },
            {
                "zoom": 5,
                "color": "#e8e8ee"
            },
            {
                "zoom": 6,
                "color": "#e8e8ee"
            },
            {
                "zoom": 7,
                "color": "#e8e8ee"
            },
            {
                "zoom": 8,
                "color": "#e8e8ee"
            },
            {
                "zoom": 9,
                "color": "#e8e8ee"
            },
            {
                "zoom": 10,
                "color": "#e8e8ee"
            },
            {
                "zoom": 11,
                "color": "#e8e8ee"
            },
            {
                "zoom": 12,
                "color": "#e8e8ee"
            },
            {
                "zoom": 13,
                "color": "#e8e8ee"
            },
            {
                "zoom": 14,
                "color": "#ededf2"
            },
            {
                "zoom": 15,
                "color": "#f3f3f6"
            },
            {
                "zoom": 16,
                "color": "#f4f4f7"
            },
            {
                "zoom": 17,
                "color": "#f5f5f8"
            },
            {
                "zoom": 18,
                "color": "#f6f6f8"
            },
            {
                "zoom": 19,
                "color": "#f7f7f9"
            },
            {
                "zoom": 20,
                "color": "#f8f8fa"
            },
            {
                "zoom": 21,
                "color": "#f9f9fb"
            }
        ]
    },
    {
        "tags": "building",
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#dcdde5"
            },
            {
                "zoom": 0,
                "opacity": 0.7
            },
            {
                "zoom": 1,
                "opacity": 0.7
            },
            {
                "zoom": 2,
                "opacity": 0.7
            },
            {
                "zoom": 3,
                "opacity": 0.7
            },
            {
                "zoom": 4,
                "opacity": 0.7
            },
            {
                "zoom": 5,
                "opacity": 0.7
            },
            {
                "zoom": 6,
                "opacity": 0.7
            },
            {
                "zoom": 7,
                "opacity": 0.7
            },
            {
                "zoom": 8,
                "opacity": 0.7
            },
            {
                "zoom": 9,
                "opacity": 0.7
            },
            {
                "zoom": 10,
                "opacity": 0.7
            },
            {
                "zoom": 11,
                "opacity": 0.7
            },
            {
                "zoom": 12,
                "opacity": 0.7
            },
            {
                "zoom": 13,
                "opacity": 0.7
            },
            {
                "zoom": 14,
                "opacity": 0.7
            },
            {
                "zoom": 15,
                "opacity": 0.7
            },
            {
                "zoom": 16,
                "opacity": 0.9
            },
            {
                "zoom": 17,
                "opacity": 0.6
            },
            {
                "zoom": 18,
                "opacity": 0.6
            },
            {
                "zoom": 19,
                "opacity": 0.6
            },
            {
                "zoom": 20,
                "opacity": 0.6
            },
            {
                "zoom": 21,
                "opacity": 0.6
            }
        ]
    },
    {
        "tags": "building",
        "elements": "geometry.outline",
        "stylers": [
            {
                "color": "#c4c7d4"
            },
            {
                "zoom": 0,
                "opacity": 0.5
            },
            {
                "zoom": 1,
                "opacity": 0.5
            },
            {
                "zoom": 2,
                "opacity": 0.5
            },
            {
                "zoom": 3,
                "opacity": 0.5
            },
            {
                "zoom": 4,
                "opacity": 0.5
            },
            {
                "zoom": 5,
                "opacity": 0.5
            },
            {
                "zoom": 6,
                "opacity": 0.5
            },
            {
                "zoom": 7,
                "opacity": 0.5
            },
            {
                "zoom": 8,
                "opacity": 0.5
            },
            {
                "zoom": 9,
                "opacity": 0.5
            },
            {
                "zoom": 10,
                "opacity": 0.5
            },
            {
                "zoom": 11,
                "opacity": 0.5
            },
            {
                "zoom": 12,
                "opacity": 0.5
            },
            {
                "zoom": 13,
                "opacity": 0.5
            },
            {
                "zoom": 14,
                "opacity": 0.5
            },
            {
                "zoom": 15,
                "opacity": 0.5
            },
            {
                "zoom": 16,
                "opacity": 0.5
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": {
            "any": "urban_area",
            "none": [
                "residential",
                "industrial",
                "cemetery",
                "park",
                "medical",
                "sports_ground",
                "beach",
                "construction_site"
            ]
        },
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 1,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 2,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 3,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 4,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 5,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 6,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 7,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 8,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 9,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 10,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 11,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 12,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 13,
                "color": "#dcdce5",
                "opacity": 1
            },
            {
                "zoom": 14,
                "color": "#e3e3ea",
                "opacity": 1
            },
            {
                "zoom": 15,
                "color": "#eaeaf0",
                "opacity": 1
            },
            {
                "zoom": 16,
                "color": "#f1f1f5",
                "opacity": 0.67
            },
            {
                "zoom": 17,
                "color": "#f9f9fb",
                "opacity": 0.33
            },
            {
                "zoom": 18,
                "color": "#f9f9fb",
                "opacity": 0
            },
            {
                "zoom": 19,
                "color": "#f9f9fb",
                "opacity": 0
            },
            {
                "zoom": 20,
                "color": "#f9f9fb",
                "opacity": 0
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "opacity": 0
            }
        ]
    },
    {
        "tags": "poi",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "poi",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "poi",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "outdoor",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "outdoor",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "outdoor",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "park",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "park",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "park",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "cemetery",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "cemetery",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "cemetery",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "beach",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "beach",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "beach",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "medical",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "medical",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "medical",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "shopping",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "shopping",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "shopping",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "commercial_services",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "commercial_services",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "commercial_services",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "food_and_drink",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "food_and_drink",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#414458"
            }
        ]
    },
    {
        "tags": "food_and_drink",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "road",
        "elements": "label.icon",
        "types": "point",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "tertiary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "road",
        "elements": "label.text.fill",
        "types": "point",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "tags": "entrance",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            },
            {
                "hue": "#303241"
            }
        ]
    },
    {
        "tags": "locality",
        "elements": "label.icon",
        "stylers": [
            {
                "color": "#303241"
            },
            {
                "secondary-color": "#ffffff"
            }
        ]
    },
    {
        "tags": "country",
        "elements": "label.text.fill",
        "stylers": [
            {
                "opacity": 0.8
            },
            {
                "color": "#626684"
            }
        ]
    },
    {
        "tags": "country",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "region",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#626684"
            },
            {
                "opacity": 0.8
            }
        ]
    },
    {
        "tags": "region",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "district",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#626684"
            },
            {
                "opacity": 0.8
            }
        ]
    },
    {
        "tags": "district",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": {
            "any": "admin",
            "none": [
                "country",
                "region",
                "locality",
                "district",
                "address"
            ]
        },
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#626684"
            }
        ]
    },
    {
        "tags": {
            "any": "admin",
            "none": [
                "country",
                "region",
                "locality",
                "district",
                "address"
            ]
        },
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "locality",
        "elements": "label.text.fill",
        "stylers": [
            {
                "zoom": 0,
                "color": "#414458"
            },
            {
                "zoom": 1,
                "color": "#414458"
            },
            {
                "zoom": 2,
                "color": "#414458"
            },
            {
                "zoom": 3,
                "color": "#414458"
            },
            {
                "zoom": 4,
                "color": "#414458"
            },
            {
                "zoom": 5,
                "color": "#3f4256"
            },
            {
                "zoom": 6,
                "color": "#3d4053"
            },
            {
                "zoom": 7,
                "color": "#3c3f51"
            },
            {
                "zoom": 8,
                "color": "#3a3d4e"
            },
            {
                "zoom": 9,
                "color": "#383b4c"
            },
            {
                "zoom": 10,
                "color": "#363949"
            },
            {
                "zoom": 11,
                "color": "#363949"
            },
            {
                "zoom": 12,
                "color": "#363949"
            },
            {
                "zoom": 13,
                "color": "#363949"
            },
            {
                "zoom": 14,
                "color": "#363949"
            },
            {
                "zoom": 15,
                "color": "#363949"
            },
            {
                "zoom": 16,
                "color": "#363949"
            },
            {
                "zoom": 17,
                "color": "#363949"
            },
            {
                "zoom": 18,
                "color": "#363949"
            },
            {
                "zoom": 19,
                "color": "#363949"
            },
            {
                "zoom": 20,
                "color": "#363949"
            },
            {
                "zoom": 21,
                "color": "#363949"
            }
        ]
    },
    {
        "tags": "locality",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "road",
        "elements": "label.text.fill",
        "types": "polyline",
        "stylers": [
            {
                "color": "#4c4f67"
            }
        ]
    },
    {
        "tags": "road",
        "elements": "label.text.outline",
        "types": "polyline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "road",
        "elements": "geometry.fill.pattern",
        "types": "polyline",
        "stylers": [
            {
                "scale": 1
            },
            {
                "color": "#7b7f9d"
            }
        ]
    },
    {
        "tags": "road",
        "elements": "label.text.fill",
        "types": "point",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "tags": "structure",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#575775"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "structure",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "address",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#575775"
            },
            {
                "zoom": 0,
                "opacity": 0.9
            },
            {
                "zoom": 1,
                "opacity": 0.9
            },
            {
                "zoom": 2,
                "opacity": 0.9
            },
            {
                "zoom": 3,
                "opacity": 0.9
            },
            {
                "zoom": 4,
                "opacity": 0.9
            },
            {
                "zoom": 5,
                "opacity": 0.9
            },
            {
                "zoom": 6,
                "opacity": 0.9
            },
            {
                "zoom": 7,
                "opacity": 0.9
            },
            {
                "zoom": 8,
                "opacity": 0.9
            },
            {
                "zoom": 9,
                "opacity": 0.9
            },
            {
                "zoom": 10,
                "opacity": 0.9
            },
            {
                "zoom": 11,
                "opacity": 0.9
            },
            {
                "zoom": 12,
                "opacity": 0.9
            },
            {
                "zoom": 13,
                "opacity": 0.9
            },
            {
                "zoom": 14,
                "opacity": 0.9
            },
            {
                "zoom": 15,
                "opacity": 0.9
            },
            {
                "zoom": 16,
                "opacity": 0.9
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": "address",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "landscape",
        "elements": "label.text.fill",
        "stylers": [
            {
                "zoom": 0,
                "color": "#626684",
                "opacity": 1
            },
            {
                "zoom": 1,
                "color": "#626684",
                "opacity": 1
            },
            {
                "zoom": 2,
                "color": "#626684",
                "opacity": 1
            },
            {
                "zoom": 3,
                "color": "#626684",
                "opacity": 1
            },
            {
                "zoom": 4,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 5,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 6,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 7,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 8,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 9,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 10,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 11,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 12,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 13,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 14,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 15,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 16,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 17,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 18,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 19,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 20,
                "color": "#575775",
                "opacity": 0.5
            },
            {
                "zoom": 21,
                "color": "#575775",
                "opacity": 0.5
            }
        ]
    },
    {
        "tags": "landscape",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "opacity": 0.5
            },
            {
                "zoom": 1,
                "opacity": 0.5
            },
            {
                "zoom": 2,
                "opacity": 0.5
            },
            {
                "zoom": 3,
                "opacity": 0.5
            },
            {
                "zoom": 4,
                "opacity": 0
            },
            {
                "zoom": 5,
                "opacity": 0
            },
            {
                "zoom": 6,
                "opacity": 0
            },
            {
                "zoom": 7,
                "opacity": 0
            },
            {
                "zoom": 8,
                "opacity": 0
            },
            {
                "zoom": 9,
                "opacity": 0
            },
            {
                "zoom": 10,
                "opacity": 0
            },
            {
                "zoom": 11,
                "opacity": 0
            },
            {
                "zoom": 12,
                "opacity": 0
            },
            {
                "zoom": 13,
                "opacity": 0
            },
            {
                "zoom": 14,
                "opacity": 0
            },
            {
                "zoom": 15,
                "opacity": 0
            },
            {
                "zoom": 16,
                "opacity": 0
            },
            {
                "zoom": 17,
                "opacity": 0
            },
            {
                "zoom": 18,
                "opacity": 0
            },
            {
                "zoom": 19,
                "opacity": 0
            },
            {
                "zoom": 20,
                "opacity": 0
            },
            {
                "zoom": 21,
                "opacity": 0
            }
        ]
    },
    {
        "tags": "water",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#6f7495"
            },
            {
                "opacity": 0.8
            }
        ]
    },
    {
        "tags": "water",
        "elements": "label.text.outline",
        "types": "polyline",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "opacity": 0.2
            }
        ]
    },
    {
        "tags": {
            "any": "road_1",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 2.97
            },
            {
                "zoom": 7,
                "scale": 3.19
            },
            {
                "zoom": 8,
                "scale": 3.53
            },
            {
                "zoom": 9,
                "scale": 4
            },
            {
                "zoom": 10,
                "scale": 3.61
            },
            {
                "zoom": 11,
                "scale": 3.06
            },
            {
                "zoom": 12,
                "scale": 2.64
            },
            {
                "zoom": 13,
                "scale": 2.27
            },
            {
                "zoom": 14,
                "scale": 2.03
            },
            {
                "zoom": 15,
                "scale": 1.9
            },
            {
                "zoom": 16,
                "scale": 1.86
            },
            {
                "zoom": 17,
                "scale": 1.48
            },
            {
                "zoom": 18,
                "scale": 1.21
            },
            {
                "zoom": 19,
                "scale": 1.04
            },
            {
                "zoom": 20,
                "scale": 0.94
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_1"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 1,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 2,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 3,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 4,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 5,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 6,
                "color": "#00000000",
                "scale": 3.05
            },
            {
                "zoom": 7,
                "color": "#00000000",
                "scale": 3.05
            },
            {
                "zoom": 8,
                "color": "#e2e2e9",
                "scale": 3.15
            },
            {
                "zoom": 9,
                "color": "#e8e8ee",
                "scale": 3.37
            },
            {
                "zoom": 10,
                "color": "#e8e8ee",
                "scale": 3.36
            },
            {
                "zoom": 11,
                "color": "#e8e8ee",
                "scale": 3.17
            },
            {
                "zoom": 12,
                "color": "#e8e8ee",
                "scale": 3
            },
            {
                "zoom": 13,
                "color": "#e8e8ee",
                "scale": 2.8
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 2.66
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 2.61
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 2.64
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 2.14
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.79
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.55
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.41
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.35
            }
        ]
    },
    {
        "tags": {
            "any": "road_2",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 2.97
            },
            {
                "zoom": 7,
                "scale": 3.19
            },
            {
                "zoom": 8,
                "scale": 3.53
            },
            {
                "zoom": 9,
                "scale": 4
            },
            {
                "zoom": 10,
                "scale": 3.61
            },
            {
                "zoom": 11,
                "scale": 3.06
            },
            {
                "zoom": 12,
                "scale": 2.64
            },
            {
                "zoom": 13,
                "scale": 2.27
            },
            {
                "zoom": 14,
                "scale": 2.03
            },
            {
                "zoom": 15,
                "scale": 1.9
            },
            {
                "zoom": 16,
                "scale": 1.86
            },
            {
                "zoom": 17,
                "scale": 1.48
            },
            {
                "zoom": 18,
                "scale": 1.21
            },
            {
                "zoom": 19,
                "scale": 1.04
            },
            {
                "zoom": 20,
                "scale": 0.94
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_2"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 1,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 2,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 3,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 4,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 5,
                "color": "#00000000",
                "scale": 1.4
            },
            {
                "zoom": 6,
                "color": "#00000000",
                "scale": 3.05
            },
            {
                "zoom": 7,
                "color": "#00000000",
                "scale": 3.05
            },
            {
                "zoom": 8,
                "color": "#e2e2e9",
                "scale": 3.15
            },
            {
                "zoom": 9,
                "color": "#e8e8ee",
                "scale": 3.37
            },
            {
                "zoom": 10,
                "color": "#e8e8ee",
                "scale": 3.36
            },
            {
                "zoom": 11,
                "color": "#e8e8ee",
                "scale": 3.17
            },
            {
                "zoom": 12,
                "color": "#e8e8ee",
                "scale": 3
            },
            {
                "zoom": 13,
                "color": "#e8e8ee",
                "scale": 2.8
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 2.66
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 2.61
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 2.64
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 2.14
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.79
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.55
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.41
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.35
            }
        ]
    },
    {
        "tags": {
            "any": "road_3",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 2.51
            },
            {
                "zoom": 10,
                "scale": 2.62
            },
            {
                "zoom": 11,
                "scale": 1.68
            },
            {
                "zoom": 12,
                "scale": 1.67
            },
            {
                "zoom": 13,
                "scale": 1.38
            },
            {
                "zoom": 14,
                "scale": 1.19
            },
            {
                "zoom": 15,
                "scale": 1.08
            },
            {
                "zoom": 16,
                "scale": 1.04
            },
            {
                "zoom": 17,
                "scale": 0.91
            },
            {
                "zoom": 18,
                "scale": 0.84
            },
            {
                "zoom": 19,
                "scale": 0.82
            },
            {
                "zoom": 20,
                "scale": 0.84
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_3"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 1.6
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 1.29
            },
            {
                "zoom": 9,
                "color": "#e8e8ee",
                "scale": 4.21
            },
            {
                "zoom": 10,
                "color": "#e8e8ee",
                "scale": 2.74
            },
            {
                "zoom": 11,
                "color": "#e8e8ee",
                "scale": 2.04
            },
            {
                "zoom": 12,
                "color": "#e8e8ee",
                "scale": 2.13
            },
            {
                "zoom": 13,
                "color": "#e8e8ee",
                "scale": 1.88
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 1.7
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 1.59
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 1.55
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 1.37
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.27
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.23
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.26
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.35
            }
        ]
    },
    {
        "tags": {
            "any": "road_4",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 0
            },
            {
                "zoom": 10,
                "scale": 1.69
            },
            {
                "zoom": 11,
                "scale": 1.26
            },
            {
                "zoom": 12,
                "scale": 1.41
            },
            {
                "zoom": 13,
                "scale": 1.19
            },
            {
                "zoom": 14,
                "scale": 1.04
            },
            {
                "zoom": 15,
                "scale": 0.97
            },
            {
                "zoom": 16,
                "scale": 1.15
            },
            {
                "zoom": 17,
                "scale": 0.99
            },
            {
                "zoom": 18,
                "scale": 0.89
            },
            {
                "zoom": 19,
                "scale": 0.85
            },
            {
                "zoom": 20,
                "scale": 0.85
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_4"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 9,
                "color": "#ffffff",
                "scale": 1.12
            },
            {
                "zoom": 10,
                "color": "#e8e8ee",
                "scale": 1.9
            },
            {
                "zoom": 11,
                "color": "#e8e8ee",
                "scale": 1.62
            },
            {
                "zoom": 12,
                "color": "#e8e8ee",
                "scale": 1.83
            },
            {
                "zoom": 13,
                "color": "#e8e8ee",
                "scale": 1.64
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 1.51
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 1.44
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 1.69
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 1.47
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.34
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.28
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.28
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.34
            }
        ]
    },
    {
        "tags": {
            "any": "road_5",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 0
            },
            {
                "zoom": 10,
                "scale": 0
            },
            {
                "zoom": 11,
                "scale": 0
            },
            {
                "zoom": 12,
                "scale": 1.25
            },
            {
                "zoom": 13,
                "scale": 0.95
            },
            {
                "zoom": 14,
                "scale": 0.81
            },
            {
                "zoom": 15,
                "scale": 0.95
            },
            {
                "zoom": 16,
                "scale": 1.1
            },
            {
                "zoom": 17,
                "scale": 0.93
            },
            {
                "zoom": 18,
                "scale": 0.85
            },
            {
                "zoom": 19,
                "scale": 0.82
            },
            {
                "zoom": 20,
                "scale": 0.84
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_5"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 9,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 10,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 11,
                "color": "#ffffff",
                "scale": 0.62
            },
            {
                "zoom": 12,
                "color": "#e8e8ee",
                "scale": 1.61
            },
            {
                "zoom": 13,
                "color": "#e8e8ee",
                "scale": 1.36
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 1.22
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 1.41
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 1.63
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 1.4
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.27
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.23
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.25
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.34
            }
        ]
    },
    {
        "tags": {
            "any": "road_6",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 0
            },
            {
                "zoom": 10,
                "scale": 0
            },
            {
                "zoom": 11,
                "scale": 0
            },
            {
                "zoom": 12,
                "scale": 0
            },
            {
                "zoom": 13,
                "scale": 2.25
            },
            {
                "zoom": 14,
                "scale": 1.27
            },
            {
                "zoom": 15,
                "scale": 1.25
            },
            {
                "zoom": 16,
                "scale": 1.31
            },
            {
                "zoom": 17,
                "scale": 1.04
            },
            {
                "zoom": 18,
                "scale": 0.9
            },
            {
                "zoom": 19,
                "scale": 0.85
            },
            {
                "zoom": 20,
                "scale": 0.85
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_6"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 9,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 10,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 11,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 12,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 13,
                "color": "#e8e8ee",
                "scale": 2.31
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 1.7
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 1.76
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 1.89
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 1.55
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.36
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.27
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.27
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.34
            }
        ]
    },
    {
        "tags": {
            "any": "road_7",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 0
            },
            {
                "zoom": 10,
                "scale": 0
            },
            {
                "zoom": 11,
                "scale": 0
            },
            {
                "zoom": 12,
                "scale": 0
            },
            {
                "zoom": 13,
                "scale": 0
            },
            {
                "zoom": 14,
                "scale": 0.9
            },
            {
                "zoom": 15,
                "scale": 0.78
            },
            {
                "zoom": 16,
                "scale": 0.88
            },
            {
                "zoom": 17,
                "scale": 0.8
            },
            {
                "zoom": 18,
                "scale": 0.78
            },
            {
                "zoom": 19,
                "scale": 0.79
            },
            {
                "zoom": 20,
                "scale": 0.83
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_7"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 9,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 10,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 11,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 12,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 13,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 1.31
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 1.19
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 1.31
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 1.21
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.17
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.18
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.23
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.33
            }
        ]
    },
    {
        "tags": {
            "any": "road_minor",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 0
            },
            {
                "zoom": 10,
                "scale": 0
            },
            {
                "zoom": 11,
                "scale": 0
            },
            {
                "zoom": 12,
                "scale": 0
            },
            {
                "zoom": 13,
                "scale": 0
            },
            {
                "zoom": 14,
                "scale": 0
            },
            {
                "zoom": 15,
                "scale": 0
            },
            {
                "zoom": 16,
                "scale": 0.9
            },
            {
                "zoom": 17,
                "scale": 0.9
            },
            {
                "zoom": 18,
                "scale": 0.9
            },
            {
                "zoom": 19,
                "scale": 0.9
            },
            {
                "zoom": 20,
                "scale": 0.9
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_minor"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 9,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 10,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 11,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 12,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 13,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 0.4
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 0.4
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 1.4
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 1.27
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.27
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.29
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.31
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.32
            }
        ]
    },
    {
        "tags": {
            "any": "road_unclassified",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 0
            },
            {
                "zoom": 10,
                "scale": 0
            },
            {
                "zoom": 11,
                "scale": 0
            },
            {
                "zoom": 12,
                "scale": 0
            },
            {
                "zoom": 13,
                "scale": 0
            },
            {
                "zoom": 14,
                "scale": 0
            },
            {
                "zoom": 15,
                "scale": 0
            },
            {
                "zoom": 16,
                "scale": 0.9
            },
            {
                "zoom": 17,
                "scale": 0.9
            },
            {
                "zoom": 18,
                "scale": 0.9
            },
            {
                "zoom": 19,
                "scale": 0.9
            },
            {
                "zoom": 20,
                "scale": 0.9
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": {
            "any": "road_unclassified"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 9,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 10,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 11,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 12,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 13,
                "color": "#ffffff",
                "scale": 0.4
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 0.4
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 0.4
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 1.4
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 1.27
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 1.27
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.29
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.31
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.32
            }
        ]
    },
    {
        "tags": {
            "all": "is_tunnel",
            "none": "path"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e2e2e9"
            },
            {
                "zoom": 1,
                "color": "#e2e2e9"
            },
            {
                "zoom": 2,
                "color": "#e2e2e9"
            },
            {
                "zoom": 3,
                "color": "#e2e2e9"
            },
            {
                "zoom": 4,
                "color": "#e2e2e9"
            },
            {
                "zoom": 5,
                "color": "#e2e2e9"
            },
            {
                "zoom": 6,
                "color": "#e2e2e9"
            },
            {
                "zoom": 7,
                "color": "#e2e2e9"
            },
            {
                "zoom": 8,
                "color": "#e2e2e9"
            },
            {
                "zoom": 9,
                "color": "#e2e2e9"
            },
            {
                "zoom": 10,
                "color": "#e2e2e9"
            },
            {
                "zoom": 11,
                "color": "#e2e2e9"
            },
            {
                "zoom": 12,
                "color": "#e2e2e9"
            },
            {
                "zoom": 13,
                "color": "#e2e2e9"
            },
            {
                "zoom": 14,
                "color": "#e7e7ed"
            },
            {
                "zoom": 15,
                "color": "#ededf2"
            },
            {
                "zoom": 16,
                "color": "#eeeef3"
            },
            {
                "zoom": 17,
                "color": "#efeff3"
            },
            {
                "zoom": 18,
                "color": "#f0f0f4"
            },
            {
                "zoom": 19,
                "color": "#f1f1f5"
            },
            {
                "zoom": 20,
                "color": "#f2f2f5"
            },
            {
                "zoom": 21,
                "color": "#f3f3f6"
            }
        ]
    },
    {
        "tags": {
            "all": "path",
            "none": "is_tunnel"
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#b6b8c9"
            }
        ]
    },
    {
        "tags": {
            "all": "path",
            "none": "is_tunnel"
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "opacity": 0.7
            },
            {
                "zoom": 0,
                "color": "#e8e8ee"
            },
            {
                "zoom": 1,
                "color": "#e8e8ee"
            },
            {
                "zoom": 2,
                "color": "#e8e8ee"
            },
            {
                "zoom": 3,
                "color": "#e8e8ee"
            },
            {
                "zoom": 4,
                "color": "#e8e8ee"
            },
            {
                "zoom": 5,
                "color": "#e8e8ee"
            },
            {
                "zoom": 6,
                "color": "#e8e8ee"
            },
            {
                "zoom": 7,
                "color": "#e8e8ee"
            },
            {
                "zoom": 8,
                "color": "#e8e8ee"
            },
            {
                "zoom": 9,
                "color": "#e8e8ee"
            },
            {
                "zoom": 10,
                "color": "#e8e8ee"
            },
            {
                "zoom": 11,
                "color": "#e8e8ee"
            },
            {
                "zoom": 12,
                "color": "#e8e8ee"
            },
            {
                "zoom": 13,
                "color": "#e8e8ee"
            },
            {
                "zoom": 14,
                "color": "#ededf2"
            },
            {
                "zoom": 15,
                "color": "#f3f3f6"
            },
            {
                "zoom": 16,
                "color": "#f4f4f7"
            },
            {
                "zoom": 17,
                "color": "#f5f5f8"
            },
            {
                "zoom": 18,
                "color": "#f6f6f8"
            },
            {
                "zoom": 19,
                "color": "#f7f7f9"
            },
            {
                "zoom": 20,
                "color": "#f8f8fa"
            },
            {
                "zoom": 21,
                "color": "#f9f9fb"
            }
        ]
    },
    {
        "tags": "road_construction",
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "tags": "road_construction",
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#d3d4de"
            },
            {
                "zoom": 1,
                "color": "#d3d4de"
            },
            {
                "zoom": 2,
                "color": "#d3d4de"
            },
            {
                "zoom": 3,
                "color": "#d3d4de"
            },
            {
                "zoom": 4,
                "color": "#d3d4de"
            },
            {
                "zoom": 5,
                "color": "#d3d4de"
            },
            {
                "zoom": 6,
                "color": "#d3d4de"
            },
            {
                "zoom": 7,
                "color": "#d3d4de"
            },
            {
                "zoom": 8,
                "color": "#d3d4de"
            },
            {
                "zoom": 9,
                "color": "#d3d4de"
            },
            {
                "zoom": 10,
                "color": "#d3d4de"
            },
            {
                "zoom": 11,
                "color": "#d3d4de"
            },
            {
                "zoom": 12,
                "color": "#d3d4de"
            },
            {
                "zoom": 13,
                "color": "#d3d4de"
            },
            {
                "zoom": 14,
                "color": "#b6b8c9"
            },
            {
                "zoom": 15,
                "color": "#d3d4de"
            },
            {
                "zoom": 16,
                "color": "#d8d9e2"
            },
            {
                "zoom": 17,
                "color": "#dddee5"
            },
            {
                "zoom": 18,
                "color": "#e1e2e9"
            },
            {
                "zoom": 19,
                "color": "#e6e7ed"
            },
            {
                "zoom": 20,
                "color": "#ebecf0"
            },
            {
                "zoom": 21,
                "color": "#f0f1f4"
            }
        ]
    },
    {
        "tags": {
            "any": "ferry"
        },
        "stylers": [
            {
                "color": "#aaadc0"
            }
        ]
    },
    {
        "tags": "transit_location",
        "elements": "label.icon",
        "stylers": [
            {
                "hue": "#303241"
            },
            {
                "saturation": -0.85
            }
        ]
    },
    {
        "tags": "transit_location",
        "elements": "label.text.fill",
        "stylers": [
            {
                "color": "#7a83b8"
            }
        ]
    },
    {
        "tags": "transit_location",
        "elements": "label.text.outline",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "tags": "transit_schema",
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#7a83b8"
            },
            {
                "scale": 0.7
            },
            {
                "zoom": 0,
                "opacity": 0.6
            },
            {
                "zoom": 1,
                "opacity": 0.6
            },
            {
                "zoom": 2,
                "opacity": 0.6
            },
            {
                "zoom": 3,
                "opacity": 0.6
            },
            {
                "zoom": 4,
                "opacity": 0.6
            },
            {
                "zoom": 5,
                "opacity": 0.6
            },
            {
                "zoom": 6,
                "opacity": 0.6
            },
            {
                "zoom": 7,
                "opacity": 0.6
            },
            {
                "zoom": 8,
                "opacity": 0.6
            },
            {
                "zoom": 9,
                "opacity": 0.6
            },
            {
                "zoom": 10,
                "opacity": 0.6
            },
            {
                "zoom": 11,
                "opacity": 0.6
            },
            {
                "zoom": 12,
                "opacity": 0.6
            },
            {
                "zoom": 13,
                "opacity": 0.6
            },
            {
                "zoom": 14,
                "opacity": 0.6
            },
            {
                "zoom": 15,
                "opacity": 0.5
            },
            {
                "zoom": 16,
                "opacity": 0.4
            },
            {
                "zoom": 17,
                "opacity": 0.4
            },
            {
                "zoom": 18,
                "opacity": 0.4
            },
            {
                "zoom": 19,
                "opacity": 0.4
            },
            {
                "zoom": 20,
                "opacity": 0.4
            },
            {
                "zoom": 21,
                "opacity": 0.4
            }
        ]
    },
    {
        "tags": "transit_schema",
        "elements": "geometry.outline",
        "stylers": [
            {
                "opacity": 0
            }
        ]
    },
    {
        "tags": "transit_line",
        "elements": "geometry.fill.pattern",
        "stylers": [
            {
                "color": "#a3a7c2"
            },
            {
                "zoom": 0,
                "opacity": 0
            },
            {
                "zoom": 1,
                "opacity": 0
            },
            {
                "zoom": 2,
                "opacity": 0
            },
            {
                "zoom": 3,
                "opacity": 0
            },
            {
                "zoom": 4,
                "opacity": 0
            },
            {
                "zoom": 5,
                "opacity": 0
            },
            {
                "zoom": 6,
                "opacity": 0
            },
            {
                "zoom": 7,
                "opacity": 0
            },
            {
                "zoom": 8,
                "opacity": 0
            },
            {
                "zoom": 9,
                "opacity": 0
            },
            {
                "zoom": 10,
                "opacity": 0
            },
            {
                "zoom": 11,
                "opacity": 0
            },
            {
                "zoom": 12,
                "opacity": 0
            },
            {
                "zoom": 13,
                "opacity": 1
            },
            {
                "zoom": 14,
                "opacity": 1
            },
            {
                "zoom": 15,
                "opacity": 1
            },
            {
                "zoom": 16,
                "opacity": 1
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": "transit_line",
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#a3a7c2"
            },
            {
                "scale": 0.4
            },
            {
                "zoom": 0,
                "opacity": 0
            },
            {
                "zoom": 1,
                "opacity": 0
            },
            {
                "zoom": 2,
                "opacity": 0
            },
            {
                "zoom": 3,
                "opacity": 0
            },
            {
                "zoom": 4,
                "opacity": 0
            },
            {
                "zoom": 5,
                "opacity": 0
            },
            {
                "zoom": 6,
                "opacity": 0
            },
            {
                "zoom": 7,
                "opacity": 0
            },
            {
                "zoom": 8,
                "opacity": 0
            },
            {
                "zoom": 9,
                "opacity": 0
            },
            {
                "zoom": 10,
                "opacity": 0
            },
            {
                "zoom": 11,
                "opacity": 0
            },
            {
                "zoom": 12,
                "opacity": 0
            },
            {
                "zoom": 13,
                "opacity": 1
            },
            {
                "zoom": 14,
                "opacity": 1
            },
            {
                "zoom": 15,
                "opacity": 1
            },
            {
                "zoom": 16,
                "opacity": 1
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": "water",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#c7c9d6"
            },
            {
                "zoom": 1,
                "color": "#c7c9d6"
            },
            {
                "zoom": 2,
                "color": "#c7c9d6"
            },
            {
                "zoom": 3,
                "color": "#c7c9d6"
            },
            {
                "zoom": 4,
                "color": "#c7c9d6"
            },
            {
                "zoom": 5,
                "color": "#c7c9d6"
            },
            {
                "zoom": 6,
                "color": "#c7c9d6"
            },
            {
                "zoom": 7,
                "color": "#c7c9d6"
            },
            {
                "zoom": 8,
                "color": "#c9cbd7"
            },
            {
                "zoom": 9,
                "color": "#cbcdd9"
            },
            {
                "zoom": 10,
                "color": "#cdcfda"
            },
            {
                "zoom": 11,
                "color": "#ced0db"
            },
            {
                "zoom": 12,
                "color": "#cfd1db"
            },
            {
                "zoom": 13,
                "color": "#d0d2dc"
            },
            {
                "zoom": 14,
                "color": "#d1d3dd"
            },
            {
                "zoom": 15,
                "color": "#d3d5de"
            },
            {
                "zoom": 16,
                "color": "#d4d6df"
            },
            {
                "zoom": 17,
                "color": "#d6d7e0"
            },
            {
                "zoom": 18,
                "color": "#d7d9e2"
            },
            {
                "zoom": 19,
                "color": "#d9dae3"
            },
            {
                "zoom": 20,
                "color": "#dadce4"
            },
            {
                "zoom": 21,
                "color": "#dcdde5"
            }
        ]
    },
    {
        "tags": "water",
        "elements": "geometry",
        "types": "polyline",
        "stylers": [
            {
                "zoom": 0,
                "opacity": 0.4
            },
            {
                "zoom": 1,
                "opacity": 0.4
            },
            {
                "zoom": 2,
                "opacity": 0.4
            },
            {
                "zoom": 3,
                "opacity": 0.4
            },
            {
                "zoom": 4,
                "opacity": 0.6
            },
            {
                "zoom": 5,
                "opacity": 0.8
            },
            {
                "zoom": 6,
                "opacity": 1
            },
            {
                "zoom": 7,
                "opacity": 1
            },
            {
                "zoom": 8,
                "opacity": 1
            },
            {
                "zoom": 9,
                "opacity": 1
            },
            {
                "zoom": 10,
                "opacity": 1
            },
            {
                "zoom": 11,
                "opacity": 1
            },
            {
                "zoom": 12,
                "opacity": 1
            },
            {
                "zoom": 13,
                "opacity": 1
            },
            {
                "zoom": 14,
                "opacity": 1
            },
            {
                "zoom": 15,
                "opacity": 1
            },
            {
                "zoom": 16,
                "opacity": 1
            },
            {
                "zoom": 17,
                "opacity": 1
            },
            {
                "zoom": 18,
                "opacity": 1
            },
            {
                "zoom": 19,
                "opacity": 1
            },
            {
                "zoom": 20,
                "opacity": 1
            },
            {
                "zoom": 21,
                "opacity": 1
            }
        ]
    },
    {
        "tags": "bathymetry",
        "elements": "geometry",
        "stylers": [
            {
                "hue": "#c7c9d6"
            }
        ]
    },
    {
        "tags": {
            "any": [
                "industrial",
                "construction_site"
            ]
        },
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e2e3e9"
            },
            {
                "zoom": 1,
                "color": "#e2e3e9"
            },
            {
                "zoom": 2,
                "color": "#e2e3e9"
            },
            {
                "zoom": 3,
                "color": "#e2e3e9"
            },
            {
                "zoom": 4,
                "color": "#e2e3e9"
            },
            {
                "zoom": 5,
                "color": "#e2e3e9"
            },
            {
                "zoom": 6,
                "color": "#e2e3e9"
            },
            {
                "zoom": 7,
                "color": "#e2e3e9"
            },
            {
                "zoom": 8,
                "color": "#e2e3e9"
            },
            {
                "zoom": 9,
                "color": "#e2e3e9"
            },
            {
                "zoom": 10,
                "color": "#e2e3e9"
            },
            {
                "zoom": 11,
                "color": "#e2e3e9"
            },
            {
                "zoom": 12,
                "color": "#e2e3e9"
            },
            {
                "zoom": 13,
                "color": "#e2e3e9"
            },
            {
                "zoom": 14,
                "color": "#e8e8ed"
            },
            {
                "zoom": 15,
                "color": "#eeeef2"
            },
            {
                "zoom": 16,
                "color": "#efeff3"
            },
            {
                "zoom": 17,
                "color": "#f0f0f3"
            },
            {
                "zoom": 18,
                "color": "#f0f1f4"
            },
            {
                "zoom": 19,
                "color": "#f1f2f5"
            },
            {
                "zoom": 20,
                "color": "#f2f3f5"
            },
            {
                "zoom": 21,
                "color": "#f3f4f6"
            }
        ]
    },
    {
        "tags": {
            "any": "transit",
            "none": [
                "transit_location",
                "transit_line",
                "transit_schema",
                "is_unclassified_transit"
            ]
        },
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e2e3e9"
            },
            {
                "zoom": 1,
                "color": "#e2e3e9"
            },
            {
                "zoom": 2,
                "color": "#e2e3e9"
            },
            {
                "zoom": 3,
                "color": "#e2e3e9"
            },
            {
                "zoom": 4,
                "color": "#e2e3e9"
            },
            {
                "zoom": 5,
                "color": "#e2e3e9"
            },
            {
                "zoom": 6,
                "color": "#e2e3e9"
            },
            {
                "zoom": 7,
                "color": "#e2e3e9"
            },
            {
                "zoom": 8,
                "color": "#e2e3e9"
            },
            {
                "zoom": 9,
                "color": "#e2e3e9"
            },
            {
                "zoom": 10,
                "color": "#e2e3e9"
            },
            {
                "zoom": 11,
                "color": "#e2e3e9"
            },
            {
                "zoom": 12,
                "color": "#e2e3e9"
            },
            {
                "zoom": 13,
                "color": "#e2e3e9"
            },
            {
                "zoom": 14,
                "color": "#e8e8ed"
            },
            {
                "zoom": 15,
                "color": "#eeeef2"
            },
            {
                "zoom": 16,
                "color": "#efeff3"
            },
            {
                "zoom": 17,
                "color": "#f0f0f3"
            },
            {
                "zoom": 18,
                "color": "#f0f1f4"
            },
            {
                "zoom": 19,
                "color": "#f1f2f5"
            },
            {
                "zoom": 20,
                "color": "#f2f3f5"
            },
            {
                "zoom": 21,
                "color": "#f3f4f6"
            }
        ]
    },
    {
        "tags": "fence",
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#d6d8e0"
            },
            {
                "zoom": 0,
                "opacity": 0.75
            },
            {
                "zoom": 1,
                "opacity": 0.75
            },
            {
                "zoom": 2,
                "opacity": 0.75
            },
            {
                "zoom": 3,
                "opacity": 0.75
            },
            {
                "zoom": 4,
                "opacity": 0.75
            },
            {
                "zoom": 5,
                "opacity": 0.75
            },
            {
                "zoom": 6,
                "opacity": 0.75
            },
            {
                "zoom": 7,
                "opacity": 0.75
            },
            {
                "zoom": 8,
                "opacity": 0.75
            },
            {
                "zoom": 9,
                "opacity": 0.75
            },
            {
                "zoom": 10,
                "opacity": 0.75
            },
            {
                "zoom": 11,
                "opacity": 0.75
            },
            {
                "zoom": 12,
                "opacity": 0.75
            },
            {
                "zoom": 13,
                "opacity": 0.75
            },
            {
                "zoom": 14,
                "opacity": 0.75
            },
            {
                "zoom": 15,
                "opacity": 0.75
            },
            {
                "zoom": 16,
                "opacity": 0.75
            },
            {
                "zoom": 17,
                "opacity": 0.45
            },
            {
                "zoom": 18,
                "opacity": 0.45
            },
            {
                "zoom": 19,
                "opacity": 0.45
            },
            {
                "zoom": 20,
                "opacity": 0.45
            },
            {
                "zoom": 21,
                "opacity": 0.45
            }
        ]
    },
    {
        "tags": "medical",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e2e3e9"
            },
            {
                "zoom": 1,
                "color": "#e2e3e9"
            },
            {
                "zoom": 2,
                "color": "#e2e3e9"
            },
            {
                "zoom": 3,
                "color": "#e2e3e9"
            },
            {
                "zoom": 4,
                "color": "#e2e3e9"
            },
            {
                "zoom": 5,
                "color": "#e2e3e9"
            },
            {
                "zoom": 6,
                "color": "#e2e3e9"
            },
            {
                "zoom": 7,
                "color": "#e2e3e9"
            },
            {
                "zoom": 8,
                "color": "#e2e3e9"
            },
            {
                "zoom": 9,
                "color": "#e2e3e9"
            },
            {
                "zoom": 10,
                "color": "#e2e3e9"
            },
            {
                "zoom": 11,
                "color": "#e2e3e9"
            },
            {
                "zoom": 12,
                "color": "#e2e3e9"
            },
            {
                "zoom": 13,
                "color": "#e2e3e9"
            },
            {
                "zoom": 14,
                "color": "#e8e8ed"
            },
            {
                "zoom": 15,
                "color": "#eeeef2"
            },
            {
                "zoom": 16,
                "color": "#efeff3"
            },
            {
                "zoom": 17,
                "color": "#f0f0f3"
            },
            {
                "zoom": 18,
                "color": "#f0f1f4"
            },
            {
                "zoom": 19,
                "color": "#f1f2f5"
            },
            {
                "zoom": 20,
                "color": "#f2f3f5"
            },
            {
                "zoom": 21,
                "color": "#f3f4f6"
            }
        ]
    },
    {
        "tags": "beach",
        "elements": "geometry",
        "stylers": [
            {
                "zoom": 0,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 1,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 2,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 3,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 4,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 5,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 6,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 7,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 8,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 9,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 10,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 11,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 12,
                "color": "#e2e3e9",
                "opacity": 0.3
            },
            {
                "zoom": 13,
                "color": "#e2e3e9",
                "opacity": 0.65
            },
            {
                "zoom": 14,
                "color": "#e8e8ed",
                "opacity": 1
            },
            {
                "zoom": 15,
                "color": "#eeeef2",
                "opacity": 1
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "opacity": 1
            },
            {
                "zoom": 17,
                "color": "#f0f0f3",
                "opacity": 1
            },
            {
                "zoom": 18,
                "color": "#f0f1f4",
                "opacity": 1
            },
            {
                "zoom": 19,
                "color": "#f1f2f5",
                "opacity": 1
            },
            {
                "zoom": 20,
                "color": "#f2f3f5",
                "opacity": 1
            },
            {
                "zoom": 21,
                "color": "#f3f4f6",
                "opacity": 1
            }
        ]
    },
    {
        "tags": {
            "all": [
                "is_tunnel",
                "path"
            ]
        },
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#b0b2c4"
            },
            {
                "opacity": 0.3
            }
        ]
    },
    {
        "tags": {
            "all": [
                "is_tunnel",
                "path"
            ]
        },
        "elements": "geometry.outline",
        "stylers": [
            {
                "opacity": 0
            }
        ]
    },
    {
        "tags": "road_limited",
        "elements": "geometry.fill",
        "stylers": [
            {
                "color": "#c4c6d4"
            },
            {
                "zoom": 0,
                "scale": 0
            },
            {
                "zoom": 1,
                "scale": 0
            },
            {
                "zoom": 2,
                "scale": 0
            },
            {
                "zoom": 3,
                "scale": 0
            },
            {
                "zoom": 4,
                "scale": 0
            },
            {
                "zoom": 5,
                "scale": 0
            },
            {
                "zoom": 6,
                "scale": 0
            },
            {
                "zoom": 7,
                "scale": 0
            },
            {
                "zoom": 8,
                "scale": 0
            },
            {
                "zoom": 9,
                "scale": 0
            },
            {
                "zoom": 10,
                "scale": 0
            },
            {
                "zoom": 11,
                "scale": 0
            },
            {
                "zoom": 12,
                "scale": 0
            },
            {
                "zoom": 13,
                "scale": 0.1
            },
            {
                "zoom": 14,
                "scale": 0.2
            },
            {
                "zoom": 15,
                "scale": 0.3
            },
            {
                "zoom": 16,
                "scale": 0.5
            },
            {
                "zoom": 17,
                "scale": 0.6
            },
            {
                "zoom": 18,
                "scale": 0.7
            },
            {
                "zoom": 19,
                "scale": 0.79
            },
            {
                "zoom": 20,
                "scale": 0.83
            },
            {
                "zoom": 21,
                "scale": 0.9
            }
        ]
    },
    {
        "tags": "road_limited",
        "elements": "geometry.outline",
        "stylers": [
            {
                "zoom": 0,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 1,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 2,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 3,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 4,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 5,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 6,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 7,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 8,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 9,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 10,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 11,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 12,
                "color": "#ffffff",
                "scale": 1.4
            },
            {
                "zoom": 13,
                "color": "#ffffff",
                "scale": 0.1
            },
            {
                "zoom": 14,
                "color": "#ededf2",
                "scale": 0.2
            },
            {
                "zoom": 15,
                "color": "#ededf2",
                "scale": 0.3
            },
            {
                "zoom": 16,
                "color": "#efeff3",
                "scale": 0.5
            },
            {
                "zoom": 17,
                "color": "#f1f1f5",
                "scale": 0.6
            },
            {
                "zoom": 18,
                "color": "#f4f4f6",
                "scale": 0.7
            },
            {
                "zoom": 19,
                "color": "#f6f6f8",
                "scale": 1.18
            },
            {
                "zoom": 20,
                "color": "#f7f7f9",
                "scale": 1.23
            },
            {
                "zoom": 21,
                "color": "#f9f9fb",
                "scale": 1.33
            }
        ]
    },
    {
        "tags": {
            "any": "landcover",
            "none": "vegetation"
        },
        "stylers": {
            "visibility": "off"
        }
    }
]