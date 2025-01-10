import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from "react-native";
import {Image} from "expo-image";

export default function FitImageExpo(props){
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(1);
    const [imageSize, setImageSize] = useState(0);

    useEffect(()=>{
        if(imageSize?.source?.height){
            setHeight((imageSize.source.height/imageSize.source.width) * width)
        }
    }, [imageSize])

    return(
        <View onLayout={(event) => { setWidth(event.nativeEvent.layout.width) }} style={{width: "100%", height: height}}>
            <Image {...props} onLoad={(e) => setImageSize(e)} style={{width: "100%", height: "100%"}}/>
        </View>
    )
}