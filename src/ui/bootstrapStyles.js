import {StyleSheet} from "react-native";

const bootstrapStyles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 'none',
        paddingRight: 10,
        paddingLeft: 10,
        flexGrow: 1
    },
    dFlex: {
        display: "flex"
    },
    flexRow: {
        flexDirection: "row"
    },
    flexRowReverse: {
        flexDirection: "row-reverse"
    },
    flexColumn: {
        flexDirection: "column"
    },
    justifyContentCenter: {
        justifyContent: "center"
    },
    justifyContentStart: {
        justifyContent: "flex-start"
    },
    justifyContentEnd: {
        justifyContent: "flex-end"
    },
    justifyContentBetween: {
        justifyContent: "space-between"
    },
    justifyContentAround: {
        justifyContent: "space-around"
    },
    alignItemsStart: {
        alignItems: "start"
    },
    alignItemsCenter: {
        alignItems: "center"
    },
    alignItemsEnd: {
        alignItems: "flex-end"
    },
    flexWrap: {
        flexWrap: "wrap",
    },
    flexGrow1: {
        flexGrow: 1,
    }
});

export default bootstrapStyles;