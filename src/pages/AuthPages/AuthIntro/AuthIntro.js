import {ScrollView, StyleSheet, View, Text} from "react-native";
import {useSelector} from "react-redux";

import Button from "../../../ui/Button/Button";
import NavBar from "../../../components/NavBar/NavBar";

import bootstrapStyles from "../../../ui/bootstrapStyles";

import Person from "../../../../assets/auth/auth.svg"
import {useMemo} from "react";

export default function AuthIntro({navigation}){
    const isTablet = useSelector(store => store.isTablet)

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <>
            <ScrollView bounces={false} style={[bootstrapStyles.container, styles.contentWrapper]} contentContainerStyle={[bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter, bootstrapStyles.justifyContentCenter, bootstrapStyles.flexGrow1]}>
                <View style={[styles.content, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                    <View style={[styles.contentText, bootstrapStyles.dFlex, bootstrapStyles.flexColumn, bootstrapStyles.alignItemsCenter]}>
                        <Person width={styles.icon.width} height={styles.icon.height}/>
                        <Text style={styles.title}>Войдите в личный кабинет</Text>
                        <Text style={styles.description}>Чтобы добавить свой автопарк и пользоваться бонусами</Text>
                    </View>
                    <View style={[styles.btns, bootstrapStyles.dFlex, bootstrapStyles.flexColumn]}>
                        <Button title="Войти" style={{width: "100%"}} onPress={()=>navigation.push("AuthSignIn")}/>
                        <Button title="Зарегистрироваться" type="second" style={{width: "100%"}} onPress={()=>navigation.push("SignUp")}/>
                    </View>
                </View>
            </ScrollView>
            <NavBar/>
        </>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create({
        contentWrapper: {
            backgroundColor: "#fff"
        },
        content: {
            rowGap: isTablet ? 26: 16,
            maxWidth: isTablet ? 382 : 280
        },
        contentText: {
            rowGap: isTablet ? 26: 16,
        },
        icon:{
            width: isTablet ? 120 : 40,
            height: isTablet ? 120 : 40,
        },
        title: {
            fontFamily: "Onest-Medium",
            fontSize: isTablet ? 32 : 18,
            lineHeight: (isTablet ? 32 : 18) * 1.3,
            color: "#111",
            textAlign: "center"
        },
        description: {
            fontFamily: "Onest-Regular",
            fontSize: isTablet ? 18 : 12,
            lineHeight: (isTablet ? 18 : 12) * 1.3,
            color: "#6B6B6B",
            textAlign: "center"
        },
        btns: {
            rowGap: 10
        },
    })
}