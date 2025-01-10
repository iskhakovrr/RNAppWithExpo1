import {useCallback, useEffect, useMemo, useRef} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import bootstrapStyles from "../../ui/bootstrapStyles";

export default function BottomModal({children, isOpen, close, headerText}){
    // ref
    const bottomSheetRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['50%', '70%'], []);

    const handleClosePress =  useCallback(() => bottomSheetRef.current?.close(), []);
    const handleOpenPress = useCallback(() =>  bottomSheetRef.current?.present(), []);
    const handleCollapsePress =  useCallback(() => bottomSheetRef.current?.collapse(), []);

    const handleSheetChanges = useCallback((index) => {
        if(index === -1){
            close();
        }
    }, []);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                opacity={0.5}
                style={{ backgroundColor: "#000" }}
                onPress={() => close()}
                {...props}
            />
        ),
        [],
    )

    useEffect(() => {
        if(isOpen){
            handleOpenPress()
        }else{
            handleClosePress()
        }
    }, [isOpen])


    // renders
    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}>
            <BottomSheetView style={styles.contentContainer}>
                {headerText && <BottomSheetView style={styles.header}><Text style={styles.headerText}>{headerText}</Text></BottomSheetView>}
                <BottomSheetView style={bootstrapStyles.container}>
                    {children}
                </BottomSheetView>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        rowGap: 16
    },
    header:{
        width: "100%"
    },
    headerText:{
        textAlign: "center",
        fontFamily: "Onest-Medium",
        fontSize: 16,
        lineHeight: 16 * 1.4
    }
});