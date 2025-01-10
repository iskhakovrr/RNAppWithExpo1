import {View, TouchableOpacity, StyleSheet} from "react-native";
import {useMemo} from "react";
import {useSelector} from "react-redux";

export default function Pagination ({size, paginationIndex, scrollToIndex, paginationDefaultColor, paginationActiveColor, perViewCount = 1}) {
    const isTablet = useSelector(store => store.isTablet);

    const styles = useMemo(() => stylish(isTablet), [isTablet]);

    return (
        <View style={styles.pagination}>
            {Array.from({ length: isTablet ? Math.ceil(size/perViewCount) : size }).map((_, index) => (
                <TouchableOpacity
                    style={[
                        styles.paginationDot,
                        paginationIndex === index
                            ? { backgroundColor: paginationActiveColor }
                            : { backgroundColor: paginationDefaultColor },
                    ]}
                    key={index}
                    onPress={() => scrollToIndex({ index })}
                />
            ))}
        </View>
    );
};

const stylish = (isTablet) => {
    return StyleSheet.create({
        pagination:{
            display: "flex",
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: "center",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: isTablet ? -10 : -15,
            columnGap: 5,
        },
        paginationDot:{
            width: isTablet ? 8 : 5,
            height: isTablet ? 8 : 5,
            borderRadius: 8
        },
    })
}