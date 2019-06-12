import React, { Component } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoadingPage = (text: string) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large"></ActivityIndicator>
            <Text>{text}</Text>
        </View>
    )
}
export default LoadingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})