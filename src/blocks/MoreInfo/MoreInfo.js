import {useMemo} from "react";
import {useSelector} from "react-redux";
import {View, Text, StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";

import Button from "../../ui/Button/Button";
import bootstrapStyles from "../../ui/bootstrapStyles";
import OpenURLButton from "../../components/LinkOpener/LinkOpener";

export default function MoreInfo({title, buttonTitle, link, toScreen}) {
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    const navigation = useNavigation();

    return (
        <View style={styles.moreInfoWrapper}>
            <View style={bootstrapStyles.container}>
                <View style={styles.moreInfo}>
                    {title && <Text style={styles.moreInfoTitle}>{title}</Text>}
                    {
                        link && <Button title={buttonTitle} type={"second"} url={link}/>
                    }
                    {
                        toScreen && <Button title={buttonTitle} type={"second"} onPress={()=>{navigation.push(toScreen)}}/>
                    }
                </View>
            </View>
        </View>
    )
}

const stylish = (isTablet) => {
    return StyleSheet.create(
        {
            moreInfoWrapper:{
                paddingVertical: isTablet ? 30 : 25
            },
            moreInfo:{
                paddingVertical: 30,
                paddingHorizontal: 20,
                backgroundColor: "#2F3140",
                borderRadius: 14,
                rowGap: 16
            },
            moreInfoTitle:{
                fontFamily: "Onest-Medium",
                fontSize: isTablet ? 28 : 18,
                lineHeight: (isTablet ? 28 : 18) * 1.3,
                color: "#fff",
                textAlign: isTablet ? "center" : "start"
            }
        }
    )
}