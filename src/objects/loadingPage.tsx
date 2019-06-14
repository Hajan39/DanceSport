import React, { Component } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "react-native-elements";

function GetLoadingImage() {
    var index = Math.floor(Math.random() * 3) + 1;
    switch (index) {
        case 1:
            return require("../../assets/pair.gif")
        case 2:
            return require("../../assets/fred.gif")
        case 3:
            return require("../../assets/balette.gif")
        default:
            return require("../../assets/pair.gif")
    }
}


const LoadingPage = (text: string) => {
    return (
        <View style={styles.container}>
            <Text>{text}</Text>
            <Image source={GetLoadingImage()} resizeMode="contain" style={{ maxHeight: "80%", maxWidth: '100%' }}></Image>
        </View>
    )
}
export default LoadingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})