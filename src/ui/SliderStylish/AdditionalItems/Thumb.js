import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

const Thumb = () => {
    return <View style={styles.thumb} />;
};

const styles = StyleSheet.create({
    thumb: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#2F3140',
        backgroundColor: '#fff',
    },
});

export default memo(Thumb);