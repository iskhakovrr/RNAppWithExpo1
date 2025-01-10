import {ImageBackground, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";

import NavBar from "../../components/NavBar/NavBar";
import PageHeader from "../../components/PageHeader/PageHeader";

import bootstrapStyles from "../../ui/bootstrapStyles";

import Link from "../../../assets/contact/link.svg"

import OpenURLButton from "../../components/LinkOpener/LinkOpener";
import Button from "../../ui/Button/Button";
import {domain} from "../../constants/constants";

export default function Contact({route}) {
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => contentStylish(isTablet), [isTablet])

    return (
        <>
            <PageHeader label={route.params.data.name}/>
            <ScrollView bounces={false} style={{backgroundColor: "#fff"}}>
                <View style={styles.contactWrapper}>
                    <ImageBackground source={{uri: `${domain}${route.params.data.background}`}} alt="" style={styles.contactImage} />
                    <View style={styles.contactContent}>
                        <View style={styles.contactHeaderWrapper}>
                            <Text style={styles.contactHeader}>{route.params.data.name}</Text>
                            {route.params.data.description && <Text style={styles.contactHeaderDescription}>{route.params.data.description}</Text>}
                        </View>
                        <View style={styles.contactItems}>
                            {
                                route.params.data?.phone
                                    && <View style={styles.contactItem}>
                                        <Text style={styles.contactItemLabel}>Телефон</Text>
                                        <OpenURLButton url={route.params.data.phoneLink}><Text style={styles.contactItemValue}>{route.params.data.phone}</Text></OpenURLButton>
                                    </View>
                            }
                            {
                                route.params.data?.address
                                    && <View style={styles.contactItem}>
                                        <Text style={styles.contactItemLabel}>Адрес</Text>
                                        <Text style={styles.contactItemValue}>{route.params.data.address}</Text>
                                    </View>
                            }
                            {
                                route.params.data?.workTime
                                    && <View style={styles.contactItem}>
                                        <Text style={styles.contactItemLabel}>Режим работы</Text>
                                        <Text style={styles.contactItemValue}>{route.params.data.workTime.replaceAll("<br/>", "\n")}</Text>
                                    </View>
                            }
                            {
                                route.params.data?.btnLink
                                    && <View style={[bootstrapStyles.flexRow]}><Button title={route.params.data.btnTitle} rightIcon={Link} url={route.params.data.btnLink}/></View>
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
            <NavBar/>
        </>
    )
}

const contentStylish = (isTablet) => StyleSheet.create({
    contactWrapper: {
        backgroundColor: "#fff",
        position: "relative",
        paddingTop: isTablet ? 320 : 90
    },
    contactImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom:0,
        resizeMethod: "contain"
    },
    contactContent: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        backgroundColor: "#fff",
        rowGap: isTablet ? 26 : 16
    },
    contactItems: {
        rowGap: isTablet ? 22 : 12
    },
    contactItem: {
        rowGap: 4
    },
    contactItemLabel: {
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 16 : 12,
        lineHeight: (isTablet ? 16 : 12) * 1.3,
        color: "#6B6B6B"
    },
    contactItemValue: {
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 18 : 14,
        lineHeight: (isTablet ? 18 : 14) * 1.2,
        color: "#111111"
    },
    contactHeaderWrapper: {
        rowGap: 4
    },
    contactHeader: {
        fontFamily: "Onest-Medium",
        fontSize: isTablet ? 32 : 20,
        lineHeight: (isTablet ? 32 : 20) * 1.2,
        color: "#111111"
    },
    contactHeaderDescription: {
        fontFamily: "Onest-Regular",
        fontSize: isTablet ? 16 : 12,
        lineHeight: (isTablet ? 16 : 12) * 1.3,
        color: "#6B6B6B"
    },
    contactHeaderAndDescriptionWrapper: {
        rowGap: 2
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
})