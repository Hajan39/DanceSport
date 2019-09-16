import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Spinner } from "native-base";

const LoadingPage = (text: string) => {
    return (
        <View style={styles.container}>
            <Spinner size="large" />
            <Text>{text}</Text>
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